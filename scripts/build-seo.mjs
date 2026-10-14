import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const base='https://nicolas-genaudet.fr/';
const courses=vm.runInNewContext(fs.readFileSync(path.join(root,'pilot-data.js'),'utf8')+';pilotCourses');
const paths=['index.html','formations.html','coaching-sportif.html','developpeur-wordpress-lyon/index.html','creation-site-wordpress/index.html','refonte-site-wordpress/index.html','consultant-seo-lyon/index.html','mentions-legales.html','confidentialite.html'];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const relative of paths){
 const file=path.join(root,relative);let html=fs.readFileSync(file,'utf8');
 const pagePath=relative==='index.html'?'':relative.replace(/index\.html$/,'');
 const url=base+pagePath;
 const title=html.match(/<title>(.*?)<\/title>/s)[1];
 const description=html.match(/<meta name="description" content="([^"]*)"/)[1];
 const person={'@type':'Person','@id':base+'#person',name:'Nicolas Genaudet',url:base,jobTitle:'Développeur WordPress freelance, designer UX/UI, consultant SEO et formateur',sameAs:['https://www.linkedin.com/in/nicolas-genaudet/','https://formateur-wordpress-lyon.fr/'],knowsAbout:['WordPress','UX/UI','SEO','Formation','Référentiels DWWM, CDA et CDUI']};
 let graph=[person,{'@type':'WebSite','@id':base+'#website',url:base,name:'Nicolas Genaudet',inLanguage:'fr-FR',publisher:{'@id':base+'#person'}},{'@type':'WebPage','@id':url+'#webpage',url,name:title,description,inLanguage:'fr-FR',isPartOf:{'@id':base+'#website'},about:{'@id':base+'#person'}}];
 // Le fil d’Ariane reste conforme aux liens visibles des pages de services.
 if(relative.includes('/')) graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'Accueil',item:base},{'@type':'ListItem',position:2,name:title.split(' — ')[0],item:url}]});
 if(relative==='formations.html'){
  graph[2].mainEntity={'@id':url+'#catalogue'};
  graph.push({'@type':'Organization','@id':'https://www.pilot-in.com/#organization',name:'Pilot’in',url:'https://www.pilot-in.com/'},{'@type':'ItemList','@id':url+'#catalogue',name:'Formations Pilot’in',numberOfItems:courses.length,itemListElement:courses.map((c,i)=>({'@type':'ListItem',position:i+1,item:{'@type':'Course','@id':c.source+'#course',url:c.source,name:c.title,description:c.desc,inLanguage:'fr-FR',provider:{'@id':'https://www.pilot-in.com/#organization'}}}))});
  const cards=courses.map(c=>`<article class="course"><span class="eyebrow">${esc(c.domain)} · ${c.hours.toLocaleString('fr')} h · Pilot’in</span><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p>${c.nicolas?'<strong>Avec Nicolas Genaudet</strong>':''}<a href="${esc(c.source)}" target="_blank" rel="noopener">Voir le programme chez Pilot’in ↗</a></article>`).join('\n');
  html=html.replace(/<!-- CATALOGUE START -->[\s\S]*?<!-- CATALOGUE END -->/,`<!-- CATALOGUE START -->${cards}<!-- CATALOGUE END -->`);
 }
 html=html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g,'');
 html=html.replace(/<meta (?:name|property)="(?:robots|author|theme-color|og:[^"]+|twitter:[^"]+)"[^>]*>/g,'');
 html=html.replace(/<link rel="canonical"[^>]*>/g,'');
 const meta=`<link rel="canonical" href="${url}"><meta name="robots" content="index,follow,max-image-preview:large"><meta name="author" content="Nicolas Genaudet"><meta name="theme-color" content="#0E1E2B"><meta property="og:type" content="website"><meta property="og:locale" content="fr_FR"><meta property="og:site_name" content="Nicolas Genaudet"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:image" content="${base}assets/social-preview.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/png"><meta property="og:image:alt" content="Nicolas Genaudet — Web, design et transmission."><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${base}assets/social-preview.png"><meta name="twitter:image:alt" content="Nicolas Genaudet — Web, design et transmission."><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c')}</script>`;
 html=html.replace('</head>',meta+'</head>');
 fs.writeFileSync(file,html);
}
fs.writeFileSync(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>${base+(p==='index.html'?'':p.replace(/index\.html$/,''))}</loc></url>`).join('')}</urlset>\n`);
console.log(`SEO et catalogue générés : ${paths.length} pages, ${courses.length} formations.`);
