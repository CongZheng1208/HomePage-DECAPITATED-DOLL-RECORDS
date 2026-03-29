import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Skull, Menu, X, ShoppingBag, Scissors, Palette, MessageCircle, Share2, QrCode } from 'lucide-react';

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

    // 更新为更纯粹的粉色光（去除紫色调）
    const pinkLight = new THREE.DirectionalLight(0xFF1493, 5); 
    pinkLight.position.set(10, 10, 15);
    scene.add(pinkLight);

    const whiteLight = new THREE.DirectionalLight(0xFFFFFF, 3);
    whiteLight.position.set(-15, -10, 10);
    scene.add(whiteLight);

    const animate = () => {
      requestAnimationFrame(animate);
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

  return <div ref={mountRef} className="three-background" />;
};

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState('en');

  // 全局滚动控制
  const { scrollYProgress } = useScroll();
  
  // 身体艺术画廊：增大左右交错滑动的幅度 (-80% 到 0%)
  const moveLeft = useTransform(scrollYProgress, [0, 1], ['0%', '-80%']);
  const moveRight = useTransform(scrollYProgress, [0, 1], ['-80%', '0%']);

  // 服饰画廊：奇偶列实现不同方向或速度的视差滑动
  const apparelY1 = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const apparelY2 = useTransform(scrollYProgress, [0, 1], ['15%', '-15%']);

  // 主理人区块的单独滚动侦测
  const masterRef = useRef(null);
  const { scrollYProgress: masterProgress } = useScroll({
    target: masterRef,
    offset: ["start 80%", "center center"]
  });

  // 主理人图片亮度随滚动增加，粒子特效向下坠落
  const masterBrightness = useTransform(masterProgress, [0, 1], [0.3, 1.2]);
  const particleY = useTransform(masterProgress, [0, 1], [0, 300]);
  const particleOpacity = useTransform(masterProgress, [0, 0.5, 1], [0, 1, 0.2]);

  // 主理人职位 Tags 的逐级显示
  const tag1Opacity = useTransform(masterProgress, [0.1, 0.3], [0, 1]);
  const tag2Opacity = useTransform(masterProgress, [0.2, 0.4], [0, 1]);
  const tag3Opacity = useTransform(masterProgress, [0.4, 0.6], [0, 1]);
  const tag4Opacity = useTransform(masterProgress, [0.6, 0.8], [0, 1]);
  const tag5Opacity = useTransform(masterProgress, [0.8, 1.0], [0, 1]);
  const tagOpacities = [tag1Opacity, tag2Opacity, tag3Opacity, tag4Opacity, tag5Opacity];

  const translations = {
    en: {
      brand: "DECAPITATED DOLL RECORDS",
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
      masterDesc1: "This is DECAPITATED DOLL, a visual anomaly struggling at the edge of biomech and industrial noise.",
      masterDesc2: "Dedicated since 2018 to exploring the symbiosis of flesh and metal. From taboo skin-cutting to cold-hard design, each piece is a violent deconstruction of mediocre aesthetics.",
      masterRole2: "BIO-MODS / DESIGN",
      apparelTitle: "APPAREL",
      apparelSub: "EXHIBITION",
      apparelStation: "VISUAL ARCHIVE",
      apparelDrop: "NO_SALES // JUST_PAIN",
      bodyArtTitle: "FLESH_ARTWORKS",
      bodyArtMotto: "PAIN_IS_TRUTH // THE ONLY REALITY",
      designTitle: "VISUAL",
      designSub: "STATIC_DECAY",
      contactTitle: "CONNECT_LINK",
      contactSub: "SOCIAL MATRIX",
      copyright: "© MMXXIV DECAPITATED DOLL RECORDS // SYSTEM_ONLINE",
      tags: ["INT'L BRUTAL MERCH LABEL OWNER", "TATTOO ARTIST", "SCARIFICATION ARTIST", "GRAPHIC DESIGNER", "LARRY WANG MAINLAND MGR"]
    },
    zh: {
      brand: "人彘娃娃 RECORDS",
      status: "状态: 生物机械革命",
      slogan: "策划令人不适的秩序，重塑肉体的冰冷宣告。",
      subSlogan: "极致金属审美策展人 / 骨骼重塑师 / 视觉腐烂专家 / 纯粹噪音管理中心。",
      nav: [
        { id: 'hero', name: '首页' },
        { id: 'master', name: '主理人' },
        { id: 'apparel', name: '服饰档案' },
        { id: 'bodyart', name: '身体艺术' },
        { id: 'design', name: '平面设计' },
        { id: 'contact', name: '社交矩阵' },
      ],
      masterTitle: "主理人档案",
      masterDesc1: "这里是 人彘娃娃 (DECAPITATED DOLL)，一个在生物机械与工业噪音边缘挣扎的视觉异端。",
      masterDesc2: "自2018年起致力于探索肉体与金属的共生关系。从禁忌的割皮艺术到冷硬的平面设计，每一件作品都是对平庸审美的暴力拆解。",
      masterRole2: "生物改造 / 设计",
      apparelTitle: "服饰",
      apparelSub: "视觉展厅",
      apparelStation: "档案库",
      apparelDrop: "仅供展示 // 拒绝消费",
      bodyArtTitle: "身体艺术作品",
      bodyArtMotto: "疼痛是唯一的真实 // PAIN_IS_TRUTH",
      designTitle: "平面",
      designSub: "静态腐烂",
      contactTitle: "神经链接",
      contactSub: "社交媒体矩阵",
      copyright: "© MMXXIV 人彘娃娃 RECORDS // 系统在线",
      tags: ["国际残酷周边厂牌主理人", "刺青师", "割皮师", "平面设计师", "LarryWang大陆经纪人"]
    }
  };

  const t = translations[lang];

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="main-container">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=JetBrains+Mono:wght@100;400;800&display=swap');
        
        :root {
          --bg-black: #050505;
          /* 将主色调改为纯正鲜艳的粉色 */
          --accent-pink: #FF1493; 
          --accent-magenta: #FF69B4; 
          --text-gray: #E0E0E0;
          --syne: 'Syne', sans-serif;
          --mono: 'JetBrains Mono', monospace;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background-color: var(--bg-black); color: var(--text-gray); font-family: var(--mono); overflow-x: hidden; cursor: none; }
        ::selection { background: var(--accent-pink); color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg-black); }
        ::-webkit-scrollbar-thumb { background: var(--accent-pink); }

        .main-container { min-height: 100vh; position: relative; }
        .font-syne { font-family: var(--syne); }
        
        .noise-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.12; 
          mix-blend-mode: overlay; background-image: url('${noiseSvg}');
        }

        .scanlines {
          position: fixed; inset: 0; z-index: 90; pointer-events: none; opacity: 0.15;
          background: linear-gradient(to bottom, transparent, transparent 50%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.5));
          background-size: 100% 4px; 
        }

        .three-background {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.4; mix-blend-mode: screen;
        }

        .laser-text {
          background: linear-gradient(90deg, #E0E0E0 0%, var(--accent-pink) 25%, #FFFFFF 50%, var(--accent-magenta) 75%, #E0E0E0 100%);
          background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: laser-move 4s linear infinite; text-shadow: 0 0 20px rgba(255, 20, 147, 0.5);
        }
        @keyframes laser-move { to { background-position: 200% center; } }

        /* Custom Cursors */
        .cursor-dot {
          position: fixed; width: 6px; height: 6px; background: #fff; border-radius: 50%;
          transform: translate(-50%, -50%); pointer-events: none; z-index: 500; mix-blend-mode: difference;
        }
        .cursor-cross {
          position: fixed; width: 40px; height: 40px; border: 1px solid var(--accent-pink);
          transform: translate(-50%, -50%); pointer-events: none; z-index: 499;
          box-shadow: 0 0 10px rgba(255, 20, 147, 0.4); transition: width 0.2s, height 0.2s;
        }
        a:hover ~ .cursor-cross, button:hover ~ .cursor-cross { width: 60px; height: 60px; background: rgba(255,20,147,0.15); }

        /* Layout & Header */
        header {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 300;
          border-bottom: 1px solid rgba(255,255,255,0.05); padding: 1.5rem 2rem;
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(20px);
        }

        .header-logo { display: flex; align-items: center; gap: 0.75rem; font-weight: 900; font-size: clamp(1rem, 2vw, 1.25rem); }
        .logo-box { min-width: 32px; height: 32px; border: 1px solid var(--accent-pink); display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; box-shadow: 0 0 15px rgba(255,20,147,0.6); } 50% { opacity: 0.5; box-shadow: none; } }

        nav.desktop-nav { display: none; gap: 2rem; font-size: 10px; letter-spacing: 0.2em; font-weight: 900; }
        nav.desktop-nav a { text-decoration: none; color: inherit; transition: 0.3s; }
        nav.desktop-nav a:hover { color: var(--accent-pink); text-shadow: 0 0 8px var(--accent-pink); }
        @media (min-width: 1024px) { nav.desktop-nav { display: flex; } }

        .lang-btn {
          border: 1px solid var(--accent-pink); background: transparent; color: inherit;
          padding: 0.25rem 0.75rem; font-size: 10px; font-weight: 900; cursor: pointer; transition: 0.3s;
        }
        .lang-btn:hover { background: var(--accent-pink); color: #000; }

        /* 固定在右上角的菜单按钮 */
        .fixed-menu-btn {
          position: fixed; top: 1.5rem; right: 2rem; z-index: 301;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);
          border: 1px solid rgba(255,20,147,0.3); padding: 8px; cursor: pointer;
          transition: 0.3s;
        }
        .fixed-menu-btn:hover { background: rgba(255,20,147,0.2); box-shadow: 0 0 15px rgba(255,20,147,0.5); }

        section { position: relative; z-index: 10; overflow: hidden; }

        /* Hero */
        .hero-section { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 6rem 5% 0; }
        @media (min-width: 768px) { .hero-section { padding-left: 10%; padding-right: 10%; } }
        
        .status-tag { color: var(--accent-pink); font-size: 10px; font-weight: 900; letter-spacing: 0.5em; margin-bottom: 1rem; font-style: italic; }
        @media (min-width: 768px) { .status-tag { font-size: 12px; letter-spacing: 0.8em; } }
        
        .hero-title { font-size: clamp(3rem, 12vw, 12rem); line-height: 0.85; letter-spacing: -0.05em; font-weight: 900; font-style: italic; margin-bottom: 2rem; }
        .hero-title span { display: block; }
        .hero-title .dim { color: rgba(255,255,255,0.1); margin-top: -0.5rem; text-shadow: none; }
        .hero-quote { max-width: 600px; border-left: 4px solid var(--accent-pink); padding-left: 1.5rem; margin: 1rem 0; }
        .hero-quote p.main { font-size: clamp(1rem, 4vw, 1.5rem); font-weight: 900; font-style: italic; color: #fff; line-height: 1.3; margin-bottom: 1rem; }
        .hero-quote p.sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 0.2em; line-height: 1.6; }

        /* Master Section */
        .master-section { padding: 6rem 5%; display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center; }
        @media (min-width: 1024px) { .master-section { padding: 10rem 10%; grid-template-columns: 1fr 1.2fr; gap: 6rem; } }
        
        .chrome-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%);
          border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px);
          position: relative; overflow: hidden;
        }
        .master-portrait { aspect-ratio: 3/4; border: 1px solid rgba(255,20,147,0.4); position: relative; }
        .master-portrait img { width: 100%; height: 100%; object-fit: cover; }
        
        /* 粉色粒子特效 */
        .pink-particle { position: absolute; background: var(--accent-pink); border-radius: 50%; filter: blur(2px); box-shadow: 0 0 10px var(--accent-pink); }
        
        .master-tag {
          position: absolute; bottom: 1rem; right: -1rem; background: var(--accent-pink); color: #000;
          padding: 0.5rem 1rem; font-weight: 900; font-size: clamp(1.5rem, 4vw, 2.5rem); font-style: italic; transform: rotate(-3deg); z-index: 10;
        }
        
        .tag-list { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
        .tag-item { 
          font-size: clamp(12px, 2vw, 16px); font-weight: 900; color: #fff; 
          padding: 0.5rem 1rem; border-left: 2px solid var(--accent-pink);
          background: linear-gradient(90deg, rgba(255,20,147,0.15) 0%, transparent 100%);
        }

        /* Apparel Exhibition (动态视差 + 无模糊 Hover) */
        .apparel-section { padding: 8rem 0; background: #fff; color: #000; overflow: hidden; }
        .apparel-header { padding: 0 5%; margin-bottom: 3rem; display: flex; flex-direction: column; gap: 1rem; }
        @media (min-width: 768px) { .apparel-header { padding: 0 10%; flex-direction: row; justify-content: space-between; align-items: flex-end; margin-bottom: 5rem; } }
        .apparel-title { font-size: clamp(3rem, 10vw, 8rem); line-height: 0.9; font-weight: 900; text-transform: uppercase; }
        .text-stroke-pink { -webkit-text-stroke: 1px #000; color: transparent; }
        @media (min-width: 768px) { .text-stroke-pink { -webkit-text-stroke: 2px #000; } }

        .apparel-gallery { 
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; background: #000; 
        }
        @media (min-width: 768px) { .apparel-gallery { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .apparel-gallery { grid-template-columns: repeat(4, 1fr); } }

        .apparel-item { 
          aspect-ratio: 3/4; position: relative; overflow: hidden; background: #111; cursor: crosshair;
        }
        .apparel-img { 
          width: 100%; height: 100%; object-fit: cover; 
          /* 移除灰色模糊，保持高清锐利 */
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); 
        }
        .apparel-overlay {
          position: absolute; inset: 0; background: rgba(255,20,147,0.1); opacity: 0;
          display: flex; flex-direction: column; justify-content: space-between; padding: 1.5rem;
          transition: 0.4s ease; border: 2px solid transparent; pointer-events: none;
        }
        /* Hover 触发极其刺激的缩放，不加入任何模糊 */
        .apparel-item:hover .apparel-img { transform: scale(1.15) !important; }
        .apparel-item:hover .apparel-overlay { opacity: 1; border-color: var(--accent-pink); background: rgba(0,0,0,0.3); }
        
        .apparel-glitch-text { color: #fff; font-weight: 900; font-size: clamp(1rem, 2vw, 1.5rem); font-style: italic; text-transform: uppercase; }
        .apparel-id { color: var(--accent-pink); font-size: 10px; font-weight: 900; }

        /* Body Art (加强的滚动幅度) */
        .bodyart-section { padding: 10rem 0; background: var(--bg-black); overflow: hidden; }
        .bodyart-header { padding: 0 5%; margin-bottom: 5rem; display: flex; align-items: center; gap: 1rem; }
        @media (min-width: 768px) { .bodyart-header { padding: 0 10%; gap: 1.5rem; } }
        .line { height: 1px; flex: 1; background: linear-gradient(90deg, transparent, var(--accent-pink)); }

        .scroll-gallery-container { display: flex; flex-direction: column; gap: 2rem; width: 100%; }
        .scroll-track { display: flex; gap: 2rem; width: max-content; padding: 0 5vw; }
        .scroll-item { 
          width: 250px; height: 350px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.1); 
          overflow: hidden; position: relative;
        }
        @media (min-width: 768px) { .scroll-item { width: 400px; height: 500px; } }
        .scroll-item img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) brightness(0.6); transition: 0.5s; }
        .scroll-item:hover img { filter: grayscale(0) brightness(1.2); transform: scale(1.05); }

        /* Design Section (Irregular Grid) */
        .design-section { padding: 10rem 5%; background: rgba(10,10,10,0.8); }
        @media (min-width: 1024px) { .design-section { padding: 10rem 10%; } }
        
        .design-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 4rem; }
        @media (min-width: 768px) {
          .design-grid { grid-template-columns: repeat(4, 1fr); grid-auto-rows: 250px; gap: 1.5rem; }
          .grid-item-1 { grid-column: span 2; grid-row: span 2; }
          .grid-item-2 { grid-column: span 2; grid-row: span 1; }
          .grid-item-3 { grid-column: span 1; grid-row: span 2; }
          .grid-item-4 { grid-column: span 1; grid-row: span 1; }
          .grid-item-5 { grid-column: span 2; grid-row: span 1; }
          .grid-item-6 { grid-column: span 1; grid-row: span 1; }
        }

        .design-item { 
          position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);
          background: #000; group; transition: 0.4s;
        }
        .design-item:hover { border-color: var(--accent-pink); box-shadow: 0 0 20px rgba(255,20,147,0.3); z-index: 10; }
        .design-item img { width: 100%; height: 100%; object-fit: cover; opacity: 0.5; filter: grayscale(1); transition: 0.6s; }
        .design-item:hover img { opacity: 1; filter: grayscale(0); transform: scale(1.05); }
        
        .design-label {
          position: absolute; bottom: 1rem; left: 1rem; background: var(--accent-pink); color: #000;
          padding: 0.25rem 0.5rem; font-size: 10px; font-weight: 900; font-family: var(--mono); text-transform: uppercase;
        }

        /* Contact (Social Matrix) */
        footer { padding: 6rem 5% 4rem; border-top: 1px solid rgba(255,20,147,0.3); background: #000; }
        @media (min-width: 1024px) { footer { padding: 10rem 10% 4rem; } }
        
        .wechat-hero-btn {
          position: relative; display: block; width: 100%; max-width: 600px; margin: 0 auto 4rem;
          border: 2px solid var(--accent-pink); overflow: hidden; border-radius: 4px; transition: 0.4s;
          box-shadow: 0 0 20px rgba(255,20,147,0.2);
        }
        .wechat-hero-btn img { width: 100%; height: auto; display: block; transition: 0.5s; opacity: 0.8; filter: grayscale(0.5); }
        .wechat-overlay {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); transition: 0.5s;
        }
        .wechat-overlay span {
          font-family: var(--syne); font-size: clamp(2rem, 5vw, 3rem); font-weight: 900;
          color: #fff; text-shadow: 0 0 15px var(--accent-pink); letter-spacing: 0.1em;
        }
        .wechat-hero-btn:hover img { transform: scale(1.05); opacity: 1; filter: grayscale(0); }
        .wechat-hero-btn:hover .wechat-overlay { background: rgba(255,20,147,0.2); backdrop-filter: blur(0px); }

        .social-matrix { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 768px) { .social-matrix { grid-template-columns: repeat(2, 1fr); } }

        .social-btn {
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;
          padding: 3rem 1rem; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02);
          text-decoration: none; color: #fff; transition: 0.4s; position: relative; overflow: hidden;
        }
        .social-btn::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,20,147,0.3), transparent);
          transition: 0.5s;
        }
        .social-btn:hover { border-color: var(--accent-pink); background: rgba(255,20,147,0.08); transform: translateY(-5px); }
        .social-btn:hover::before { left: 100%; }
        .social-icon { width: 32px; height: 32px; color: var(--accent-pink); }
        .social-text { font-family: var(--syne); font-weight: 900; font-size: 1.5rem; letter-spacing: 0.1em; }
        .social-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 0.2em; }

        .mobile-menu {
          position: fixed; inset: 0; z-index: 500; background: rgba(0,0,0,0.95); backdrop-filter: blur(10px);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 2.5rem; font-size: 2.5rem; font-family: var(--syne); font-weight: 900;
        }
        .mobile-menu a { color: #fff; text-decoration: none; text-transform: uppercase; }
        .mobile-menu a:hover, .mobile-menu a:active { color: var(--accent-pink); }
      `}</style>

      <div className="noise-overlay" />
      <div className="scanlines" />
      <Metallic3DScene />
      
      <div className="cursor-dot" style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }} />
      <div className="cursor-cross" style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }} />

      <header>
        <div className="header-logo font-syne">
          <div className="logo-box">
            <Skull size={18} color="#FF1493" />
          </div>
          <span className="laser-text uppercase">{t.brand}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', paddingRight: '4rem' }}>
          <nav className="desktop-nav">
            {t.nav.map((s) => (
              <a key={s.id} href={`#${s.id}`}>{s.name}</a>
            ))}
          </nav>
          <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className="lang-btn">
            {lang === 'en' ? 'EN / 中' : '中 / EN'}
          </button>
        </div>
      </header>

      {/* 始终常驻的右上角菜单按钮 */}
      <div className="fixed-menu-btn" onClick={() => setMenuOpen(true)}>
        <Menu size={28} color="#FF1493" />
      </div>

      <main>
        {/* 1. HERO */}
        <section id="hero" className="hero-section">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="status-tag">// {t.status}</div>
            <h1 className="hero-title font-syne uppercase">
              <span>DECAPITATED</span>
              <span className="laser-text">DOLL</span>
              <span className="dim">RECORDS</span>
            </h1>
            <div className="hero-quote uppercase">
              <p className="main">"{t.slogan}"</p>
              <p className="sub">{t.subSlogan}</p>
            </div>
          </motion.div>
        </section>

        {/* 2. MASTER */}
        <section id="master" className="master-section" ref={masterRef}>
          <div className="chrome-card master-portrait">
            {/* 随滚动变亮的主理人图片 */}
            <motion.img 
              src="/assets/MASTER/1.jpg" 
              alt="Operator" 
              style={{ filter: useTransform(masterBrightness, b => `brightness(${b}) grayscale(${1.2 - b})`) }}
            />
            
            {/* 酷炫粉色坠落粒子 */}
            <motion.div style={{ opacity: particleOpacity }} className="absolute inset-0 pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="pink-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 50}%`,
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    y: useTransform(particleY, y => y * (Math.random() + 0.5))
                  }}
                />
              ))}
            </motion.div>

            <div className="master-tag font-syne">
              {lang === 'en' ? 'OPERATOR' : '主理人'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 className="font-syne laser-text uppercase" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900 }}>{t.masterTitle}</h2>
            <div style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '14px', fontFamily: "var(--mono)" }}>
              <p style={{ marginBottom: '1.5rem' }}>{t.masterDesc1}</p>
              <p>{t.masterDesc2}</p>
              
              <div style={{ marginTop: '3rem' }}>
                <div style={{ fontSize: '12px', color: 'var(--accent-pink)', marginBottom: '1rem', fontWeight: 900, letterSpacing: '0.2em' }}>
                  // MULTI-DIMENSIONAL_POSITION
                </div>
                <div className="tag-list">
                  {t.tags.map((tag, index) => (
                    <motion.div 
                      key={index} 
                      className="tag-item"
                      style={{ opacity: tagOpacities[index], x: useTransform(tagOpacities[index], o => (1 - o) * -20) }}
                    >
                      {tag}
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. APPAREL - 动态画廊 */}
        <section id="apparel" className="apparel-section">
          <div className="apparel-header">
            <h2 className="apparel-title font-syne">
              {t.apparelTitle}<br/><span className="text-stroke-pink">{t.apparelSub}</span>
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <ShoppingBag size={40} style={{ opacity: 0.2 }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, fontSize: '14px' }}>{t.apparelStation}</div>
                <div style={{ fontSize: '10px', color: 'var(--accent-pink)', fontWeight: 'bold', marginTop: '4px' }}>{t.apparelDrop}</div>
              </div>
            </div>
          </div>

          <div className="apparel-gallery">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="apparel-item">
                {/* 增加 scale 确保移动时不会露出黑边，根据奇偶应用不同的滑动方向 */}
                <motion.img 
                  src={`/assets/APPAREL/${(i % 6) + 1}.png`} 
                  alt={`Apparel ${i}`} 
                  className="apparel-img"
                  style={{ 
                    y: i % 2 === 0 ? apparelY1 : apparelY2,
                    scale: 1.25 
                  }}
                />
                <div className="apparel-overlay">
                  <div className="apparel-id">ARCHIVE_ID_{String(i+1).padStart(3, '0')}</div>
                  <div className="apparel-glitch-text">{lang === 'en' ? `SYMBIOTE_${i+1}` : `共生体_构型_${i+1}`}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. BODY ART - 巨幅横向滚动特效 */}
        <section id="bodyart" className="bodyart-section">
          <div className="bodyart-header">
            <h2 className="font-syne laser-text uppercase" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>{t.bodyArtTitle}</h2>
            <div className="line"></div>
            <Scissors color="#FF1493" size={32} />
          </div>

          <div className="scroll-gallery-container">
            <motion.div className="scroll-track" style={{ x: moveLeft }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={`t1-${i}`} className="scroll-item">
                  <img src={`/assets/BODYART/${i}.jpg`} alt="Body Mod" />
                  <div style={{ position: 'absolute', top: 10, left: 10, fontSize: '10px', background: 'var(--accent-pink)', color: '#000', padding: '2px 6px', fontWeight: 900 }}>MOD_{i}</div>
                </div>
              ))}
            </motion.div>
            
            <motion.div className="scroll-track" style={{ x: moveRight }}>
              {[8, 7, 6, 5, 4, 3, 2, 1].map(i => (
                <div key={`t2-${i}`} className="scroll-item">
                  <img src={`/assets/BODYART/${i}.jpg`} alt="Body Mod" />
                  <div style={{ position: 'absolute', bottom: 10, right: 10, fontSize: '10px', border: '1px solid var(--accent-pink)', color: 'var(--accent-pink)', padding: '2px 6px', fontWeight: 900, background: 'rgba(0,0,0,0.5)' }}>FLESH_{i}</div>
                </div>
              ))}
            </motion.div>
          </div>
          <p style={{ marginTop: '5rem', textAlign: 'center', color: 'rgba(255,20,147,0.6)', fontSize: '12px', letterSpacing: '0.5em', fontWeight: 900 }}>{t.bodyArtMotto}</p>
        </section>

        {/* 5. DESIGN */}
        <section id="design" className="design-section">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
             <div>
                <h2 className="font-syne uppercase" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, color: '#fff', lineHeight: 0.9 }}>{t.designTitle}</h2>
                <h2 className="font-syne laser-text uppercase" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900 }}>{t.designSub}</h2>
             </div>
             <Palette size={64} style={{ opacity: 0.1, color: '#fff' }} />
           </div>

           <div className="design-grid">
              {[
                { img: "/assets/DESIGN/1.jpg", cls: "grid-item-1", lbl: "POSTER_MAIN" },
                { img: "/assets/DESIGN/2.jpg", cls: "grid-item-2", lbl: "VISUAL_IDENT" },
                { img: "/assets/DESIGN/3.jpg", cls: "grid-item-3", lbl: "GUITAR_DECAL" },
                { img: "/assets/DESIGN/4.jpg", cls: "grid-item-4", lbl: "NOISE_SYS" },
                { img: "/assets/DESIGN/5.jpg", cls: "grid-item-5", lbl: "ACID_BRUTAL" },
                { img: "/assets/DESIGN/6.jpg", cls: "grid-item-6", lbl: "FLESH_SYM" }
              ].map((item, i) => (
                <div key={i} className={`design-item ${item.cls}`}>
                  <img src={item.img} alt={item.lbl} />
                  <div className="design-label">{item.lbl}</div>
                </div>
              ))}
           </div>
        </section>

        {/* 6. CONTACT - 加入巨大化微信名片链接 */}
        <footer id="contact">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="font-syne laser-text uppercase" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 900 }}>{t.contactTitle}</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.4em', fontSize: '12px', marginTop: '1rem', fontWeight: 900 }}>// {t.contactSub}</p>
          </div>

          {/* 巨大的微信名片按钮 */}
          <a href="https://picui.ogmua.cn/s1/2026/03/29/69c91d0c0003d.webp" target="_blank" rel="noreferrer" className="wechat-hero-btn">
            <img src="https://picui.ogmua.cn/s1/2026/03/29/69c91d0c0003d.webp" alt="WeChat Business Card" />
            <div className="wechat-overlay">
              <span><QrCode size={48} style={{display:'inline', marginRight:'1rem', marginBottom:'-0.5rem'}}/>CONNECT WECHAT</span>
            </div>
          </a>

          <div className="social-matrix">
            <a href="#" target="_blank" rel="noreferrer" className="social-btn">
              <Share2 className="social-icon" />
              <span className="social-text">XIAOHONGSHU</span>
              <span className="social-sub">{lang === 'en' ? 'RED (小红书)' : '人彘娃娃_Official'}</span>
            </a>

            <a href="#" target="_blank" rel="noreferrer" className="social-btn">
              <MessageCircle className="social-icon" />
              <span className="social-text">WEIBO</span>
              <span className="social-sub">{lang === 'en' ? 'WEIBO (微博)' : '@人彘娃娃_Records'}</span>
            </a>
          </div>
          
          <div style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', fontSize: '10px', opacity: 0.3, fontWeight: 900 }}>
            <div style={{ letterSpacing: '0.1em' }}>{t.copyright}</div>
            <div style={{ display: 'flex', gap: '2rem', letterSpacing: '0.2em' }}>
              <span>PRIVACY</span><span>TERMS</span><span>ARCHIVE</span>
            </div>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: '-100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '-100%' }} transition={{ type: 'tween', duration: 0.3 }} className="mobile-menu font-syne uppercase">
            <X size={48} color="#FF1493" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', cursor: 'pointer' }} onClick={() => setMenuOpen(false)} />
            {t.nav.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={() => setMenuOpen(false)}>{s.name}</a>
            ))}
            <div style={{ marginTop: '2rem', fontSize: '12px', color: 'var(--accent-pink)', letterSpacing: '0.5em' }}>SYSTEM_ONLINE</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;