(() => {
  const id = 'G-BF3V4MJ92S';
  const key = 'ng-portfolio-consent-v1';
  const lifetime = 183 * 24 * 60 * 60 * 1000;
  const banner = document.querySelector('#cookie-banner');
  const openers = document.querySelectorAll('[data-cookie-settings]');
  let started = false;
  function readChoice() {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value.analytics === 'boolean' && value.expires > Date.now() ? value : null;
    } catch { return null; }
  }
  function removeCookies() {
    const host = location.hostname;
    const domains = [null, host, '.' + host];
    const parts = host.split('.');
    for (let i = 1; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'));
    document.cookie.split(';').map(c => c.split('=')[0].trim()).filter(n => /^_ga(?:_|$)|^_gid$|^_gat/.test(n)).forEach(name => domains.forEach(domain => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? '; domain=' + domain : ''}`;
    }));
  }
  function startAnalytics() {
    // Le consentement est requis ; les aperçus locaux ne mesurent aucune visite.
    if (started || !['nicolas-genaudet.fr', 'www.nicolas-genaudet.fr'].includes(location.hostname)) return;
    started = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {analytics_storage:'granted', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
    window.gtag('js', new Date());
    window.gtag('config', id, {allow_google_signals:false, allow_ad_personalization_signals:false, cookie_expires:33696000, cookie_update:false});
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  }
  function choose(analytics) {
    try { localStorage.setItem(key, JSON.stringify({analytics, expires:Date.now() + lifetime})); } catch {}
    banner.hidden = true;
    if (analytics) startAnalytics();
    else {
      window['ga-disable-' + id] = true;
      removeCookies();
      // Retirer les scripts déjà chargés par un rechargement sans consentement.
      if (started) location.reload();
    }
  }
  banner.querySelector('[data-accept]').addEventListener('click', () => choose(true));
  banner.querySelector('[data-reject]').addEventListener('click', () => choose(false));
  openers.forEach(button => button.addEventListener('click', () => { banner.hidden = false; banner.querySelector('[data-reject]').focus(); }));
  const choice = readChoice();
  window['ga-disable-' + id] = !choice?.analytics;
  if (choice) {
    banner.hidden = true;
    if (choice.analytics) startAnalytics(); else removeCookies();
  } else { banner.hidden = false; removeCookies(); }
  window.addEventListener('storage', event => { if (event.key === key) location.reload(); });
})();
