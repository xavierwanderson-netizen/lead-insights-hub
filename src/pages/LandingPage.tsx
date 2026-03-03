import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap, MessageSquare, BarChart3, Users, Clock, TrendingUp,
  Bot, Shield, Globe, ArrowRight, Star, CheckCircle2, Send, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Funcionalidades", href: "#features" },
  { label: "Preços", href: "#pricing" },
  { label: "Cadastro", href: "/onboarding", isRoute: true },
  { label: "Leads", href: "/dashboardlead", isRoute: true },
];

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Multi-canal Inteligente",
    desc: "Telegram, WhatsApp e mais. Seu agente responde em todos os canais com consistência e velocidade.",
  },
  {
    icon: Bot,
    title: "IA Conversacional Avançada",
    desc: "Agentes treinados com seus documentos, FAQ e scripts de vendas. Respostas personalizadas e naturais.",
  },
  {
    icon: BarChart3,
    title: "Painel de Leads em Tempo Real",
    desc: "Visualize, filtre e exporte todos os leads capturados. Gráficos de conversão e métricas que importam.",
  },
  {
    icon: Shield,
    title: "CRM Integrado",
    desc: "Cada lead é registrado automaticamente com nome, empresa, dor principal e interesse detectados pela IA.",
  },
  {
    icon: Clock,
    title: "Resposta em Segundos",
    desc: "Reduza o tempo de resposta de horas para segundos. Nunca mais perca um lead por demora.",
  },
  {
    icon: Globe,
    title: "Onboarding em 5 Minutos",
    desc: "Configure seu agente de vendas em apenas 4 etapas. Sem código, sem complicação.",
  },
];

const TESTIMONIALS = [
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
];

const METRICS = [
  { value: "3.200+", label: "Leads Capturados" },
  { value: "< 8s", label: "Tempo de Resposta" },
  { value: "94%", label: "Taxa de Satisfação" },
  { value: "12x", label: "ROI Médio" },
];

const PLANS = [
  {
    name: "Starter",
    price: "R$ 297",
    desc: "Para quem está começando",
    features: ["500 msgs/mês", "1 canal (Telegram)", "Painel de leads", "Suporte por email"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$ 597",
    desc: "Para equipes em crescimento",
    features: ["2.000 msgs/mês", "Multi-canal", "Exportação CSV", "Suporte prioritário", "Prompt customizado"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "R$ 1.497",
    desc: "Para operações de escala",
    features: ["Msgs ilimitadas", "Todos os canais", "API dedicada", "Gerente de conta", "SLA 99.9%", "Onboarding VIP"],
    highlighted: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (link: typeof NAV_LINKS[0]) => {
    setMobileOpen(false);
    if (link.isRoute) {
      navigate(link.href);
    } else {
      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => document.querySelector("#hero")?.scrollIntoView({ behavior: "smooth" })}>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg">Closing Senior</span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleClick(link)}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
            >
              {link.label}
            </button>
          ))}
          <Button size="sm" className="ml-3" onClick={() => navigate("/onboarding")}>
            Começar Agora
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 pb-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleClick(link)}
              className="block w-full text-left px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
          <Button className="w-full mt-2" onClick={() => { setMobileOpen(false); navigate("/onboarding"); }}>
            Começar Agora
          </Button>
        </div>
      )}
    </nav>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />

      {/* ── HERO ── */}
      <section id="hero" className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-6">
              <Zap className="w-3 h-3" /> Automação de vendas com IA
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Automatize sua prospecção e{" "}
              <span className="text-primary">atendimento com IA</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10">
              Transforme conversas em leads qualificados. Seu agente inteligente responde 24/7, captura dados e alimenta seu painel — enquanto você foca em fechar negócios.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-base px-8 gap-2" onClick={() => navigate("/onboarding")}>
                Cadastre sua empresa agora <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 gap-2" onClick={() => navigate("/dashboardlead")}>
                <BarChart3 className="w-4 h-4" /> Ver dashboard de leads
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section className="py-12 border-y border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
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
              <div className="font-display text-3xl sm:text-4xl font-bold text-primary">{m.value}</div>
              <div className="text-muted-foreground text-sm mt-1">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Tudo que você precisa para <span className="text-primary">vender mais</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Uma plataforma completa de automação comercial alimentada por inteligência artificial.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors group"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Quem usa, <span className="text-primary">recomenda</span>
            </h2>
            <p className="text-muted-foreground text-lg">Resultados reais de empresas como a sua.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-card border border-border rounded-xl p-6"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Planos que <span className="text-primary">cabem no seu bolso</span>
            </h2>
            <p className="text-muted-foreground text-lg">Comece pequeno, escale sem limites.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((p, i) => (
              <motion.div
                key={p.name}
                className={`rounded-xl p-8 border-2 flex flex-col ${
                  p.highlighted
                    ? "border-primary bg-primary/5 relative"
                    : "border-border bg-card"
                }`}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                {p.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Mais popular
                  </span>
                )}
                <h3 className="font-display text-xl font-bold">{p.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{p.desc}</p>
                <div className="mb-6">
                  <span className="font-display text-4xl font-bold text-primary">{p.price}</span>
                  <span className="text-muted-foreground text-sm">/mês</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={p.highlighted ? "default" : "outline"}
                  className="w-full"
                  onClick={() => navigate("/onboarding")}
                >
                  Começar agora
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center bg-card border border-border rounded-2xl p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Send className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-4">
            Pronto para transformar suas vendas?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            Configure seu agente de IA em minutos e comece a capturar leads qualificados hoje mesmo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base px-8 gap-2" onClick={() => navigate("/onboarding")}>
              Cadastre sua empresa <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 gap-2" onClick={() => navigate("/dashboardlead")}>
              <BarChart3 className="w-4 h-4" /> Acessar Dashboard
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-sm">Closing Senior</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <button onClick={() => navigate("/onboarding")} className="hover:text-foreground transition-colors">
              Cadastro
            </button>
            <button onClick={() => navigate("/dashboardlead")} className="hover:text-foreground transition-colors">
              Dashboard
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Closing Senior. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
