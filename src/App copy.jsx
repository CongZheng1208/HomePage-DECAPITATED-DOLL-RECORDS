import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useSpring, useVelocity, AnimatePresence } from 'framer-motion';
import { Activity, Skull, Zap, Menu, X, ShoppingBag, Scissors, Palette, Mail } from 'lucide-react';

const noiseSvg = `data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E`;

const Metallic3DScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xaaaaaa,
      metalness: 1.0,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const knotGeo = new THREE.TorusKnotGeometry(12, 1.8, 300, 32, 4, 7);
    const mainKnot = new THREE.Mesh(knotGeo, chromeMaterial);
    scene.add(mainKnot);

    const shards = [];
    for(let i = 0; i < 20; i++) {
      const shardGeo = new THREE.IcosahedronGeometry(Math.random() * 1.5 + 0.5, 0);
      const shard = new THREE.Mesh(shardGeo, chromeMaterial);
      shard.position.set((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 30 - 15);
      scene.add(shard);
      shards.push({ mesh: shard, speed: Math.random() * 0.01 + 0.005 });
    }

    const pinkLight = new THREE.DirectionalLight(0xFF007F, 4);
    pinkLight.position.set(10, 10, 15);
    scene.add(pinkLight);

    const whiteLight = new THREE.DirectionalLight(0xFFFFFF, 3);
    whiteLight.position.set(-15, -10, 10);
    scene.add(whiteLight);

    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      mainKnot.rotation.x += 0.001;
      mainKnot.rotation.y += 0.002;
      shards.forEach(s => {
        s.mesh.rotation.x += s.speed;
        s.mesh.rotation.y += s.speed;
      });
      pinkLight.position.x = Math.sin(Date.now() * 0.001) * 20;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-40 mix-blend-screen" />;
};

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState('en'); // Default to English

  const translations = {
    en: {
      brand: "DOLL MAN RECORDS",
      status: "STATUS: BIOMECH_REVOLUTION",
      slogan: "Curating Uncomfortable Order, Reshaping the Cold Manifesto of Flesh.",
      subSlogan: "Extreme Metal Aesthetic Curator / Bone Reconstructor / Visual Decay Expert / Pure Noise Management.",
      nav: [
        { id: 'hero', name: 'HOME' },
        { id: 'master', name: 'OPERATOR' },
        { id: 'apparel', name: 'APPAREL' },
        { id: 'bodyart', name: 'BODY ART' },
        { id: 'design', name: 'DESIGN' },
        { id: 'contact', name: 'CONTACT' },
      ],
      masterTitle: "OPERATOR ARCHIVE",
      masterDesc1: "This is DOLL MAN, a visual anomaly struggling at the edge of biomech and industrial noise.",
      masterDesc2: "Dedicated since 2018 to exploring the symbiosis of flesh and metal. From taboo skin-cutting to cold-hard design, each piece is a violent deconstruction of mediocre aesthetics.",
      masterRole1: "VISUAL DECAY EXPERT",
      masterRole2: "BIO-MODS / DESIGN",
      apparelTitle: "APPAREL",
      apparelSub: "COLLECTION",
      apparelStation: "LIMITED SUPPLY STATION",
      apparelDrop: "2024 DROP_01: BONE_LINK",
      bodyArtTitle: "FLESH_ARTWORKS",
      bodyArtMotto: "PAIN_IS_TRUTH // THE ONLY REALITY",
      designTitle: "VISUAL",
      designSub: "STATIC",
      designLogo: "LOGO DESIGN",
      designLogoDesc: "Identity / Symbolism",
      designPoster: "POSTER ART",
      designPosterDesc: "Campaigns / Visual Comm",
      designGuitar: "GUITAR PAINT",
      designGuitarDesc: "Custom / Hand-painted",
      contactTitle: "CONNECT",
      contactFormTitle: "INITIATE NEURAL LINK",
      contactFormBtn: "INITIATE LINK",
      copyright: "© MMXXIV DOLLMAN RECORDS // SYSTEM_ONLINE"
    },
    zh: {
      brand: "人彘娃娃 RECORDS",
      status: "状态: 生物机械革命",
      slogan: "策划令人不适的秩序，重塑肉体的冰冷宣告。",
      subSlogan: "极致金属审美策展人 / 骨骼重塑师 / 视觉腐烂专家 / 纯粹噪音管理中心。",
      nav: [
        { id: 'hero', name: '首页' },
        { id: 'master', name: '主理人' },
        { id: 'apparel', name: '服饰售卖' },
        { id: 'bodyart', name: '身体艺术' },
        { id: 'design', name: '平面设计' },
        { id: 'contact', name: '联系' },
      ],
      masterTitle: "主理人档案",
      masterDesc1: "这里是 人彘娃娃，一个在生物机械与工业噪音边缘挣扎的视觉异端。",
      masterDesc2: "自2018年起致力于探索肉体与金属的共生关系。从禁忌的割皮艺术到冷硬的平面设计，每一件作品都是对平庸审美的暴力拆解。",
      masterRole1: "视觉腐烂专家",
      masterRole2: "生物改造 / 设计",
      apparelTitle: "服饰",
      apparelSub: "系列展示",
      apparelStation: "限定补给站",
      apparelDrop: "2024 第1弹: 骨骼链接",
      bodyArtTitle: "身体艺术作品",
      bodyArtMotto: "疼痛是唯一的真实 // PAIN_IS_TRUTH",
      designTitle: "平面",
      designSub: "设计档案",
      designLogo: "LOGO 设计",
      designLogoDesc: "品牌视觉/符号识别",
      designPoster: "海报艺术",
      designPosterDesc: "活动海报/视觉传达",
      designGuitar: "琴绘艺术",
      designGuitarDesc: "乐器定制/手工琴绘",
      contactTitle: "连接",
      contactFormTitle: "启动神经链接",
      contactFormBtn: "发送链接",
      copyright: "© MMXXIV 人彘娃娃 RECORDS // 系统在线"
    }
  };

  const t = translations[lang];

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { damping: 50, stiffness: 200 });

  return (
    <div className="bg-[#050505] text-[#E0E0E0] min-h-screen font-mono selection:bg-[#FF007F] selection:text-[#FFFFFF] overflow-x-hidden cursor-none">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=JetBrains+Mono:wght@100;800&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #FF007F; }
        .font-syne { font-family: 'Syne', sans-serif; }
        .noise-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none; z-index: 100; opacity: 0.12; mix-blend-mode: overlay;
          background-image: url('${noiseSvg}');
        }
        .laser-text {
          background: linear-gradient(90deg, #E0E0E0 0%, #FF007F 25%, #FFFFFF 50%, #FF007F 75%, #E0E0E0 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: laser-move 4s linear infinite;
          text-shadow: 0 0 15px rgba(255, 0, 127, 0.3);
        }
        @keyframes laser-move { to { background-position: 200% center; } }
        .cursor-dot {
          position: fixed; top: 0; left: 0; width: 6px; height: 6px; background-color: #FFFFFF;
          transform: translate(-50%, -50%); pointer-events: none; z-index: 500; mix-blend-mode: difference;
        }
        .cursor-cross {
          position: fixed; top: 0; left: 0; width: 40px; height: 40px; border: 1px solid #FF007F;
          transform: translate(-50%, -50%); pointer-events: none; z-index: 499;
          box-shadow: 0 0 10px rgba(255, 0, 127, 0.4);
        }
        .chrome-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .chrome-card:hover { border-color: #FF007F; background: rgba(255, 0, 127, 0.05); }
        .scanlines {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: linear-gradient(to bottom, transparent, transparent 50%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.5));
          background-size: 100% 4px; z-index: 90; pointer-events: none; opacity: 0.2;
        }
      `}</style>

      <div className="noise-overlay" />
      <div className="scanlines" />
      <Metallic3DScene />
      
      <div className="cursor-dot" style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }} />
      <div className="cursor-cross" style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }} />

      <header className="fixed top-0 left-0 w-full z-[300] border-b border-white/5 px-8 py-6 flex justify-between items-center bg-black/60 backdrop-blur-xl">
        <div className="font-syne font-black text-xl flex items-center gap-3">
          <div className="w-8 h-8 border border-[#FF007F] flex items-center justify-center animate-pulse">
            <Skull className="w-4 h-4 text-[#FF007F]" />
          </div>
          <span className="laser-text tracking-tighter uppercase">{t.brand}</span>
        </div>
        
        <div className="flex items-center gap-8">
          <nav className="hidden lg:flex gap-8 text-[10px] tracking-widest uppercase font-black">
            {t.nav.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="hover:text-[#FF007F] transition-colors">{s.name}</a>
            ))}
          </nav>

          {/* Language Switch Button */}
          <button 
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="border border-[#FF007F] px-3 py-1 text-[10px] font-black hover:bg-[#FF007F] hover:text-black transition-all"
          >
            {lang === 'en' ? 'EN / 中' : '中 / EN'}
          </button>

          <button onClick={() => setMenuOpen(true)} className="lg:hidden">
            <Menu className="w-6 h-6 text-[#FF007F]" />
          </button>
        </div>
      </header>

      <main className="relative z-10">
        
        {/* 1. HERO */}
        <section id="hero" className="min-h-screen flex flex-col justify-center px-10 md:px-32 pt-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="text-[#FF007F] text-xs font-black tracking-[0.8em] mb-4 uppercase italic">
              // {t.status}
            </div>
            <h1 className="font-syne text-[14vw] leading-[0.85] tracking-[-0.05em] uppercase italic mb-8">
              <span className="block text-white">SYSTEM</span>
              <span className="block laser-text">FAILURE</span>
              <span className="block text-white/20 -mt-2">RECORDS</span>
            </h1>
            <div className="max-w-2xl border-l-4 border-[#FF007F] pl-8 py-4">
              <p className="text-xl md:text-2xl font-black text-white italic leading-tight uppercase mb-4">
                "{t.slogan}"
              </p>
              <p className="text-xs text-white/40 tracking-widest uppercase">
                {t.subSlogan}
              </p>
            </div>
          </motion.div>
        </section>

        {/* 2. MASTER */}
        <section id="master" className="py-40 px-10 md:px-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 border border-[#FF007F]/20 group-hover:border-[#FF007F]/50 transition-all duration-700"></div>
              <div className="aspect-[3/4] overflow-hidden chrome-card">
                <img src="https://images.unsplash.com/photo-1620336655055-188d7f625027?q=80&w=800" alt="[Operator Portrait]" className="w-full h-full object-cover grayscale brightness-50 contrast-125 group-hover:brightness-100 transition-all duration-1000" />
              </div>
              <div className="absolute bottom-8 -right-8 bg-[#FF007F] text-black px-6 py-4 font-syne font-black text-4xl italic -rotate-3 uppercase">
                {lang === 'en' ? 'THE_OPERATOR' : '主理人'}
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <h2 className="text-5xl font-syne font-black uppercase text-[#FF007F] tracking-tighter">{t.masterTitle}</h2>
              <div className="space-y-6 text-sm leading-relaxed text-white/60">
                <p>{t.masterDesc1}</p>
                <p>{t.masterDesc2}</p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="border border-white/10 p-4">
                    <div className="text-[10px] text-[#FF007F] mb-1">{lang === 'en' ? 'POSITION' : '定位'}</div>
                    <div className="text-white font-bold">{t.masterRole1}</div>
                  </div>
                  <div className="border border-white/10 p-4">
                    <div className="text-[10px] text-[#FF007F] mb-1">{lang === 'en' ? 'MEANS' : '手段'}</div>
                    <div className="text-white font-bold">{t.masterRole2}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. APPAREL */}
        <section id="apparel" className="py-40 bg-white text-black overflow-hidden">
          <div className="px-10 md:px-32 mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
            <h2 className="font-syne text-8xl md:text-[10vw] leading-none font-black uppercase tracking-tighter">
              {t.apparelTitle}<br/><span className="text-stroke-pink" style={{ WebkitTextStroke: '2px black', color: 'transparent' }}>{t.apparelSub}</span>
            </h2>
            <div className="flex gap-4">
              <ShoppingBag className="w-12 h-12" />
              <div className="text-right">
                <div className="font-black text-xs uppercase">{t.apparelStation}</div>
                <div className="text-[10px] opacity-40 uppercase">{t.apparelDrop}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 px-4 md:px-8">
            {[
              { t: lang === 'en' ? 'BIOMECH T-SHIRT' : '异变骨骼 T-SHIRT', p: '¥299', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600' },
              { t: lang === 'en' ? 'METAL THORN HOODIE' : '金属荆棘 HOODIE', p: '¥599', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600' },
              { t: lang === 'en' ? 'MECH JACKET' : '生物机械 夹克', p: '¥1299', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600' },
              { t: lang === 'en' ? 'NOISE TOTE' : '工业噪音 托特包', p: '¥169', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600' },
              { t: lang === 'en' ? 'ACID CAP' : '酸性霓虹 棒球帽', p: '¥199', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600' },
              { t: lang === 'en' ? 'FLESH MANIFESTO' : '肉体宣告 限量版', p: '¥888', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600' }
            ].map((item, i) => (
              <div key={i} className="group relative aspect-[3/4] overflow-hidden bg-[#f0f0f0]">
                <img src={item.img} alt={item.t} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100">
                  <div className="text-[#FF007F] font-black text-xs mb-2">SUPPLY_ITEM_{i+1}</div>
                  <div className="text-white text-2xl font-black uppercase mb-2 italic">{item.t}</div>
                  <div className="text-white/60 font-bold mb-6">{item.p}</div>
                  <button className="bg-[#FF007F] text-black font-black py-3 text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                    {lang === 'en' ? 'INITIATE LINK' : '加入链接'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. BODY ART */}
        <section id="bodyart" className="py-40 px-10 md:px-32 relative">
          <div className="flex items-center gap-6 mb-20">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#FF007F]"></div>
            <h2 className="font-syne text-5xl font-black uppercase laser-text italic">{t.bodyArtTitle}</h2>
            <Scissors className="text-[#FF007F] w-10 h-10" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="chrome-card relative overflow-hidden aspect-square p-1 group">
                <img src={`https://images.unsplash.com/photo-1598331668826-20cecc596b86?q=80&w=400&sig=${i}`} alt="[Body Art Work]" className="w-full h-full object-cover brightness-50 contrast-150 grayscale group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" />
                <div className="absolute top-2 left-2 text-[8px] bg-[#FF007F] text-black px-1 font-bold">MOD_ID_{i}09</div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-white/30 text-xs tracking-[0.4em] uppercase font-bold italic">{t.bodyArtMotto}</p>
          </div>
        </section>

        {/* 5. DESIGN */}
        <section id="design" className="py-40 px-10 md:px-32 bg-zinc-950/50 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-24">
            <div>
              <h2 className="font-syne text-[8vw] leading-none uppercase font-black text-white">{t.designTitle}<br/><span className="laser-text">{t.designSub}</span></h2>
              <div className="mt-6 flex gap-8">
                <div className="text-[10px] border-l-2 border-[#FF007F] pl-4">
                  <span className="block text-[#FF007F] font-bold uppercase">{t.designLogo}</span>
                  <span className="text-white/40 italic uppercase">{t.designLogoDesc}</span>
                </div>
                <div className="text-[10px] border-l-2 border-white/20 pl-4">
                  <span className="block text-[#FF007F] font-bold uppercase">{t.designPoster}</span>
                  <span className="text-white/40 italic uppercase">{t.designPosterDesc}</span>
                </div>
                <div className="text-[10px] border-l-2 border-white/20 pl-4">
                  <span className="block text-[#FF007F] font-bold uppercase">{t.designGuitar}</span>
                  <span className="text-white/40 italic uppercase">{t.designGuitarDesc}</span>
                </div>
              </div>
            </div>
            <Palette className="w-20 h-20 text-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-12">
              <div className="chrome-card p-4 group">
                <div className="aspect-video bg-black overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800" alt="[Poster Design]" className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-1000" />
                  <div className="absolute bottom-4 left-4 text-xs font-black italic bg-[#FF007F] text-black px-4 py-1">POSTER_001</div>
                </div>
                <h3 className="mt-6 text-xl font-black uppercase">{lang === 'en' ? 'Noise Lab Series' : '《噪音实验室》系列海报'}</h3>
                <p className="text-xs text-white/40 mt-2 uppercase tracking-widest">NOISE_LAB EXPERIMENT VISUALS</p>
              </div>
            </div>
            <div className="space-y-12 md:mt-24">
              <div className="chrome-card p-4 group">
                <div className="aspect-square bg-black overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1516924911020-7483c983bbad?q=80&w=800" alt="[Guitar Design]" className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-1000" />
                  <div className="absolute bottom-4 left-4 text-xs font-black italic bg-[#FF007F] text-black px-4 py-1">GUITAR_CUSTOM</div>
                </div>
                <h3 className="mt-6 text-xl font-black uppercase">{lang === 'en' ? 'Custom Guitar Painting' : '手工琴体涂鸦/设计'}</h3>
                <p className="text-xs text-white/40 mt-2 uppercase tracking-widest">HAND_PAINTED INSTRUMENTS</p>
              </div>
              <div className="p-8 border-2 border-dashed border-[#FF007F]/30 flex flex-col justify-center items-center text-center">
                <Zap className="w-12 h-12 text-[#FF007F] mb-6 animate-bounce" />
                <div className="text-2xl font-black italic uppercase">{lang === 'en' ? 'MORE_DATA_LOADING' : '持续同步中'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CONTACT */}
        <footer id="contact" className="bg-[#050505] py-40 border-t border-white/5 relative px-10 md:px-32">
          <div className="flex flex-col lg:flex-row justify-between gap-20">
            <div className="max-w-xl">
              <h2 className="font-syne text-[10vw] font-black laser-text italic uppercase leading-none tracking-tighter mb-12">{t.contactTitle}</h2>
              <div className="space-y-12">
                <div className="flex items-center gap-8 group cursor-pointer">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#FF007F] group-hover:shadow-[0_0_20px_#FF007F] transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] text-white/20 uppercase tracking-widest mb-1">E-MAIL</div>
                    <div className="text-2xl font-black uppercase">contact@dollman.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-8 group cursor-pointer">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#FF007F] group-hover:shadow-[0_0_20px_#FF007F] transition-all">
                    {/* <Instagram className="w-6 h-6" /> */}
                  </div>
                  <div>
                    <div className="text-[10px] text-white/20 uppercase tracking-widest mb-1">INSTAGRAM</div>
                    <div className="text-2xl font-black uppercase">@dollman_records</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[#FF007F]/5 border border-[#FF007F]/20 p-12 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl font-black uppercase italic mb-8">{t.contactFormTitle}</h3>
                <div className="space-y-6">
                  <input type="text" placeholder={lang === 'en' ? "ID / NAME" : "ID / 称号"} className="w-full bg-black/40 border border-white/10 p-4 text-xs font-black uppercase tracking-widest focus:border-[#FF007F] outline-none transition-all" />
                  <textarea placeholder={lang === 'en' ? "YOUR MANIFESTO" : "输入你的异端宣告"} rows="4" className="w-full bg-black/40 border border-white/10 p-4 text-xs font-black uppercase tracking-widest focus:border-[#FF007F] outline-none transition-all"></textarea>
                  <button className="w-full bg-[#FF007F] text-black font-black py-5 text-sm uppercase tracking-[0.4em] hover:bg-white transition-all">{t.contactFormBtn}</button>
                </div>
              </div>
              <Skull className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
            </div>
          </div>

          <div className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em]">{t.copyright}</div>
            <div className="flex gap-10 font-black text-[10px] text-white/40 uppercase italic tracking-widest">
              <span>PRIVACY</span>
              <span>TERMS</span>
              <span>ARCHIVE</span>
            </div>
          </div>
        </footer>

      </main>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-[500] bg-black p-10 flex flex-col justify-center items-center text-center font-syne font-black">
            <X className="absolute top-10 right-10 w-10 h-10 text-[#FF007F]" onClick={() => setMenuOpen(false)} />
            <div className="flex flex-col gap-8 text-5xl uppercase tracking-tighter">
              {t.nav.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={() => setMenuOpen(false)} className="hover:text-[#FF007F]">
                  {s.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;