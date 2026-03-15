import React, { useState, useEffect, useRef, memo } from 'react';
import {
  Terminal as TerminalIcon,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Code2,
  Laptop,
  School,
  Cpu,
  ExternalLink,
  ChevronRight,
  Monitor,
  Command,
  User,
  Layers,
  Briefcase,
  Trophy,
  Users,
  Settings,
  Database,
  Globe,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';

// --- Components ---

const MatrixRain = memo(() => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@&%*<>{}[]';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1).map(() => Math.random() * -100);

    const draw = () => {
      // Very slight fade for trailing effect
      ctx.fillStyle = 'rgba(2, 2, 2, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px "JetBrains Mono"`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Leading character is brighter and has a glow
        if (Math.random() > 0.9) {
          ctx.fillStyle = '#fff';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00ff41';
        } else {
          ctx.fillStyle = '#00ff41';
          ctx.shadowBlur = 0;
        }

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.985) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-[0.12] z-0" />;
});

const TypingText = ({ text, delay = 0, speed = 50, className = "" }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i === text.length) {
          clearInterval(interval);
          setComplete(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return (
    <span className={className}>
      {displayedText}
      {!complete && <span className="animate-blink inline-block w-1.5 h-4 bg-matrix-500 ml-1" />}
    </span>
  );
};

const Section = ({ children, id, className = "", title, icon: Icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`section-container ${className}`}
    >
      <div className="section-window">
        <div className="window-header">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
          </div>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-3 h-3 text-matrix-500/40" />}
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
              {title || id}.sys
            </span>
          </div>
          <div className="w-10" />
        </div>
        <div className="p-8 md:p-12">
          {children}
        </div>
      </div>
    </motion.section>
  );
};

const SectionTitle = ({ children, icon: Icon, subtitle }) => (
  <div className="mb-16">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-matrix-500/10 border border-matrix-500/20 rounded-sm">
        <Icon className="w-5 h-5 text-matrix-500" />
      </div>
      <div className="flex flex-col">
        <h2 className="text-3xl font-black tracking-[.25em] text-white uppercase text-glow">
          {children}
        </h2>
        {subtitle && (
          <span className="text-[10px] text-matrix-500/40 uppercase tracking-[0.4em] font-bold mt-1">
            {subtitle}
          </span>
        )}
      </div>
    </div>
    <div className="h-[1px] w-full bg-gradient-to-r from-matrix-500/40 via-matrix-500/10 to-transparent" />
  </div>
);

