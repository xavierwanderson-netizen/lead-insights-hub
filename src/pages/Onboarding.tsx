import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const N8N_WEBHOOK_URL = "https://synpase.app.n8n.cloud/webhook/onboarding";

const STEPS = [
  { id: 1, title: "Empresa", icon: "🏢" },
  { id: 2, title: "Telegram", icon: "✈️" },
  { id: 3, title: "Conteúdo", icon: "📚" },
  { id: 4, title: "Prompt", icon: "🤖" },
];

const PLANOS = [
  { id: "starter", label: "Starter", desc: "500 msgs/mês", preco: "R$ 297" },
  { id: "pro", label: "Pro", desc: "2.000 msgs/mês", preco: "R$ 597" },
  { id: "enterprise", label: "Enterprise", desc: "Ilimitado", preco: "R$ 1.497" },
];

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex flex-col items-center gap-1.5 flex-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
              i < current
                ? "bg-primary border-primary text-primary-foreground"
                : i === current
                ? "bg-card border-primary text-primary"
                : "bg-card border-border text-muted-foreground"
            }`}
          >
            {i < current ? "✓" : i + 1}
          </div>
          <span
            className={`text-[11px] text-center ${
              i <= current ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {s.icon} {s.title}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const [form, setForm] = useState({
    nome_empresa: "",
    cliente_id: "",
    plano: "starter",
    telegram_bot_token: "",
    telegram_bot_username: "",
    drive_folder_id: "",
    namespace: "",
    prompt: "",
    senha_painel: "",
  });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const gerarClienteId = (nome: string) =>
    nome.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "").slice(0, 20);

  const handleNomeChange = (val: string) => {
    set("nome_empresa", val);
    if (!form.cliente_id || form.cliente_id === gerarClienteId(form.nome_empresa)) {
      set("cliente_id", gerarClienteId(val));
      set("namespace", gerarClienteId(val));
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!form.nome_empresa) return "Informe o nome da empresa";
      if (!form.cliente_id) return "Informe o ID do cliente";
    }
    if (step === 2) {
      if (!form.telegram_bot_token) return "Informe o token do bot";
    }
    if (step === 3) {
      if (!form.drive_folder_id) return "Informe o ID da pasta do Drive";
    }
    if (step === 4) {
      if (!form.prompt) return "Defina o prompt do agente";
      if (!form.senha_painel) return "Defina uma senha para o painel";
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => Math.min(s + 1, 4));
  };

  const back = () => { setError(""); setStep((s) => Math.max(s - 1, 1)); };

  const submit = async () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao enviar");
      setSuccess(true);
      toast({ title: "Cliente cadastrado com sucesso!" });
    } catch {
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setStep(1);
    setForm({
      nome_empresa: "", cliente_id: "", plano: "starter",
      telegram_bot_token: "", telegram_bot_username: "",
      drive_folder_id: "", namespace: "", prompt: "", senha_painel: "",
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans">
        <Card className="w-full max-w-md text-center border-border">
          <CardContent className="pt-10 pb-8 px-8">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Cliente cadastrado!</h1>
            <p className="text-muted-foreground text-sm mb-6">
              O onboarding da <strong className="text-foreground">{form.nome_empresa}</strong> foi iniciado com sucesso.
            </p>
            <div className="text-left space-y-1 mb-6">
              {[
                "✅ Registro criado no banco",
                "✅ Webhook do Telegram sendo configurado",
                "✅ Documentos sendo indexados no Pinecone",
                "✅ Agente pronto em alguns minutos",
              ].map((item) => (
                <div key={item} className="text-muted-foreground text-sm py-1.5 border-b border-border">{item}</div>
              ))}
            </div>
            <div className="bg-card rounded-lg p-4 mb-6 border border-border space-y-1.5">
              {[
                ["Cliente ID", form.cliente_id],
                ["Plano", form.plano],
                ["Senha do painel", form.senha_painel],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-primary font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <Button onClick={resetForm} className="w-full">Cadastrar outro cliente</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-[560px] border-border">
        <CardHeader className="text-center pb-2">
          <div className="text-4xl mb-3">⚡</div>
          <CardTitle className="text-2xl">Novo Cliente</CardTitle>
          <CardDescription>Configure o agente de vendas em minutos</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <ProgressBar current={step} />

          {/* STEP 1 — EMPRESA */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">🏢 Dados da Empresa</h2>
              <div className="space-y-1.5">
                <Label>Nome da Empresa *</Label>
                <Input placeholder="Ex: CDL Goiânia" value={form.nome_empresa} onChange={(e) => handleNomeChange(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>ID do Cliente *</Label>
                <p className="text-xs text-muted-foreground">Gerado automaticamente — pode editar se quiser</p>
                <Input placeholder="Ex: cdlgoiania" value={form.cliente_id} onChange={(e) => set("cliente_id", e.target.value.toLowerCase().replace(/\s/g, ""))} />
              </div>
              <div className="space-y-1.5">
                <Label>Plano *</Label>
                <div className="grid grid-cols-3 gap-3">
                  {PLANOS.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => set("plano", p.id)}
                      className={`rounded-lg p-4 text-center cursor-pointer border-2 transition-colors ${
                        form.plano === p.id
                          ? "border-primary bg-accent"
                          : "border-border bg-card hover:border-muted-foreground"
                      }`}
                    >
                      <div className="text-foreground font-bold text-sm">{p.label}</div>
                      <div className="text-muted-foreground text-[11px] mb-2">{p.desc}</div>
                      <div className="text-primary font-bold text-sm">{p.preco}/mês</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — TELEGRAM */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">✈️ Bot do Telegram</h2>
              <div className="space-y-1.5">
                <Label>Token do Bot *</Label>
                <p className="text-xs text-muted-foreground">Obtido no @BotFather — formato: 123456789:AAF...</p>
                <Input placeholder="123456789:AAFxxxxxxxxxxxxxxxxxx" value={form.telegram_bot_token} onChange={(e) => set("telegram_bot_token", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Username do Bot</Label>
                <p className="text-xs text-muted-foreground">Ex: cdlgoiania_bot (sem o @)</p>
                <Input placeholder="cdlgoiania_bot" value={form.telegram_bot_username} onChange={(e) => set("telegram_bot_username", e.target.value)} />
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground">
                <strong className="text-foreground">Como criar o bot:</strong>
                <ol className="mt-2 pl-5 list-decimal space-y-1">
                  <li>Abra o Telegram e busque @BotFather</li>
                  <li>Digite /newbot</li>
                  <li>Defina nome e username</li>
                  <li>Copie o token gerado</li>
                </ol>
              </div>
            </div>
          )}

          {/* STEP 3 — CONTEÚDO */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">📚 Base de Conhecimento</h2>
              <div className="space-y-1.5">
                <Label>ID da Pasta do Google Drive *</Label>
                <p className="text-xs text-muted-foreground">Cole o ID da pasta com os documentos do cliente</p>
                <Input placeholder="1N-PvNmnbgwJ49JB8qjMUQ02-n7VZiX_i" value={form.drive_folder_id} onChange={(e) => set("drive_folder_id", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Namespace no Pinecone</Label>
                <p className="text-xs text-muted-foreground">Gerado automaticamente</p>
                <Input value={form.namespace || form.cliente_id} onChange={(e) => set("namespace", e.target.value)} />
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground">
                <strong className="text-foreground">Como pegar o ID da pasta:</strong>
                <p className="mt-2">
                  Abra a pasta no Google Drive. O ID está na URL:<br />
                  <code className="text-primary">drive.google.com/drive/folders/<strong>ID_AQUI</strong></code>
                </p>
              </div>
            </div>
          )}

          {/* STEP 4 — PROMPT */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">🤖 Configuração do Agente</h2>
              <div className="space-y-1.5">
                <Label>Prompt do Agente *</Label>
                <p className="text-xs text-muted-foreground">Use {"{nome_empresa}"} para inserir o nome automaticamente</p>
                <Textarea
                  className="min-h-[140px]"
                  placeholder="Você é um SDR focado em vendas consultivas representando a empresa {nome_empresa}..."
                  value={form.prompt}
                  onChange={(e) => set("prompt", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Senha do Painel de Leads *</Label>
                <p className="text-xs text-muted-foreground">O cliente usará essa senha para acessar o painel</p>
                <Input type="password" placeholder="Mínimo 6 caracteres" value={form.senha_painel} onChange={(e) => set("senha_painel", e.target.value)} />
              </div>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-destructive text-sm mt-4">
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-3 justify-end mt-6">
            {step > 1 && (
              <Button variant="outline" onClick={back}>← Voltar</Button>
            )}
            {step < 4 ? (
              <Button onClick={next}>Continuar →</Button>
            ) : (
              <Button onClick={submit} disabled={loading}>
                {loading ? "Cadastrando..." : "🚀 Cadastrar Cliente"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
