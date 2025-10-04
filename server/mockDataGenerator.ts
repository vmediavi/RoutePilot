import { randomUUID } from "crypto";
import type { User, Route, Booking, Message, LocationUpdate } from "@shared/types";
import type { IStorage } from "./storage";

interface MockDataOptions {
  userCount: number;
  routeCount: number;
  bookingCount: number;
  messageCount: number;
}

export class MockDataGenerator {
  private storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  async generateAllMockData(options: MockDataOptions = {
    userCount: 50,
    routeCount: 100,
    bookingCount: 200,
    messageCount: 500
  }): Promise<void> {
    console.log('🎭 Generating mock data...');

    // Generate users first
    const users = await this.generateUsers(options.userCount);
    console.log(`✅ Generated ${users.length} users`);

    // Separate drivers and customers
    const drivers = users.filter(u => u.role === 'driver');
    const customers = users.filter(u => u.role === 'customer');

    // Generate routes
    const routes = await this.generateRoutes(options.routeCount, drivers);
    console.log(`✅ Generated ${routes.length} routes`);

    // Generate bookings
    const bookings = await this.generateBookings(options.bookingCount, routes, customers);
    console.log(`✅ Generated ${bookings.length} bookings`);

    // Generate conversations and messages
    await this.generateConversationsAndMessages(bookings, options.messageCount);
    console.log(`✅ Generated conversations and messages`);

    // Generate location data for drivers
    await this.generateLocationData(drivers);
    console.log(`✅ Generated location data`);

    console.log('🚀 Mock data generation complete!');
  }

  private async generateUsers(count: number): Promise<User[]> {
    const firstNames = [
      'Maria', 'James', 'Sarah', 'Michael', 'Anna', 'David', 'Lisa', 'Robert',
      'Emma', 'John', 'Sophia', 'William', 'Olivia', 'Daniel', 'Isabella',
      'Matthew', 'Mia', 'Christopher', 'Abigail', 'Joseph', 'Emily', 'Andrew'
    ];

    const lastNames = [
      'Garcia', 'Wilson', 'Johnson', 'Brown', 'Jones', 'Miller', 'Davis',
      'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez',
      'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee'
    ];

    const cities = [
      'Downtown Plaza', 'City Center', 'Airport Terminal', 'University Campus',
      'Shopping Mall', 'Beach Resort', 'Business District', 'Residential Area',
      'Industrial Zone', 'Historic Quarter', 'Suburban Heights', 'Riverside'
    ];

    const users: User[] = [];

    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const role = Math.random() > 0.5 ? 'driver' : 'customer';

      const user = await this.storage.createUser({
        username: `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`,
        password: 'password123', // Mock password
        role,
        profile: {
          firstName,
          lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0 rating
          totalTrips: Math.floor(Math.random() * 100),
          bio: role === 'driver'
            ? `Experienced driver serving ${cities[Math.floor(Math.random() * cities.length)]} area. Safe and reliable transportation.`
            : `Regular commuter looking for cost-effective travel options.`
        }
      });

      users.push(user);
    }

