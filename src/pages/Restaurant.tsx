import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/Header';
import { MenuItemCard } from '@/components/MenuItemCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine_type: string;
  image_url: string;
  floor_number: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

const Restaurant = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { totalItems, totalPrice, restaurantId } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const [restaurantRes, menuRes] = await Promise.all([
        supabase.from('restaurants').select('*').eq('id', id).maybeSingle(),
        supabase.from('menu_items').select('*').eq('restaurant_id', id).eq('is_available', true),
      ]);

      if (restaurantRes.data) {
        setRestaurant(restaurantRes.data);
      }
      if (menuRes.data) {
        setMenuItems(menuRes.data);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  // Group menu items by category
  const categories = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Skeleton className="mb-8 h-64 rounded-2xl" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <p className="text-lg text-muted-foreground">Restaurant not found.</p>
          <Link to="/restaurants">
            <Button variant="outline" className="mt-4">
              Back to Restaurants
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <main className="container py-8">
        <Link
          to="/restaurants"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to restaurants
        </Link>

        {/* Restaurant Header */}
        <div className="relative mb-8 overflow-hidden rounded-2xl shadow-medium">
          <div className="aspect-[21/9] overflow-hidden">
            <img
              src={restaurant.image_url}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
            <Badge className="mb-3 bg-primary/90">{restaurant.cuisine_type}</Badge>
            <h1 className="mb-2 text-3xl font-bold">{restaurant.name}</h1>
            <p className="mb-3 text-primary-foreground/80">{restaurant.description}</p>
            <div className="flex items-center gap-4 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {restaurant.floor_number}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                8am - 6pm
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-8">
          {Object.entries(categories).map(([category, items]) => (
            <section key={category}>
              <h2 className="mb-4 text-xl font-bold text-foreground">{category}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    {...item}
                    restaurant_id={restaurant.id}
                    restaurant_name={restaurant.name}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No menu items available.</p>
          </div>
        )}
      </main>

      {/* Sticky Cart Bar */}
      {totalItems > 0 && restaurantId === id && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 shadow-elevated">
          <div className="container">
            <Link to="/cart">
              <Button className="w-full gap-2" size="lg">
                <ShoppingBag className="h-5 w-5" />
                View Cart ({totalItems} items) · ${totalPrice.toFixed(2)}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurant;
