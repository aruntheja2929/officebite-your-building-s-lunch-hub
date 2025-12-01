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
    <Card className="group overflow-hidden border-0 shadow-soft transition-all duration-300 hover:shadow-medium">
      <div className="flex gap-4 p-4">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
          <img
            src={image_url}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <CardContent className="flex flex-1 flex-col justify-between p-0">
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold text-primary">${price.toFixed(2)}</span>
            <Button
              onClick={handleAdd}
              size="sm"
              variant={justAdded ? 'accent' : 'default'}
              className="gap-1"
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
