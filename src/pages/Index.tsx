import { useState } from "react";
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [clienteId, setClienteId] = useState<string | null>(null);

  if (!clienteId) return <Login onLogin={setClienteId} />;
  return <Dashboard clienteId={clienteId} onLogout={() => setClienteId(null)} />;
};

export default Index;
