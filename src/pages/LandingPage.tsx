import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap, MessageSquare, BarChart3, Users, Clock, TrendingUp,
  Bot, Shield, Globe, ArrowRight, Star, CheckCircle2, Send, Menu, X,
  Sparkles, Headphones, Target, Building2, GraduationCap, Stethoscope, Home as HomeIcon, Factory
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

/* ─── Data ─── */

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Funcionalidades", href: "#features" },
  { label: "Casos de Uso", href: "#usecases" },
  { label: "Preços", href: "#pricing" },
];

const FEATURES = [
  {
    icon: Bot,
    title: "Gestão simplificada de agentes",
    desc: "Crie, ajuste e evolua seus agentes de IA com facilidade, garantindo atendimentos consistentes e eficientes.",
  },
  {
    icon: MessageSquare,
    title: "Respostas automáticas com IA",
    desc: "Utilize conteúdos do seu site e base de conhecimento para responder dúvidas automaticamente, reduzindo o esforço do time.",
  },
  {
    icon: Headphones,
    title: "Tom adaptável de conversa",
    desc: "O agente entende o contexto da interação e ajusta o tom das respostas para uma comunicação mais natural.",
  },
  {
    icon: Target,
    title: "Qualificação automática de leads",
    desc: "Coleta informações ao longo da conversa para acelerar a qualificação e direcionar oportunidades ao time comercial.",
  },
  {
    icon: Globe,
    title: "Dados atualizados em tempo real",
    desc: "Conecte-se a sistemas externos para buscar informações atualizadas durante o atendimento, sem processos manuais.",
  },
  {
    icon: Shield,
    title: "Comportamento personalizável",
    desc: "Defina regras de negócio para transferir, encerrar ou escalar atendimentos conforme a conversa evolui.",
  },
];

const BENEFITS = [
  "Atendimento 24/7 com IA treinada no seu conteúdo",
  "Redução de custos com atendimento",
  "Leads qualificados automaticamente",
  "Conversas mais rápidas e eficientes",
  "Integração nativa com CRM e funil de vendas",
  "Respostas inteligentes com consulta em tempo real",
];

const USE_CASES = [
  {
    icon: GraduationCap,
    title: "Instituições de Ensino",
    desc: "O agente identifica se o contato já é aluno e responde dúvidas sobre cursos, mensalidades e matrículas com dados atualizados.",
  },
  {
    icon: Stethoscope,
    title: "Clínicas e Consultórios",
    desc: "Confirma agendamentos e envia informações de forma automática pelo WhatsApp, direto do sistema da clínica.",
  },
  {
    icon: HomeIcon,
    title: "Imobiliárias",
    desc: "Responde dúvidas sobre imóveis com dados internos como preço, localização, disponibilidade e condições de financiamento.",
  },
  {
    icon: Factory,
    title: "Indústrias",
    desc: "Fornece informações técnicas precisas dos produtos, consultando catálogos internos para atender revendedores e distribuidores.",
  },
];

const METRICS = [
  { value: "3.200+", label: "Leads capturados" },
  { value: "< 8s", label: "Tempo médio de resposta" },
  { value: "94%", label: "Taxa de satisfação" },
  { value: "12x", label: "ROI médio" },
];