    return users;
  }

  private async generateRoutes(count: number, drivers: User[]): Promise<Route[]> {
    const locations = [
      'Downtown Plaza', 'City Center', 'Airport Terminal 1', 'Airport Terminal 2',
      'University Campus', 'Shopping Mall', 'Beach Resort', 'Business District',
      'Residential Area', 'Industrial Zone', 'Historic Quarter', 'Suburban Heights',
      'Riverside Park', 'Metro Station', 'Hospital Complex', 'Sports Stadium'
    ];

    const routes: Route[] = [];

    for (let i = 0; i < count; i++) {
      const driver = drivers[Math.floor(Math.random() * drivers.length)];
      const origin = locations[Math.floor(Math.random() * locations.length)];
      let destination = locations[Math.floor(Math.random() * locations.length)];

      // Ensure origin and destination are different
      while (destination === origin) {
        destination = locations[Math.floor(Math.random() * locations.length)];
      }

      const departureDate = this.getRandomFutureDate();
      const departureTime = this.getRandomTime();
      const totalSeats = Math.floor(Math.random() * 4 + 2); // 2-5 seats
      const price = Math.floor(Math.random() * 30 + 10); // $10-$40

      const stops = this.generateRouteStops(origin, destination, locations);

      const route = await this.storage.createRoute({
        driverId: driver.id,
        routeName: `${origin} to ${destination}`,
        origin,
        destination,
        departureDate,
        departureTime,
        stops,
        totalSeats,
        price,
        notes: Math.random() > 0.7 ? this.getRandomRouteNote() : undefined
      });

      routes.push(route);
    }

    return routes;
  }

  private generateRouteStops(origin: string, destination: string, locations: string[]) {
    const numStops = Math.random() > 0.6 ? Math.floor(Math.random() * 2 + 1) : 0; // 0-2 intermediate stops
    const stops = [
      { name: origin, estimatedTime: '0 min', order: 0, latitude: this.getRandomLatitude(), longitude: this.getRandomLongitude() }
    ];

    // Add intermediate stops
    for (let i = 0; i < numStops; i++) {
      const availableLocations = locations.filter(loc => loc !== origin && loc !== destination);
      const stopLocation = availableLocations[Math.floor(Math.random() * availableLocations.length)];
      stops.push({
        name: stopLocation,
        estimatedTime: `${(i + 1) * 15} min`,
        order: i + 1,
        latitude: this.getRandomLatitude(),
        longitude: this.getRandomLongitude()
      });
    }

    // Add destination
    stops.push({
      name: destination,
      estimatedTime: `${(numStops + 1) * 15 + 10} min`,
      order: numStops + 1,
      latitude: this.getRandomLatitude(),
      longitude: this.getRandomLongitude()
    });

    return stops;
  }

  private async generateBookings(count: number, routes: Route[], customers: User[]): Promise<Booking[]> {
    const bookings: Booking[] = [];
    const statuses: Array<'pending' | 'confirmed' | 'cancelled' | 'completed'> = ['pending', 'confirmed', 'cancelled', 'completed'];

    for (let i = 0; i < count && routes.length > 0; i++) {
      const route = routes[Math.floor(Math.random() * routes.length)];
      const customer = customers[Math.floor(Math.random() * customers.length)];

      // Skip if route has no available seats
      if (route.availableSeats <= 0) continue;

      const seats = Math.min(
        Math.floor(Math.random() * 3 + 1), // 1-3 seats
        route.availableSeats
      );

      try {
        const booking = await this.storage.createBooking({
          routeId: route.id,
          customerId: customer.id,
          seats,
          notes: Math.random() > 0.8 ? this.getRandomBookingNote() : undefined
        });

        // Update booking status (simulate completed bookings, etc.)
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const driverConfirmed = Math.random() > 0.3;
        const customerConfirmed = true;

        const updatedBooking = await this.storage.updateBooking(booking.id, {
          status,
          driverConfirmed,
          customerConfirmed
        });

        bookings.push(updatedBooking);
      } catch (error) {
        // Skip bookings that fail (e.g., not enough seats)
        continue;
      }
    }

    return bookings;
  }

  private async generateConversationsAndMessages(bookings: Booking[], messageCount: number): Promise<void> {
    // Create conversations for 60% of bookings
    const bookingsWithChat = bookings.filter(() => Math.random() > 0.4);

    for (const booking of bookingsWithChat) {
      try {
        const conversation = await this.storage.createConversation(
          booking.id,
          booking.driverId,
          booking.customerId
        );

        // Generate 3-15 messages per conversation
        const numMessages = Math.floor(Math.random() * 12 + 3);

        for (let i = 0; i < numMessages; i++) {
          const isDriverSender = Math.random() > 0.5;
          const senderId = isDriverSender ? booking.driverId : booking.customerId;

          await this.storage.addMessage(conversation.id, {
            senderId,
            text: this.getRandomMessage(isDriverSender),
            type: 'text'
          });

          // Small chance of system messages
          if (Math.random() > 0.9) {
            await this.storage.addMessage(conversation.id, {
              senderId: booking.driverId,
              text: this.getRandomSystemMessage(),
              type: 'system'
            });
          }
        }
      } catch (error) {
        // Skip conversations that fail to create
        continue;
      }
    }
  }

  private async generateLocationData(drivers: User[]): Promise<void> {
    const baseLocations = [
      { lat: 42.141296, lng: -8.234724 },
      { lat: 42.140800, lng: -8.234200 },
      { lat: 42.142000, lng: -8.236000 },
      { lat: 42.139500, lng: -8.233000 }
    ];

    for (const driver of drivers) {
      const baseLocation = baseLocations[Math.floor(Math.random() * baseLocations.length)];

      // Generate current location
      await this.storage.updateLocation(driver.id, {
        latitude: baseLocation.lat + (Math.random() - 0.5) * 0.01,
        longitude: baseLocation.lng + (Math.random() - 0.5) * 0.01,
        accuracy: Math.floor(Math.random() * 20 + 10),
        speed: Math.floor(Math.random() * 60),
        heading: Math.floor(Math.random() * 360)
      });

      // Generate location history (last 20 positions)
      for (let i = 0; i < 20; i++) {
        await this.storage.updateLocation(driver.id, {
          latitude: baseLocation.lat + (Math.random() - 0.5) * 0.02,
          longitude: baseLocation.lng + (Math.random() - 0.5) * 0.02,
          accuracy: Math.floor(Math.random() * 25 + 15),
          speed: Math.floor(Math.random() * 50 + 10),
          heading: Math.floor(Math.random() * 360)
        });
      }
    }
  }

  // Helper methods
  private getRandomFutureDate(): string {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30)); // 0-30 days from now
    return futureDate.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  private getRandomTime(): string {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  private getRandomLatitude(): number {
    return 42.141296 + (Math.random() - 0.5) * 0.1; // Around the base location
  }

  private getRandomLongitude(): number {
    return -8.234724 + (Math.random() - 0.5) * 0.1; // Around the base location
  }

  private getRandomRouteNote(): string {
    const notes = [
      'Non-smoking vehicle only',
      'Small luggage only, no large bags',
      'Please be punctual, departure is strict',
      'AC available, comfortable ride',
      'Pet-friendly driver',
      'Music allowed, just ask!',
      'Prefer quiet passengers',
      'WiFi available in vehicle'
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  }

  private getRandomBookingNote(): string {
    const notes = [
      'Will have one medium suitcase',
      'Running slightly late, please wait 5 minutes',
      'First time user, please be patient',
      'Prefer window seat if possible',
      'Will need help with luggage',
      'Very punctual, will be there early'
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  }

  private getRandomMessage(isDriver: boolean): string {
    const driverMessages = [
      'Hi! I\'ll be driving a blue Honda Civic',
      'I\'m running about 5 minutes late, sorry!',
      'Please wait at the main entrance',
      'Traffic is heavy, might be delayed',
      'On my way, see you soon!',
      'Where exactly should I pick you up?',
      'Thanks for choosing my ride!',
      'Please confirm your pickup location',
      'Are you ready? I\'m outside',
      'Safe travels! Please rate the ride'
    ];

    const customerMessages = [
      'Thank you! I\'ll be wearing a red jacket',
      'No problem, I can wait',
      'I\'m at the main entrance as requested',
      'Understood, no rush!',
      'Great, looking forward to the trip',
      'I\'ll be at the coffee shop near the entrance',
      'Thank you so much for the ride!',
      'I\'m the one with the blue backpack',
      'Yes, I\'m ready and waiting outside',
      'Excellent service, will book again!'
    ];

    const messages = isDriver ? driverMessages : customerMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private getRandomSystemMessage(): string {
    const systemMessages = [
      'Booking confirmed by driver',
      'Pickup location updated',
      'Payment processed successfully',
      'Trip completed',
      'Route updated by driver'
    ];
    return systemMessages[Math.floor(Math.random() * systemMessages.length)];
  }
}

// Helper function to initialize mock data
export async function initializeMockData(storage: IStorage): Promise<void> {
  const generator = new MockDataGenerator(storage);
  await generator.generateAllMockData({
    userCount: 50,
    routeCount: 80,
    bookingCount: 150,
    messageCount: 400
  });
}