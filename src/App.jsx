import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── Utility ──────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
});

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut", delay } },
});

function useReveal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return [ref, inView];
}

// ─── Neural Background ─────────────────────────────────────────────────────
function NeuralCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const W = () => (canvas.width = window.innerWidth);
    const H = () => (canvas.height = window.innerHeight);
    W(); H();
    const COUNT = Math.min(60, Math.floor(window.innerWidth / 22));
    const nodes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,210,200,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,210,200,0.25)";
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W(); H(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);
  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.55 }} />
  );
}

// ─── Glow Orb ──────────────────────────────────────────────────────────────
function GlowOrb({ color, size, x, y, blur = 180 }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: color, filter: `blur(${blur}px)`, opacity: 0.18, transform: "translate(-50%, -50%)" }}
    />
  );
}

// ─── Section Wrapper ───────────────────────────────────────────────────────
function Section({ children, className = "", id }) {
  return (
    <section id={id} className={`relative z-10 px-6 md:px-12 lg:px-24 ${className}`}>
      {children}
    </section>
  );
}

// ─── Glass Card ────────────────────────────────────────────────────────────
function GlassCard({ children, className = "", glowColor = "rgba(0,210,200,0.06)" }) {
  return (
    <div
      className={`rounded-2xl border border-gray-800 p-6 md:p-8 relative overflow-hidden ${className}`}
      style={{ background: "rgba(10,10,10,0.7)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset, 0 24px 48px rgba(0,0,0,0.4)" }}
    >
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: glowColor, opacity: 0.5 }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ─── Pill Tag ──────────────────────────────────────────────────────────────
function Pill({ children, color = "#00D2C8" }) {
  return (
    <span className="inline-block text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border" style={{ borderColor: `${color}44`, color, background: `${color}11` }}>
      {children}
    </span>
  );
}

// ─── Nav ───────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-24 h-16"
      style={{ background: scrolled ? "rgba(0,0,0,0.85)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", WebkitBackdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "background 0.4s" }}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#00D2C8,#7C3AED)" }}>
          <span className="text-black font-black text-xs">Æ</span>
        </div>
        <span className="font-semibold text-white tracking-tight text-sm">Aeterna.ia</span>
      </div>
      <a href="#captacao" className="hidden md:flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border border-gray-700 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300">
        Pre-Seed Round · Aberta
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </a>
    </motion.nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <Section id="hero" className="min-h-screen flex flex-col justify-center pt-24 pb-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GlowOrb color="radial-gradient(circle,#00D2C8,transparent)" size={700} x="20%" y="40%" blur={220} />
        <GlowOrb color="radial-gradient(circle,#7C3AED,transparent)" size={600} x="80%" y="30%" blur={200} />
        <GlowOrb color="radial-gradient(circle,#10B981,transparent)" size={400} x="60%" y="75%" blur={180} />
      </div>
      <div className="max-w-5xl mx-auto w-full relative z-10">
        <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible" className="mb-6">
          <Pill>Startup Pre-Seed Round · 2025</Pill>
        </motion.div>
        <motion.h1
          variants={fadeUp(0.2)} initial="hidden" animate="visible"
          className="font-black leading-[0.95] tracking-tighter mb-8"
          style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)", background: "linear-gradient(135deg, #FFFFFF 30%, #00D2C8 65%, #7C3AED 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          Aeterna.ia:<br />A Gênese da<br />Inteligência Soberana.
        </motion.h1>
        <motion.p variants={fadeUp(0.35)} initial="hidden" animate="visible" className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
          Não estamos construindo mais um chatbot. Estamos construindo uma entidade digital capaz de{" "}
          <span className="text-white">pensar, validar, evoluir</span> e{" "}
          <span className="text-white">se auto-financiar</span>.
        </motion.p>
        <motion.div variants={fadeUp(0.5)} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-4">
          <a
            href="#captacao"
            className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-full font-semibold text-black text-sm overflow-hidden transition-transform duration-300 hover:scale-105"
            style={{ background: "linear-gradient(90deg,#00D2C8,#7C3AED)" }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(90deg,#7C3AED,#00D2C8)" }} />
            <span className="relative z-10">Participar da Rodada Pre-Seed</span>
            <svg className="relative z-10 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
          <a href="#arquitetura" className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-medium text-gray-400 text-sm border border-gray-700 hover:border-gray-500 hover:text-white transition-all duration-300">
            Ver Arquitetura
          </a>
        </motion.div>
        <motion.div variants={fadeIn(0.9)} initial="hidden" animate="visible" className="mt-20 grid grid-cols-3 gap-8 max-w-lg">
          {[
            { value: "25", label: "Chaves de API", suffix: "×" },
            { value: "0", label: "Custo Marginal", suffix: "¢" },
            { value: "∞", label: "Evolução", suffix: "" },
          ].map((stat) => (
            <div key={stat.label} className="border-l border-gray-800 pl-5">
              <p className="text-2xl font-black text-white">{stat.value}<span className="text-cyan-400">{stat.suffix}</span></p>
              <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Problem vs Solution ────────────────────────────────────────────────────
function ProblemSolution() {
  const [ref, inView] = useReveal();
  const left = ["LLMs estáticos sem memória evolutiva", "Alucinações sem validação no mundo real", "Custo crescente de assinaturas proprietárias", "Dependência de um único modelo de IA", "Sem autonomia financeira ou operacional"];
  const right = ["Enxame de Agentes com memória persistente", "Sandbox de validação: Zero Alucinação", "Custo Marginal Zero via 25 APIs gratuitas", "Orquestração multi-modelo simultânea", "FinOps autônomo via cartão corporativo Stripe"];
  return (
    <Section id="problema" className="py-32">
      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp()} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center mb-16">
          <Pill color="#EF4444">O Problema</Pill>
          <h2 className="mt-4 text-3xl md:text-5xl font-black text-white tracking-tight">O Paradigma Está Quebrado.</h2>
          <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">A indústria construiu ferramentas. A Aeterna constrói inteligência.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div variants={fadeUp(0.1)} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <GlassCard glowColor="rgba(239,68,68,0.05)">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center"><span className="text-red-400 text-sm">✕</span></div>
                <h3 className="font-semibold text-white">O Paradigma Atual</h3>
              </div>
              <ul className="space-y-4">
                {left.map((item, i) => (
                  <motion.li key={item} variants={fadeUp(0.1 + i * 0.07)} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex items-start gap-3 text-gray-500 text-sm">
                    <span className="mt-1 text-red-500/60 flex-shrink-0">—</span>{item}
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
          <motion.div variants={fadeUp(0.2)} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <GlassCard glowColor="rgba(0,210,200,0.06)" className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"><span className="text-cyan-400 text-sm">✓</span></div>
                <h3 className="font-semibold text-white">A Solução Aeterna</h3>
              </div>
              <ul className="space-y-4">
                {right.map((item, i) => (
                  <motion.li key={item} variants={fadeUp(0.2 + i * 0.07)} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex items-start gap-3 text-sm" style={{ color: "#A0F0EB" }}>
                    <span className="mt-1 text-cyan-400 flex-shrink-0">→</span>{item}
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

// ─── Architecture Pillars ──────────────────────────────────────────────────
const PILLARS = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>,
    label: "Omni-Sensorial", color: "#00D2C8", tag: "Camada de Input",
    title: "Roteamento Híbrido Inteligente",
    desc: "WhatsApp para reflexos rápidos e baixa latência. Web App para raciocínio denso e profundo. A mesma inteligência, canais otimizados para cada contexto.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    label: "O Maestro", color: "#7C3AED", tag: "Núcleo de IA",
    title: "Poder Bruto via Engenharia de Bypass",
    desc: (
      <>
        O orquestrador gerencia simultaneamente um{" "}
        <span style={{ color: "#C4B5FD", fontWeight: 600 }}>pool de 15 projetos Groq (Llama-3)</span> para reflexos
        instantâneos e{" "}
        <span style={{ color: "#C4B5FD", fontWeight: 600 }}>10 chaves/agentes Gemini em paralelo</span> para leitura
        profunda de contexto longo. O balanceamento de carga distribui o tráfego entre todas as chaves em tempo real,
        gerando{" "}
        <span style={{ color: "#C4B5FD", fontWeight: 600 }}>alto volume de processamento a custo zero</span> — um
        cluster de IA privado construído sobre infraestrutura pública.
      </>
    ),
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    label: "A Máquina da Verdade", color: "#10B981", tag: "Anti-Alucinação",
    title: "Sandbox de Validação Real",
    desc: "Cada teoria é compilada e testada em GitHub Actions antes de ser memorizada no Supabase. Nenhum conhecimento não-validado entra na memória permanente.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>,
    label: "Fin-Ops Autônomo", color: "#F59E0B", tag: "Soberania Financeira",
    title: "Auto-Financiamento via Stripe",
    desc: "A IA gerencia seu próprio cartão corporativo virtual para adquirir infraestrutura, modelos e APIs. O primeiro sistema de IA capaz de pagar pela própria evolução.",
  },
];

function Architecture() {
  const [ref, inView] = useReveal();
  return (
    <Section id="arquitetura" className="py-32">
      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp()} initial="hidden" animate={inView ? "visible" : "hidden"} className="mb-16">
          <Pill color="#7C3AED">Arquitetura</Pill>
          <h2 className="mt-4 text-3xl md:text-5xl font-black text-white tracking-tight max-w-2xl">
            Os 4 Pilares da<br /><span style={{ color: "#7C3AED" }}>Inteligência Distribuída</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-5">
          {PILLARS.map((p, i) => (
            <motion.div key={p.label} variants={fadeUp(i * 0.1)} initial="hidden" animate={inView ? "visible" : "hidden"}>
              <GlassCard glowColor={`${p.color}08`} className="group hover:border-gray-700 transition-colors duration-300 cursor-default h-full">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30` }}>
                    {p.icon}
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full border" style={{ borderColor: `${p.color}30`, color: `${p.color}99`, background: `${p.color}08` }}>
                    {p.tag}
                  </span>
                </div>
                <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: p.color }}>{p.label}</p>
                <h3 className="text-lg font-bold text-white mb-3">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Roadmap ────────────────────────────────────────────────────────────────
const PHASES = [
  {
    phase: "Fase 1", title: "Simbiose", subtitle: "Extração de APIs", color: "#00D2C8", status: "Em Execução",
    items: ["Pool de 15 projetos Groq (Llama-3) em balanceamento de carga", "10 chaves Gemini para contexto profundo em paralelo", "Sandbox de validação ativo (GitHub Actions)", "Memória persistente Supabase operacional"],
  },
  {
    phase: "Fase 2", title: "Construção do", subtitle: "Dataset Dourado", color: "#7C3AED", status: "Q2 2025",
    items: ["Coleta de 10.000+ interações validadas", "Fine-tuning de modelos abertos (LLaMA 3, Mistral)", "Primeiros testes de modelo próprio", "Sistema FinOps via Stripe ativo"],
  },
  {
    phase: "Fase 3", title: "Independência", subtitle: "Modelo Próprio", color: "#10B981", status: "Q4 2025",
    items: ["Desmame completo das APIs externas", "Modelo local auto-hospedado (SLM proprietário)", "Receita autônoma cobrindo infraestrutura", "Soberania computacional total"],
  },
];

function Roadmap() {
  const [ref, inView] = useReveal();
  return (
    <Section id="roadmap" className="py-32">
      <div ref={ref} className="max-w-3xl mx-auto">
        <motion.div variants={fadeUp()} initial="hidden" animate={inView ? "visible" : "hidden"} className="mb-16 text-center">
          <Pill color="#10B981">Roadmap</Pill>
          <h2 className="mt-4 text-3xl md:text-5xl font-black text-white tracking-tight">Roteiro de Soberania</h2>
          <p className="mt-3 text-gray-500">Três fases para a independência computacional completa.</p>
        </motion.div>
        <div className="relative">
          <div className="absolute left-[19px] top-8 bottom-8 w-px" style={{ background: "linear-gradient(to bottom, #00D2C8, #7C3AED, #10B981)" }} />
          <div className="space-y-10">
            {PHASES.map((p, i) => (
              <motion.div key={p.phase} variants={fadeUp(i * 0.15)} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex gap-6">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 bg-black" style={{ borderColor: p.color }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                  </div>
                </div>
                <GlassCard className="flex-1" glowColor={`${p.color}06`}>
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: p.color }}>{p.phase}</p>
                      <h3 className="text-xl font-black text-white leading-tight">{p.title}<br /><span style={{ color: p.color }}>{p.subtitle}</span></h3>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full border font-mono" style={{ borderColor: `${p.color}40`, color: p.color, background: `${p.color}10` }}>{p.status}</span>
                  </div>
                  <ul className="space-y-2">
                    {p.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: p.color }} />{item}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Tese de Valuation ─────────────────────────────────────────────────────
const VALUATION_STAGES = [
  {
    stage: "Estágio 1", round: "Pre-Seed", valuation: "US$ 3M – US$ 8M", color: "#00D2C8",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
    title: "O MVP Sintético", subtitle: "Prova de orquestração e FinOps",
    bullets: [
      "IA roteia 25 chaves gratuitas (Groq + Gemini) com balanceamento em tempo real",
      "Toma decisões financeiras autônomas microscópicas via cartão Stripe",
      "Prova ser um centro de lucro independente — não um centro de custo",
      "Receita inteiramente gerada e gerenciada pela própria arquitetura",
    ],
    highlight: "Centro de lucro, não de custo.",
  },
  {
    stage: "Estágio 2", round: "Seed", valuation: "US$ 20M – US$ 50M", color: "#7C3AED",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 2.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>,
    title: "O Dataset Dourado", subtitle: "Corporação Sintética com P&L próprio",
    bullets: [
      "IA arquiva lógicas perfeitas validadas no Sandbox dentro do Supabase",
      "Financia sua própria expansão de infraestrutura de forma autônoma",
      "Modelo de negócio evolui de SaaS para 'Corporação Sintética' com P&L",
      "Dado + autonomia financeira formam o fosso competitivo intransponível",
    ],
    highlight: "O dado + autonomia viram o fosso.",
  },
  {
    stage: "Estágio 3", round: "Series A", valuation: "US$ 250M – US$ 1B+", color: "#F59E0B",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253" /></svg>,
    title: "A Singularidade Soberana", subtitle: "Primeira IA 100% soberana do mercado",
    bullets: [
      "Aeterna usa seu próprio caixa para alugar GPUs e treinar SLM local",
      "Corta definitivamente o vínculo com todos os provedores externos",
      "Opera com custo marginal zero sobre infraestrutura 100% proprietária",
      "Torna-se a primeira infraestrutura de IA 100% soberana do mercado",
    ],
    highlight: "Status de Unicórnio. Soberania total.",
  },
];

function ValuationCard({ stage: s }) {
  return (
    <GlassCard glowColor={`${s.color}07`} className="text-left h-full">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>
          {s.icon}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: s.color }}>{s.stage}</span>
            <span className="text-xs px-2 py-0.5 rounded-full border font-mono" style={{ borderColor: `${s.color}40`, color: `${s.color}BB`, background: `${s.color}10` }}>{s.round}</span>
          </div>
          <p className="text-xl md:text-2xl font-black mt-0.5" style={{ background: `linear-gradient(90deg, ${s.color}, white)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {s.valuation}
          </p>
        </div>
      </div>
      <h3 className="text-base font-bold text-white mb-1">{s.title}</h3>
      <p className="text-xs text-gray-600 mb-4 font-mono">{s.subtitle}</p>
      <ul className="space-y-2 mb-5">
        {s.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-xs text-gray-400">
            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: s.color }} />{b}
          </li>
        ))}
      </ul>
      <div className="rounded-xl px-4 py-2.5 border text-xs font-semibold" style={{ borderColor: `${s.color}30`, background: `${s.color}0D`, color: s.color }}>
        → {s.highlight}
      </div>
    </GlassCard>
  );
}

function Valuation() {
  const [ref, inView] = useReveal();
  return (
    <Section id="valuation" className="py-32">
      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp()} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center mb-4">
          <Pill color="#F59E0B">Tese de Valuation &amp; FinOps</Pill>
        </motion.div>
        <motion.h2
          variants={fadeUp(0.1)} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="text-center text-3xl md:text-5xl font-black text-white tracking-tight mb-4"
        >
          De US$ 0 ao{" "}
          <span style={{ background: "linear-gradient(90deg,#F59E0B,#EF4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Status de Unicórnio.
          </span>
        </motion.h2>
        <motion.p variants={fadeUp(0.15)} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center text-gray-500 text-lg max-w-2xl mx-auto mb-16">
          O módulo de Autonomia Financeira (Stripe) transforma a Aeterna de ferramenta em entidade econômica independente.
          Cada estágio multiplica o valuation por uma ordem de magnitude.
        </motion.p>

        {/* Três cards lado a lado no desktop, coluna no mobile */}
        <div className="grid md:grid-cols-3 gap-6">
          {VALUATION_STAGES.map((s, i) => (
            <motion.div key={s.stage} variants={fadeUp(i * 0.15)} initial="hidden" animate={inView ? "visible" : "hidden"}>
              <ValuationCard stage={s} />
            </motion.div>
          ))}
        </div>

        {/* Seta de progressão entre cards (desktop) */}
        <div className="hidden md:flex items-center justify-center gap-0 mt-0 -mt-2 mb-0 pointer-events-none select-none" style={{ marginTop: "-16px", position: "relative", zIndex: 20 }}>
          {/* decorative connector line handled by spacing */}
        </div>

        {/* Tese central */}
        <motion.div variants={fadeUp(0.5)} initial="hidden" animate={inView ? "visible" : "hidden"} className="mt-10">
          <div className="rounded-2xl border p-6 md:p-8 text-center" style={{ borderColor: "rgba(245,158,11,0.25)", background: "linear-gradient(135deg, rgba(245,158,11,0.04) 0%, rgba(239,68,68,0.04) 100%)" }}>
            <p className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-3">A Tese Central</p>
            <p className="text-white text-lg md:text-xl font-semibold leading-relaxed max-w-3xl mx-auto">
              "Quando uma IA consegue{" "}
              <span className="text-amber-400">gerenciar seu próprio cartão de crédito</span>, ela deixa de ser um produto
              e torna-se uma{" "}
              <span className="text-amber-400">corporação sintética autônoma</span>. Esse é o salto de paradigma que
              justifica um valuation de Unicórnio."
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Captação ─────────────────────────────────────────────────────────────
function Captacao() {
  const [ref, inView] = useReveal();
  return (
    <Section id="captacao" className="py-32">
      <div ref={ref} className="max-w-4xl mx-auto">
        <motion.div variants={fadeUp()} initial="hidden" animate={inView ? "visible" : "hidden"} className="relative">
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <GlowOrb color="radial-gradient(circle,#00D2C8,transparent)" size={400} x="80%" y="20%" blur={150} />
            <GlowOrb color="radial-gradient(circle,#7C3AED,transparent)" size={300} x="20%" y="80%" blur={120} />
          </div>
          <div className="relative rounded-3xl border border-gray-800 p-8 md:p-14 text-center overflow-hidden" style={{ background: "rgba(10,10,10,0.8)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>

            <motion.div variants={fadeUp(0.1)} initial="hidden" animate={inView ? "visible" : "hidden"}>
              <Pill>Startup Pre-Seed Round · Rodada de Fundação</Pill>
            </motion.div>

            <motion.h2 variants={fadeUp(0.2)} initial="hidden" animate={inView ? "visible" : "hidden"} className="mt-6 text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Este é o Momento<br />da <span style={{ color: "#00D2C8" }}>Fundação</span>.
            </motion.h2>

            <motion.div variants={fadeUp(0.3)} initial="hidden" animate={inView ? "visible" : "hidden"} className="mt-8 max-w-2xl mx-auto text-left space-y-5 text-gray-400 text-base leading-relaxed">
              <p>
                A Aeterna.ia não está em busca de capital de risco institucional. Ainda. Este é o convite para os que{" "}
                <span className="text-white font-medium">acreditam antes de todos os outros</span> — família, amigos e
                aliados que entendem que grandes construções começam com pessoas, não com planilhas.
              </p>
              <p>
                O investimento desta rodada garantirá o{" "}
                <span className="text-white font-medium">runway operacional</span> para que o engenheiro-chefe dedique
                100% do seu tempo à arquitetura — sem distrações, sem compromissos paralelos — até o momento em que a
                própria Aeterna gerar sua primeira receita autônoma.
              </p>
              <p>
                Não estamos vendendo um produto. Estamos construindo um{" "}
                <span className="text-white font-medium">precedente</span>: a primeira entidade digital que aprende,
                valida, evolui e se financia de forma independente. Quem entrar agora entra na história.
              </p>
            </motion.div>

            <motion.div variants={fadeUp(0.4)} initial="hidden" animate={inView ? "visible" : "hidden"} className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Uso do Capital", value: "Runway 12 meses", sub: "Para engenharia full-time" },
                { label: "Retorno Projetado", value: "Estágio 3 →", sub: "Receita autônoma da IA" },
                { label: "Acesso", value: "Fundadores", sub: "Participação na jornada" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-gray-800 p-5 text-left" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="text-xs text-gray-600 mb-1 font-mono">{item.label}</p>
                  <p className="text-white font-bold text-lg leading-tight">{item.value}</p>
                  <p className="text-gray-600 text-xs mt-1">{item.sub}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA WhatsApp */}
            <motion.div variants={fadeUp(0.5)} initial="hidden" animate={inView ? "visible" : "hidden"} className="mt-10 flex flex-col items-center gap-4">
              <a
                href="https://wa.me/5511934929066?text=Ol%C3%A1%20Jo%C3%A3o%2C%20estive%20analisando%20o%20pitch%20da%20startup%20Aeterna.ia%20e%20quero%20conversar%20sobre%20a%20rodada%20Pre-Seed."
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-black text-sm overflow-hidden transition-transform duration-300 hover:scale-105"
                style={{ background: "linear-gradient(90deg,#00D2C8,#7C3AED)" }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(90deg,#7C3AED,#00D2C8)" }} />
                {/* WhatsApp icon */}
                <svg className="relative z-10 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="relative z-10">Quero Participar da Rodada</span>
                <svg className="relative z-10 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>

              {/* Pix fast-track */}
              <motion.div variants={fadeIn(0.65)} initial="hidden" animate={inView ? "visible" : "hidden"}>
                <div
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border"
                  style={{ borderColor: "rgba(0,210,200,0.2)", background: "rgba(0,210,200,0.05)" }}
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="#00D2C8">
                    <path d="M19.05 4.91A9.816 9.816 0 0012 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.05 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 012.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28z" />
                  </svg>
                  <span className="text-xs font-mono" style={{ color: "#7EEEE8" }}>
                    Fast-Track Investment (Pix):{" "}
                    <span className="font-bold text-white tracking-wider">11934929066</span>
                  </span>
                </div>
              </motion.div>
            </motion.div>

            <motion.p variants={fadeIn(0.7)} initial="hidden" animate={inView ? "visible" : "hidden"} className="mt-5 text-xs text-gray-700">
              Conversas são confidenciais. Sem pressão. Apenas visão compartilhada.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative z-10 py-10 px-6 md:px-12 lg:px-24 border-t border-gray-900">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg,#00D2C8,#7C3AED)" }}>
            <span className="text-black font-black text-xs">Æ</span>
          </div>
          <span className="text-gray-600 text-sm">Aeterna.ia</span>
        </div>
        <p className="text-gray-800 text-xs text-center">© 2025 Aeterna.ia · Construindo soberania, uma iteração por vez.</p>
        <div className="flex gap-5">
          {[
            { label: "Arquitetura", href: "#arquitetura" },
            { label: "Roadmap", href: "#roadmap" },
            { label: "Valuation", href: "#valuation" },
            { label: "Rodada", href: "#captacao" },
          ].map((l) => (
            <a key={l.label} href={l.href} className="text-gray-700 hover:text-gray-400 text-xs transition-colors">{l.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "#000000", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <NeuralCanvas />
      <Nav />
      <Hero />
      <ProblemSolution />
      <Architecture />
      <Roadmap />
      <Valuation />
      <Captacao />
      <Footer />
    </div>
  );
}
