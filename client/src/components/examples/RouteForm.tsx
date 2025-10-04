import RouteForm from '../RouteForm';

export default function RouteFormExample() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <RouteForm onSubmit={(data) => console.log('Form submitted:', data)} />
    </div>
  );
}