// --- Main App ---

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const shellRef = useRef(null);
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'output', text: 'Initializing AyushOS v4.2.0...' },
    { type: 'output', text: 'Kernel: Linux 5.15.0-generic' },
    { type: 'output', text: 'Status: SYSTEM_READY_FOR_ENGAGEMENT' },
    { type: 'output', text: 'Type "help" to see available commands.' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsBooted(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatus('SENDING...');
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus('SIGNAL_SENT_SUCCESSFULLY');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('ERROR:_SIGNAL_INTERRUPTED');
      }
    } catch (error) {
      setStatus('OFFLINE:_CHECK_SERVER_CONNECTION');
    }
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = inputValue.toLowerCase().trim();
      const newHistory = [...terminalHistory, { type: 'input', text: inputValue }];

      let response = '';
      if (cmd === 'help') response = 'Available: help, clear, contact, projects, skills, resume, status';
      else if (cmd === 'clear') { setTerminalHistory([]); setInputValue(''); return; }
      else if (cmd === 'contact') response = 'ayushauti5605@gmail.com | +91 8149457576';
      else if (cmd === 'projects') response = 'Indexing repositories... Scroll to PROJECT section for full UI.';
      else if (cmd === 'skills') response = 'MERN Stack, Java, Python, SQL, Cloud Dev...';
      else if (cmd === 'resume') response = 'Opening resume.pdf in a new data stream...';
      else if (cmd === 'status') response = 'Current Status: Open for Internships/Roles. Build Pipeline: Stable.';
      else response = `ERR: Command "${cmd}" not found. Try "help".`;

      setTerminalHistory([...newHistory, { type: 'output', text: response }]);
      setInputValue('');

      setTimeout(() => {
        if (shellRef.current) shellRef.current.scrollTop = shellRef.current.scrollHeight;
      }, 50);
    }
  };

  if (!isBooted) {
    return (
      <div className="h-screen bg-[#020202] flex flex-col items-center justify-center font-mono relative overflow-hidden">
        <div className="absolute inset-0 bg-matrix-500/[0.02] grid grid-cols-[repeat(20,minmax(0,1fr))] pointer-events-none">
          {Array(20).fill(0).map((_, i) => (
            <div key={i} className="border-r border-matrix-500/5 h-full" />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <Cpu className="w-12 h-12 text-matrix-500" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-matrix-500 text-xs tracking-[0.8em] font-black uppercase"
          >
            Booting System...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#020202] selection:bg-matrix-500/30 overflow-x-hidden antialiased">
      <MatrixRain />
      <div className="scanline" />
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03] bg-[radial-gradient(#00ff41_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.02] matrix-noise" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 font-bold group"
          >
            <div className="relative">
              <div className="w-10 h-10 flex items-center justify-center bg-matrix-500 text-black font-black text-xs">AA</div>
              <div className="absolute -inset-1 border border-matrix-500/20 group-hover:border-matrix-500/50 transition-colors" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="tracking-[0.2em] text-[10px] text-matrix-500 font-black uppercase">AyushOS</span>
              <span className="text-[8px] text-matrix-500/40 font-bold uppercase tracking-widest italic">v4.2.0</span>
            </div>
          </motion.div>
          <div className="hidden md:flex gap-10">
            {['ABOUT', 'EXPERIENCE', 'PROJECTS', 'CONTACT'].map((item, idx) => (
              <motion.a
                key={item}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                href={`#${item.toLowerCase()}`}
                className="text-[10px] font-black tracking-[0.3em] text-white/40 hover:text-matrix-500 transition-all relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-matrix-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center">

        {/* --- Hero Section --- */}
        <section className="min-h-screen w-full flex items-center justify-center py-32">
          <div className="max-w-6xl w-full px-6 grid lg:grid-cols-2 gap-20 items-center">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-matrix-500/5 border border-matrix-500/20 mb-8 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-matrix-500 animate-pulse" />
                  <span className="text-[9px] text-matrix-500 font-black uppercase tracking-[0.2em]">Live Connection established</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
                  <span className="text-white">AYUSH</span><br />
                  <span className="text-matrix-500 text-glow-strong">AUTI</span>
                </h1>

                <p className="text-lg md:text-xl text-zinc-400 max-w-lg mb-12 font-medium leading-relaxed">
                  3rd Year Computer Engineering @ <span className="text-matrix-500">D.Y. Patil IT</span>.
                  Specializing in the <span className="text-white border-b border-white/10">MERN Stack</span> and AI-driven architecture.
                </p>

                <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                  <a href="#projects" className="btn-terminal group flex items-center gap-3">
                    <Command className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                    Load Workspace
                  </a>
                  <a href="mailto:ayushauti5605@gmail.com" className="btn-terminal group flex items-center gap-3">
                    <Mail className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    Send Signal
                  </a>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-matrix-500/10 blur-[100px] rounded-full opacity-20 pointer-events-none" />
              <div className="window-box rounded-xl">
                <div className="window-header">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                    <TerminalIcon className="w-3 h-3" /> system@ayush-os
                  </span>
                  <div className="w-10" />
                </div>
                <div
                  ref={shellRef}
                  className="p-8 h-[360px] overflow-y-auto font-mono text-[13px] leading-relaxed custom-scrollbar"
                >
                  {terminalHistory.map((line, i) => (
                    <div key={i} className={line.type === 'input' ? "text-white" : "text-matrix-500/70"}>
                      {line.type === 'input' && <span className="mr-3 text-matrix-500 opacity-50">➜</span>}
                      {line.text}
                    </div>
                  ))}
                  <div className="flex items-center mt-2 group">
                    <span className="mr-3 text-matrix-500 font-bold opacity-50">➜</span>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleCommand}
                      className="bg-transparent border-none outline-none flex-1 text-white caret-matrix-500"
                      autoFocus
                      placeholder="Type 'help'..."
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- About Section --- */}
        <Section id="about" title="About" icon={User}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Identity Profile</h3>
              <p className="text-xl leading-relaxed text-zinc-100 font-medium">
                Passionate developer focused on creating high-performance, scalable web systems. Won the Solo Dev challenge by building a full ERP module in 8 hours.
              </p>
              <div className="grid gap-4">
                {[
                  { icon: Trophy, title: 'Competition', val: '1st Place Solo Hackathon' },
                  { icon: School, title: 'Education', val: '8.5 GPA @ D.Y. Patil' },
                  { icon: Briefcase, title: 'Current Role', val: 'Full-stack Intern' }
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border border-white/5 bg-white/[0.02]">
                    <s.icon className="w-5 h-5 text-matrix-500" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white/20 uppercase">{s.title}</span>
                      <span className="text-sm font-bold text-white uppercase">{s.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-zinc-900 aspect-video flex items-center justify-center border border-white/5 relative group overflow-hidden">
              <div className="absolute inset-0 bg-matrix-500/5 group-hover:bg-matrix-500/10 transition-colors" />
              <Cpu className="w-20 h-20 text-matrix-500/20 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </Section>

        {/* --- Experience Section --- */}
        <Section id="experience" title="History" icon={Briefcase}>
          <div className="max-w-4xl mx-auto py-10 relative">
            <div className="absolute left-0 lg:left-1/2 top-0 bottom-0 w-[1px] bg-white/5 hidden lg:block" />

            <div className="relative group">
              <div className="lg:w-1/2 lg:pr-16 mb-12 lg:mb-0">
                <div className="bg-white/[0.02] border border-white/5 p-8 relative">
                  <div className="absolute -right-2 top-8 w-4 h-4 bg-matrix-500 rotate-45 hidden lg:block" />
                  <span className="text-[10px] font-black text-matrix-500 uppercase tracking-widest">2025 — PRESENT</span>
                  <h4 className="text-2xl font-black text-white mt-2 mb-4">FULL-STACK INTERN</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-medium">
                    Developing enterprise-scale ERP solutions and MERN microservices at XenoTech Solutions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['NODE', 'REACT', 'RBAC', 'REST'].map(t => (
                      <span key={t} className="text-[8px] font-black px-2 py-0.5 border border-white/10 text-white/40">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* --- Projects Section --- */}
        <Section id="projects" title="Works" icon={Layers}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              title="SCHOOL ERP v3"
              desc="Comprehensive institutional management suite with automated billing and attendance."
              tags={['MERN', 'NEXT', 'AWS']}
            />
            <ProjectCard
              title="FINANCE AI"
              desc="Deep-learning utility for expense tracking and predictive financial modeling."
              tags={['PYTORCH', 'REACT', 'DB']}
            />
            <ProjectCard
              title="RENTAL HUB"
              desc="Real-estate marketplace with geocoding, multi-role auth, and payment gateway."
              tags={['EXPRESS', 'GEO', 'STRIPE']}
            />
          </div>
        </Section>

        {/* --- Skills Grid --- */}
        <Section id="skills" title="Matrix" icon={Cpu}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <SkillBlock label="Languages" items={['JS', 'Java', 'Python', 'SQL']} icon={Code2} />
            <SkillBlock label="Backend" items={['Node', 'Express', 'PHP', 'API']} icon={Layers} />
            <SkillBlock label="Frontend" items={['React', 'Next', 'Tailwind', 'Canvas']} icon={Monitor} />
            <SkillBlock label="Storage" items={['Mongo', 'Postgres', 'Redis', 'Supabase']} icon={Database} />
            <SkillBlock label="DevOps" items={['Git', 'Docker', 'AWS', 'Linux']} icon={Settings} />
            <SkillBlock label="Utilities" items={['Postman', 'Cursor', 'Vim', 'Thunder']} icon={Globe} />
          </div>
        </Section>

        {/* --- Contact Section --- */}
        <Section id="contact" title="Handshake" icon={Mail}>
          <div className="max-w-4xl mx-auto py-10">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase">Initialize Link</h2>
                <p className="text-zinc-500 mb-10 text-lg font-medium leading-relaxed uppercase">
                  Accepting high-bandwidth challenges and engineering collaborations.
                </p>
                <div className="flex gap-8 items-center bg-white/[0.02] border border-white/5 p-6 inline-flex">
                  <a href="https://github.com" className="text-white/20 hover:text-white transition-all"><Github className="w-8 h-8" /></a>
                  <a href="https://linkedin.com" className="text-white/20 hover:text-white transition-all"><Linkedin className="w-8 h-8" /></a>
                  <a href="mailto:ayushauti5605@gmail.com" className="text-white/20 hover:text-white transition-all"><Mail className="w-8 h-8" /></a>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">User_Identity</span>
                    <input
                      type="text"
                      placeholder="NAME"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/[0.02] border border-white/10 p-4 text-white font-mono text-sm outline-none focus:border-matrix-500/50 transition-colors uppercase"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Return_Path</span>
                    <input
                      type="email"
                      placeholder="EMAIL"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white/[0.02] border border-white/10 p-4 text-white font-mono text-sm outline-none focus:border-matrix-500/50 transition-colors uppercase"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Packet_Payload</span>
                    <textarea
                      placeholder="MESSAGE"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-white/[0.02] border border-white/10 p-4 text-white font-mono text-sm outline-none focus:border-matrix-500/50 transition-colors uppercase resize-none"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-terminal w-full py-5 flex items-center justify-center gap-4">
                  <FileText className="w-5 h-5" /> {status || 'INITIALIZE_HANDSHAKE'}
                </button>
              </form>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="py-20 w-full border-t border-matrix-500/10 bg-zinc-950/50">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
            <div className="flex flex-col gap-2">
              <span className="text-matrix-500/40">© 2026 AYUSH_AUTI.SYSTEM</span>
              <span className="text-[8px] opacity-30">ENCRYPTION: QUANTUM_SECURED</span>
            </div>
            <div className="flex gap-12 items-center">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-matrix-500 rounded-full animate-pulse shadow-[0_0_8px_#00ff41]" />
                <span className="text-matrix-500/60 uppercase">System_Healthy</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-matrix-500/20 rounded-full" />
                <span className="uppercase tracking-widest">Uptime_99.9%</span>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}

// --- Sub-components ---

const ProjectCard = ({ title, desc, tags }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="card-terminal flex flex-col h-full bg-zinc-900/50"
  >
    <div className="window-header px-4 py-2">
      <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">{title}</span>
      <Monitor className="w-3 h-3 text-matrix-500/40" />
    </div>
    <div className="p-8 flex-1 flex flex-col">
      <h3 className="text-xl font-black mb-3 text-white uppercase tracking-tight">{title}</h3>
      <p className="text-xs text-zinc-500 leading-relaxed mb-10 font-bold uppercase">{desc}</p>
      <div className="mt-auto pt-6 border-t border-white/5 flex flex-wrap gap-2">
        {tags.map(t => <span key={t} className="text-[10px] font-black text-matrix-500/60">{t}</span>)}
      </div>
    </div>
  </motion.div>
);

const SkillBlock = ({ label, items, icon: Icon }) => (
  <motion.div className="flex flex-col">
    <div className="flex items-center gap-3 mb-4 opacity-40">
      <Icon className="w-4 h-4" />
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="p-6 border border-white/5 bg-white/[0.01] flex flex-wrap gap-x-4 gap-y-2">
      {items.map(item => (
        <span key={item} className="text-[11px] text-zinc-400 font-bold hover:text-matrix-500 transition-colors uppercase">{item}</span>
      ))}
    </div>
  </motion.div>
);
