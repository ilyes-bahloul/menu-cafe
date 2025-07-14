import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';

// Associe chaque catégorie à une image de fond compressée (avec -min.png)
const images = [
  '20250712_1608_Spinach Quiche Close-up_remix_01jzzjrw1tfy79f3f6s98cy1j2-min.png',
  '20250712_1605_Toasted Sandwich Delight_remix_01jzzjm242fp39tk7tdwvhgy9v-min.png',
  '20250712_1602_Text-Free Croissant Display_remix_01jzzjdw59fpzag8f0akvhsev0-min.png',
  '20250712_1559_Grilled Cheese Sandwich_remix_01jzzj8yyweqts3bh37rq97sbw-min.png',
  '20250712_1557_Panini Menu Display_remix_01jzzj3gt4f58t058adk46abvk-min.png',
  '20250712_1554_Omelette and Bread_remix_01jzzhyf9wfyrtmt2ardkx6se6-min.png',
  '20250712_1551_Text-Free Crepe Menu_remix_01jzzhs6xteh3tt2cvd1cerped-min.png',
  '20250712_1548_Chocolate Drizzled Crêpes_remix_01jzzhkzcmerx8qhz4vc9enc0y-min.png',
  '20250712_1525_Waffle Dessert Menu_remix_01jzzg7pc6eecardjmffxyj3my-min.png',
  
  '20250712_1516_Waffle Plate Delight_remix_01jzzfq7q1edmah7njt249nea6-min.png',
  '20250712_1521_Chocolate Fondant Delight_remix_01jzzfz3f4ff2rnxd842f8fgm0-min.png',
  '20250712_1512_Textless Pancake Menu_remix_01jzzffevyfe29cm4dg18evc00-min.png',
  '20250712_1508_Soda Pouring Scene_remix_01jzzf7em7esmbvjjtfkmetkn5-min.png',
  '20250712_1503_Iced Tea Menu_remix_01jzzezrrgf4c896mkgzf41aea-min.png',
  '20250712_1459_Mojito Cocktail Menu_remix_01jzzerjxaes6bk9baxqnaberj-min.png',
  '20250712_1451_Smoothie Menu Display_remix_01jzze9kpvepyb2hfa06kbhk7n-min.png',
  '20250712_1447_Fruit Smoothie Menu_remix_01jzze2gcde948n6necjx22bg6-min.png',
  '20250712_1440_Bubble Coffee Menu_remix_01jzzdrzwree9bt93r1nczwfw3-min.png',
  '20250712_1438_Avocado Coffee Drink_remix_01jzzdmr4xfkcrrh341hq128sn-min.png',
  '20250712_1436_Matcha Beverage Display_remix_01jzzdgdeaeht849b8edjcbsc9-min.png',
  '20250712_1432_Milkshake Menu_remix_01jzzd8x33f1sv54e1gwbqdbz1-min.png',
  '20250712_1429_Frappuccino Delight_remix_01jzzd4gr8fyvr1mnsafk1rke8-min.png',
  '20250712_1427_Text-Free Coffee Image_remix_01jzzd00rjf1yrqharyb7zhms6-min.png',
  '20250712_1424_Text-Free Coffee Menu_remix_01jzzctmbsfs1tzs4tyb19bedz-min.png',
  '20250712_1421_Iced Coffee Menu_remix_01jzzcnwasety8pgkx9fxgdq65.png',
  '20250712_1418_Coffee Menu Closeup_remix_01jzzcgx88ft4rqawf8z3xf10y-min.png',
  '20250712_1416_Whipped Cream Close-up_remix_01jzzcc79pekasrg3ktws0qt8d-min.png',
  '20250712_1413_Coffee Shop Menu_remix_01jzzc7cbkfy8bvn0gh4daerkd-min.png',
 


];

function getEncodedImageUrl(filename) {
  // Encode chaque partie séparément pour éviter les problèmes avec les slashs
  return '/' + filename.split('/').map(encodeURIComponent).join('/');
}

function MenuPage({ menu, category, bgImage }) {
  const navigate = useNavigate();
  if (!menu[category]) return <div>Catégorie introuvable.</div>;
  return (
    <div className="menu-bg" style={{backgroundImage: `url(${getEncodedImageUrl(bgImage)})`}}>
      <div className="menu-overlay">
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
