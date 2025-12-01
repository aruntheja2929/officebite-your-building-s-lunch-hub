import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RestaurantCardProps {
  id: string;
  name: string;
  description: string;
  cuisine_type: string;
  image_url: string;
  floor_number: string;
}

export const RestaurantCard = ({
  id,
  name,
  description,
  cuisine_type,
  image_url,
  floor_number,
}: RestaurantCardProps) => {
  return (
    <Link to={`/restaurant/${id}`}>
      <Card className="group overflow-hidden border-0 shadow-soft transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image_url}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          <Badge className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur-sm">
            {cuisine_type}
          </Badge>
        </div>
        <CardContent className="p-5">
          <h3 className="mb-2 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {floor_number}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              8am - 6pm
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
