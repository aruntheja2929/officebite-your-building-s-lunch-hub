import { Plus, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface MenuItemCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  restaurant_id: string;
  restaurant_name: string;
}

export const MenuItemCard = ({
  id,
  name,
  description,
  price,
  image_url,
  restaurant_id,
  restaurant_name,
}: MenuItemCardProps) => {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  
  const itemInCart = items.find((item) => item.id === id);
  const quantity = itemInCart?.quantity || 0;

  const handleAdd = () => {
    addItem({
      id,
      name,
      price,
      image_url,
      restaurant_id,
      restaurant_name,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-soft transition-all duration-500 hover:shadow-elevated hover:-translate-y-1 border border-border/50">
      <div className="flex gap-5 p-5">
        <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl shadow-medium group-hover:shadow-glow transition-all duration-500">
          <img
            src={image_url}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <CardContent className="flex flex-1 flex-col justify-between p-0">
          <div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{name}</h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">${price.toFixed(2)}</span>
            <Button
              onClick={handleAdd}
              size="sm"
              variant={justAdded ? 'accent' : 'default'}
              className="gap-1.5 font-semibold shadow-soft hover:shadow-medium transition-all duration-300"
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add{quantity > 0 && ` (${quantity})`}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
