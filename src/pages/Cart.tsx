import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/Header';
import { CartItem } from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const generateTimeSlots = () => {
  const slots = [];
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  for (let hour = 11; hour <= 14; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      // Skip past time slots
      if (hour < currentHour || (hour === currentHour && minute <= currentMinute + 15)) {
        continue;
      }
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const label = new Date(2000, 0, 1, hour, minute).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      slots.push({ value: time, label });
    }
  }
  return slots;
};

const Cart = () => {
  const { items, totalPrice, restaurantId, restaurantName, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const timeSlots = generateTimeSlots();

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to place an order.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (!pickupTime) {
      toast({
        title: 'Select pickup time',
        description: 'Please select when you want to pick up your order.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          restaurant_id: restaurantId,
          pickup_time: pickupTime,
          total_amount: totalPrice,
          notes: notes || null,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      toast({
        title: 'Order placed! 🎉',
        description: `Your order will be ready at ${timeSlots.find((t) => t.value === pickupTime)?.label}.`,
      });
      navigate('/orders');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-24 text-center">
          <div className="mx-auto max-w-md">
            <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 shadow-elevated animate-float">
              <ShoppingBag className="h-12 w-12 text-primary" />
            </div>
            <h1 className="mb-3 text-3xl font-extrabold text-foreground">Your cart is empty</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Looks like you haven't added anything yet. Let's fix that!
            </p>
            <Link to="/restaurants">
              <Button size="lg" variant="hero" className="shadow-elevated hover:shadow-glow transition-all duration-300">
                Browse Restaurants
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <Link
          to={restaurantId ? `/restaurant/${restaurantId}` : '/restaurants'}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="mb-2 text-3xl font-extrabold text-foreground">Your Order</h1>
            <p className="mb-8 text-lg text-muted-foreground">From <span className="font-semibold text-foreground">{restaurantName}</span></p>
            
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24 border-0 shadow-elevated border border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-extrabold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pickup Time */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pickup Time
                  </Label>
                  <Select value={pickupTime} onValueChange={setPickupTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.length > 0 ? (
                        timeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-slots" disabled>
                          No slots available today
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label>Special Instructions (Optional)</Label>
                  <Textarea
                    placeholder="Any allergies or preferences?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-border pt-5">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground font-medium">Subtotal</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="font-extrabold text-xl">Total</span>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={loading || timeSlots.length === 0}
                  className="w-full shadow-elevated hover:shadow-glow transition-all duration-300"
                  size="lg"
                  variant="hero"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>

                {!user && (
                  <p className="text-center text-sm text-muted-foreground">
                    You'll need to{' '}
                    <Link to="/auth" className="text-primary hover:underline">
                      sign in
                    </Link>{' '}
                    to complete your order.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
