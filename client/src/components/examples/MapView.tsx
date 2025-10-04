import MapView from '../MapView';

export default function MapViewExample() {
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

  const route = [
    { name: "Downtown Plaza", lat: 42.140800, lng: -8.234200, eta: "Start" },
    { name: "City Center", lat: 42.141500, lng: -8.235000, eta: "10 min" },
    { name: "Airport", lat: 42.142000, lng: -8.236000, eta: "25 min" }
  ];

  return (
    <div className="h-96">
      <MapView
        currentLocation={currentLocation}
        positionHistory={positionHistory}
        route={route}
      />
    </div>
  );
}
