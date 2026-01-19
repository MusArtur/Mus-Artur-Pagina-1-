
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  Calendar, 
  Mail, 
  Settings, 
  Trash2, 
  Plus, 
  Sparkles,
  Send,
  X as XIcon,
  Disc,
  Star,
  Share2,
  Loader2,
  Copy,
  Instagram,
  Youtube,
  Facebook,
  Image as ImageIcon,
  Globe,
  ShieldCheck,
  Lock,
  Lightbulb,
  Zap,
  ChevronUp,
  Link as LinkIcon,
  Smartphone as TikTokIcon,
  Check
} from 'lucide-react';
import { AppData, Song, Social, Message, Idea, UpcomingProject } from './types';

const DEFAULT_LOGO = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&h=200&auto=format&fit=crop";
const DEFAULT_BANNER = "https://images.unsplash.com/photo-1514525253361-bee87184f47a?auto=format&fit=crop&q=80&w=1200";

// Extractor de ID de YouTube mejorado para soportar Shorts, Mobile y Music
const getYTid = (url: string | undefined): string | null => {
  if (!url) return null;
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(() => {
    const defaultData: AppData = {
      about: "Mus Artur es un proyecto musical enfocado en transmitir mensajes de fe, esperanza y amor a través de canciones originales.",
      headerLogo: DEFAULT_LOGO,
      artistCover: DEFAULT_BANNER,
      contactEmail: "vicrober0125@gmail.com",
      securityEmail: "vicrober0125@gmail.com",
      songs: [],
      socials: [
        { id: '1', name: 'Instagram', url: 'https://instagram.com/musartur' },
        { id: '2', name: 'Spotify', url: 'https://spotify.com' },
        { id: '3', name: 'YouTube', url: 'https://youtube.com' }
      ],
      upcoming: [],
      messages: [],
      ideas: []
    };

    try {
      const saved = localStorage.getItem('musArturData');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultData,
          ...parsed,
          songs: Array.isArray(parsed.songs) ? parsed.songs : [],
          socials: Array.isArray(parsed.socials) ? parsed.socials : defaultData.socials,
          upcoming: Array.isArray(parsed.upcoming) ? parsed.upcoming : [],
          messages: Array.isArray(parsed.messages) ? parsed.messages : [],
          ideas: Array.isArray(parsed.ideas) ? parsed.ideas : []
        };
      }
    } catch (e) {
      console.error("Fallo al cargar datos guardados", e);
    }
    return defaultData;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginStep, setLoginStep] = useState<1 | 2 | 3>(1);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [twoFactorCode, setTwoFactorCode] = useState(['', '', '', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [codeTimer, setCodeTimer] = useState(60);
  const [shareSong, setShareSong] = useState<Song | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 800);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('musArturData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    let interval: any;
    if (loginStep === 3 && codeTimer > 0) {
      interval = setInterval(() => setCodeTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [loginStep, codeTimer]);

  const handleLogin = () => {
    setLoginError('');
    if (loginForm.email === "vicrober0125@gmail.com" && loginForm.password === "vico0125") {
      setLoginStep(2);
      setIsVerifying(true);
      setTimeout(() => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
        setLoginStep(3);
        setIsVerifying(false);
        setCodeTimer(60);
        setTwoFactorCode(['', '', '', '', '', '']);
        setShowNotification(true);
      }, 1500);
    } else {
      setLoginError('Credenciales incorrectas del sistema.');
    }
  };

  const handleVerify2FA = () => {
    if (twoFactorCode.join('') === generatedCode) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsLoggedIn(true);
        setIsVerifying(false);
        setShowNotification(false);
      }, 1000);
    } else {
      setLoginError('Código de seguridad inválido.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020412] text-[#f1f5f9] selection:bg-blue-600/40 relative">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/5 blur-[150px] rounded-full" />
      </div>

      <AnimatePresence>
        {showNotification && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className="fixed top-0 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-sm glass p-5 rounded-3xl shadow-4xl flex items-center gap-5 border border-white/10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/20"><ShieldCheck size={20} /></div>
            <div className="flex-1">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-400">Autenticación</span>
              <p className="text-sm font-bold text-white">Código: <span className="text-blue-400 font-orbitron">{generatedCode}</span></p>
            </div>
            <button onClick={() => setShowNotification(false)} className="text-white/40 hover:text-white transition-colors"><XIcon size={16}/></button>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative pt-32 pb-20 text-center z-10 px-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="relative inline-block mb-12"
        >
          <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full" />
          <img src={data.headerLogo} alt="Mus Artur Logo" className="w-40 h-40 md:w-56 md:h-56 mx-auto rounded-full border-2 border-white/10 shadow-2xl object-cover relative z-10" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-orbitron text-6xl md:text-9xl font-black blue-gradient-text tracking-tighter filter drop-shadow-2xl"
        >
          Mus Artur
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-[10px] md:text-xs font-light text-blue-100/30 tracking-[0.8em] uppercase"
        >
          El Sonido de la Esperanza
        </motion.p>

        <button onClick={() => setIsAdminOpen(true)} className="mt-14 px-10 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 mx-auto hover:bg-white/10 transition-all group hover:border-blue-500/50">
          <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500 text-blue-500" /> Terminal Maestro
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20 relative z-10 space-y-48">
        
        {/* SOBRE EL ARTISTA */}
        <Section title="Sobre el Artista" icon={<Sparkles />}>
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative w-full aspect-[2.5/1] rounded-[3rem] overflow-hidden mb-16 shadow-4xl group"
           >
              <img src={data.artistCover} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Banner Artista" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020412] via-[#020412]/20 to-transparent" />
           </motion.div>
           <p className="text-xl md:text-4xl font-light text-blue-50/70 leading-relaxed italic border-l-4 border-blue-600 pl-8 max-w-4xl">{data.about}</p>
        </Section>

        {/* LANZAMIENTOS */}
        <Section title="Lanzamientos" icon={<Calendar />}>
           <div className="grid lg:grid-cols-2 gap-12">
             {data.upcoming.length > 0 ? data.upcoming.map(u => (
               <motion.div 
                 key={u.id}
                 initial={{ y: 30, opacity: 0 }}
                 whileInView={{ y: 0, opacity: 1 }}
                 viewport={{ once: true }}
                 className="glass p-10 rounded-[3rem] border border-white/5 hover:border-blue-500/30 transition-all duration-500 group"
               >
                 <div className="flex justify-between items-start mb-8">
                   <div>
                     <h3 className="text-2xl md:text-3xl font-orbitron font-black text-amber-500 uppercase leading-tight mb-2 group-hover:text-amber-400 transition-colors">{u.title}</h3>
                     {u.releaseDate && <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{new Date(u.releaseDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                   </div>
                   <div className="flex gap-3">
                     {u.youtubeTrailer && <SocialIcon type="YouTube" url={u.youtubeTrailer} size="sm" />}
                     {u.spotifyPreSave && <SocialIcon type="Spotify" url={u.spotifyPreSave} size="sm" />}
                   </div>
                 </div>
                 {u.youtubeTrailer ? <VideoEmbed url={u.youtubeTrailer} /> : (
                   <div className="aspect-video bg-white/[0.02] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/10">
                      <Disc size={40} className="animate-pulse mb-2" />
                      <span className="text-[9px] uppercase tracking-widest">Contenido Próximamente</span>
                   </div>
                 )}
               </motion.div>
             )) : (
               <div className="col-span-full py-20 text-center opacity-20 italic font-orbitron text-xs tracking-[0.5em]">No hay lanzamientos programados actualmente</div>
             )}
           </div>
        </Section>

        {/* MÚSICA */}
        <Section title="Música" icon={<Music />}>
          <div className="space-y-24">
            {data.songs.length > 0 ? data.songs.map((song) => (
              <motion.div 
                key={song.id} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="glass p-10 md:p-14 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                  <h3 className="text-4xl md:text-6xl font-orbitron font-black tracking-tighter">{song.title}</h3>
                  <div className="flex gap-4">
                    {song.videoUrl && <SocialIcon type="YouTube" url={song.videoUrl} size="sm" />}
                    {song.spotifyLink && <SocialIcon type="Spotify" url={song.spotifyLink} size="sm" />}
                    <button 
                      onClick={() => setShareSong(song)} 
                      className="p-5 bg-blue-600/10 rounded-2xl text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                    >
                      <Share2 size={24}/>
                    </button>
                  </div>
                </div>
                {song.videoUrl && <VideoEmbed url={song.videoUrl} />}
              </motion.div>
            )) : (
              <div className="py-20 text-center opacity-20 italic font-orbitron text-xs tracking-[0.5em]">El catálogo está siendo actualizado...</div>
            )}
          </div>
        </Section>

        {/* CONECTAR */}
        <Section title="Conectar" icon={<Zap />}>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {data.socials.map(s => <SocialIcon key={s.id} type={s.name} url={s.url} />)}
           </div>
        </Section>

        {/* IDEAS */}
        <Section title="Ideas" icon={<Lightbulb />}>
           <div className="bg-amber-500/[0.03] border border-amber-500/10 p-12 md:p-24 rounded-[4rem] max-w-4xl mx-auto shadow-2xl text-center">
              <h3 className="text-3xl font-orbitron font-black text-white uppercase mb-8">¿Qué quieres escuchar?</h3>
              <p className="text-white/40 text-sm mb-12 max-w-xl mx-auto italic">Tus ideas son la base de nuevas creaciones. Envía tu propuesta directamente al laboratorio creativo.</p>
              <IdeaForm onIdeaSent={(i: Idea) => setData(prev => ({...prev, ideas: [i, ...prev.ideas]}))} />
           </div>
        </Section>

        {/* CONTACTO */}
        <Section title="Contacto" icon={<Mail />}>
           <div className="glass p-12 md:p-20 rounded-[4rem] max-w-4xl mx-auto shadow-2xl">
              <ContactForm onMessageSent={(m: Message) => setData(prev => ({...prev, messages: [m, ...prev.messages]}))} />
           </div>
        </Section>
      </main>

      <footer className="py-20 text-center border-t border-white/5 relative z-10">
         <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-orbitron">&copy; {new Date().getFullYear()} Mus Artur | Todos los Derechos Reservados</p>
      </footer>

      {/* ADMIN DRAWER */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
            className="fixed inset-0 z-[200] bg-[#020412] overflow-y-auto"
          >
            <div className="sticky top-0 z-[210] bg-[#020412]/90 backdrop-blur-xl border-b border-white/5 px-8 py-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <Settings className="text-blue-500 animate-spin-slow" size={20} />
                 <h2 className="text-sm font-orbitron font-black uppercase text-white tracking-[0.2em]">Panel Maestro</h2>
              </div>
              <button onClick={() => setIsAdminOpen(false)} className="p-3 bg-white/5 rounded-full text-white hover:bg-white/10 transition-colors"><XIcon/></button>
            </div>
            
            <div className="max-w-7xl mx-auto p-8 md:p-20">
               {!isLoggedIn ? (
                 <AdminLogin step={loginStep} form={loginForm} setForm={setLoginForm} error={loginError} onLogin={handleLogin} tfa={twoFactorCode} setTfa={setTwoFactorCode} inputRefs={inputRefs} onVerify={handleVerify2FA} isVerifying={isVerifying} timer={codeTimer} />
               ) : (
                 <AdminDashboard data={data} setData={setData} onLogout={() => setIsLoggedIn(false)} />
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
          className="fixed bottom-10 right-10 p-5 bg-blue-600 rounded-full shadow-2xl z-50 text-white hover:scale-110 active:scale-95 transition-all"
        >
          <ChevronUp/>
        </button>
      )}

      {/* SHARE MODAL */}
      <AnimatePresence>
        {shareSong && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md" onClick={() => setShareSong(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f172a] border border-white/10 p-10 rounded-[3rem] text-center space-y-8 max-w-sm w-full" 
              onClick={e => e.stopPropagation()}
            >
               <Share2 size={48} className="mx-auto text-blue-500" />
               <h4 className="text-xl font-orbitron font-black text-white">{shareSong.title}</h4>
               <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                  <span className="text-[10px] truncate text-white/30 px-2 font-mono">{window.location.origin}/track/{shareSong.id}</span>
                  <button 
                    onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/track/${shareSong.id}`); alert("Enlace copiado al portapapeles");}} 
                    className="p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-colors"
                  >
                    <Copy size={16}/>
                  </button>
               </div>
               <button onClick={() => setShareSong(null)} className="w-full py-4 text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">Cerrar</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Section = ({ title, icon, children }: any) => (
  <section className="relative">
    <div className="flex items-center gap-6 mb-16">
      <div className="p-5 bg-blue-600/10 rounded-2xl text-blue-500 shadow-inner">{icon}</div>
      <h2 className="text-4xl md:text-7xl font-orbitron font-black uppercase tracking-tighter leading-none">{title}</h2>
    </div>
    {children}
  </section>
);

const SocialIcon = ({ type, url, size = 'md' }: any) => {
  const icons: any = { 
    Instagram: <Instagram size={size === 'sm' ? 24 : 36} />, 
    YouTube: <Youtube size={size === 'sm' ? 24 : 36} />, 
    Spotify: <Disc size={size === 'sm' ? 24 : 36} />, 
    Facebook: <Facebook size={size === 'sm' ? 24 : 36} />, 
    TikTok: <TikTokIcon size={size === 'sm' ? 24 : 36} />, 
    X: <XIcon size={size === 'sm' ? 24 : 36} />
  };
  
  const colors: any = {
    Instagram: "hover:text-[#E1306C] hover:shadow-[0_0_30px_rgba(225,48,108,0.3)]",
    YouTube: "hover:text-[#FF0000] hover:shadow-[0_0_30px_rgba(255,0,0,0.3)]",
    Spotify: "hover:text-[#1DB954] hover:shadow-[0_0_30px_rgba(29,185,84,0.3)]",
    Facebook: "hover:text-[#1877F2] hover:shadow-[0_0_30px_rgba(24,119,242,0.3)]",
    TikTok: "hover:text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]",
    X: "hover:text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
  };

  return (
    <motion.a 
      whileHover={{ y: -8, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      href={url} target="_blank" rel="noopener noreferrer"
      className={`flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-3xl transition-all aspect-square ${size === 'sm' ? 'p-4' : 'p-10'} text-white/50 ${colors[type] || 'hover:text-blue-500 shadow-xl'}`}
    >
      {icons[type] || <Globe size={size === 'sm' ? 24 : 36}/>}
    </motion.a>
  );
};

// Componente de Video reparado para evitar error 153 y problemas de configuración
const VideoEmbed = ({ url }: any) => {
  const id = getYTid(url);
  
  return id ? (
    <div className="aspect-video w-full rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl relative">
      <iframe 
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`}
        title="Reproductor Mus Artur"
        className="absolute inset-0 w-full h-full" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen 
        loading="lazy" 
      />
    </div>
  ) : (
    <div className="aspect-video w-full bg-white/5 rounded-3xl flex flex-col items-center justify-center text-[10px] opacity-30 font-orbitron p-8 text-center space-y-4">
      <Youtube size={32} className="text-red-500" />
      <span className="uppercase tracking-[0.3em]">Enlace no reconocido o ID inválido</span>
    </div>
  );
};

const ContactForm = ({ onMessageSent }: any) => {
  const [f, setF] = useState({ name: '', email: '', msg: '' });
  const send = () => { if(!f.name || !f.email || !f.msg) return; onMessageSent({ id: Date.now().toString(), name: f.name, email: f.email, message: f.msg, date: new Date().toLocaleString() }); setF({name:'', email:'', msg:''}); alert("Señal enviada con éxito."); };
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <input placeholder="Tu Identidad" value={f.name} onChange={e => setF({...f, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl outline-none text-white focus:border-blue-500 transition-colors" />
        <input type="email" placeholder="Canal de Email" value={f.email} onChange={e => setF({...f, email: e.target.value})} className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl outline-none text-white focus:border-blue-500 transition-colors" />
      </div>
      <textarea placeholder="Frecuencia del Mensaje" rows={5} value={f.msg} onChange={e => setF({...f, msg: e.target.value})} className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl outline-none text-white focus:border-blue-500 resize-none transition-colors" />
      <button onClick={send} className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] text-white shadow-xl shadow-blue-600/20 transition-all active:scale-95">Transmitir Mensaje</button>
    </div>
  );
};

const IdeaForm = ({ onIdeaSent }: any) => {
  const [c, setC] = useState('');
  const send = () => { if(!c) return; onIdeaSent({id: Date.now().toString(), author: 'Colaborador Anónimo', content: c, date: new Date().toLocaleString()}); setC(''); alert("Tu idea ha sido registrada en el laboratorio."); };
  return (
    <div className="space-y-8">
       <textarea value={c} onChange={e => setC(e.target.value)} placeholder="¿Qué concepto musical deberíamos explorar próximamente?" rows={4} className="w-full bg-black/40 border border-amber-500/20 p-8 rounded-[2rem] text-white outline-none focus:border-amber-500 resize-none text-center italic transition-colors" />
       <button onClick={send} className="px-12 py-5 bg-amber-500 text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20">Registrar Propuesta</button>
    </div>
  );
};

const AdminLogin = ({ step, form, setForm, error, onLogin, tfa, setTfa, inputRefs, onVerify, isVerifying, timer }: any) => (
  <div className="max-w-md mx-auto space-y-12 text-center py-20">
    {step === 1 ? (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
        <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 mx-auto shadow-inner"><Lock size={32} /></div>
        <div className="space-y-4">
          <input type="email" placeholder="Email Maestro" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-blue-500" />
          <input type="password" placeholder="Clave Maestra" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-blue-500" />
          {error && <p className="text-red-500 text-[9px] uppercase font-black tracking-widest">{error}</p>}
        </div>
        <button onClick={onLogin} className="w-full bg-blue-600 py-6 rounded-2xl font-black uppercase text-xs tracking-widest text-white shadow-xl">Iniciar Protocolo</button>
      </motion.div>
    ) : step === 3 ? (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
        <ShieldCheck className="mx-auto text-amber-500" size={56} />
        <div className="space-y-2">
          <p className="text-[10px] uppercase text-white/40 tracking-[0.3em]">Seguridad de Doble Factor</p>
          <p className="text-xs text-white/60">Introduce el código generado ({timer}s)</p>
        </div>
        <div className="flex gap-3 justify-center">
          {tfa.map((d: string, i: number) => (
            <input key={i} ref={el => { if(inputRefs.current) inputRefs.current[i] = el; }} maxLength={1} value={d} onChange={e => {
              const nt = [...tfa]; nt[i] = e.target.value; setTfa(nt);
              if(e.target.value && i < 5) inputRefs.current[i+1]?.focus();
            }} className="w-12 h-16 bg-white/5 border-2 border-white/10 rounded-xl text-center text-2xl font-bold text-white outline-none focus:border-blue-500" />
          ))}
        </div>
        <button onClick={onVerify} className="w-full bg-amber-500 py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest text-black shadow-xl shadow-amber-500/10">Verificar Identidad</button>
      </motion.div>
    ) : <div className="py-20 flex flex-col items-center gap-6"><Loader2 className="animate-spin text-blue-500" size={48}/><p className="text-[10px] uppercase tracking-widest text-white/30">Validando...</p></div>}
  </div>
);

const AdminDashboard = ({ data, setData, onLogout }: any) => {
  const update = (f: string, v: any) => setData((p: any) => ({...p, [f]: v}));
  const addSong = () => update('songs', [{id: Date.now().toString(), title: 'Nuevo Track', videoUrl: '', spotifyLink: ''}, ...data.songs]);
  const addSoc = () => update('socials', [...data.socials, {id: Date.now().toString(), name: 'Instagram', url: ''}]);
  const addUp = () => update('upcoming', [{id: Date.now().toString(), title: 'Nuevo Lanzamiento', youtubeTrailer: '', spotifyPreSave: '', releaseDate: ''}, ...data.upcoming]);
  
  const handleImg = (e: any, f: string) => {
    const reader = new FileReader();
    reader.onload = () => update(f, reader.result);
    if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
  };

  const platforms: Social['name'][] = ['Instagram', 'YouTube', 'Spotify', 'Facebook', 'TikTok', 'X', 'Snapchat'];

  return (
    <div className="grid xl:grid-cols-2 gap-12 pb-32">
      <div className="space-y-12">
        <AdminCard title="Identidad Visual" icon={<ImageIcon/>} color="blue">
           <div className="space-y-8">
              <div className="flex items-center gap-8">
                 <img src={data.headerLogo} className="w-24 h-24 rounded-full object-cover border-2 border-white/10" alt="Preview Logo" />
                 <div className="flex-1 space-y-3">
                   <p className="text-[10px] text-white/30 uppercase tracking-widest">Logo del Sistema</p>
                   <input type="file" onChange={e => handleImg(e, 'headerLogo')} className="text-[10px] text-white/60 file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:mr-4 file:cursor-pointer" accept="image/*" />
                 </div>
              </div>
              <div className="space-y-3">
                 <p className="text-[10px] text-white/30 uppercase tracking-widest">Banner de Portada</p>
                 <img src={data.artistCover} className="w-full aspect-[3/1] rounded-2xl object-cover border border-white/10" alt="Preview Banner" />
                 <input type="file" onChange={e => handleImg(e, 'artistCover')} className="text-[10px] text-white/60 file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:mr-4 file:cursor-pointer" accept="image/*" />
              </div>
           </div>
        </AdminCard>

        <AdminCard title="Redes de Conexión" icon={<LinkIcon/>} color="blue">
           <div className="space-y-5">
              <button onClick={addSoc} className="w-full py-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center justify-center gap-2 hover:bg-blue-600/20 transition-all"><Plus size={14}/> Sincronizar Nueva Red</button>
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4">
                {data.socials.map((s: any) => (
                  <div key={s.id} className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <select value={s.name} onChange={e => update('socials', data.socials.map((x: any) => x.id === s.id ? {...x, name: e.target.value} : x))} className="bg-white/5 text-blue-400 p-2 rounded-lg text-[10px] font-bold uppercase outline-none border border-white/10">
                        {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <button onClick={() => update('socials', data.socials.filter((x: any) => x.id !== s.id))} className="text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16}/></button>
                    </div>
                    <input value={s.url} onChange={e => update('socials', data.socials.map((x: any) => x.id === s.id ? {...x, url: e.target.value} : x))} className="w-full bg-white/5 text-white p-3 rounded-xl text-[10px] outline-none border border-white/5" placeholder="Enlace de la plataforma" />
                  </div>
                ))}
              </div>
           </div>
        </AdminCard>

        <AdminCard title="Biografía del Artista" icon={<Star/>} color="blue">
           <textarea value={data.about} onChange={e => update('about', e.target.value)} className="w-full bg-black/40 p-6 rounded-3xl text-xs text-white/80 h-48 outline-none border border-white/10 focus:border-blue-500 transition-all leading-relaxed" placeholder="Introduce el mensaje del artista..." />
        </AdminCard>
      </div>

      <div className="space-y-12">
        <AdminCard title="Gestión de Catálogo (Canciones)" icon={<Disc/>} color="blue">
           <div className="space-y-5">
              <button onClick={addSong} className="w-full py-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center justify-center gap-2 hover:bg-blue-600/20 transition-all"><Plus size={14}/> Registrar Nuevo Track</button>
              <div className="max-h-[500px] overflow-y-auto pr-2 space-y-6">
                {data.songs.map((s: any) => (
                  <div key={s.id} className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-5 relative group">
                    <div className="flex justify-between items-center">
                      <input value={s.title} onChange={e => update('songs', data.songs.map((x: any) => x.id === s.id ? {...x, title: e.target.value} : x))} className="bg-transparent text-sm font-black text-white outline-none border-b border-white/10 focus:border-blue-500 pb-1 flex-1 mr-4" placeholder="Título de la Obra" />
                      <button onClick={() => update('songs', data.songs.filter((x: any) => x.id !== s.id))} className="text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18}/></button>
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                        <Youtube size={14} className="text-red-500" />
                        <input value={s.videoUrl} onChange={e => update('songs', data.songs.map((x: any) => x.id === s.id ? {...x, videoUrl: e.target.value} : x))} className="bg-transparent text-[10px] text-white/50 w-full outline-none" placeholder="YouTube URL" />
                      </div>
                      <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                        <Disc size={14} className="text-green-500" />
                        <input value={s.spotifyLink} onChange={e => update('songs', data.songs.map((x: any) => x.id === s.id ? {...x, spotifyLink: e.target.value} : x))} className="bg-transparent text-[10px] text-white/50 w-full outline-none" placeholder="Spotify URL" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </AdminCard>

        <AdminCard title="Próximos Lanzamientos" icon={<Calendar/>} color="amber">
           <div className="space-y-5">
              <button onClick={addUp} className="w-full py-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-all"><Plus size={14}/> Programar Lanzamiento</button>
              <div className="space-y-6">
                {data.upcoming.map((u: any) => (
                  <div key={u.id} className="p-6 bg-black/40 rounded-3xl border border-amber-500/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <input value={u.title} onChange={e => update('upcoming', data.upcoming.map((x: any) => x.id === u.id ? {...x, title: e.target.value} : x))} className="bg-transparent text-sm font-black text-white outline-none border-b border-white/10 focus:border-amber-500 pb-1 flex-1 mr-4" />
                      <button onClick={() => update('upcoming', data.upcoming.filter((x: any) => x.id !== u.id))} className="text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18}/></button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input type="date" value={u.releaseDate} onChange={e => update('upcoming', data.upcoming.map((x: any) => x.id === u.id ? {...x, releaseDate: e.target.value} : x))} className="bg-white/5 text-[10px] text-amber-500 p-3 rounded-xl outline-none" />
                      <input value={u.youtubeTrailer} onChange={e => update('upcoming', data.upcoming.map((x: any) => x.id === u.id ? {...x, youtubeTrailer: e.target.value} : x))} className="bg-white/5 text-[10px] text-white/50 p-3 rounded-xl outline-none" placeholder="Trailer URL" />
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </AdminCard>

        <AdminCard title="Buzón de Ideas y Mensajes" icon={<Mail/>} color="blue">
           <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase text-blue-500 tracking-[0.2em]">Últimos Mensajes de Contacto</p>
                <div className="max-h-[250px] overflow-y-auto space-y-3">
                  {data.messages.length === 0 ? <p className="text-[10px] text-white/10 italic text-center py-8">Sin mensajes entrantes</p> : data.messages.map((m: any) => (
                    <div key={m.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 relative group">
                       <p className="text-[10px] font-bold text-blue-400 mb-1">{m.name} <span className="text-white/20 font-light ml-2">({m.email})</span></p>
                       <p className="text-[11px] text-white/70 italic leading-relaxed">"{m.message}"</p>
                       <button onClick={() => update('messages', data.messages.filter((x: any) => x.id !== m.id))} className="absolute top-2 right-2 text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase text-amber-500 tracking-[0.2em]">Laboratorio de Ideas</p>
                <div className="max-h-[250px] overflow-y-auto space-y-3">
                  {data.ideas.length === 0 ? <p className="text-[10px] text-white/10 italic text-center py-8">Sin ideas registradas</p> : data.ideas.map((i: any) => (
                    <div key={i.id} className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 relative group">
                       <p className="text-[10px] font-bold text-amber-500 mb-1">{i.author}</p>
                       <p className="text-[11px] text-white/80 italic leading-relaxed">"{i.content}"</p>
                       <button onClick={() => update('ideas', data.ideas.filter((x: any) => x.id !== i.id))} className="absolute top-2 right-2 text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </AdminCard>

        <button onClick={onLogout} className="w-full py-6 bg-red-900/20 text-red-500 border border-red-900/40 rounded-[2rem] uppercase font-black text-xs tracking-widest shadow-2xl hover:bg-red-900/40 transition-all">Cerrar Sesión Segura</button>
      </div>
    </div>
  );
};

const AdminCard = ({ title, icon, color, children }: any) => (
  <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 space-y-8 relative overflow-hidden shadow-2xl">
    <div className={`flex items-center gap-4 ${color === 'blue' ? 'text-blue-500' : 'text-amber-500'}`}>
      <div className={`p-4 rounded-2xl ${color === 'blue' ? 'bg-blue-500/10' : 'bg-amber-500/10'}`}>{icon}</div>
      <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">{title}</h3>
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

export default App;