const PLANS = [
  {
    name: "Starter",
    price: "R$ 297",
    desc: "Para quem está começando a automatizar.",
    features: ["500 msgs/mês", "1 canal (Telegram)", "Painel de leads", "Suporte por email"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$ 597",
    desc: "Para equipes em crescimento.",
    features: ["2.000 msgs/mês", "Multi-canal", "Exportação CSV", "Suporte prioritário", "Prompt customizado"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    desc: "Para operações de escala.",
    features: ["Msgs ilimitadas", "Todos os canais", "API dedicada", "Gerente de conta", "SLA 99.9%", "Onboarding VIP"],
    highlighted: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

/* ─── Navbar ─── */

function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => scrollTo("#hero")}
        >
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Closing Senior
          </span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md"
            >
              {link.label}
            </button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => navigate("/dashboardlead")}
          >
            Entrar
          </Button>
          <Button size="sm" variant="secondary" className="ml-2" onClick={() => navigate("/onboarding-agendamento")}>
            Agendamento
          </Button>
          <Button size="sm" className="ml-2" onClick={() => navigate("/onboarding")}>
            Começar grátis <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 pb-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="block w-full text-left px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Button variant="outline" onClick={() => { setMobileOpen(false); navigate("/dashboardlead"); }}>
              Entrar
            </Button>
            <Button variant="secondary" onClick={() => { setMobileOpen(false); navigate("/onboarding-agendamento"); }}>
              Agendamento
            </Button>
            <Button onClick={() => { setMobileOpen(false); navigate("/onboarding"); }}>
              Começar grátis <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Page ─── */

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />

      {/* ── HERO ── */}
      <section id="hero" className="pt-28 pb-16 lg:pt-36 lg:pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 bg-secondary/15 text-secondary text-xs font-semibold px-3 py-1 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Agentes de IA para vendas
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] tracking-tight mb-5 text-foreground">
              Atendimento inteligente com IA,{" "}
              <span className="text-primary">em tempo real</span> e sem complicação
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
              Respostas automáticas, naturais e personalizadas que escalam seu atendimento sem sobrecarregar seu time. Transforme conversas em leads qualificados — 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="text-base px-8 gap-2 shadow-lg" onClick={() => navigate("/onboarding")}>
                Cadastre sua empresa <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 gap-2" onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })}>
                Veja na prática
              </Button>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            className="relative hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="w-full max-w-md aspect-square rounded-full bg-primary/8 flex items-center justify-center relative">
              <div className="w-3/4 aspect-square rounded-full bg-primary/12 flex items-center justify-center">
                <div className="w-3/4 aspect-square rounded-full bg-primary/18 flex items-center justify-center">
                  <Bot className="w-20 h-20 text-primary" />
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute top-8 right-4 bg-background border border-border rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-sm font-medium text-foreground">Atenda com IA.</span>
              </div>
              <div className="absolute bottom-12 left-0 bg-secondary text-secondary-foreground rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Venda com eficiência.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── METRICS BAR ── */}
      <section className="py-10 border-y border-border bg-muted/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              className="text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-primary">
                {m.value}
              </div>
              <div className="text-muted-foreground text-sm mt-1">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES (ASSISTENTES INTELIGENTES) ── */}
      <section id="features" className="py-20 lg:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
              Assistentes Inteligentes
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-4 text-foreground">
              IA que transforma seu atendimento
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Agentes inteligentes que entendem o contexto da conversa e entregam atendimentos mais rápidos, personalizados e eficientes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="bg-background border border-border rounded-2xl p-7 hover:shadow-md hover:border-primary/30 transition-all group"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-base font-bold mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS (Seu time focado) ── */}
      <section className="py-20 lg:py-28 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
              Produtividade
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-5 text-foreground">
              Seu time focado no que importa
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Muitas empresas enfrentam problemas com chatbots travados, conversas pouco naturais e leads ficando sem resposta. Os Agentes de IA te ajudam a escapar desse cenário:
            </p>
            <ul className="space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-foreground font-semibold text-base">
              Seu time foca em fechar negócios.{" "}
              <span className="text-primary">E a IA cuida do resto!</span>
            </p>
          </motion.div>

          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-background border border-border rounded-2xl p-8 shadow-sm w-full max-w-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-display text-sm font-bold text-foreground">Painel de Leads</div>
                  <div className="text-xs text-muted-foreground">Atualizado em tempo real</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Leads capturados hoje", value: "47", color: "bg-primary" },
                  { label: "Taxa de conversão", value: "32%", color: "bg-secondary" },
                  { label: "Tempo médio de resposta", value: "6s", color: "bg-primary" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <span className={`text-sm font-bold text-foreground`}>{stat.value}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-6" size="sm" onClick={() => navigate("/dashboardlead")}>
                Ver dashboard completo <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section id="usecases" className="py-20 lg:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
              Casos de Uso
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-4 text-foreground">
              Quer saber como usar na prática?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Veja como empresas de diferentes segmentos já utilizam IA no atendimento:
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {USE_CASES.map((uc, i) => (
              <motion.div
                key={uc.title}
                className="bg-background border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className="w-11 h-11 rounded-xl bg-secondary/15 flex items-center justify-center mb-4">
                  <uc.icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-display text-base font-bold mb-2 text-foreground">{uc.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF (Métricas + Testemunhos) ── */}
      <section className="py-20 lg:py-28 px-6 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-4">
              Empresas que confiam no Closing Senior
            </h2>
            <p className="text-primary-foreground/75 text-lg">Resultados reais de clientes como você.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Ricardo Almeida",
                role: "CEO — TechSales Brasil",
                text: "Triplicamos a captação de leads qualificados no primeiro mês. A IA entende exatamente o tom do nosso negócio.",
                avatar: "RA",
              },
              {
                name: "Fernanda Costa",
                role: "Diretora Comercial — CDL Goiânia",
                text: "O painel de leads mudou nosso jogo. Exportamos tudo para CSV e integramos com nosso CRM sem esforço.",
                avatar: "FC",
              },
              {
                name: "Marcos Oliveira",
                role: "Founder — ClosingPro",
                text: "Setup em 5 minutos, resultados em 24 horas. Melhor investimento que fizemos este ano.",
                avatar: "MO",
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-7 border border-primary-foreground/15"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current text-yellow-300" />
                  ))}
                </div>
                <p className="text-primary-foreground/90 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-primary-foreground/60">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 lg:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
              Planos
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-4 text-foreground">
              Pronto para escalar seu atendimento com IA?
            </h2>
            <p className="text-muted-foreground text-lg">Comece pequeno, escale sem limites.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((p, i) => (
              <motion.div
                key={p.name}
                className={`rounded-2xl p-8 border-2 flex flex-col ${
                  p.highlighted
                    ? "border-primary bg-primary/5 relative shadow-lg"
                    : "border-border bg-background"
                }`}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                {p.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    Mais popular
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-foreground">{p.name}</h3>
                <p className="text-muted-foreground text-sm mb-5">{p.desc}</p>
                <div className="mb-6">
                  <span className="font-display text-4xl font-extrabold text-foreground">{p.price}</span>
                  {p.price !== "Sob consulta" && (
                    <span className="text-muted-foreground text-sm">/mês</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={p.highlighted ? "default" : "outline"}
                  className="w-full"
                  onClick={() => navigate("/onboarding")}
                >
                  {p.price === "Sob consulta" ? "Fale com vendas" : "Começar agora"}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 lg:py-28 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center bg-primary rounded-3xl p-12 lg:p-16 text-primary-foreground"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-foreground/15 flex items-center justify-center mx-auto mb-6">
            <Send className="w-7 h-7" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-4">
            Pronto para transformar suas vendas?
          </h2>
          <p className="text-primary-foreground/75 text-lg mb-8 max-w-lg mx-auto">
            Configure seu agente de IA em minutos e comece a capturar leads qualificados hoje mesmo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="text-base px-8 gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold"
              onClick={() => navigate("/onboarding")}
            >
              Cadastre sua empresa <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate("/dashboardlead")}
            >
              <BarChart3 className="w-4 h-4" /> Acessar Dashboard
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-10 px-6 bg-foreground text-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm">Closing Senior</span>
          </div>
          <div className="flex items-center gap-6 text-sm opacity-70">
            <button onClick={() => navigate("/onboarding")} className="hover:opacity-100 transition-opacity">
              Cadastro
            </button>
            <button onClick={() => navigate("/dashboardlead")} className="hover:opacity-100 transition-opacity">
              Dashboard
            </button>
            <button onClick={() => document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" })} className="hover:opacity-100 transition-opacity">
              Preços
            </button>
          </div>
          <p className="text-xs opacity-50">
            © {new Date().getFullYear()} Closing Senior. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
