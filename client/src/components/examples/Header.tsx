import Header from '../Header';
import { useState } from 'react';

export default function HeaderExample() {
  const [role, setRole] = useState<"driver" | "customer">("driver");

  return (
    <Header 
      userRole={role} 
      onRoleSwitch={setRole}
      notificationCount={3}
    />
  );
}
