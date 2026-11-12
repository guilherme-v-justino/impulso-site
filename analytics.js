'use strict';

(() => {
  const measurementId = 'G-C6VWPZ44D7';
  const preferenceKey = 'impulso.analytics.v1';
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  let accepted = false;
  let loaded = false;
  let opener;

  function readPreference() {
    try {
      const saved = JSON.parse(localStorage.getItem(preferenceKey));
      if (saved && typeof saved.accepted === 'boolean' && Date.now() - saved.date < maxAge) return saved.accepted;
    } catch (_) { /* Sem armazenamento, a escolha vale só nesta página. */ }
    return null;
  }

  function startAnalytics() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 15552000,
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);
  }

  function removeAnalyticsCookies() {
    // Remove os cookies GA no host e nos domínios pais aplicáveis.
    const parts = location.hostname.split('.');
    const domains = ['', ...parts.map((_, i) => parts.slice(i).join('.'))];
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (name !== '_ga' && !name.startsWith('_ga_')) return;
      domains.forEach(domain => {
        document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''}`;
      });
    });
  }

  const panel = document.createElement('section');
  panel.className = 'analytics-choice';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Preferências de medição de visitas');
  panel.innerHTML = '<div><strong>Podemos medir as visitas ao site?</strong><p>Com sua permissão, usamos o Google Analytics para entender os acessos e os cliques no WhatsApp. Você pode recusar e continuar normalmente. <a href="/privacidade">Saiba mais</a>.</p></div><div class="analytics-actions"><button type="button" class="button button-small" data-analytics-choice="no">Recusar</button><button type="button" class="button button-small" data-analytics-choice="yes">Aceitar medição</button></div>';
  document.body.append(panel);

  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'analytics-settings';
  settings.textContent = 'Preferências de privacidade';
  (document.querySelector('.footer-links') || document.querySelector('.privacy-page') || document.body).append(settings);
  settings.addEventListener('click', () => {
    opener = settings;
    panel.hidden = false;
    panel.querySelector('button').focus();
  });

  panel.querySelectorAll('[data-analytics-choice]').forEach(button => {
    button.addEventListener('click', () => {
      accepted = button.dataset.analyticsChoice === 'yes';
      try {
        localStorage.setItem(preferenceKey, JSON.stringify({ accepted, date: Date.now() }));
      } catch (_) { /* Não bloquear a navegação se o armazenamento estiver indisponível. */ }
      panel.hidden = true;
      if (accepted) {
        window[`ga-disable-${measurementId}`] = false;
        startAnalytics();
      } else {
        window[`ga-disable-${measurementId}`] = true;
        if (loaded) {
          window.gtag('consent', 'update', { analytics_storage: 'denied' });
          removeAnalyticsCookies();
          // Descarrega a biblioteca para impedir novos envios após a retirada.
          location.reload();
          return;
        }
        removeAnalyticsCookies();
      }
      opener?.focus();
    });
  });

  const saved = readPreference();
  accepted = saved === true;
  if (accepted) startAnalytics();
  else {
    removeAnalyticsCookies();
    panel.hidden = saved === false;
  }

  document.querySelectorAll('[data-contact]').forEach(link => {
    link.addEventListener('click', () => {
      if (!accepted || !loaded) return;
      // Somente a posição do botão: sem mensagem, telefone ou dados clínicos.
      window.gtag('event', 'whatsapp_click', {
        contact_method: 'whatsapp',
        button_location: link.dataset.contact,
        transport_type: 'beacon',
      });
    });
  });
})();
