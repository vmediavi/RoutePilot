import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Users, MessageSquare, Check, X, Clock } from "lucide-react";

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

interface BookingCardProps {
  id: string;
  userName: string;
  userAvatar?: string;
  userRole: "driver" | "customer";
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  status: BookingStatus;
  driverConfirmed?: boolean;
  customerConfirmed?: boolean;
  onConfirm?: () => void;
  onReject?: () => void;
  onChat?: () => void;
}

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const, color: "text-chart-3" },
  confirmed: { label: "Confirmed", variant: "default" as const, color: "text-chart-2" },
  cancelled: { label: "Cancelled", variant: "secondary" as const, color: "text-destructive" },
  completed: { label: "Completed", variant: "secondary" as const, color: "text-muted-foreground" },
};

export default function BookingCard({
  userName,
  userAvatar,
  userRole,
  origin,
  destination,
  date,
  time,
  seats,
  status,
  driverConfirmed = false,
  customerConfirmed = false,
  onConfirm,
  onReject,
  onChat,
}: BookingCardProps) {
  const config = statusConfig[status];

  return (
    <Card className="hover-elevate" data-testid={`card-booking-${status}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm" data-testid="text-user-name">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
          </div>
          <Badge variant={config.variant} className={config.color} data-testid="badge-status">
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm" data-testid="text-booking-origin">{origin}</p>
            <div className="h-4 border-l-2 border-dashed border-border ml-2 my-1"></div>
            <p className="text-sm" data-testid="text-booking-destination">{destination}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{seats} seat{seats > 1 ? 's' : ''}</span>
          </div>
        </div>

        {status === "pending" && (
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Driver:</span>
              {driverConfirmed ? (
                <Check className="h-3 w-3 text-chart-2" />
              ) : (
                <Clock className="h-3 w-3 text-chart-3" />
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Customer:</span>
              {customerConfirmed ? (
                <Check className="h-3 w-3 text-chart-2" />
              ) : (
                <Clock className="h-3 w-3 text-chart-3" />
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {status === "pending" && onConfirm && onReject && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={onReject}
                data-testid="button-reject"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button 
                size="sm"
                onClick={onConfirm}
                data-testid="button-confirm"
              >
                <Check className="h-4 w-4 mr-1" />
                Confirm
              </Button>
            </>
          )}
          {onChat && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={onChat}
              className="ml-auto"
              data-testid="button-chat"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Chat
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
