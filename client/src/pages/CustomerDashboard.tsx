import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, MapPin } from "lucide-react";
import RouteCard from "@/components/RouteCard";
import BookingCard from "@/components/BookingCard";
import MapView from "@/components/MapView";

export default function CustomerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockRoutes = [
    {
      id: "1",
      driverName: "Maria Garcia",
      driverRating: 4.9,
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
      driverName: "James Wilson",
      driverRating: 4.7,
      origin: "City Center",
      destination: "Beach Resort",
      departureTime: "02:00 PM",
      departureDate: "Oct 16, 2025",
      availableSeats: 3,
      totalSeats: 4,
      price: "25"
    },
    {
      id: "3",
      driverName: "Anna Lee",
      driverRating: 4.8,
      origin: "University Campus",
      destination: "Shopping Mall",
      departureTime: "11:00 AM",
      departureDate: "Oct 15, 2025",
      availableSeats: 1,
      totalSeats: 3,
      price: "10"
    }
  ];

  const mockBookings = [
    {
      id: "1",
      userName: "Maria Garcia",
      userRole: "driver" as const,
      origin: "Downtown Plaza",
      destination: "Airport Terminal 2",
      date: "Oct 15, 2025",
      time: "09:30 AM",
      seats: 2,
      status: "pending" as const,
      driverConfirmed: true,
      customerConfirmed: false
    },
    {
      id: "2",
      userName: "James Wilson",
      userRole: "driver" as const,
      origin: "City Center",
      destination: "Beach Resort",
      date: "Oct 14, 2025",
      time: "02:00 PM",
      seats: 1,
      status: "completed" as const
    }
  ];

  return (
    <div className="flex-1 overflow-hidden" data-testid="page-customer-dashboard">
      <Tabs defaultValue="search" className="h-full flex flex-col">
        <div className="border-b px-4">
          <TabsList className="h-12">
            <TabsTrigger value="search" data-testid="tab-search">Search Routes</TabsTrigger>
            <TabsTrigger value="bookings" data-testid="tab-my-bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="map" data-testid="tab-map">Live Map</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="search" className="p-4 space-y-4 m-0">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by destination..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-routes"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Input placeholder="From location" data-testid="input-from-location" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Input type="date" data-testid="input-travel-date" />
                    </div>
                  </div>

                  <Button className="w-full" data-testid="button-search">
                    <Search className="h-4 w-4 mr-2" />
                    Search Routes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-lg font-semibold mb-4">Available Routes</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockRoutes.map((route) => (
                  <RouteCard
                    key={route.id}
                    {...route}
                    onBook={() => console.log('Book route', route.id)}
                    onViewDetails={() => console.log('View details', route.id)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="p-4 space-y-4 m-0">
            <h2 className="text-lg font-semibold">My Bookings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  {...booking}
                  onConfirm={() => console.log('Confirm booking', booking.id)}
                  onChat={() => console.log('Open chat', booking.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="p-4 m-0">
            <Card>
              <CardContent className="p-6">
                <div className="h-[600px]">
                  <MapView
                    driverLocation={{
                      latitude: 42.141296,
                      longitude: -8.234724,
                      accuracy: 20.0
                    }}
                    stops={[
                      { name: "Downtown Plaza", lat: 42.14, lng: -8.23, eta: "Now" },
                      { name: "City Center", lat: 42.15, lng: -8.24, eta: "10 min" },
                      { name: "Airport", lat: 42.16, lng: -8.25, eta: "25 min" }
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
