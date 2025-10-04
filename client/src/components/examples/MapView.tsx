import MapView from '../MapView';

export default function MapViewExample() {
  return (
    <div className="h-96">
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
  );
}
