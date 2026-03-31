import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Skull, Menu, X, ShoppingBag, Scissors, Palette, MessageCircle, Share2, QrCode, Camera } from 'lucide-react';

const noiseSvg = `data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E`;

const Metallic3DScene = () => {
  const mountRef = useRef(null);
  const [canRun, setCanRun] = useState(false);

  useEffect(() => {
    setCanRun(true);
  }, []);

  useEffect(() => {
    if (!canRun || typeof window === 'undefined') return;

    import('three').then(THREE => {
      const scene = new THREE.Scene();
      const aspect = window.innerWidth / window.innerHeight;
      const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
      camera.position.z = 35;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

      const chromeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaaa, metalness: 1.0, roughness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.1,
      });

      const knotGeo = new THREE.TorusKnotGeometry(12, 1.8, 256, 32, 4, 7);
      const mainKnot = new THREE.Mesh(knotGeo, chromeMaterial);
      scene.add(mainKnot);

      const shards = [];
      for (let i = 0; i < 15; i++) {
        const shardGeo = new THREE.IcosahedronGeometry(Math.random() * 1.2 + 0.4, 0);
        const shard = new THREE.Mesh(shardGeo, chromeMaterial);
        shard.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 25 - 10);
        scene.add(shard);
        shards.push({ mesh: shard, speed: Math.random() * 0.01 + 0.005 });
      }

      const pinkLight = new THREE.DirectionalLight(0xFF1493, 4);
      pinkLight.position.set(10, 10, 15);
      scene.add(pinkLight);
      const whiteLight = new THREE.DirectionalLight(0xffffff, 2.5);
      whiteLight.position.set(-15, -10, 10);
      scene.add(whiteLight);

      const animate = () => {
        requestAnimationFrame(animate);
        mainKnot.rotation.x += 0.001;
        mainKnot.rotation.y += 0.002;
        shards.forEach(s => { s.mesh.rotation.x += s.speed; s.mesh.rotation.y += s.speed; });
        pinkLight.position.x = Math.sin(Date.now() * 0.001) * 15;
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
        renderer.dispose();
      };
    });
  }, [canRun]);

  return <div ref={mountRef} className="three-background" />;
};

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll();
  const apparelY1 = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const apparelY2 = useTransform(scrollYProgress, [0, 1], ['15%', '-15%']);

  const masterRef = useRef(null);
  const { scrollYProgress: masterProgress } = useScroll({
    target: masterRef, offset: ["start 70%", "end end"]
  });
  const masterBrightness = useTransform(masterProgress, [0, 1], [0.3, 1.2]);
  const particleY = useTransform(masterProgress, [0, 1], [0, 300]);
  const particleOpacity = useTransform(masterProgress, [0, 0.5, 1], [0, 1, 0.2]);

  const tag1Opacity = useTransform(masterProgress, [0.05, 0.2], [0, 1]);
  const tag2Opacity = useTransform(masterProgress, [0.15, 0.35], [0, 1]);
  const tag3Opacity = useTransform(masterProgress, [0.3, 0.5], [0, 1]);
  const tag4Opacity = useTransform(masterProgress, [0.45, 0.65], [0, 1]);
  const tag5Opacity = useTransform(masterProgress, [0.6, 0.85], [0, 1]);
  const tagOpacities = [tag1Opacity, tag2Opacity, tag3Opacity, tag4Opacity, tag5Opacity];

  const tagX = (opacity) => useTransform(opacity, o => (1 - o) * -10);
  const tagScale = (opacity) => useTransform(opacity, o => 0.8 + o * 0.2);
  const tagRotate = (opacity) => useTransform(opacity, o => (1 - o) * -2 + 'deg');

  const designRef = useRef(null);
  const { scrollYProgress: designProgress } = useScroll({
    target: designRef, offset: ["start 60%", "end 40%"]
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const translations = {
    en: {
      brand: "DECAPITATED DOLL RECORDS",
      status: "INTERNATIONAL GRINDCORE METAL BAND MERCHANDISE LABEL",
      slogan: "Curating Uncomfortable Order, Reshaping the Cold Manifesto of Flesh.",
      subSlogan: "INT'L BRUTAL MERCH LABEL OWNER | TATTOO ARTIST | SCARIFICATION ARTIST | GRAPHIC DESIGNER | LARRY WANG'S MAINLAND MGR",
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
      bodyArtTitle: "FLESH\nARTWORKS",
      bodyArtMotto: "PAIN_IS_TRUTH // THE ONLY REALITY",
      designTitle: "VISUAL",
      designSub: "STATIC_DECAY",
      contactTitle: "CONNECT",
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
      bodyArtTitle: "身体\n艺术作品",
      bodyArtMotto: "疼痛是唯一的真实 // PAIN_IS_TRUTH",
      designTitle: "平面",
      designSub: "静态腐烂",
      contactTitle: "CONNECT",
      contactSub: "社交媒体矩阵",
      copyright: "© MMXXIV 人彘娃娃  RECORDS // 系统在线",
      tags: ["国际残酷周边厂牌主理人", "刺青师", "割皮师", "平面设计师", "LarryWang大陆经纪人"]
    }
  };

  const t = translations[lang];

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // 修改：大幅拉长纵向间距 (top 值)
  const designItemsConfig = [
    { width: 210, top: '0%', left: '2%', rotate: -8 },
    { width: 240, top: '18%', left: '15%', rotate: 5 },
    { width: 180, top: '36%', left: '30%', rotate: -3 },
    { width: 225, top: '54%', left: '5%', rotate: 6 },
    { width: 195, top: '72%', left: '20%', rotate: -5 },
    { width: 165, top: '90%', left: '35%', rotate: 2 },
    { width: 217, top: '108%', left: '3%', rotate: -4 },
    { width: 187, top: '126%', left: '18%', rotate: 7 },
    { width: 232, top: '144%', left: '32%', rotate: -2 },
  ];

  const getMasterImg = () => 'https://picui.ogmua.cn/s1/2026/03/30/69ca4377e4dd7.webp';

  const getApparelImg = (i) => {
    const list = [
      "https://picui.ogmua.cn/s1/2026/03/30/69ca43b331b95.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca43bd2c56a.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca43bf405e5.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca43c23190d.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca43c94f6b0.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca440712b66.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca44113e4e5.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca4414195df.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca4416a36bf.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca442062745.webp"
    ];
    return list[i % list.length];
  };

  const getBodyArtImg = (i) => {
    const list = [
      "https://picui.ogmua.cn/s1/2026/03/30/69ca425d40eca.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca425e87a2c.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca426245739.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca425f5b031.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca425f5b031.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca42fbb22d4.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca42fd5a58b.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca42ffed39f.webp"
    ];
    return list[i % list.length];
  };

  const getDesignImg = (i) => {
    const list = [
      "https://picui.ogmua.cn/s1/2026/03/30/69ca4301a0ec1.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca4301eb635.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca432be993e.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca432be993e.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca4334eb61f.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca4334e899b.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca4335d3d7f.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca43676425a.webp",
      "https://picui.ogmua.cn/s1/2026/03/30/69ca4372ce8b6.webp"
    ];
    return list[i % list.length];
  };

  // 辅助：阻止长按菜单的通用处理
  const preventLongPressMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="main-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=JetBrains+Mono:wght@100;40;800&display=swap');
        :root {
          --bg-black: #050505;
          --accent-pink: #FF1493;
          --accent-magenta: #FF69B4;
          --text-gray: #E0E0E0;
          --syne: 'Syne', sans-serif;
          --mono: 'JetBrains Mono', monospace;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg-black); color: var(--text-gray); font-family: var(--mono); overflow-x: hidden; cursor: none; }
        ::selection { background: var(--accent-pink); color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg-black); }
        ::-webkit-scrollbar-thumb { background: var(--accent-pink); }
        
        /* 防止整体横向滚动 */
        .main-container { min-height: 100vh; position: relative; overflow-x: hidden; width: 100%; max-width: 100vw; }
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
          background: linear-gradient(90deg, #E0E0E0 0%, var(--accent-pink) 25%, #FFF 50%, var(--accent-magenta) 75%, #E0E0E0 100%);
          background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: laser-move 4s linear infinite; text-shadow: 0 0 20px rgba(255,20,147,0.5);
        }
        @keyframes laser-move { to { background-position: 200% center; } }
        
        .cursor-dot {
          position: fixed; width: 6px; height: 6px; background: #fff; border-radius: 50%;
          transform: translate(-50%, -50%); pointer-events: none; z-index: 500; mix-blend-mode: difference;
        }
        .cursor-cross {
          position: fixed; width: 40px; height: 40px; border: 1px solid var(--accent-pink);
          transform: translate(-50%, -50%); pointer-events: none; z-index: 499;
          box-shadow: 0 0 10px rgba(255,20,147,0.4); transition: width 0.2s, height 0.2s;
        }
        a:hover ~ .cursor-cross, button:hover ~ .cursor-cross { width: 60px; height: 60px; background: rgba(255,20,147,0.15); }
        @media (max-width: 768px) {
          body { cursor: auto; }
          .cursor-dot, .cursor-cross { display: none !important; }
        }

        header {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 300;
          border-bottom: 1px solid rgba(255,255,255,0.05); padding: 1.5rem 2rem;
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(20px);
        }
        .header-logo { display: flex; align-items: center; gap: 0.75rem; font-weight: 900; font-size: clamp(1rem,2vw,1.25rem); }
        .logo-box { min-width: 32px; height: 32px; border: 1px solid var(--accent-pink); display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; box-shadow:0 0 15px rgba(255,20,147,0.6); } 50% { opacity:0.5; box-shadow:none; } }
        nav.desktop-nav { display: none; gap: 2rem; font-size: 10px; letter-spacing: 0.2em; font-weight: 900; }
        nav.desktop-nav a { text-decoration: none; color: inherit; transition: 0.3s; }
        nav.desktop-nav a:hover { color: var(--accent-pink); text-shadow: 0 0 8px var(--accent-pink); }
        @media (min-width: 1024px) { nav.desktop-nav { display: flex; } }
        .fixed-menu-btn {
          position: fixed; top: 1.5rem; right: 2rem; z-index: 301;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);
          border: 1px solid rgba(255,20,147,0.3); padding: 8px; cursor: pointer;
          transition: 0.3s;
        }
        .fixed-menu-btn:hover { background: rgba(255,20,147,0.2); box-shadow: 0 0 15px rgba(255,20,147,0.5); }
        section { position: relative; z-index: 10; overflow: hidden; }
        .hero-section { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 6rem 5% 0; }
        @media (min-width:768px) { .hero-section { padding-left:10%; padding-right:10%; } }
        .status-tag { color: var(--accent-pink); font-size:10px; font-weight:900; letter-spacing:0.5em; margin-bottom:1rem; font-style:italic; }
        @media (min-width:768px) { .status-tag { font-size:12px; letter-spacing:0.8em; } }
        .hero-title { font-size: clamp(3rem,12vw,12rem); line-height:0.85; letter-spacing:-0.05em; font-weight:900; font-style:italic; margin-bottom:2rem; }
        .hero-title span { display:block; }
        .hero-title .dim { color:rgba(255,255,255,0.1); margin-top:-0.5rem; text-shadow:none; }
        .hero-quote { max-width:600px; border-left:4px solid var(--accent-pink); padding-left:1.5rem; margin:1rem 0; }
        .hero-quote p.main { font-size: clamp(1rem,4vw,1.5rem); font-weight:900; font-style:italic; color:#fff; line-height:1.3; margin-bottom:1rem; }
        .hero-quote p.sub { font-size:10px; color:rgba(255,255,255,0.4); letter-spacing:0.2em; line-height:1.6; }
        .master-section {
          padding:6rem 5%; display:grid; grid-template-columns:1fr; gap:4rem; align-items:start; place-items:center;
        }
        @media (min-width:1024px) { .master-section { padding:10rem 10%; gap:6rem; } }
        .chrome-card {
          background:linear-gradient(135deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0) 100%);
          border:1px solid rgba(255,255,255,0.1); backdrop-filter:blur(10px); position:relative; overflow:hidden;
        }
        
        /* 已修改：主理人照片宽度固定为 95% */
        .master-portrait {
          aspect-ratio:3/4; border:1px solid rgba(255,20,147,0.4); position:relative;
          width: 95%; margin:0 auto;
        }
        
        .master-portrait img { width:100%; height:100%; object-fit:cover; object-position:center; }
        .pink-particle { position:absolute; background:var(--accent-pink); border-radius:50%; filter:blur(2px); box-shadow:0 0 10px var(--accent-pink); }
        .master-tag {
          position:absolute; bottom:3rem; right:-1rem; background:var(--accent-pink); color:#000;
          padding:0.5rem 1rem; font-weight:900; font-size:clamp(1.5rem,4vw,2.5rem); font-style:italic; transform:rotate(-3deg); z-index:10;
        }
        .tag-list {
          position:absolute; z-index:20; bottom:18%; left:0; width:auto; display:flex;
          flex-direction:column; gap:0.4rem; padding:0; margin:0;
        }
        .tag-item {
          font-size:16px; font-weight:900; color:#fff; padding:0.5rem 0.6rem; padding-left:0.2rem; margin:0;
          border-left:none; background:linear-gradient(to right,rgba(0,0,0,0.1),rgba(0,0,0,0.7));
          white-space:nowrap; max-width:100%;
        }
        .apparel-section { padding:8rem 0; background:#fff; color:#000; overflow:hidden; }
        .apparel-header { padding:0 5%; margin-bottom:3rem; display:flex; flex-direction:column; gap:1rem; }
        @media (min-width:768px) { .apparel-header { padding:0 10%; flex-direction:row; justify-content:space-between; align-items:flex-end; margin-bottom:5rem; } }
        .apparel-title { font-size:clamp(3rem,10vw,8rem); line-height:0.9; font-weight:900; text-transform:uppercase; }
        .text-stroke-pink { -webkit-text-stroke:1px #000; color:transparent; }
        @media (min-width:768px) { .text-stroke-pink { -webkit-text-stroke:2px #000; } }
        .apparel-gallery { display:grid; grid-template-columns:repeat(2,1fr); gap:2px; background:#000; }
        @media (min-width:768px) { .apparel-gallery { grid-template-columns:repeat(3,1fr); } }
        @media (min-width:1024px) { .apparel-gallery { grid-template-columns:repeat(4,1fr); } }
        .apparel-item { aspect-ratio:3/4; position:relative; overflow:hidden; background:#111; cursor:crosshair; }
        .apparel-img {
          width:100%; height:100%; object-fit:cover; transition:transform 0.6s cubic-bezier(0.25,1,0.5,1);
          filter:grayscale(0.5) contrast(0.6) saturate(0.4);
        }
        .apparel-item:hover .apparel-img { transform:scale(1.08) !important; filter:grayscale(0) contrast(1) saturate(1); }
        .apparel-overlay {
          position:absolute; inset:0; background:rgba(255,20,147,0.1); opacity:0;
          display:flex; flex-direction:column; justify-content:space-between; padding:1.5rem;
          transition:0.4s ease; border:2px solid transparent; pointer-events:none;
        }
        .apparel-item:hover .apparel-overlay { opacity:1; border-color:var(--accent-pink); background:rgba(0,0,0,0.3); }
        .apparel-glitch-text { color:#fff; font-weight:900; font-size:clamp(1rem,2vw,1.5rem); font-style:italic; text-transform:uppercase; }
        .apparel-id { color:var(--accent-pink); font-size:10px; font-weight:900; }
        .bodyart-section { padding:10rem 0; background:rgba(5,5,5,0.6); overflow:hidden; }
        .bodyart-header { padding:0 5%; margin-bottom:6rem; display:flex; align-items:center; gap:1rem; }
        @media (min-width:768px) { .bodyart-header { padding:0 10%; gap:1.5rem; } }
        .line { height:1px; flex:1; background:linear-gradient(90deg,transparent,var(--accent-pink)); }
        .scroll-gallery-container { display:flex; flex-direction:column; gap:3rem; width:100%; }
        
        /* 修改画廊滚动 CSS 配置，支持拖拽双持 */
        .scroll-track { display:flex; width:max-content; padding:0 5vw; }
        .drag-track { display:flex; gap:2.5rem; width:max-content; cursor:grab; }
        .drag-track:active { cursor:grabbing; }
        
        .scroll-item {
          width:280px; height:380px; flex-shrink:0; border:1px solid rgba(255,255,255,0.15);
          overflow:hidden; position:relative;
        }
        @media (min-width:768px) { .scroll-item { width:420px; height:520px; } }
        
        /* 修改：禁止长按触发系统菜单 (微信) */
        .scroll-item img { 
          width:100%; height:100%; object-fit:cover; 
          filter:grayscale(1) brightness(0.6); transition:0.5s; 
          pointer-events: auto;
          -webkit-touch-callout: none; /* iOS */
          -webkit-user-select: none;
          user-select: none;
        }
        .scroll-item:hover img { filter:grayscale(0) brightness(1.2); transform:scale(1.05); }
        .design-section { padding:12rem 5%; background:rgba(10,10,10,0.8); }
        @media (min-width:1024px) { .design-section { padding:12rem 10%; } }
        .design-irregular-container { position:relative; width:100%; min-height:180vh; margin-top:4rem; } /* 增加高度以适应更长的布局 */
        footer { padding:6rem 5% 4rem; border-top:1px solid rgba(255,20,147,0.3); background:#000; }
        @media (min-width:1024px) { footer { padding:10rem 10% 4rem; } }
        .wechat-hero-btn {
          position:relative; display:block; width:100%; max-width:600px; margin:0 auto 4rem;
          border:2px solid var(--accent-pink); overflow:hidden; border-radius:4px; transition:0.4s;
          box-shadow:0 0 20px rgba(255,20,147,0.2);
        }
        .wechat-hero-btn img { width:100%; height:auto; display:block; transition:0.5s; opacity:0.8; filter:grayscale(0.5); }
        .wechat-overlay {
          position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          background:rgba(0,0,0,0.4); backdrop-filter:blur(4px); transition:0.5s;
        }
        .wechat-overlay span {
          font-family:var(--syne); font-size:clamp(2rem,5vw,3rem); font-weight:900;
          color:#fff; text-shadow:0 0 15px var(--accent-pink); letter-spacing:0.1em; margin-left:1.5rem;
        }
        .wechat-hero-btn:hover img { transform:scale(1.05); opacity:1; filter:grayscale(0); }
        .wechat-hero-btn:hover .wechat-overlay { background:rgba(255,20,147,0.2); backdrop-filter:blur(0px); }
        .social-matrix { display:grid; grid-template-columns:1fr; gap:2rem; }
        @media (min-width:768px) { .social-matrix { grid-template-columns:repeat(3,1fr); } }
        .social-btn {
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem;
          padding:3rem 1rem; border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.02);
          text-decoration:none; color:#fff; transition:0.4s; position:relative; overflow:hidden;
        }
        .social-btn::before {
          content:''; position:absolute; top:0; left:-100%; width:100%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,20,147,0.3),transparent); transition:0.5s;
        }
        .social-btn:hover { border-color:var(--accent-pink); background:rgba(255,20,147,0.08); transform:translateY(-5px); }
        .social-btn:hover::before { left:100%; }
        .social-icon { width:32px; height:32px; color:var(--accent-pink); }
        .social-text { font-family:var(--syne); font-weight:900; font-size:1.5rem; letter-spacing:0.1em; }
        .social-sub { font-size:10px; color:rgba(255,255,255,0.4); letter-spacing:0.2em; }
        .mobile-menu {
          position:fixed; inset:0; z-index:500; background:rgba(0,0,0,0.95); backdrop-filter:blur(10px);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:2.5rem; font-size:2.5rem; font-family:var(--syne); font-weight:900;
        }
        .mobile-menu a { color:#fff; text-decoration:none; text-transform:uppercase; }
        .mobile-menu a:hover,.mobile-menu a:active { color:var(--accent-pink); }
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
        </div>
      </header>

      <div className="fixed-menu-btn" onClick={() => setMenuOpen(true)}>
        <Menu size={24} color="#FF1493" />
      </div>

      <main>
        <section id="hero" className="hero-section">
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
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

        <section id="master" className="master-section" ref={masterRef}>
          <div className="chrome-card master-portrait">
            <motion.img
              src={getMasterImg()}
              alt="Operator"
              style={{ filter: useTransform(masterBrightness, b => `brightness(${b}) grayscale(${1.2 - b})`) }}
            />
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
            <div className="tag-list">
              {t.tags.map((tag, index) => (
                <motion.div
                  key={index}
                  className="tag-item"
                  style={{
                    opacity: tagOpacities[index],
                    x: tagX(tagOpacities[index]),
                    scale: tagScale(tagOpacities[index]),
                    rotate: tagRotate(tagOpacities[index])
                  }}
                >
                  {tag}
                </motion.div>
              ))}
            </div>
            <div className="master-tag font-syne">
              {lang === 'en' ? 'OPERATOR' : '主理人'}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px', width: '100%' }}>
            <h2 className="font-syne laser-text uppercase" style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight:900 }}>{t.masterTitle}</h2>
            <div style={{ color: 'rgba(255,255,255,0.7)', lineHeight:1.8, fontSize:'14px' }}>
              <p style={{ marginBottom:'1.5rem' }}>{t.masterDesc1}</p>
              <p>{t.masterDesc2}</p>
            </div>
          </div>
        </section>

        {/* 锁链特效已完全移除 */}

        <section id="apparel" className="apparel-section">
          <div className="apparel-header">
            <h2 className="apparel-title font-syne">
              {t.apparelTitle}<br /><span className="text-stroke-pink">{t.apparelSub}</span>
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <ShoppingBag size={40} style={{ opacity:0.2 }} />
              <div style={{ textAlign:'right' }}>
                <div style={{ fontWeight:900, fontSize:'14px' }}>{t.apparelStation}</div>
                <div style={{ fontSize:'10px', color:'var(--accent-pink)', fontWeight:'bold', marginTop:'4px' }}>{t.apparelDrop}</div>
              </div>
            </div>
          </div>
          <div className="apparel-gallery">
            {Array.from({ length:12 }).map((_, i) => (
              <div key={i} className="apparel-item">
                <motion.img
                  src={getApparelImg(i)}
                  alt={`Apparel ${i}`}
                  className="apparel-img"
                  style={{ y: i%2===0 ? apparelY1 : apparelY2, scale:1.25, willChange: "transform" }}
                />
                <div className="apparel-overlay">
                  <div className="apparel-id">ARCHIVE_ID_{String(i+1).padStart(3,'0')}</div>
                  <div className="apparel-glitch-text">{lang === 'en' ? `SYMBIOTE_${i+1}` : `共生体_构型_${i+1}`}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="bodyart" className="bodyart-section">
          <div className="bodyart-header">
            <h2 className="font-syne laser-text uppercase" style={{ fontSize:'clamp(3rem,8vw,6rem)', fontWeight:900, fontStyle:'italic', margin:0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 0.9 }}>{t.bodyArtTitle}</h2>
            <div className="line"></div>
            <Scissors color="#FF1493" size={40} />
          </div>
          <div className="scroll-gallery-container">
            {/* 修改：三重独立无限横向滑动画廊 (移除视差绑定，增加拖拽自由度) */}
            
            {/* 第一行：正向无限流 */}
            <div className="scroll-track">
              <motion.div 
                drag="x" 
                dragConstraints={{ left: -6000, right: 0 }} // 扩大约束范围实现“无限”感
                dragElastic={0.2}
                className="drag-track"
              >
                {[...[1,2,3,4,5,6,7,8], ...[1,2,3,4,5,6,7,8]].map((i, idx) => (
                  <div key={`t1-${idx}`} className="scroll-item">
                    <img 
                      src={getBodyArtImg(i)} 
                      alt="Body Mod" 
                      onContextMenu={preventLongPressMenu}
                      onTouchStart={(e) => e.preventDefault()} // 激进阻止长按
                    />
                    <div style={{ position:'absolute', top:10, left:10, fontSize:'10px', background:'var(--accent-pink)', color:'#000', padding:'2px 6px', fontWeight:900 }}>MOD_{i}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* 第二行：反向无限流 */}
            <div className="scroll-track">
              <motion.div 
                drag="x" 
                dragConstraints={{ left: -6000, right: 0 }}
                dragElastic={0.2}
                className="drag-track"
              >
                {[...[8,7,6,5,4,3,2,1], ...[8,7,6,5,4,3,2,1]].map((i, idx) => (
                  <div key={`t2-${idx}`} className="scroll-item">
                    <img 
                      src={getBodyArtImg(i)} 
                      alt="Body Mod" 
                      onContextMenu={preventLongPressMenu}
                      onTouchStart={(e) => e.preventDefault()}
                    />
                    <div style={{ position:'absolute', top:10, right:10, fontSize:'10px', border:'1px solid var(--accent-pink)', color:'#fff', padding:'2px 6px', fontWeight:900, background:'rgba(0,0,0,0.5)' }}>FLESH_{i}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* 第三行：乱序无限流 */}
            <div className="scroll-track">
              <motion.div 
                drag="x" 
                dragConstraints={{ left: -6000, right: 0 }}
                dragElastic={0.2}
                className="drag-track"
              >
                {[...[1,3,5,7,2,4,6,8], ...[1,3,5,7,2,4,6,8]].map((i, idx) => (
                  <div key={`t3-${idx}`} className="scroll-item">
                    <img 
                      src={getBodyArtImg(i)} 
                      alt="Body Mod" 
                      onContextMenu={preventLongPressMenu}
                      onTouchStart={(e) => e.preventDefault()}
                    />
                    <div style={{ position:'absolute', bottom:10, left:10, fontSize:'10px', background:'#000', color:'var(--accent-pink)', padding:'2px 6px', fontWeight:900, border:'1px solid var(--accent-pink)' }}>ART_{i}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
          <p style={{ marginTop:'6rem', textAlign:'center', color:'rgba(255,20,147,0.6)', fontSize:'14px', letterSpacing:'0.5em', fontWeight:900 }}>{t.bodyArtMotto}</p>
        </section>

        <section id="design" className="design-section" ref={designRef}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <h2 className="font-syne uppercase" style={{ fontSize:'clamp(3rem,8vw,6rem)', fontWeight:900, color:'#fff', lineHeight:0.9 }}>{t.designTitle}</h2>
              <h2 className="font-syne laser-text uppercase" style={{ fontSize:'clamp(2rem,5vw,4rem)', fontWeight:900 }}>{t.designSub}</h2>
            </div>
            <Palette size={64} style={{ opacity:0.1, color:'#fff' }} />
          </div>
          <div className="design-irregular-container">
            {designItemsConfig.map((item, i) => {
              const opacity = useTransform(designProgress, [0.1,0.3,0.7,0.9], [0,1,1,0]);
              const y = useTransform(designProgress, [0,1], [60, 0]);
              return (
                <motion.div
                  key={i}
                  style={{
                    position:'absolute',
                    width:`${item.width}px`,
                    top:item.top,
                    left:item.left,
                    rotate:`${item.rotate}deg`,
                    opacity,
                    y,
                    zIndex:1,
                  }}
                  whileHover={{ scale:1.15, zIndex:50, rotate:0, transition:{duration:0.4} }}
                  className="design-item"
                >
                  <img
                    src={getDesignImg(i)}
                    alt={`DECAY_${i+1}`}
                    style={{
                      width:'100%',
                      height:'auto',
                      filter:'grayscale(0.8) brightness(0.7)',
                      border:'1px solid rgba(255,255,255,0.05)',
                      transition:'all 0.5s ease',
                      pointerEvents: 'auto',
                      WebkitTouchCallout: 'none',
                      userSelect: 'none',
                    }}
                    onContextMenu={preventLongPressMenu}
                    onMouseEnter={(e) => {
                      e.target.style.filter = 'grayscale(0) brightness(1.2)';
                      e.target.style.borderColor = 'var(--accent-pink)';
                      e.target.style.boxShadow = '0 0 25px rgba(255,20,147,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.filter = 'grayscale(0.8) brightness(0.7)';
                      e.target.style.borderColor = 'rgba(255,255,255,0.05)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </section>

        <footer id="contact">
          <div style={{ textAlign:'center', marginBottom:'4rem' }}>
            <h2 className="font-syne laser-text uppercase" style={{ fontSize:'clamp(3rem,8vw,5rem)', fontWeight:900, wordBreak: 'break-word' }}>{t.contactTitle}</h2>
            <p style={{ color:'rgba(255,255,255,0.4)', letterSpacing:'0.4em', fontSize:'12px', marginTop:'1rem', fontWeight:900 }}>// {t.contactSub}</p>
          </div>

          <a href="https://picui.ogmua.cn/s1/2026/03/29/69c91d0c0003d.webp" target="_blank" rel="noreferrer" className="wechat-hero-btn">
            <img src="https://picui.ogmua.cn/s1/2026/03/29/69c91d0c0003d.webp" alt="WeChat Business Card" />
            <div className="wechat-overlay">
              <span><QrCode size={48} style={{ display:'inline', marginRight:'1rem', marginBottom:'-0.5rem' }}/>CONNECT WECHAT</span>
            </div>
          </a>



          <div className="social-matrix">

            <a 
              href="https://www.xiaohongshu.com/user/profile/58d57ad250c4b45bd6b2409d?xsec_token=ABa18T2EvuDSoSwKOPftx8S4n-4_cFFXurd4iA8STbB_Y%3D&xsec_source=pc_search" 
              target="_blank" 
              rel="noreferrer" 
              className="social-btn"
            >
              <Share2 className="social-icon" />
              <span className="social-text">XIAOHONGSHU</span>
              <span className="social-sub">@彫七刺青&人彘娃娃Records</span>
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noreferrer" 
              className="social-btn"
            >
              <Camera className="social-icon" /> 
              <span className="social-text">INSTAGRAM</span>
              <span className="social-sub">@decapitated_doll</span>
            </a>

            <a 
              href="https://weibo.com/u/3535364641" 
              target="_blank" 
              rel="noreferrer" 
              className="social-btn"
            >
              <MessageCircle className="social-icon" />
              <span className="social-text">WEIBO</span>
              <span className="social-sub">@彫七刺青Meiousei</span>
            </a>
          </div>

          <div style={{
            marginTop:'6rem',
            paddingTop:'2rem',
            borderTop:'1px solid rgba(255,255,255,0.05)',
            display:'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent:'space-between',
            alignItems:'center',
            gap:'2rem',
            fontSize:'10px',
            opacity:0.3,
            fontWeight:900
          }}>
            <div style={{ letterSpacing:'0.1em' }}>{t.copyright}</div>
            <div style={{ display:'flex', gap:'2rem', letterSpacing:'0.2em' }}>
              <span>PRIVACY</span><span>TERMS</span><span>ARCHIVE</span>
            </div>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity:0, y:'-100%' }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:'-100%' }} transition={{ type:'tween', duration:0.3 }} className="mobile-menu font-syne uppercase">
            <X size={48} color="#FF1493" style={{ position:'absolute', top:'1.5rem', right:'1.5rem', cursor:'pointer' }} onClick={() => setMenuOpen(false)} />
            {t.nav.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={() => setMenuOpen(false)}>{s.name}</a>
            ))}
            <div style={{ marginTop:'2rem', fontSize:'12px', color:'var(--accent-pink)', letterSpacing:'0.5em' }}>SYSTEM_ONLINE</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;