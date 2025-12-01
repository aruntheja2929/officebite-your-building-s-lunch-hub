import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, MapPin, ChevronRight, Package } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Order {
  id: string;
  status: string;
  pickup_time: string;
  total_amount: number;
  created_at: string;
  notes: string | null;
  restaurant: {
    name: string;
    floor_number: string;
  };
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  preparing: { label: 'Preparing', color: 'bg-purple-100 text-purple-800' },
  ready: { label: 'Ready for Pickup', color: 'bg-green-100 text-green-800' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          restaurant:restaurants(name, floor_number)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data as Order[]);
      }
      setLoading(false);
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCancelOrder = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel order. Please try again.',
        variant: 'destructive',
      });
    } else {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
      toast({
        title: 'Order cancelled',
        description: 'Your order has been cancelled.',
      });
    }
  };

  const formatPickupTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Skeleton className="mb-4 h-8 w-48" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-10">
        <h1 className="mb-3 text-4xl font-extrabold text-foreground md:text-5xl">My Orders</h1>
        <p className="mb-10 text-lg text-muted-foreground">Track and manage your orders</p>

        {orders.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 shadow-elevated animate-float">
              <Package className="h-12 w-12 text-primary" />
            </div>
            <h2 className="mb-3 text-2xl font-extrabold text-foreground">No orders yet</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              You haven't placed any orders. Ready to grab lunch?
            </p>
            <Link to="/restaurants">
              <Button size="lg" variant="hero" className="shadow-elevated hover:shadow-glow transition-all duration-300">
                Browse Restaurants
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const canCancel = order.status === 'pending';

              return (
                <Card key={order.id} className="border-0 shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 border border-border/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="text-lg font-bold text-foreground">
                            {order.restaurant.name}
                          </h3>
                          <Badge className={status.color}>{status.label}</Badge>
                        </div>
                        
                        <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Pickup at {formatPickupTime(order.pickup_time)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {order.restaurant.floor_number}
                          </span>
                        </div>

                        {order.notes && (
                          <p className="text-sm text-muted-foreground">
                            Note: {order.notes}
                          </p>
                        )}

                        <p className="mt-3 text-sm text-muted-foreground">
                          Ordered on{' '}
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                          ${order.total_amount.toFixed(2)}
                        </span>
                        
                        {canCancel && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive">
                                Cancel Order
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. Your order will be cancelled
                                  and you won't be able to pick it up.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Order</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Yes, Cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
