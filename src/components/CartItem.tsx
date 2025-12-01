import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart, CartItem as CartItemType } from '@/contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="group flex items-center gap-5 rounded-2xl bg-card p-5 shadow-soft border border-border/50 transition-all duration-300 hover:shadow-medium hover:border-primary/20">
      {item.image_url && (
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl shadow-soft group-hover:shadow-medium transition-all duration-300">
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-lg text-foreground mb-1">{item.name}</h4>
        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
      </div>
      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-right">
        <p className="font-extrabold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">${(item.price * item.quantity).toFixed(2)}</p>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-lg"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          <span className="text-xs font-medium">Remove</span>
        </Button>
      </div>
    </div>
  );
};
