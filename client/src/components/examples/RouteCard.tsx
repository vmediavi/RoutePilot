import RouteCard from '../RouteCard';

export default function RouteCardExample() {
  return (
    <div className="p-4 max-w-md">
      <RouteCard
        id="1"
        driverName="Maria Garcia"
        driverRating={4.9}
        origin="Downtown Plaza"
        destination="Airport Terminal 2"
        departureTime="09:30 AM"
        departureDate="Oct 15, 2025"
        availableSeats={2}
        totalSeats={4}
        price="15"
        onBook={() => console.log('Book route clicked')}
        onViewDetails={() => console.log('View details clicked')}
      />
    </div>
  );
}
