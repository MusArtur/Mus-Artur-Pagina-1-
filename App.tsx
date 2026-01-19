
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
  Save,
  Loader2,
  Edit3,
  Copy,
  Instagram,
  Youtube,
  Facebook,
  Image as ImageIcon,
  Upload,
  Globe,
  ShieldCheck,
  Lock,
  Lightbulb,
  Zap,
  ChevronUp,
  Link as LinkIcon,
  Smartphone as TikTokIcon,
  Check,
  XCircle
} from 'lucide-react';
import { AppData, Song, Social, Message, Idea, UpcomingProject } from './types';

const DEFAULT_LOGO = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&h=200&auto=format&fit=crop";
const DEFAULT_BANNER = "https://images.unsplash.com/photo-1514525253361-bee87184f47a?auto=format&fit=crop&q=80&w=1200";

const getYTid = (url: string | undefined): string | null => {
  if (!url) return null;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(() => {
    try {
      const saved = localStorage.getItem('musArturData');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
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
      }, 2000);
    } else {
      setLoginError('Credenciales incorrectas.');
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
      setLoginError('Código inválido.');
    }
  };

  const handleIdeaSent = (idea: Idea) => {
    setData(prev => ({ ...prev, ideas: [idea, ...prev.ideas] }));
  };

  return (
    <div className="min-h-screen bg-[#020412] text-[#f1f5f9] selection:bg-blue-600/40 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence>
        {showNotification && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className="fixed top-0 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-sm bg-white/10 backdrop-blur-3xl border border-white/20 p-5 rounded-3xl shadow-4xl flex items-center gap-5">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0"><ShieldCheck size={20} /></div>
            <div className="flex-1">
              <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">Seguridad</span>
              <p className="text-xs font-bold text-white">Código: <span className="text-blue-400 font-orbitron">{generatedCode}</span></p>
            </div>
            <button onClick={() => setShowNotification(false)} className="text-white/40"><XIcon size={16}/></button>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative pt-24 pb-12 text-center z-10 px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative inline-block mb-10">
          <img src={data.headerLogo} alt="Logo" className="w-32 h-32 md:w-44 md:h-44 mx-auto rounded-full border-2 border-white/10 shadow-4xl object-cover" />
        </motion.div>
        <h1 className="font-orbitron text-5xl md:text-8xl font-black blue-gradient-text tracking-tighter filter drop-shadow-2xl">Mus Artur</h1>
        <p className="mt-6 text-[10px] md:text-xs font-light text-blue-100/30 tracking-[0.6em] uppercase">El Sonido de la Esperanza</p>
        <button onClick={() => setIsAdminOpen(true)} className="mt-10 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-3 mx-auto hover:bg-white/10 transition-all group">
          <Settings size={14} className="group-hover:rotate-90 transition-transform" /> Terminal Maestro
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20 relative z-10 space-y-40">
        <Section title="Sobre el Artista" icon={<Sparkles />}>
           <div className="relative w-full aspect-[2.5/1] rounded-[3rem] overflow-hidden mb-12 shadow-4xl">
              <img src={data.artistCover} className="w-full h-full object-cover" alt="Banner" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020412] to-transparent" />
           </div>
           <p className="text-xl md:text-4xl font-light text-blue-50/80 leading-relaxed italic border-l-4 border-blue-600 pl-8">{data.about}</p>
        </Section>

        <Section title="Música" icon={<Disc className="animate-spin-slow" />}>
          <div className="grid gap-20">
            {data.songs.map((song) => (
              <div key={song.id} className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] shadow-xl">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-3xl md:text-5xl font-orbitron font-black">{song.title}</h3>
                  <div className="flex gap-3">
                    {song.videoUrl && <SocialIcon type="YouTube" url={song.videoUrl} size="sm" />}
                    {song.spotifyLink && <SocialIcon type="Spotify" url={song.spotifyLink} size="sm" />}
                    <button onClick={() => setShareSong(song)} className="p-4 bg-blue-600/10 rounded-2xl text-blue-400 hover:bg-blue-600 hover:text-white transition-all"><Share2 size={20}/></button>
                  </div>
                </div>
                {song.videoUrl && <VideoEmbed url={song.videoUrl} />}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Conectar" icon={<Zap />}>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
            {data.socials.map(s => <SocialIcon key={s.id} type={s.name} url={s.url} />)}
          </div>
        </Section>

        <Section title="Ideas" icon={<Lightbulb className="text-amber-500" />}>
          <div className="bg-amber-500/5 p-10 md:p-20 rounded-[4rem] max-w-3xl mx-auto shadow-4xl text-center">
             <IdeaForm onIdeaSent={handleIdeaSent} />
          </div>
        </Section>

        <Section title="Contacto" icon={<Mail />}>
          <div className="bg-white/[0.01] border border-white/5 p-10 md:p-20 rounded-[4rem] max-w-3xl mx-auto shadow-4xl">
            <ContactForm onMessageSent={(m) => setData(prev => ({...prev, messages: [m, ...prev.messages]}))} />
          </div>
        </Section>
      </main>

      <AnimatePresence>
        {isAdminOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-0 z-[200] bg-[#020412] overflow-y-auto">
            <div className="sticky top-0 z-[210] bg-[#020412]/80 backdrop-blur-3xl border-b border-white/10 px-10 py-8 flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <Settings className="text-blue-500" />
                 <h2 className="text-xl font-orbitron font-black uppercase text-white tracking-widest">Panel de Control Maestro</h2>
              </div>
              <button onClick={() => setIsAdminOpen(false)} className="p-3 bg-white/5 rounded-full text-white"><XIcon/></button>
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
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="fixed bottom-10 right-10 p-5 bg-blue-600 rounded-full shadow-4xl z-50 text-white"><ChevronUp/></button>
      )}
    </div>
  );
};

const Section = ({ title, icon, children }: any) => (
  <section>
    <div className="flex items-center gap-6 mb-12">
      <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-500">{icon}</div>
      <h2 className="text-4xl md:text-6xl font-orbitron font-black uppercase tracking-tighter">{title}</h2>
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
    Instagram: "hover:text-[#E1306C] hover:shadow-[0_0_30px_rgba(225,48,108,0.4)]",
    YouTube: "hover:text-[#FF0000] hover:shadow-[0_0_30px_rgba(255,0,0,0.4)]",
    Spotify: "hover:text-[#1DB954] hover:shadow-[0_0_30px_rgba(29,185,84,0.4)]",
    Facebook: "hover:text-[#1877F2] hover:shadow-[0_0_30px_rgba(24,119,242,0.4)]",
    TikTok: "hover:text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]",
    X: "hover:text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
  };

  return (
    <motion.a 
      whileHover={{ y: -10, scale: 1.05 }}
      href={url} target="_blank" 
      className={`flex items-center justify-center bg-white/[0.03] border border-white/5 rounded-3xl transition-all aspect-square ${size === 'sm' ? 'p-4' : 'p-10'} text-white/70 ${colors[type] || 'hover:text-blue-500'}`}
    >
      {icons[type] || <Globe size={size === 'sm' ? 24 : 36}/>}
    </motion.a>
  );
};

