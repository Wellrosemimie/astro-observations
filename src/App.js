import React, { useState, useEffect } from 'react';
import './App.css';

// Catalogue Messier simplifié (extrait)
const messierCatalog = [
  { id: 1, name: 'M1', type: 'Nébuleuse', info: 'Nébuleuse du Crabe', mythology: 'Supernova observée en 1054' },
  { id: 2, name: 'M2', type: 'Amas globulaire', info: 'Amas globulaire dans le Verseau', mythology: 'Découvert par Maraldi en 1746' },
  { id: 3, name: 'M3', type: 'Amas globulaire', info: 'Amas globulaire dans les Chiens de Chasse', mythology: 'Découvert par Charles Messier en 1764' },
  { id: 4, name: 'M4', type: 'Amas globulaire', info: 'Amas globulaire près d’Antarès', mythology: 'Le plus proche amas globulaire' },
  { id: 5, name: 'M5', type: 'Amas globulaire', info: 'Amas globulaire dans le Serpent', mythology: 'Découvert par Gottfried Kirch en 1702' },
  // ... Ajoutez tous les objets jusqu'à M110
];


function App() {
  // État des observations personnelles
  const [observations, setObservations] = useState(() => {
    // Charger depuis localStorage si existant
    const saved = localStorage.getItem('observations');
    return saved ? JSON.parse(saved) : [];
  });

  // État mode sombre
  const [darkMode, setDarkMode] = useState(false);

  // Formulaire observation
  const [form, setForm] = useState({
    photo: null,
    comment: '',
    date: '',
    type: 'Galaxie',
    messierId: '',
    keep: true,
    watermark: false,
  });

  // Sauvegarder observations dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('observations', JSON.stringify(observations));
  }, [observations]);

  // Gestion du changement dans le formulaire
  function handleFormChange(e) {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      if (files.length > 0) {
        // Lire la photo en base64 pour affichage simple
        const reader = new FileReader();
        reader.onload = () => {
          setForm(prev => ({ ...prev, photo: reader.result }));
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  // Ajouter une observation
  function addObservation(e) {
  e.preventDefault();
  try {
    if (!form.photo) {
      alert('Veuillez ajouter une photo.');
      return;
    }
    if (!form.date) {
      alert('Veuillez choisir une date.');
      return;
    }
    const newObs = {
      id: Date.now(),
      photo: form.photo,
      comment: form.comment,
      date: form.date,
      type: form.type,
      messierId: form.messierId,
      keep: form.keep,
      watermark: form.watermark,
    };
    setObservations(prev => [...prev, newObs]);
    // Reset form
    setForm({
      photo: null,
      comment: '',
      date: '',
      type: 'Galaxie',
      messierId: '',
      keep: true,
      watermark: false,
    });
    alert('Observation ajoutée avec succès !'); // Confirmation visuelle
  } catch (error) {
    alert('Erreur : ' + error.message); // Afficher l'erreur
  }
}

  // Filtrer observations par type
  const [filterType, setFilterType] = useState('Tous');

  const filteredObservations = observations.filter(obs => {
    if (filterType === 'Tous') return true;
    return obs.type === filterType;
  });

  // Basculer mode sombre
  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }

  // Ajouter filigrane simple (texte) sur photo (canvas)
  function addWatermark(photoBase64) {
    return photoBase64; // Pour simplifier, on ne modifie pas la photo ici
  }

  // Lien vers observations du mois (exemple simple)
  function observationsDuMois() {
    alert("Fonctionnalité à développer : afficher les objets visibles ce mois-ci.");
  }

  // Lien vers agenda (exemple simple)
  function ouvrirAgenda() {
    window.open('https://calendar.google.com', '_blank');
  }

  return (
    <div className={darkMode ? 'App dark' : 'App'}>
      <header>
        <h1>Observations Astronomiques du Ciel Profond</h1>
        <button onClick={toggleDarkMode}>
          {darkMode ? 'Mode Jour' : 'Mode Nuit'}
        </button>
      </header>

      <section className="form-section">
        <h2>Ajouter une observation</h2>
        <form onSubmit={addObservation}>
          <label>
            Photo (jpg/png) :
            <input type="file" accept="image/*" name="photo" onChange={handleFormChange} required />
          </label>
          {form.photo && (
            <img src={form.photo} alt="Prévisualisation" className="preview" />
          )}
          <label>
            Commentaire :
            <textarea name="comment" value={form.comment} onChange={handleFormChange} />
          </label>
          <label>
            Date d'observation :
            <input type="date" name="date" value={form.date} onChange={handleFormChange} required />
          </label>
          <label>
            Type d'objet :
            <select name="type" value={form.type} onChange={handleFormChange}>
              <option>Galaxie</option>
              <option>Nébuleuse</option>
              <option>Amas</option>
              <option>Autre</option>
            </select>
          </label>
          <label>
            Objet Messier (optionnel) :
            <select name="messierId" value={form.messierId} onChange={handleFormChange}>
              <option value="">Aucun</option>
              {messierCatalog.map(obj => (
                <option key={obj.id} value={obj.id}>{obj.name} - {obj.info}</option>
              ))}
            </select>
          </label>
          <label>
            <input type="checkbox" name="keep" checked={form.keep} onChange={handleFormChange} />
            Garder cette observation
          </label>
          <label>
            <input type="checkbox" name="watermark" checked={form.watermark} onChange={handleFormChange} />
            Ajouter un filigrane (non fonctionnel ici)
          </label>
          <button type="submit">Ajouter</button>
        </form>
      </section>

      <section className="catalog-section">
        <h2>Catalogue Messier</h2>
        <ul>
          {messierCatalog.map(obj => (
            <li key={obj.id}>
              <strong>{obj.name}</strong> ({obj.type}) - {obj.info}
              <br />
              <em>{obj.mythology}</em>
              <br />
              {/* Photos officielles simples avec lien Wikipedia */}
              <a href={`https://fr.wikipedia.org/wiki/${obj.name}`} target="_blank" rel="noreferrer">
                Voir sur Wikipédia
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="observations-section">
        <h2>Mes Observations</h2>
        <label>
          Filtrer par type :
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option>Tous</option>
            <option>Galaxie</option>
            <option>Nébuleuse</option>
            <option>Amas</option>
            <option>Autre</option>
          </select>
        </label>
        <ul className="observations-list">
          {filteredObservations.length === 0 && <p>Aucune observation.</p>}
          {filteredObservations.map(obs => (
            <li key={obs.id} className="observation-item">
              <img src={obs.photo} alt="Observation" className="obs-photo" />
              <div>
                <p><strong>Date :</strong> {obs.date}</p>
                <p><strong>Type :</strong> {obs.type}</p>
                <p><strong>Commentaire :</strong> {obs.comment || 'Aucun'}</p>
                <p><strong>Garder :</strong> {obs.keep ? 'Oui' : 'Non'}</p>
                <p><strong>Filigrane :</strong> {obs.watermark ? 'Oui' : 'Non'}</p>
                {obs.messierId && (
                  <p><strong>Objet Messier :</strong> {messierCatalog.find(o => o.id === +obs.messierId)?.name || 'Inconnu'}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="links-section">
        <button onClick={observationsDuMois}>Observations possibles du mois</button>
        <button onClick={ouvrirAgenda}>Ouvrir mon agenda</button>
      </section>

      <footer>
        <p>Application créée par vous - Bonnes observations !</p>
      </footer>
    </div>
  );
}

export default App;
