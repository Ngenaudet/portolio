(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const safeUrl = value => {
    try { const u = new URL(value); return u.protocol === 'https:' ? u.href : null; } catch { return null; }
  };
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  if (toggle && nav) {
    const mobile = matchMedia('(max-width:760px)');
    const close = () => { nav.hidden = mobile.matches; toggle.setAttribute('aria-expanded','false'); };
    toggle.hidden = false;
    close();
    mobile.addEventListener('change', close);
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open)); nav.hidden = !open;
    });
    nav.addEventListener('click', event => { if (event.target.closest('a') && mobile.matches) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && mobile.matches && !nav.hidden) { close(); toggle.focus(); } });
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), {threshold:0.06});
    document.querySelectorAll('[data-reveal]').forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
    reduced.addEventListener('change', () => { if (reduced.matches) { observer.disconnect(); document.querySelectorAll('.reveal-ready').forEach(el => el.classList.add('visible')); } });
  }
  const calendar = safeUrl(config.calendlyUrl);
  if (calendar) {
    document.querySelectorAll('[data-calendly]').forEach(a => { a.href=calendar; a.rel='noopener noreferrer'; a.target='_blank'; });
    const note=document.querySelector('#contact-note'); if (note) note.textContent='Choisissez votre créneau sur Calendly (nouvel onglet).';
  }
  const formUrl = safeUrl(config.formUrl);
  if (formUrl) document.querySelectorAll('[data-form-url]').forEach(a => {a.href=formUrl; a.hidden=false; a.target='_blank'; a.rel='noopener noreferrer';});
  const form = document.querySelector('#contact-form');
  if (form) {
    const steps = [...form.querySelectorAll('.project-step')];
    const progress = form.querySelector('.project-progress');
    const markers = [...progress.querySelectorAll('li')];
    const previous = form.querySelector('.project-back');
    const next = form.querySelector('.project-next');
    const download = form.querySelector('.project-download');
    let current = 0;
    form.noValidate = true;
    progress.hidden = false;
    const show = (index, focus = true) => {
      current = index;
      steps.forEach((step, i) => { step.hidden = i !== index; });
      markers.forEach((marker, i) => {
        if (i === index) marker.setAttribute('aria-current', 'step');
        else marker.removeAttribute('aria-current');
        marker.classList.toggle('is-complete', i < index);
      });
      form.querySelector('#project-step-status').textContent = `Étape ${index + 1} sur ${steps.length}`;
      previous.hidden = index === 0;
      next.hidden = index === steps.length - 1;
      download.hidden = index !== steps.length - 1;
      if (focus) steps[index].querySelector('h3').focus();
    };
    const validate = step => {
      const invalid = [...step.querySelectorAll('input, textarea')].find(input => !input.checkValidity());
      if (invalid) { invalid.reportValidity(); return false; }
      return true;
    };
    previous.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => { if (validate(steps[current])) show(current + 1); });
    form.addEventListener('input', () => { document.querySelector('#form-status').textContent = ''; });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (current < steps.length - 1) {
        if (validate(steps[current])) show(current + 1);
        return;
      }
      for (let i = 0; i < steps.length; i++) {
        const invalid = [...steps[i].querySelectorAll('input, textarea')].some(input => !input.checkValidity());
        if (invalid) { show(i); validate(steps[i]); return; }
      }
      const data = new FormData(form);
      const fields = [['name','Nom'],['firstname','Prénom'],['email','E-mail'],['phone','Téléphone'],['project','Projet'],['objectives','Objectifs'],['identity','Identité visuelle'],['content','Textes'],['pages','Nombre de pages'],['features','Fonctionnalités'],['deadline','Date souhaitée'],['website','Site actuel'],['message','Précisions']];
      const text = 'Projet pour Nicolas Genaudet\n\n' + fields.map(([key,label]) => `${label} : ${data.getAll(key).filter(Boolean).join(', ') || 'Non précisé'}`).join('\n\n') + '\n';
      const url = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
      const link = document.createElement('a');
      link.href = url; link.download = 'mon-projet.txt'; document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      document.querySelector('#form-status').textContent = 'Votre fichier a été préparé. Aucun message n’a été envoyé. Vous pouvez revenir aux étapes précédentes pour modifier vos réponses.';
    });
    show(0, false);
  }
  const grid=document.querySelector('#course-grid');
  if (!grid) return;
  const status=document.querySelector('#catalog-status');
  const count=document.querySelector('#course-count');
  let courses=[], active='Tous', demo=true;
  const make=(tag,text,className)=>{const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;return el;};
  const render=()=>{
    grid.replaceChildren();
    const items=courses.filter(c=>active==='Tous'||c.category===active);
    count.textContent=`${items.length} ${demo?'exemple'+(items.length>1?'s':''):'formation'+(items.length>1?'s':'')}`;
    if(!items.length) {grid.append(make('p','Aucune formation dans cette sélection. Consultez le catalogue Pilot’in ou choisissez une autre thématique.','empty'));return;}
    items.forEach(c=>{
      const article=make('article','','course');
      article.append(make('span',`${c.category}${demo?' · Exemple de présentation':''}`,'eyebrow'),make('h2',c.title),make('p',c.description));
      const a=make('a',demo?'Consulter le catalogue officiel':'Voir le programme');a.href=safeUrl(c.url)||'https://www.pilot-in.com/formations/';article.append(a);grid.append(article);
    });
  };
  const filters=()=>{
    const container=document.querySelector('#course-filters'); container.replaceChildren();
    ['Tous',...new Set(courses.map(c=>c.category))].forEach(category=>{
      const button=make('button',category);button.type='button';button.setAttribute('aria-pressed',String(category===active));
      button.addEventListener('click',()=>{active=category;container.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();});container.append(button);
    });
  };
  const fallback=message=>{demo=true;courses=window.DEMO_COURSES||[];status.textContent=message;filters();render();};
  async function load(){
    const endpoint=config.courses?.endpoint;
    if(!endpoint){fallback('Aperçu de présentation : ces exemples ne constituent pas le catalogue Pilot’in. Retrouvez les programmes, tarifs et modalités sur leur site officiel.');return;}
    status.textContent='Chargement du catalogue…';grid.setAttribute('aria-busy','true');
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),config.courses.timeoutMs||8000);
    try{
      if(!safeUrl(endpoint))throw new Error('URL HTTPS requise');
      const response=await fetch(endpoint,{signal:controller.signal,credentials:'omit',headers:{Accept:'application/json'}});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const payload=config.courses.mapResponse(await response.json());
      if(!Array.isArray(payload)||!payload.every(c=>c&&typeof c.title==='string'&&c.title.trim()&&typeof c.category==='string'&&typeof c.description==='string'&&safeUrl(c.url)))throw new Error('Schéma inattendu');
      courses=payload;demo=false;status.textContent='Catalogue des formations Pilot’in.';filters();render();
    }catch(error){fallback('Le catalogue est momentanément indisponible. Voici des exemples de présentation ; consultez Pilot’in pour les programmes officiels.');}
    finally{clearTimeout(timer);grid.setAttribute('aria-busy','false');}
  }
  load();
})();
