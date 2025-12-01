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
    <Link to={`/restaurant/${id}`} className="block h-full">
      <Card className="group h-full overflow-hidden border-0 shadow-soft transition-all duration-500 hover:shadow-elevated hover:-translate-y-2 border border-border/50">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <img
            src={image_url}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
          <Badge className="absolute left-4 top-4 bg-background/95 text-foreground backdrop-blur-glass border border-border/50 shadow-medium font-semibold">
            {cuisine_type}
          </Badge>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-extrabold text-primary-foreground drop-shadow-lg">
              {name}
            </h3>
          </div>
        </div>
        <CardContent className="p-6">
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              {floor_number}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="h-4 w-4 text-primary" />
              8am - 6pm
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
