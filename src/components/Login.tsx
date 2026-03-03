import { useState } from "react";
import { CLIENTES, SENHAS } from "@/lib/leads";
import { Zap } from "lucide-react";

interface LoginProps {
  onLogin: (clienteId: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [clienteId, setClienteId] = useState("clienteA");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = () => {
    if (SENHAS[clienteId] === senha) {
      onLogin(clienteId);
    } else {
      setErro("Senha incorreta. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-fade-in bg-card border border-border rounded-2xl p-12 w-[380px] text-center">
        <div className="mb-4 flex justify-center">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Zap className="w-7 h-7 text-primary" />
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">Painel de Leads</h1>
        <p className="text-muted-foreground text-sm mb-8">Acesse seus resultados</p>

        <div className="text-left mb-4">
          <label className="block text-muted-foreground text-xs uppercase tracking-widest mb-1.5">
            Empresa
          </label>
          <select
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-foreground text-sm outline-none focus:ring-1 focus:ring-primary"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          >
            {CLIENTES.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div className="text-left mb-4">
          <label className="block text-muted-foreground text-xs uppercase tracking-widest mb-1.5">
            Senha
          </label>
          <input
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-foreground text-sm outline-none focus:ring-1 focus:ring-primary"
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {erro && <p className="text-destructive text-sm mb-4">{erro}</p>}

        <button
          className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold text-sm hover:opacity-90 transition-opacity mt-2"
          onClick={handleLogin}
        >
          Entrar →
        </button>
      </div>
    </div>
  );
}