const VideoEmbed = ({ url }: any) => {
  const id = getYTid(url);
  return id ? (
    <div className="aspect-video w-full rounded-[2rem] overflow-hidden border border-white/10 bg-black">
      <iframe src={`https://www.youtube.com/embed/${id}`} className="w-full h-full" allowFullScreen />
    </div>
  ) : <div className="aspect-video w-full bg-white/5 rounded-[2rem] flex items-center justify-center text-xs opacity-20">Sin video</div>;
};

const ContactForm = ({ onMessageSent }: any) => {
  const [f, setF] = useState({ name: '', email: '', msg: '' });
  const send = () => { if(!f.name || !f.email || !f.msg) return; onMessageSent({ id: Date.now().toString(), ...f, date: new Date().toLocaleString() }); setF({name:'', email:'', msg:''}); alert("¡Mensaje enviado!"); };
  return (
    <div className="space-y-6">
      <input placeholder="Tu Nombre" value={f.name} onChange={e => setF({...f, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white focus:border-blue-500" />
      <input placeholder="Tu Email" value={f.email} onChange={e => setF({...f, email: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white focus:border-blue-500" />
      <textarea placeholder="Mensaje" rows={4} value={f.msg} onChange={e => setF({...f, msg: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white focus:border-blue-500 resize-none" />
      <button onClick={send} className="w-full bg-blue-600 py-6 rounded-2xl font-black uppercase text-xs tracking-widest text-white">Enviar Señal</button>
    </div>
  );
};

const IdeaForm = ({ onIdeaSent }: any) => {
  const [c, setC] = useState('');
  const send = () => { if(!c) return; onIdeaSent({id: Date.now().toString(), author: 'Anónimo', content: c, date: new Date().toLocaleString()}); setC(''); alert("Idea enviada"); };
  return (
    <div className="space-y-6">
       <h3 className="text-xl font-orbitron font-black text-white uppercase">¿Tienes una idea?</h3>
       <textarea value={c} onChange={e => setC(e.target.value)} placeholder="Escribe tu idea para el artista..." rows={3} className="w-full bg-black/40 border border-amber-500/20 p-5 rounded-2xl text-white outline-none focus:border-amber-500 resize-none" />
       <button onClick={send} className="px-10 py-4 bg-amber-500 text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-amber-400 transition-all">Enviar al Laboratorio</button>
    </div>
  );
};

const AdminLogin = ({ step, form, setForm, error, onLogin, tfa, setTfa, inputRefs, onVerify, isVerifying, timer }: any) => (
  <div className="max-w-md mx-auto space-y-12 text-center py-20">
    {step === 1 ? (
      <div className="space-y-8">
        <Lock className="mx-auto text-blue-500" size={48} />
        <div className="space-y-4">
          <input type="email" placeholder="Email Maestro" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none" />
          <input type="password" placeholder="Clave de Acceso" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none" />
          {error && <p className="text-red-500 text-[10px] uppercase font-black">{error}</p>}
        </div>
        <button onClick={onLogin} className="w-full bg-blue-600 py-6 rounded-2xl font-black uppercase text-white shadow-xl">Autenticar</button>
      </div>
    ) : step === 3 ? (
      <div className="space-y-10">
        <ShieldCheck className="mx-auto text-amber-500" size={48} />
        <p className="text-xs uppercase text-white/40 tracking-widest">Introduce el código 2FA ({timer}s)</p>
        <div className="flex gap-2 justify-center">
          {tfa.map((d: string, i: number) => (
            <input key={i} ref={el => { if(inputRefs.current) inputRefs.current[i] = el; }} maxLength={1} value={d} onChange={e => {
              const nt = [...tfa]; nt[i] = e.target.value; setTfa(nt);
              if(e.target.value && i < 5) inputRefs.current[i+1]?.focus();
            }} className="w-12 h-16 bg-white/5 border-2 border-white/10 rounded-xl text-center text-2xl font-bold text-white outline-none focus:border-blue-500" />
          ))}
        </div>
        <button onClick={onVerify} className="w-full bg-amber-500 py-6 rounded-2xl font-black uppercase text-black">Verificar Sistema</button>
      </div>
    ) : <Loader2 className="animate-spin text-blue-500 mx-auto" size={48}/>}
  </div>
);

const AdminDashboard = ({ data, setData, onLogout }: any) => {
  const [editingId, setEditingId] = useState<string | null>(null);
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
    <div className="grid xl:grid-cols-2 gap-10 pb-20">
      {/* Columna Izquierda: Identidad y Redes */}
      <div className="space-y-10">
        <AdminCard title="Identidad Visual" icon={<ImageIcon/>} color="blue">
           <div className="space-y-6">
              <div className="flex items-center gap-6">
                 <img src={data.headerLogo} className="w-16 h-16 rounded-full object-cover border border-white/10" alt="L" />
                 <div className="flex-1 space-y-2">
                   <p className="text-[10px] text-white/40 uppercase">Logo Principal</p>
                   <input type="file" onChange={e => handleImg(e, 'headerLogo')} className="text-[10px] text-white" accept="image/*" />
                 </div>
              </div>
              <div className="space-y-2">
                 <p className="text-[10px] text-white/40 uppercase">Portada del Artista</p>
                 <img src={data.artistCover} className="w-full aspect-[3/1] rounded-xl object-cover border border-white/10" alt="B" />
                 <input type="file" onChange={e => handleImg(e, 'artistCover')} className="text-[10px] text-white" accept="image/*" />
              </div>
           </div>
        </AdminCard>

        <AdminCard title="Redes Sociales" icon={<LinkIcon/>} color="blue">
           <div className="space-y-4">
              <button onClick={addSoc} className="w-full py-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center justify-center gap-2 hover:bg-blue-600/20 transition-all"><Plus size={14}/> Añadir Red</button>
              {data.socials.map((s: any) => (
                <div key={s.id} className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-blue-500 font-bold uppercase">{s.name}</span>
                    <button onClick={() => update('socials', data.socials.filter((x: any) => x.id !== s.id))} className="text-red-500 p-1 hover:bg-red-500/10 rounded-md transition-all"><Trash2 size={14}/></button>
                  </div>
                  <div className="flex gap-2">
                    <select value={s.name} onChange={e => update('socials', data.socials.map((x: any) => x.id === s.id ? {...x, name: e.target.value} : x))} className="bg-black text-white p-2 rounded-lg text-[10px] outline-none border border-white/10">
                      {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <input value={s.url} onChange={e => update('socials', data.socials.map((x: any) => x.id === s.id ? {...x, url: e.target.value} : x))} className="flex-1 bg-black text-white p-2 rounded-lg text-[10px] outline-none border border-white/10" placeholder="URL de la red" />
                  </div>
                </div>
              ))}
           </div>
        </AdminCard>

        <AdminCard title="Biografía / Acerca de" icon={<Star/>} color="blue">
           <textarea value={data.about} onChange={e => update('about', e.target.value)} className="w-full bg-black/40 p-6 rounded-2xl text-xs text-white h-40 outline-none border border-white/10 leading-relaxed focus:border-blue-500 transition-all" placeholder="Escribe la biografía del artista aquí..." />
        </AdminCard>
      </div>

      {/* Columna Derecha: Música, Proyectos y Buzón */}
      <div className="space-y-10">
        <AdminCard title="Discografía (Tracks)" icon={<Disc/>} color="blue">
           <div className="space-y-4">
              <button onClick={addSong} className="w-full py-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center justify-center gap-2 hover:bg-blue-600/20 transition-all"><Plus size={14}/> Añadir Track</button>
              {data.songs.map((s: any) => (
                <div key={s.id} className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-4 relative group">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-blue-500 font-bold uppercase">Edición de Track</span>
                    <button onClick={() => update('songs', data.songs.filter((x: any) => x.id !== s.id))} className="text-red-500 p-2 hover:bg-red-500/10 rounded-md transition-all"><Trash2 size={16}/></button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] text-white/30 uppercase block mb-1">Título</label>
                      <input value={s.title} onChange={e => update('songs', data.songs.map((x: any) => x.id === s.id ? {...x, title: e.target.value} : x))} className="w-full bg-transparent text-xs font-bold text-white outline-none border-b border-white/10 focus:border-blue-500 pb-1" placeholder="Título de la canción" />
                    </div>
                    <div>
                      <label className="text-[9px] text-white/30 uppercase block mb-1">Link YouTube</label>
                      <input value={s.videoUrl} onChange={e => update('songs', data.songs.map((x: any) => x.id === s.id ? {...x, videoUrl: e.target.value} : x))} className="w-full bg-transparent text-[10px] text-red-400 outline-none border-b border-white/10 focus:border-red-500 pb-1" placeholder="https://youtube.com/..." />
                    </div>
                    <div>
                      <label className="text-[9px] text-white/30 uppercase block mb-1">Link Spotify</label>
                      <input value={s.spotifyLink} onChange={e => update('songs', data.songs.map((x: any) => x.id === s.id ? {...x, spotifyLink: e.target.value} : x))} className="w-full bg-transparent text-[10px] text-green-400 outline-none border-b border-white/10 focus:border-green-500 pb-1" placeholder="https://spotify.com/..." />
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </AdminCard>

        <AdminCard title="Próximos Lanzamientos" icon={<Calendar/>} color="amber">
           <div className="space-y-4">
              <button onClick={addUp} className="w-full py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-all"><Plus size={14}/> Añadir Lanzamiento</button>
              {data.upcoming.map((u: any) => (
                <div key={u.id} className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-amber-500 font-bold uppercase">Edición Proyecto</span>
                    <button onClick={() => update('upcoming', data.upcoming.filter((x: any) => x.id !== u.id))} className="text-red-500 p-2 hover:bg-red-500/10 rounded-md transition-all"><Trash2 size={16}/></button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] text-white/30 uppercase block mb-1">Título del Proyecto</label>
                      <input value={u.title} onChange={e => update('upcoming', data.upcoming.map((x: any) => x.id === u.id ? {...x, title: e.target.value} : x))} className="w-full bg-transparent text-xs font-bold text-white outline-none border-b border-white/10 focus:border-amber-500 pb-1" />
                    </div>
                    <div>
                      <label className="text-[9px] text-white/30 uppercase block mb-1">Trailer YouTube</label>
                      <input value={u.youtubeTrailer} onChange={e => update('upcoming', data.upcoming.map((x: any) => x.id === u.id ? {...x, youtubeTrailer: e.target.value} : x))} className="w-full bg-transparent text-[10px] text-red-400 outline-none border-b border-white/10 focus:border-red-500 pb-1" placeholder="YouTube URL" />
                    </div>
                    <div>
                      <label className="text-[9px] text-white/30 uppercase block mb-1">Spotify Pre-Save / Link</label>
                      <input value={u.spotifyPreSave} onChange={e => update('upcoming', data.upcoming.map((x: any) => x.id === u.id ? {...x, spotifyPreSave: e.target.value} : x))} className="w-full bg-transparent text-[10px] text-green-400 outline-none border-b border-white/10 focus:border-green-500 pb-1" placeholder="Spotify URL" />
                    </div>
                    <div>
                      <label className="text-[9px] text-white/30 uppercase block mb-1">Fecha de Lanzamiento</label>
                      <input type="date" value={u.releaseDate} onChange={e => update('upcoming', data.upcoming.map((x: any) => x.id === u.id ? {...x, releaseDate: e.target.value} : x))} className="w-full bg-transparent text-[10px] text-amber-500 outline-none focus:border-amber-500 pb-1" />
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </AdminCard>

        <AdminCard title="Buzón Directo" icon={<Mail/>} color="blue">
           <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {data.messages.length === 0 ? (
                <p className="text-[10px] opacity-20 text-center py-10 uppercase tracking-widest">Sin mensajes nuevos</p>
              ) : data.messages.map((m: any) => (
                <div key={m.id} className="p-4 bg-white/5 rounded-xl relative group border border-white/5 space-y-2">
                   <div className="flex justify-between items-start">
                     <div>
                       <p className="text-[10px] font-bold text-blue-400">{m.name}</p>
                       <p className="text-[8px] opacity-30">{m.email}</p>
                     </div>
                     <button onClick={() => update('messages', data.messages.filter((x: any) => x.id !== m.id))} className="text-red-500 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all"><Trash2 size={12}/></button>
                   </div>
                   <p className="text-[11px] text-white/70 italic leading-relaxed">"{m.message}"</p>
                   <p className="text-[8px] opacity-20 text-right">{m.date}</p>
                </div>
              ))}
           </div>
        </AdminCard>

        <AdminCard title="Laboratorio de Ideas" icon={<Lightbulb/>} color="amber">
           <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {data.ideas.length === 0 ? (
                <p className="text-[10px] opacity-20 text-center py-10 uppercase tracking-widest">Sin ideas por ahora</p>
              ) : data.ideas.map((i: any) => (
                <div key={i.id} className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl relative group space-y-2">
                   <div className="flex justify-between items-start">
                     <p className="text-[10px] font-bold text-amber-500">{i.author}</p>
                     <button onClick={() => update('ideas', data.ideas.filter((x: any) => x.id !== i.id))} className="text-red-500 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all"><Trash2 size={12}/></button>
                   </div>
                   <p className="text-[11px] text-white/80 italic leading-relaxed">"{i.content}"</p>
                   <p className="text-[8px] opacity-20 text-right">{i.date}</p>
                </div>
              ))}
           </div>
        </AdminCard>

        <button onClick={onLogout} className="w-full py-6 bg-red-900/20 text-red-500 border border-red-900/40 rounded-2xl uppercase font-black text-[10px] tracking-widest hover:bg-red-900/40 transition-all shadow-2xl">Desconectar Sistema</button>
      </div>
    </div>
  );
};

const AdminCard = ({ title, icon, color, children }: any) => (
  <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden shadow-2xl">
    <div className={`absolute -top-6 -right-6 p-10 opacity-[0.03] ${color === 'blue' ? 'text-blue-500' : 'text-amber-500'} rotate-12`}>{icon}</div>
    <div className={`flex items-center gap-4 ${color === 'blue' ? 'text-blue-500' : 'text-amber-500'}`}>
      <div className={`p-3 rounded-xl ${color === 'blue' ? 'bg-blue-500/10' : 'bg-amber-500/10'}`}>{icon}</div>
      <h3 className="text-xs font-black uppercase tracking-widest">{title}</h3>
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

export default App;
