/* Animations partagées : GSAP local, défilement natif et clavier préservés. */
(() => {
  'use strict';
  const { gsap, ScrollTrigger, SplitText } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);

  const media = gsap.matchMedia();
  const start = () => media.add('(prefers-reduced-motion: no-preference)', context => {
    const cleanup = [];
    const listen = (element, event, handler) => {
      const callback = e => context.add(() => handler(e));
      element.addEventListener(event, callback);
      cleanup.push(() => element.removeEventListener(event, callback));
    };
    document.documentElement.classList.add('motion-enabled');
    cleanup.push(() => document.documentElement.classList.remove('motion-enabled'));

    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);
    cleanup.push(() => progress.remove());
    gsap.fromTo(progress, { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.15 }
    });

    const header = document.querySelector('.header');
    if (header) gsap.from(header, { opacity: 0, duration: 0.6, clearProps: 'opacity' });
    const hero = document.querySelector('.hero, .training-hero, .service-hero, .coaching-hero');
    if (hero) {
      const entrance = gsap.timeline({ paused: true });
      const title = hero.querySelector('h1');
      if (title && SplitText) {
        const split = SplitText.create(title, { type: 'words', wordsClass: 'motion-word', aria: 'auto' });
        cleanup.push(() => split.revert());
        entrance.fromTo(split.words, { yPercent: 35, opacity: 0 }, {
          yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.045, ease: 'power3.out'
        }, 0);
      } else if (title) {
        entrance.fromTo(title, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0);
      }
      const copy = hero.querySelectorAll('p, .hero-bottom, .button');
      if (copy.length) entrance.fromTo(copy, { opacity: 0 }, {
        opacity: 1, duration: 0.7, stagger: 0.08
      }, 0.2);
      ScrollTrigger.create({
        trigger: hero, animation: entrance, start: 'top bottom', end: 'bottom top',
        toggleActions: 'restart complete restart complete'
      });
      listen(hero, 'focusin', () => entrance.progress(1));
    }

    const groups = '.problems, .expertise-grid, .steps, .projects, .course-grid, .testimonial-grid, .service-grid, .service-home-links';
    const reveal = (targets, trigger, stagger = 0) => {
      if (!targets.length) return;
      const animation = gsap.fromTo(targets, { y: 28, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.75, stagger, ease: 'power2.out',
        scrollTrigger: {
          trigger, start: 'top 92%', end: 'bottom top',
          toggleActions: 'restart complete restart complete'
        }
      });
      // Un élément atteint au clavier reste immédiatement visible.
      listen(trigger, 'focusin', () => animation.progress(1));
    };
    document.querySelectorAll(groups).forEach(group => reveal([...group.children], group, 0.09));
    document.querySelectorAll('main section').forEach(section => {
      if (section === hero) return;
      const children = [...section.children].filter(el => !el.matches(groups) && !el.querySelector(groups));
      reveal(children, section, 0.08);
    });
    const footer = document.querySelector('.footer');
    if (footer) reveal([...footer.children], footer, 0.05);

    // Le défilement indique le contexte dans la navigation de l’accueil.
    document.querySelectorAll('.header nav a[href^="#"]').forEach(link => {
      const section = document.getElementById(link.hash.slice(1));
      if (!section) return;
      ScrollTrigger.create({
        trigger: section, start: 'top 35%', end: 'bottom 35%',
        onToggle: self => link.classList.toggle('is-active', self.isActive)
      });
      cleanup.push(() => link.classList.remove('is-active'));
    });

    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    document.querySelectorAll('.button, .menu-toggle, .filters button').forEach(button => {
      const reset = () => gsap.to(button, { x: 0, y: 0, scale: 1, duration: 0.35, overwrite: 'auto', ease: 'power2.out' });
      listen(button, 'pointermove', event => {
        if (!finePointer.matches || event.pointerType === 'touch') return;
        const bounds = button.getBoundingClientRect();
        gsap.to(button, {
          x: gsap.utils.clamp(-5, 5, (event.clientX - bounds.left - bounds.width / 2) * 0.08),
          y: gsap.utils.clamp(-4, 4, (event.clientY - bounds.top - bounds.height / 2) * 0.12),
          duration: 0.3, overwrite: 'auto'
        });
      });
      listen(button, 'pointerleave', reset);
      listen(button, 'blur', reset);
      listen(button, 'pointerdown', () => gsap.to(button, { scale: 0.96, duration: 0.12, overwrite: 'auto' }));
      listen(button, 'pointerup', reset);
      listen(button, 'pointercancel', reset);
      listen(button, 'focus', () => gsap.to(button, { scale: 1.025, duration: 0.2, overwrite: 'auto' }));
    });

    document.querySelectorAll('.expertise, .course, .project-visual, .review, .problems article, .service-home-links a').forEach(card => {
      const reset = () => gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.45, overwrite: 'auto' });
      listen(card, 'pointermove', event => {
        if (!finePointer.matches || event.pointerType === 'touch') return;
        const bounds = card.getBoundingClientRect();
        gsap.to(card, {
          rotationY: ((event.clientX - bounds.left) / bounds.width - 0.5) * 3,
          rotationX: ((event.clientY - bounds.top) / bounds.height - 0.5) * -3,
          transformPerspective: 900, scale: 1.008, duration: 0.4, overwrite: 'auto'
        });
      });
      listen(card, 'pointerleave', reset);
      listen(card, 'focusin', () => gsap.to(card, { scale: 1.008, duration: 0.25, overwrite: 'auto' }));
      listen(card, 'focusout', reset);
    });

    document.querySelectorAll('details').forEach(details => {
      listen(details, 'toggle', () => {
        if (details.open) {
          const content = [...details.children].filter(el => el.tagName !== 'SUMMARY');
          gsap.fromTo(content, { opacity: 0, y: 6 }, {
            opacity: 1, y: 0, duration: 0.3, stagger: 0.035,
            overwrite: 'auto', clearProps: 'transform,opacity',
            onComplete: () => ScrollTrigger.refresh()
          });
        } else ScrollTrigger.refresh();
      });
    });
    const toggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('#navigation');
    if (toggle && navigation) listen(toggle, 'click', () => {
      if (!navigation.hidden) gsap.fromTo(navigation.querySelectorAll('a'),
        { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.045, clearProps: 'transform,opacity', overwrite: 'auto' });
    });
    document.querySelectorAll('.project-step').forEach(step => {
      const observer = new MutationObserver(() => {
        if (!step.hidden) context.add(() => gsap.fromTo(step, { opacity: 0 }, { opacity: 1, duration: 0.25, clearProps: 'opacity', overwrite: 'auto' }));
      });
      observer.observe(step, { attributes: true, attributeFilter: ['hidden'] });
      cleanup.push(() => observer.disconnect());
    });
    ScrollTrigger.refresh();
    return () => cleanup.reverse().forEach(fn => fn());
  });
  if (document.fonts?.ready) document.fonts.ready.then(start);
  else start();
})();
