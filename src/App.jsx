import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';

// L'image de chaque catégorie vient maintenant du JSON (clé "image"),
// plus d'association par position : ajouter ou déplacer une catégorie
// ne décale plus les visuels.
function imageUrl(filename) {
  if (!filename) return null;
  return '/' + filename.split('/').map(encodeURIComponent).join('/');
}

function Ornament({ className = '' }) {
  return (
    <svg className={`ornament ${className}`} viewBox="0 0 120 12" aria-hidden="true">
      <path d="M0 6h44" />
      <path d="M76 6h44" />
      <path d="M60 1.5 64.5 6 60 10.5 55.5 6z" />
    </svg>
  );
}

function Price({ value }) {
  return <span className="item-price">{value}</span>;
}

function MenuItem({ entry }) {
  const hasIngredients = entry.ingredients && entry.ingredients.length > 0;
  return (
    <li className="menu-item">
      <div className="item-top">
        <span className="item-name">{entry.item}</span>
        <span className="item-leader" aria-hidden="true" />
        <Price value={entry.price} />
      </div>
      {hasIngredients && (
        <p className="item-ingredients">{entry.ingredients.join(' · ')}</p>
      )}
    </li>
  );
}

function MenuPage({ menu }) {
  const { category } = useParams();
  const navigate = useNavigate();
  const section = menu[category];

  if (!section) {
    return (
      <div className="page page--empty">
        <p>Catégorie introuvable.</p>
        <Link className="btn-ghost" to="/home">Retour au menu</Link>
      </div>
    );
  }

  const hero = imageUrl(section.image);

  return (
    <div className="page menu-page">
      {hero && (
        <div className="menu-hero">
          <img src={hero} alt="" className="menu-hero-img" loading="eager" />
          <div className="menu-hero-veil" />
          <button className="btn-back" onClick={() => navigate(-1)} aria-label="Retour">
            <span aria-hidden="true">←</span>
          </button>
          <div className="menu-hero-title">
            <Ornament />
            <h1>{category}</h1>
          </div>
        </div>
      )}

      <div className="menu-sheet">
        <ul className="menu-list">
          {section.items.map((entry, idx) => (
            <MenuItem entry={entry} key={`${entry.item}-${idx}`} />
          ))}
        </ul>

        {section.supplements && (
          <section className="supplements">
            <h2 className="supplements-title">{section.supplements.title}</h2>
            <ul className="menu-list menu-list--compact">
              {section.supplements.items.map((entry, idx) => (
                <MenuItem entry={entry} key={`supp-${entry.item}-${idx}`} />
              ))}
            </ul>
          </section>
        )}

        <Link className="btn-ghost" to="/home">Toutes les catégories</Link>
      </div>
    </div>
  );
}

function Welcome() {
  return (
    <div className="page welcome">
      <div className="welcome-inner">
        <img src="/motif welcome@3x.png" alt="" className="welcome-motif" />
        <h1 className="welcome-name">VAGARY</h1>
        <p className="welcome-tagline">Le temps d'un caprice</p>
        <Ornament className="ornament--welcome" />
        <Link to="/home" className="btn-gold">Voir le menu</Link>
      </div>
    </div>
  );
}

function Home({ menu }) {
  const categories = Object.keys(menu);
  return (
    <div className="page home">
      <header className="home-header">
        <img src="/goldenlogo.png" alt="Vagary" className="home-logo" />
        <Ornament />
      </header>

      <ul className="category-grid">
        {categories.map((cat) => {
          const section = menu[cat];
          const count = section.items.length;
          return (
            <li key={cat}>
              <Link className="category-card" to={`/menu/${encodeURIComponent(cat)}`}>
                <img
                  src={imageUrl(section.image)}
                  alt=""
                  className="category-img"
                  loading="lazy"
                />
                <span className="category-veil" />
                <span className="category-text">
                  <span className="category-name">{cat}</span>
                  <span className="category-count">{count} articles</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <footer className="home-footer">
        <Ornament />
        <p>Le temps d'un caprice</p>
      </footer>
    </div>
  );
}

function App() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/menu-vagary.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Menu indisponible (${res.status})`);
        return res.json();
      })
      .then(setMenu)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="page page--empty"><p>Erreur : {error}</p></div>;
  }

  if (!menu) {
    return (
      <div className="page page--empty">
        <div className="loader" aria-label="Chargement du menu" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/home" element={<Home menu={menu} />} />
      <Route path="/menu/:category" element={<MenuPage menu={menu} />} />
    </Routes>
  );
}

export default App;
