import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Clock, Briefcase, MessageCircle, CheckCircle2, ArrowLeft, ArrowRight, Send } from "lucide-react";

const WEBHOOK_URL = "https://n8n-production-841d.up.railway.app/webhook/onboarding-agendamento";

const STEPS = [
  { id: 1, title: "Empresa", icon: Building2 },
  { id: 2, title: "Atendimento", icon: Clock },
  { id: 3, title: "Serviços", icon: Briefcase },
  { id: 4, title: "Integração", icon: MessageCircle },
  { id: 5, title: "Revisão", icon: CheckCircle2 },
];

const TIPOS_NEGOCIO = [
  "Clínica Médica",
  "Clínica Odontológica",
  "Barbearia",
  "Salão de Beleza",
  "Psicologia",
  "Fisioterapia",
  "Outro",
];

const DIAS_SEMANA = [
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
  { id: "sab", label: "Sáb" },
  { id: "dom", label: "Dom" },
];

const DURACOES = ["30", "45", "60", "90"];

interface FormData {
  nome_empresa: string;
  tipo_negocio: string;
  endereco: string;
  email_remetente: string;
  dias_atendimento: string[];
  horario_inicio: string;
  horario_fim: string;
  duracao_atendimento: number;
  max_agendamentos_dia: number;
  servicos: string;
  planos_aceitos: string;
  telegram_bot: string;
  instancia_whatsapp: string;
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const isComplete = i < current;
        const isCurrent = i === current;
        return (
          <div key={s.id} className="flex flex-col items-center gap-1.5 flex-1 relative">
            {i > 0 && (
              <div
                className={`absolute top-4 -left-1/2 w-full h-0.5 transition-colors ${
                  isComplete ? "bg-primary" : "bg-border"
                }`}
              />
            )}
            <div
              className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isComplete
                  ? "bg-primary text-primary-foreground shadow-md"
                  : isCurrent
                  ? "bg-primary/10 border-2 border-primary text-primary"
                  : "bg-muted border-2 border-border text-muted-foreground"
              }`}
            >
              {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </div>
            <span
              className={`text-[11px] font-medium text-center ${
                isCurrent ? "text-primary" : isComplete ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {s.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function OnboardingAgendamento() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const [form, setForm] = useState<FormData>({
    nome_empresa: "",
    tipo_negocio: "",
    endereco: "",
    email_remetente: "",
    dias_atendimento: [],
    horario_inicio: "08:00",
    horario_fim: "18:00",
    duracao_atendimento: 30,
    max_agendamentos_dia: 20,
    servicos: "",
    planos_aceitos: "",
    telegram_bot: "",
    instancia_whatsapp: "",
  });

  const set = (key: keyof FormData, val: string | number | string[]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleDia = (dia: string) => {
    setForm((f) => ({
      ...f,
      dias_atendimento: f.dias_atendimento.includes(dia)
        ? f.dias_atendimento.filter((d) => d !== dia)
        : [...f.dias_atendimento, dia],
    }));
  };

  const validateStep = (): string | null => {
    if (step === 0) {
      if (!form.nome_empresa.trim()) return "Informe o nome da empresa";
      if (!form.tipo_negocio) return "Selecione o tipo de negócio";
      if (!form.endereco.trim()) return "Informe o endereço";
      if (!form.email_remetente.trim()) return "Informe o e-mail";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_remetente))
        return "E-mail inválido";
    }
    if (step === 1) {
      if (form.dias_atendimento.length === 0) return "Selecione pelo menos um dia";
      if (!form.horario_inicio) return "Informe o horário de início";
      if (!form.horario_fim) return "Informe o horário de fim";
    }
    if (step === 2) {
      if (!form.servicos.trim()) return "Informe os serviços oferecidos";
    }
    if (step === 3) {
      if (!form.telegram_bot.trim()) return "Informe o token do bot Telegram";
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => Math.min(s + 1, 4));
  };

  const back = () => { setError(""); setStep((s) => Math.max(s - 1, 0)); };

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao enviar");
      setSuccess(true);
      toast({ title: "Cadastro realizado com sucesso!" });
    } catch {
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className="w-full max-w-md text-center shadow-lg">
            <CardContent className="pt-10 pb-8 px-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Cadastro realizado!
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                Em até 24h seu agente estará ativo.
              </p>
              <div className="bg-muted rounded-lg p-4 mb-6 space-y-2 text-left">
                {[
                  ["Empresa", form.nome_empresa],
                  ["Tipo", form.tipo_negocio],
                  ["E-mail", form.email_remetente],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="text-foreground font-medium">{v}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => window.location.href = "/"} className="w-full">
                Voltar ao início
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const reviewItems = [
    { label: "Empresa", value: form.nome_empresa },
    { label: "Tipo de negócio", value: form.tipo_negocio },
    { label: "Endereço", value: form.endereco },
    { label: "E-mail", value: form.email_remetente },
    { label: "Dias de atendimento", value: form.dias_atendimento.join(", ") },
    { label: "Horário", value: `${form.horario_inicio} – ${form.horario_fim}` },
    { label: "Duração da consulta", value: `${form.duracao_atendimento} min` },
    { label: "Máx. agendamentos/dia", value: String(form.max_agendamentos_dia) },
    { label: "Serviços", value: form.servicos },
    { label: "Planos aceitos", value: form.planos_aceitos || "—" },
    { label: "Token Telegram", value: form.telegram_bot ? "••••" + form.telegram_bot.slice(-6) : "—" },
    { label: "Instância WhatsApp", value: form.instancia_whatsapp || "—" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-[620px] shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
            Cadastro de Empresa
          </CardTitle>
          <CardDescription>Configure seu agente de agendamento inteligente</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <StepIndicator current={step} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* STEP 1 — Empresa */}
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" /> Dados da Empresa
                  </h2>
                  <div className="space-y-1.5">
                    <Label>Nome da Empresa *</Label>
                    <Input placeholder="Ex: Clínica Sorriso" value={form.nome_empresa} onChange={(e) => set("nome_empresa", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tipo de Negócio *</Label>
                    <Select value={form.tipo_negocio} onValueChange={(v) => set("tipo_negocio", v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {TIPOS_NEGOCIO.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Endereço Completo *</Label>
                    <Input placeholder="Rua, número, bairro, cidade - UF" value={form.endereco} onChange={(e) => set("endereco", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>E-mail para Confirmações *</Label>
                    <Input type="email" placeholder="contato@clinica.com" value={form.email_remetente} onChange={(e) => set("email_remetente", e.target.value)} />
                  </div>
                </div>
              )}

              {/* STEP 2 — Atendimento */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" /> Configuração do Atendimento
                  </h2>
                  <div className="space-y-1.5">
                    <Label>Dias de Atendimento *</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {DIAS_SEMANA.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => toggleDia(d.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                            form.dias_atendimento.includes(d.id)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-card text-muted-foreground hover:border-muted-foreground"
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Horário Início *</Label>
                      <Input type="time" value={form.horario_inicio} onChange={(e) => set("horario_inicio", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Horário Fim *</Label>
                      <Input type="time" value={form.horario_fim} onChange={(e) => set("horario_fim", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Duração da Consulta *</Label>
                      <Select value={String(form.duracao_atendimento)} onValueChange={(v) => set("duracao_atendimento", Number(v))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {DURACOES.map((d) => (
                            <SelectItem key={d} value={d}>{d} minutos</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Máx. Agendamentos/dia</Label>
                      <Input type="number" min={1} value={form.max_agendamentos_dia} onChange={(e) => set("max_agendamentos_dia", Number(e.target.value))} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — Serviços */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" /> Serviços e Planos
                  </h2>
                  <div className="space-y-1.5">
                    <Label>Serviços Oferecidos *</Label>
                    <p className="text-xs text-muted-foreground">Separe por vírgula</p>
                    <Textarea
                      className="min-h-[100px]"
                      placeholder="Ex: Limpeza, Clareamento, Extração, Consulta"
                      value={form.servicos}
                      onChange={(e) => set("servicos", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Planos Aceitos</Label>
                    <p className="text-xs text-muted-foreground">Separe por vírgula (opcional)</p>
                    <Textarea
                      className="min-h-[80px]"
                      placeholder="Ex: Amil, Unimed, Particular"
                      value={form.planos_aceitos}
                      onChange={(e) => set("planos_aceitos", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* STEP 4 — Integração */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" /> Integração
                  </h2>
                  <div className="space-y-1.5">
                    <Label>Token do Bot Telegram *</Label>
                    <p className="text-xs text-muted-foreground">Obtido no @BotFather — formato: 123456789:AAF...</p>
                    <Input placeholder="123456789:AAFxxxxxxxxxxxxxxxxxx" value={form.telegram_bot} onChange={(e) => set("telegram_bot", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Instância WhatsApp</Label>
                    <p className="text-xs text-muted-foreground">Opcional — nome da instância na Evolution API</p>
                    <Input placeholder="nome-da-clinica" value={form.instancia_whatsapp} onChange={(e) => set("instancia_whatsapp", e.target.value)} />
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
                    <strong className="text-foreground">Como criar o bot Telegram:</strong>
                    <ol className="mt-2 pl-5 list-decimal space-y-1">
                      <li>Abra o Telegram e busque @BotFather</li>
                      <li>Digite /newbot</li>
                      <li>Defina nome e username</li>
                      <li>Copie o token gerado</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* STEP 5 — Revisão */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Revisão Final
                  </h2>
                  <p className="text-sm text-muted-foreground">Confira os dados antes de finalizar o cadastro.</p>
                  <div className="bg-muted rounded-lg divide-y divide-border">
                    {reviewItems.map((item) => (
                      <div key={item.label} className="flex justify-between px-4 py-2.5 text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="text-foreground font-medium text-right max-w-[55%] truncate">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-destructive text-sm mt-4">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-between mt-6">
            <div>
              {step > 0 && (
                <Button variant="outline" onClick={back}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                </Button>
              )}
            </div>
            <div>
              {step < 4 ? (
                <Button onClick={next}>
                  Continuar <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={submit} disabled={loading}>
                  {loading ? "Enviando..." : (
                    <>
                      <Send className="w-4 h-4 mr-1" /> Finalizar Cadastro
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
