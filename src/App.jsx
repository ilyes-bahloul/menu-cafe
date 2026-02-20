import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';

// Associe chaque catégorie à une image de fond compressée (avec -min.png)
const images = [
  // Brunch (position 0)
  'breackfast.jpg',
  // Burger (position 1 - slot 2)
  'burger.jpg',
  // Salades (position 2 - slot 3)
  'salade.jpg',
  // Crêpes salées (position 3 - slot 4)
  'crepe sale.jpg',
  // Crêpes sucrées (position 4)
  'crepe.jpg',
  // Café (position 5)
  '20250712_1418_Coffee Menu Closeup_remix_01jzzcgx88ft4rqawf8z3xf10y-min.png',
  // Thé (position 6)
  'the.jpg',
  // iced coffee
  'icedcoffe.png',
  // iced tea
  'iced-tea.jpg',
  // affogato
  'affogato.jpg',
  // vagary coffee
  '20250712_1424_Text-Free Coffee Menu_remix_01jzzctmbsfs1tzs4tyb19bedz-min.png',
  // chocolat chaude
  'chocolat-chaude.jpg',
  // infusion
  'infusion.jpg',
  // drinks
  'soda.png',
  // matcha
  'matcha.png',

  // Smoothie
  '20250712_1447_Fruit Smoothie Menu_remix_01jzze2gcde948n6necjx22bg6-min.png',
  // Jus
  '20250712_1451_Smoothie Menu Display_remix_01jzze9kpvepyb2hfa06kbhk7n-min.png',
  // Fraputchino
  '20250712_1429_Frappuccino Delight_remix_01jzzd4gr8fyvr1mnsafk1rke8-min.png',
  // Bubble-yoyo-stick
  'detox.jpg',
  // Paincackes
  'mojito.png',
 

];

function getEncodedImageUrl(filename) {
  // Encode chaque partie séparément pour éviter les problèmes avec les slashs
  return '/' + filename.split('/').map(encodeURIComponent).join('/');
}

function Logo({ isHome = false, logoSrc = "/vagary-logo.png" }) {
  return (
    <div className="logo-container">
      <img src={logoSrc} alt="Vagary Logo" className="main-logo" />
    </div>
  );
}

function MenuPage({ menu, category, bgImage }) {
  const navigate = useNavigate();
  if (!menu[category]) return <div>Catégorie introuvable.</div>;
  const bgImageUrl = getEncodedImageUrl(bgImage);
  return (
    <div className="menu-bg" style={{'--bg-image': `url(${bgImageUrl})`, backgroundImage: `url(${bgImageUrl})`}}>
      <div className="menu-overlay">
        <Logo />
        <h1 className="menu-title">{category}</h1>
        <div className="menu-list">
          {menu[category].map((item, idx) => (
            <div className="menu-item" key={idx}>
              <div className="item-top">
                <span className="item-name">{item.item}</span>
                <span className="item-price">{item.price}</span>
              </div>
              {item.ingredients && item.ingredients.length > 0 && (
                <div className="ingredients-list">
                  {item.ingredients.map((ingredient, ingIdx) => (
                    <span key={ingIdx} className="ingredient-tag">
                      {ingredient}
                    </span>
                  ))}
                </div>
              )}
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

function Welcome() {
  return (
    <div className="welcome-screen">
      <div className="welcome-bg" />
      <div className="welcome-content">
        <header className="welcome-header">
          <img src="/motif welcome@3x.png" alt="" className="welcome-motif" />
        </header>
        <div className="welcome-cta">
          <div className="welcome-ramathan-wrap">
            <img src="/ramathan.png" alt="" className="welcome-ramathan" />
          </div>
          <Link to="/home" className="welcome-btn">Voir le menu</Link>
        </div>
        <footer className="welcome-footer">
          <Logo logoSrc="/goldenlogo.png" />
        </footer>
      </div>
    </div>
  );
}

function Home({ menu }) {
  const categories = Object.keys(menu);
  return (
    <div className="home-bg">
      <Logo isHome={true} />
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
    fetch('/menu-vagary.json')
      .then(res => res.json())
      .then(data => { setMenu(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <div>Chargement du menu...</div>;
  if (error) return <div>Erreur : {error}</div>;

  const categories = Object.keys(menu);

  return (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home menu={menu} />} />
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
