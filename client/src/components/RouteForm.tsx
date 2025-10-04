import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, MapPin } from "lucide-react";
import { useState } from "react";

interface Stop {
  id: string;
  name: string;
  estimatedTime: string;
}

interface RouteFormProps {
  onSubmit?: (data: any) => void;
}

export default function RouteForm({ onSubmit }: RouteFormProps) {
  const [stops, setStops] = useState<Stop[]>([
    { id: "1", name: "", estimatedTime: "" },
    { id: "2", name: "", estimatedTime: "" },
  ]);

  const addStop = () => {
    setStops([...stops, { id: String(Date.now()), name: "", estimatedTime: "" }]);
  };

  const removeStop = (id: string) => {
    if (stops.length > 2) {
      setStops(stops.filter(stop => stop.id !== id));
    }
  };

  const updateStop = (id: string, field: "name" | "estimatedTime", value: string) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Route created with stops:', stops);
    onSubmit?.({ stops });
  };

  return (
    <Card data-testid="form-create-route">
      <CardHeader>
        <CardTitle>Create New Route</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="route-name">Route Name</Label>
              <Input
                id="route-name"
                placeholder="e.g., Downtown to Airport"
                data-testid="input-route-name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departure-date">Departure Date</Label>
                <Input
                  id="departure-date"
                  type="date"
                  data-testid="input-departure-date"
                />
              </div>
              <div>
                <Label htmlFor="departure-time">Departure Time</Label>
                <Input
                  id="departure-time"
                  type="time"
                  data-testid="input-departure-time"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total-seats">Total Seats</Label>
                <Input
                  id="total-seats"
                  type="number"
                  min="1"
                  max="8"
                  placeholder="4"
                  data-testid="input-total-seats"
                />
              </div>
              <div>
                <Label htmlFor="price">Price per Seat ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="15.00"
                  data-testid="input-price"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Route Stops</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addStop}
                data-testid="button-add-stop"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Stop
              </Button>
            </div>

            <div className="space-y-3">
              {stops.map((stop, index) => (
                <div key={stop.id} className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-2 shrink-0" />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      placeholder={index === 0 ? "Start location" : index === stops.length - 1 ? "End location" : "Stop location"}
                      value={stop.name}
                      onChange={(e) => updateStop(stop.id, "name", e.target.value)}
                      data-testid={`input-stop-name-${index}`}
                    />
                    <Input
                      placeholder="Est. time (e.g., 10 min)"
                      value={stop.estimatedTime}
                      onChange={(e) => updateStop(stop.id, "estimatedTime", e.target.value)}
                      data-testid={`input-stop-time-${index}`}
                    />
                  </div>
                  {stops.length > 2 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeStop(stop.id)}
                      data-testid={`button-remove-stop-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or requirements..."
              rows={3}
              data-testid="input-notes"
            />
          </div>

          <Button type="submit" className="w-full" data-testid="button-create-route">
            Create Route
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
