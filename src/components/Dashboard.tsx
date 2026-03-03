import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CLIENTES, fetchLeads, groupByDay, exportCSV, type Lead } from "@/lib/leads";
import { Zap, BarChart3, Download, LogOut, Users, CalendarDays, Phone, Building2 } from "lucide-react";

interface DashboardProps {
  clienteId: string;
  onLogout: () => void;
}

function Badge({ text }: { text?: string }) {
  if (!text) return <span className="text-muted-foreground/40">—</span>;
  return (
    <span className="inline-block bg-secondary border border-border rounded-full px-2.5 py-0.5 text-xs text-primary max-w-[200px] truncate">
      {text}
    </span>
  );
}

export default function Dashboard({ clienteId, onLogout }: DashboardProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const cliente = CLIENTES.find((c) => c.id === clienteId);

  useEffect(() => {
    setLoading(true);
    fetchLeads(clienteId)
      .then(setLeads)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [clienteId]);

  const filtered = leads.filter((l) =>
    [l.nome, l.empresa, l.dor_principal, l.interesse]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const chartData = groupByDay(leads);

  const stats = [
    { label: "Total de Leads", value: leads.length, icon: Users },
    {
      label: "Últimos 7 dias",
      value: leads.filter((l) => {
        const d = new Date(l.created_at || "");
        return Date.now() - d.getTime() < 7 * 86400000;
      }).length,
      icon: CalendarDays,
    },
    { label: "Com Telefone", value: leads.filter((l) => l.telefone).length, icon: Phone },
    { label: "Com Empresa", value: leads.filter((l) => l.empresa).length, icon: Building2 },
  ];

  return (
    <div className="flex min-h-screen bg-background font-body">
      {/* SIDEBAR */}
      <aside className="w-[220px] bg-sidebar border-r border-sidebar-border flex flex-col p-6 shrink-0">
        <div className="flex justify-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
        </div>
        <nav className="flex-1">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-sidebar-accent text-primary text-sm font-medium">
            <BarChart3 className="w-4 h-4" /> Dashboard
          </div>
        </nav>
        <div className="border-t border-sidebar-border pt-4">
          <p className="text-sidebar-foreground text-xs text-center mb-3">{cliente?.nome}</p>
          <button
            className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-2 text-muted-foreground text-xs hover:text-foreground transition-colors"
            onClick={onLogout}
          >
            <LogOut className="w-3.5 h-3.5" /> Sair
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <header className="flex justify-between items-start mb-8 animate-fade-in">
          <div>
            <h1 className="font-display text-3xl font-bold">Seus Leads</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {cliente?.nome} · {leads.length} leads capturados
            </p>
          </div>
          <button
            className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 text-primary text-sm hover:bg-secondary transition-colors"
            onClick={() => exportCSV(leads, cliente?.nome || "")}
          >
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-6 animate-fade-in">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-1">
              <s.icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-3xl font-bold text-primary font-display">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        {/* CHART */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6 animate-fade-in">
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
            Leads por dia (últimos 14 dias)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 15% 18%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(240 5% 45%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(240 5% 45%)", fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(240 25% 9%)",
                  border: "1px solid hsl(240 15% 18%)",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "hsl(0 0% 70%)" }}
                itemStyle={{ color: "hsl(252 100% 71%)" }}
              />
              <Bar dataKey="total" fill="hsl(252 100% 71%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SEARCH */}
        <div className="mb-4">
          <input
            className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground text-sm outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            placeholder="🔍  Buscar por nome, empresa, dor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
          {loading ? (
            <div className="p-10 text-center text-muted-foreground">Carregando leads...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">Nenhum lead encontrado.</div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Nome", "Empresa", "Telefone", "Dor Principal", "Interesse", "Data"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[11px] text-muted-foreground uppercase tracking-widest border-b border-border bg-background"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-border cursor-pointer hover:bg-secondary/50 transition-colors"
                    onClick={() => setSelectedLead(l)}
                  >
                    <td className="px-4 py-3 text-sm font-medium">{l.nome || "—"}</td>
                    <td className="px-4 py-3 text-sm text-foreground/70">{l.empresa || "—"}</td>
                    <td className="px-4 py-3 text-sm text-foreground/70">{l.telefone || "—"}</td>
                    <td className="px-4 py-3 text-sm"><Badge text={l.dor_principal} /></td>
                    <td className="px-4 py-3 text-sm"><Badge text={l.interesse} /></td>
                    <td className="px-4 py-3 text-sm text-foreground/70">
                      {l.created_at ? l.created_at.slice(0, 10) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* MODAL */}
      {selectedLead && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-8 w-[480px] relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-lg"
              onClick={() => setSelectedLead(null)}
            >
              ✕
            </button>
            <h2 className="font-display text-xl font-bold mb-6">{selectedLead.nome || "Lead"}</h2>
            {[
              ["Empresa", selectedLead.empresa],
              ["Telefone", selectedLead.telefone],
              ["Dor Principal", selectedLead.dor_principal],
              ["Interesse", selectedLead.interesse],
              ["Chat ID", selectedLead.chat_id],
              ["Criado em", selectedLead.created_at?.slice(0, 19).replace("T", " ")],
            ].map(([k, v]) => (
              <div key={k as string} className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground text-sm">{k}</span>
                <span className="text-foreground text-sm text-right max-w-[280px]">{v || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
