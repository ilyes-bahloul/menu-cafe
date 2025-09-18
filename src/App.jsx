import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';

// Associe chaque catégorie à une image de fond compressée (avec -min.png)
const images = [
  // Petit déjeuner
  'breackfast.jpg',
  // Café glacé
  '20250712_1421_Iced Coffee Menu_remix_01jzzcnwasety8pgkx9fxgdq65.png',
  // Café machine
  '20250712_1418_Coffee Menu Closeup_remix_01jzzcgx88ft4rqawf8z3xf10y-min.png',
  // Thé
  'the.jpg',
  // Avocatto
  '20250712_1438_Avocado Coffee Drink_remix_01jzzdmr4xfkcrrh341hq128sn-min.png',
  // Matcha
  '20250712_1436_Matcha Beverage Display_remix_01jzzdgdeaeht849b8edjcbsc9-min.png',
  // Nescafé
  '20250712_1427_Text-Free Coffee Image_remix_01jzzd00rjf1yrqharyb7zhms6-min.png',
  // Café latte
  '20250712_1424_Text-Free Coffee Menu_remix_01jzzctmbsfs1tzs4tyb19bedz-min.png',
  // Drink
  '20250712_1508_Soda Pouring Scene_remix_01jzzf7em7esmbvjjtfkmetkn5-min.png',
  // Mojito
  '20250712_1459_Mojito Cocktail Menu_remix_01jzzerjxaes6bk9baxqnaberj-min.png',
  // Pistachio
  'pistachio.jpg',
  // Milkshake
  '20250712_1432_Milkshake Menu_remix_01jzzd8x33f1sv54e1gwbqdbz1-min.png',
  // Smoothie
  '20250712_1447_Fruit Smoothie Menu_remix_01jzze2gcde948n6necjx22bg6-min.png',
  // Jus
  '20250712_1451_Smoothie Menu Display_remix_01jzze9kpvepyb2hfa06kbhk7n-min.png',
  // Fraputchino
  '20250712_1429_Frappuccino Delight_remix_01jzzd4gr8fyvr1mnsafk1rke8-min.png',
  // Bubble-yoyo-stick
  'bubble.jpg',
  // Paincackes
  '20250712_1512_Textless Pancake Menu_remix_01jzzffevyfe29cm4dg18evc00-min.png',
  // Pain perdu
  'painperdu.jpg',
  // Crêpe
  'crepe.jpg',
  // Crêpe salé
  '20250712_1551_Text-Free Crepe Menu_remix_01jzzhs6xteh3tt2cvd1cerped-min.png',
  // Gaufre
  '20250712_1516_Waffle Plate Delight_remix_01jzzfq7q1edmah7njt249nea6-min.png',
  // Omelette
  '20250712_1554_Omelette and Bread_remix_01jzzhyf9wfyrtmt2ardkx6se6-min.png'

];

function getEncodedImageUrl(filename) {
  // Encode chaque partie séparément pour éviter les problèmes avec les slashs
  return '/' + filename.split('/').map(encodeURIComponent).join('/');
}

function Logo({ isHome = false }) {
  const logoSrc = isHome ? "/logohome.png" : "/logo.png";
  return (
    <div className="logo-container">
      <img src={logoSrc} alt="Logo" className="main-logo" />
    </div>
  );
}

function MenuPage({ menu, category, bgImage }) {
  const navigate = useNavigate();
  if (!menu[category]) return <div>Catégorie introuvable.</div>;
  return (
    <div className="menu-bg" style={{backgroundImage: `url(${getEncodedImageUrl(bgImage)})`}}>
      <div className="menu-overlay">
        <Logo />
        <h1 className="menu-title">{category}</h1>
        <div className="menu-list">
          {menu[category].map((item, idx) => (
            <div className="menu-item" key={idx}>
              <span className="item-name">{item.item}</span>
              <span className="item-price">{item.price}</span>
            </div>
          ))}
        </div>
        <div className="menu-nav">
          <button onClick={() => navigate(-1)}>Retour</button>
        </div>
      </div>
    </div>
  );
}

function Home({ menu }) {
  const categories = Object.keys(menu);
  return (
    <div className="home-bg">
      <Logo isHome={true} />
      <h1 className="home-title">PAPOTER COFFEE SHOP</h1>
      <div className="category-list">
        {categories.map((cat, idx) => (
          <Link className="category-link" to={`/menu/${encodeURIComponent(cat)}`} key={cat}>
            <div className="category-card" style={{backgroundImage: `url(${getEncodedImageUrl(images[idx % images.length])})`}}>
              <span>{cat}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/menu.json')
      .then(res => res.json())
      .then(data => { setMenu(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <div>Chargement du menu...</div>;
  if (error) return <div>Erreur : {error}</div>;

  const categories = Object.keys(menu);

  return (
      <Routes>
        <Route path="/" element={<Home menu={menu} />} />
        <Route path="/menu/:category" element={
          <CategoryWrapper menu={menu} categories={categories} />
        } />
      </Routes>
  );
}

function CategoryWrapper({ menu, categories }) {
  const { category } = useParams();
  const idx = categories.findIndex(cat => cat === category);
  const bgImage = images[idx % images.length];
  return <MenuPage menu={menu} category={category} bgImage={bgImage} />;
}

export default App;
