import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation, ZoomIn, ZoomOut, Locate } from "lucide-react";

interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
}

interface MapViewProps {
  currentLocation?: Location;
  positionHistory?: Location[];
  route?: Array<{ name: string; lat: number; lng: number; eta?: string }>;
  showControls?: boolean;
}

export default function MapView({ 
  currentLocation, 
  positionHistory = [], 
  route = [], 
  showControls = true 
}: MapViewProps) {
  const mapScale = 100;
  const centerX = 50;
  const centerY = 50;

  const toMapCoords = (lat: number, lng: number) => {
    const x = centerX + (lng + 8.234724) * mapScale * 10;
    const y = centerY - (lat - 42.141296) * mapScale * 10;
    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <div className="relative h-full w-full bg-muted rounded-md overflow-hidden" data-testid="container-map-view">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {route.length > 1 && (
          <polyline
            points={route.map(stop => {
              const coords = toMapCoords(stop.lat, stop.lng);
              return `${coords.x} ${coords.y}`;
            }).join(' ')}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeDasharray="8,4"
            opacity="0.6"
          />
        )}

        {positionHistory.map((position, index) => {
          const coords = toMapCoords(position.latitude, position.longitude);
          const opacity = (index + 1) / positionHistory.length * 0.4;
          const radius = (position.accuracy || 20) / 4;
          
          return (
            <circle
              key={index}
              cx={coords.x}
              cy={coords.y}
              r={radius}
              fill="hsl(var(--primary))"
              opacity={opacity}
            />
          );
        })}
      </svg>

      {route.length > 0 && (
        <>
          {route.map((stop, index) => {
            const coords = toMapCoords(stop.lat, stop.lng);
            return (
              <div
                key={index}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: coords.x, top: coords.y }}
              >
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-chart-2 border-2 border-background flex items-center justify-center text-xs font-semibold text-white shadow-md">
                    {index + 1}
                  </div>
                  <div className="mt-1 px-2 py-0.5 bg-background/90 rounded text-xs font-medium whitespace-nowrap">
                    {stop.name}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {currentLocation && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: toMapCoords(currentLocation.latitude, currentLocation.longitude).x,
            top: toMapCoords(currentLocation.latitude, currentLocation.longitude).y,
          }}
        >
          <div className="relative">
            <div 
              className="rounded-full bg-primary/20 border-2 border-primary"
              style={{ 
                width: `${(currentLocation.accuracy || 20) / 2}px`, 
                height: `${(currentLocation.accuracy || 20) / 2}px` 
              }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <div className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

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

      {route.length > 0 && (
        <Card className="absolute top-4 left-4 max-w-xs">
          <div className="p-3 space-y-2">
            <p className="text-sm font-medium">Route Stops</p>
            {route.map((stop, index) => (
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
        <Card className="absolute bottom-4 left-4">
          <div className="p-2 space-y-1">
            <p className="text-xs font-medium">Current Position</p>
            <div className="flex gap-2">
              <Badge variant="secondary" className="font-mono text-xs">
                {currentLocation.latitude.toFixed(6)}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                {currentLocation.longitude.toFixed(6)}
              </Badge>
            </div>
            {currentLocation.accuracy && (
              <p className="text-xs text-muted-foreground">±{currentLocation.accuracy}m</p>
            )}
          </div>
        </Card>
      )}

      {!currentLocation && !route.length && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Navigation className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No active tracking</p>
          </div>
        </div>
      )}
    </div>
  );
}
