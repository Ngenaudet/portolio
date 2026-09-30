/* Configuration publique uniquement. Ne jamais placer de clé secrète ici. */
window.SITE_CONFIG = {
  calendlyUrl: '', // Votre lien Calendly HTTPS confirmé.
  formUrl: '', // Votre lien Google Forms ou formulaire externe HTTPS confirmé.
  courses: {
    endpoint: '', // Aucun endpoint Pilot’in n’est supposé. Renseigner après confirmation.
    timeoutMs: 8000,
    // Adapter ce mapping au schéma RÉEL de l’API (pagination comprise si nécessaire).
    // Contrat interne : [{title, category, description, url}]. Texte brut uniquement.
    mapResponse(payload) {
      if (!Array.isArray(payload)) throw new Error('Schéma API à adapter dans config.js');
      return payload;
    }
  }
};
window.DEMO_COURSES = [
  {title:'Prendre en main WordPress', category:'WordPress', description:'Exemple de programme : organiser ses pages, publier ses contenus et gagner en autonomie.'},
  {title:'Concevoir un parcours plus clair', category:'UX/UI', description:'Exemple de programme : comprendre ses utilisateurs, hiérarchiser les contenus et structurer une interface.'},
  {title:'Comprendre les bases du SEO', category:'SEO', description:'Exemple de programme : travailler la structure, les contenus et les priorités de visibilité.'}
];
