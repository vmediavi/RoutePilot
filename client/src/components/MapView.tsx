import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation, ZoomIn, ZoomOut, Locate } from "lucide-react";
import { useState, useEffect } from "react";

interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface MapViewProps {
  driverLocation?: Location;
  stops?: Array<{ name: string; lat: number; lng: number; eta?: string }>;
  showControls?: boolean;
}

export default function MapView({ driverLocation, stops = [], showControls = true }: MapViewProps) {
  const [currentLocation, setCurrentLocation] = useState(driverLocation);

  useEffect(() => {
    setCurrentLocation(driverLocation);
  }, [driverLocation]);

  return (
    <div className="relative h-full w-full bg-muted rounded-md overflow-hidden" data-testid="container-map-view">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-2">
          <Navigation className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Map View</p>
          {currentLocation && (
            <div className="space-y-1">
              <Badge variant="secondary" className="font-mono text-xs">
                Lat: {currentLocation.latitude.toFixed(6)}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs ml-2">
                Lng: {currentLocation.longitude.toFixed(6)}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {showControls && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button 
            size="icon" 
            variant="secondary"
            data-testid="button-zoom-in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary"
            data-testid="button-zoom-out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary"
            data-testid="button-locate"
          >
            <Locate className="h-4 w-4" />
          </Button>
        </div>
      )}

      {stops.length > 0 && (
        <Card className="absolute top-4 left-4 max-w-xs">
          <div className="p-3 space-y-2">
            <p className="text-sm font-medium">Route Stops</p>
            {stops.map((stop, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{index + 1}. {stop.name}</span>
                {stop.eta && (
                  <Badge variant="outline" className="text-xs">{stop.eta}</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {currentLocation && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center animate-pulse">
              <div className="h-4 w-4 rounded-full bg-primary-foreground"></div>
            </div>
            <div className="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping"></div>
          </div>
        </div>
      )}
    </div>
  );
}
