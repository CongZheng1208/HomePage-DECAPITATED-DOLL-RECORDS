import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skull, Menu, X, ShoppingBag, Scissors, Palette, MessageCircle, Share2, QrCode } from 'lucide-react';

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const translations = {
    en: {
      brand: "DECAPITATED DOLL RECORDS",
      status: "STATUS: BIOMECH_REVOLUTION",
      slogan: "Curating Uncomfortable Order, Reshaping the Cold Manifesto of Flesh.",
      nav: [{ id: 'hero', name: 'HOME' }, { id: 'contact', name: 'CONTACT' }],
      copyright: "© MMXXIV DECAPITATED DOLL RECORDS"
    },
    zh: {
      brand: "人彘娃娃 RECORDS",
      status: "状态: 生物机械革命",
      slogan: "策划令人不适的秩序，重塑肉体的冰冷宣告。",
      nav: [{ id: 'hero', name: '首页' }, { id: 'contact', name: '联系' }],
      copyright: "© MMXXIV 人彘娃娃 RECORDS"
    }
  };

  const t = translations[lang];

  return (
    <div className="main" style={{ background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'monospace' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #050505; color: white; cursor: none; }
        .cursor { position: fixed; width: 8px; height: 8px; background: #FF1493; border-radius: 50%; z-index: 999; pointer-events: none; }
        header { padding: 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; }
        .logo { display: flex; align-items: center; gap: 10px; font-weight: bold; }
        .menu { position: fixed; top: 20px; right: 20px; z-index: 99; }
        button { background: #111; border: 1px solid #FF1493; color: white; padding: 8px; cursor: pointer; }
        .hero { padding: 4rem 2rem; }
        .hero h1 { font-size: 3rem; margin-bottom: 2rem; color: #FF1493; }
        footer { padding: 4rem 2rem; text-align: center; opacity: 0.5; }
      `}</style>

      <div className="cursor" style={{ left: mousePos.x + 'px', top: mousePos.y + 'px' }} />

      <header>
        <div className="logo"><Skull /> {t.brand}</div>
      </header>

      <div className="menu">
        <button onClick={() => setMenuOpen(!menuOpen)}><Menu size={20} /></button>
      </div>

      <motion.section className="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <div>// {t.status}</div>
        <h1>{t.slogan}</h1>
      </motion.section>

      <footer>{t.copyright}</footer>
    </div>
  );
};

export default App;