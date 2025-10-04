import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Clock, Calendar } from "lucide-react";

interface RouteCardProps {
  id: string;
  driverName: string;
  driverAvatar?: string;
  driverRating?: number;
  origin: string;
  destination: string;
  departureTime: string;
  departureDate: string;
  availableSeats: number;
  totalSeats: number;
  price?: string;
  onBook?: () => void;
  onViewDetails?: () => void;
}

export default function RouteCard({
  driverName,
  driverAvatar,
  driverRating = 4.8,
  origin,
  destination,
  departureTime,
  departureDate,
  availableSeats,
  totalSeats,
  price,
  onBook,
  onViewDetails,
}: RouteCardProps) {
  const isFullyBooked = availableSeats === 0;

  return (
    <Card className="hover-elevate" data-testid={`card-route-${origin}-${destination}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={driverAvatar} />
              <AvatarFallback>{driverName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm" data-testid="text-driver-name">{driverName}</p>
              <p className="text-xs text-muted-foreground">Rating: {driverRating} ⭐</p>
            </div>
          </div>
          {price && (
            <div className="text-right">
              <p className="text-lg font-semibold text-primary" data-testid="text-price">${price}</p>
              <p className="text-xs text-muted-foreground">per seat</p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm" data-testid="text-origin">{origin}</p>
            <div className="h-6 border-l-2 border-dashed border-border ml-2 my-1"></div>
            <p className="font-medium text-sm" data-testid="text-destination">{destination}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground" data-testid="text-date">{departureDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground" data-testid="text-time">{departureTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {availableSeats} of {totalSeats} seats available
          </span>
          {isFullyBooked && (
            <Badge variant="secondary" className="ml-auto">Fully Booked</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onViewDetails}
          data-testid="button-view-details"
        >
          View Details
        </Button>
        <Button 
          className="flex-1"
          disabled={isFullyBooked}
          onClick={onBook}
          data-testid="button-book"
        >
          {isFullyBooked ? "Fully Booked" : "Book Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}
