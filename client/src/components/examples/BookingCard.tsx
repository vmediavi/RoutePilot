import BookingCard from '../BookingCard';

export default function BookingCardExample() {
  return (
    <div className="p-4 max-w-md space-y-4">
      <BookingCard
        id="1"
        userName="John Smith"
        userRole="customer"
        origin="Downtown Plaza"
        destination="Airport Terminal 2"
        date="Oct 15, 2025"
        time="09:30 AM"
        seats={2}
        status="pending"
        driverConfirmed={true}
        customerConfirmed={false}
        onConfirm={() => console.log('Confirm booking')}
        onReject={() => console.log('Reject booking')}
        onChat={() => console.log('Open chat')}
      />
      
      <BookingCard
        id="2"
        userName="Maria Garcia"
        userRole="driver"
        origin="City Center"
        destination="Beach Resort"
        date="Oct 16, 2025"
        time="02:00 PM"
        seats={1}
        status="confirmed"
        onChat={() => console.log('Open chat')}
      />
    </div>
  );
}
