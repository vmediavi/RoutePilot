import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MapPin, Users, DollarSign } from "lucide-react";
import RouteCard from "@/components/RouteCard";
import BookingCard from "@/components/BookingCard";
import MapView from "@/components/MapView";
import RouteForm from "@/components/RouteForm";

export default function DriverDashboard() {
  const [showRouteForm, setShowRouteForm] = useState(false);

  const currentLocation = {
    latitude: 42.141296,
    longitude: -8.234724,
    accuracy: 20.0
  };

  const positionHistory = [
    { latitude: 42.140800, longitude: -8.234200, accuracy: 25 },
    { latitude: 42.140900, longitude: -8.234300, accuracy: 22 },
    { latitude: 42.141000, longitude: -8.234400, accuracy: 18 },
    { latitude: 42.141100, longitude: -8.234500, accuracy: 20 },
    { latitude: 42.141200, longitude: -8.234600, accuracy: 19 },
    { latitude: 42.141250, longitude: -8.234650, accuracy: 21 },
    { latitude: 42.141280, longitude: -8.234690, accuracy: 20 },
  ];

  const activeRoute = [
    { name: "Downtown Plaza", lat: 42.140800, lng: -8.234200, eta: "Start" },
    { name: "City Center", lat: 42.141500, lng: -8.235000, eta: "10 min" },
    { name: "Airport Terminal 2", lat: 42.142000, lng: -8.236000, eta: "25 min" }
  ];

  const mockRoutes = [
    {
      id: "1",
      driverName: "You",
      origin: "Downtown Plaza",
      destination: "Airport Terminal 2",
      departureTime: "09:30 AM",
      departureDate: "Oct 15, 2025",
      availableSeats: 2,
      totalSeats: 4,
      price: "15"
    },
    {
      id: "2",
      driverName: "You",
      origin: "City Center",
      destination: "Beach Resort",
      departureTime: "02:00 PM",
      departureDate: "Oct 16, 2025",
      availableSeats: 4,
      totalSeats: 4,
      price: "25"
    }
  ];

  const mockBookings = [
    {
      id: "1",
      userName: "John Smith",
      userRole: "customer" as const,
      origin: "Downtown Plaza",
      destination: "Airport Terminal 2",
      date: "Oct 15, 2025",
      time: "09:30 AM",
      seats: 2,
      status: "pending" as const,
      driverConfirmed: false,
      customerConfirmed: true
    },
    {
      id: "2",
      userName: "Sarah Johnson",
      userRole: "customer" as const,
      origin: "City Center",
      destination: "Beach Resort",
      date: "Oct 16, 2025",
      time: "02:00 PM",
      seats: 1,
      status: "confirmed" as const
    }
  ];

  return (
    <div className="flex-1 overflow-hidden" data-testid="page-driver-dashboard">
      <Tabs defaultValue="overview" className="h-full flex flex-col">
        <div className="border-b px-4">
          <TabsList className="h-12">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="routes" data-testid="tab-routes">My Routes</TabsTrigger>
            <TabsTrigger value="bookings" data-testid="tab-bookings">Booking Requests</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="overview" className="p-4 space-y-4 m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-active-routes">2</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-bookings">3</div>
                  <p className="text-xs text-muted-foreground">1 pending approval</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-earnings">$65</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Live Location Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <MapView 
                    currentLocation={currentLocation}
                    positionHistory={positionHistory}
                    route={activeRoute}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="p-4 space-y-4 m-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">My Routes</h2>
              <Button onClick={() => setShowRouteForm(!showRouteForm)} data-testid="button-toggle-route-form">
                <Plus className="h-4 w-4 mr-2" />
                {showRouteForm ? "Cancel" : "Create Route"}
              </Button>
            </div>

            {showRouteForm && (
              <RouteForm onSubmit={() => setShowRouteForm(false)} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  {...route}
                  onViewDetails={() => console.log('View details')}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="p-4 space-y-4 m-0">
            <h2 className="text-lg font-semibold">Booking Requests</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  {...booking}
                  onConfirm={() => console.log('Confirm booking', booking.id)}
                  onReject={() => console.log('Reject booking', booking.id)}
                  onChat={() => console.log('Open chat', booking.id)}
                />
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
