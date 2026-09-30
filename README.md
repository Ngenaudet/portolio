# Nicolas Genaudet — site statique

## Ouvrir
Double-cliquer sur `index.html`. Ouvrir `formations.html` pour la page Formations. Aucun outil de compilation, dépendance ou serveur n’est nécessaire pour le site et les exemples. Les trois images sont incluses localement : le rendu fonctionne hors ligne.

## Personnaliser
- `index.html` : textes, projets, témoignages et carnet sportif. Les contenus non fournis sont signalés et aucune performance ou citation client n’est inventée.
- `styles.css` : couleurs en tête de fichier, espacements et règles responsive.
- `assets/` : remplacer les photographies en conservant les noms ou mettre à jour leurs chemins CSS. Les photos sont décoratives ; elles ne représentent ni Nicolas ni ses réalisations.
- `config.js` : liens HTTPS Calendly et Google Forms, endpoint REST confirmé et adaptateur de données.
- `app.js` : navigation, animations, préparation locale du message et catalogue.

## Contact
`calendlyUrl` vide : le bouton conduit au texte annonçant que la réservation sera disponible. Une fois renseigné, il ouvre Calendly.
`formUrl` vide : pas de transmission externe. Le formulaire valide les champs et télécharge un fichier texte local ; il ne prétend jamais envoyer le message. Une fois le lien renseigné, un lien vers le formulaire externe apparaît. Les champs locaux ne sont pas transférés automatiquement. Aucun cookie, suivi, stockage local ou service distant n’est utilisé au chargement.

## Catalogue REST Pilot’in
La source éditoriale est https://www.pilot-in.com/formations/ (consultée le 29 septembre 2026). Aucun endpoint n’a été inventé et aucun tarif/durée/financement n’est promis.

1. Confirmer avec Pilot’in l’URL publique autorisée, son schéma, sa pagination et les règles CORS.
2. Renseigner `courses.endpoint` dans `config.js`.
3. Adapter `courses.mapResponse` au schéma réel et renvoyer un tableau :
   `{ title: 'Titre', category: 'WordPress', description: 'Texte brut', url: 'https://…' }`.
4. Ne mettre aucune clé privée dans le code public. Si l’API exige un secret ou refuse CORS, prévoir un relais serveur ; un site statique seul ne peut pas résoudre cette contrainte.
5. Pour l’API réelle, utiliser un serveur HTTP local ou un hébergement HTTPS. En ouverture `file://`, les restrictions CORS peuvent empêcher l’appel : le fallback reste opérationnel.

Chargement, réponse vide, erreur HTTP, schéma invalide et délai dépassé sont gérés. Les contenus API sont insérés par `textContent` et les liens sont limités à HTTPS. Les catégories des filtres sont dérivées des données. Le mode démo est explicitement signalé et ne se présente pas comme le catalogue réel. Le mapping livré ne présume aucune pagination : l’adapter quand le contrat API est confirmé.

## Accessibilité et interactions
HTML sémantique, langue française, lien d’évitement, labels de formulaire, focus visible, boutons natifs, accordéons natifs, état du menu et filtres annoncés, fermeture du menu avec Échap, états du catalogue annoncés. Le contenu reste lisible sans JavaScript. Les animations respectent `prefers-reduced-motion`. Les photographies d’ambiance sont en arrière-plan décoratif. Aucun audit de conformité WCAG complet n’est revendiqué.

## Images et droits
Images sous licence Unsplash : https://unsplash.com/license (utilisation gratuite, y compris commerciale, sous les conditions de cette licence).
- `mountains.jpg` : Simon Berger — https://unsplash.com/photos/landscape-photography-of-mountains-twukN12EN7c
- `interior.jpg` : Spacejoy — https://unsplash.com/photos/a-living-room-with-a-large-flat-screen-tv-xyygOyZO5VA (visuel d’aménagement d’inspiration).
- `workspace.jpg` : Grovemade — https://unsplash.com/photos/black-and-silver-laptop-on-brown-wooden-rack-RvPDe41lYBA

Avant publication, remplacer les emplacements projets et témoignages, renseigner les résultats sportifs et les liens de contact, et ajouter les informations légales adaptées à l’activité. Cette livraison est locale, sans déploiement.

## Réalisation Nitaski Aventure
Visuel récupéré sur le site client à la demande de Nicolas pour illustrer sa refonte WordPress. Cette image ne relève pas de la licence Unsplash. Source : https://www.nitaski.com/wp-content/uploads/2026/07/randonnee-motoneige-foret-enneigee.webp . Site : https://www.nitaski.com/ .
