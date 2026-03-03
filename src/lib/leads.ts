const SUPABASE_URL = "https://rbiwvevkytatxffeoypw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaXd2ZXZreXRhdHhmZmVveXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzI0MTcsImV4cCI6MjA4ODA0ODQxN30.UkazBahD-MolCE9Dx-0JmoKAMopi9xNiwOc3n51DkjI";

export const CLIENTES = [
  { id: "clienteA", nome: "Closing Senior" },
  { id: "clienteB", nome: "CDL Goiânia" },
];

export const SENHAS: Record<string, string> = {
  clienteA: "senhaA123",
  clienteB: "senhaB123",
};

export interface Lead {
  id: string;
  nome?: string;
  empresa?: string;
  telefone?: string;
  dor_principal?: string;
  interesse?: string;
  chat_id?: string;
  created_at?: string;
  cliente_id: string;
}

export async function fetchLeads(clienteId: string): Promise<Lead[]> {
  const url = `${SUPABASE_URL}/rest/v1/leads?cliente_id=eq.${clienteId}&order=created_at.desc`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao buscar leads");
  return res.json();
}

export function groupByDay(leads: Lead[]) {
  const map: Record<string, number> = {};
  leads.forEach((l) => {
    const day = l.created_at ? l.created_at.slice(0, 10) : "N/A";
    map[day] = (map[day] || 0) + 1;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, total]) => ({ date: date.slice(5), total }));
}

export function exportCSV(leads: Lead[], clienteNome: string) {
  const header = ["nome", "empresa", "telefone", "dor_principal", "interesse", "chat_id", "criado_em"];
  const rows = leads.map((l) =>
    [l.nome, l.empresa, l.telefone, l.dor_principal, l.interesse, l.chat_id, l.created_at]
      .map((v) => `"${v ?? ""}"`)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads_${clienteNome}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}
