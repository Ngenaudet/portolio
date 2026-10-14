(() => {
  const grid=document.querySelector('#training-catalogue');
  if (!grid) return;
  const filters=document.querySelector('#training-filters');
  const search=document.querySelector('#training-search');
  const count=document.querySelector('#training-count');
  let selected='Tous';
  const make=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e;};
  function render(){
    const query=search.value.trim().toLocaleLowerCase('fr');
    const items=pilotCourses.filter(c=>(selected==='Tous'||c.domain===selected)&&`${c.title} ${c.domain} ${c.nicolas?'Nicolas Genaudet':''}`.toLocaleLowerCase('fr').includes(query));
    grid.replaceChildren();
    for(const c of items){
      const card=make('article','');card.className='course';
      const meta=make('span',`${c.domain} · ${c.hours.toLocaleString('fr')} h · Pilot’in`);meta.className='eyebrow';
      card.append(meta,make('h3',c.title),make('p',c.desc));
      if(c.nicolas) card.append(make('strong','Avec Nicolas Genaudet'));
      const link=make('a','Voir le programme chez Pilot’in ↗');link.href=c.source;link.target='_blank';link.rel='noopener';card.append(link);grid.append(card);
    }
    if(!items.length)grid.append(make('p','Aucune formation pour cette recherche. Essayez une autre thématique.'));
    count.textContent=`${items.length} formation${items.length===1?'':'s'} Pilot’in`;
  }
  for(const domain of ['Tous',...new Set(pilotCourses.map(c=>c.domain))]){
    const button=make('button',domain);button.type='button';button.setAttribute('aria-pressed',domain==='Tous');
    button.addEventListener('click',()=>{selected=domain;filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b===button));render()});filters.append(button);
  }
  search.addEventListener('input',render);
})();
