'use strict';

// Conteúdo público centralizado. A medição opcional está em analytics.js.
const clinic = Object.freeze({
  whatsapp: '5541992384832',
  message: 'Olá! Gostaria de atendimento para o meu pet.',
  maps: 'https://www.google.com/maps/place/Impulso+Fisioterapia+Veterin%C3%A1ria/@-25.4633205,-49.2922883,17z/data=!3m1!4b1!4m6!3m5!1s0x94dce348895e49fd:0xf7eaadb335a3d316!8m2!3d-25.4633205!4d-49.2922883!16s%2Fg%2F11ph8pnn19',
  mapEmbed: 'https://maps.google.com/maps?q=-25.4633205,-49.2922883&z=17&output=embed',
});

document.querySelectorAll('[data-contact]').forEach(link => {
  link.href = `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(clinic.message)}`;
  // data-contact identifica a posição do botão na medição opcional.

});
document.querySelectorAll('[data-maps]').forEach(link => { link.href = clinic.maps; });

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navegacao');
if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
}

const mapButton = document.querySelector('#load-map');
mapButton?.addEventListener('click', () => {
  const iframe = document.createElement('iframe');
  iframe.title = 'Localização da Impulso Fisioterapia Veterinária no Google Maps';
  iframe.src = clinic.mapEmbed;
  iframe.referrerPolicy = 'no-referrer';
  iframe.allowFullscreen = true;
  const panel = document.querySelector('#mapa');
  panel.replaceChildren(iframe);
  iframe.addEventListener('load', () => iframe.focus(), { once: true });
}, { once: true });

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const videoButton = document.querySelector('#play-institutional');
const institutionalVideo = document.querySelector('#institutional-video');
if (videoButton && institutionalVideo) {
  const showVideoError = () => {
    document.querySelector('#video-status').hidden = false;
  };
  institutionalVideo.addEventListener('error', showVideoError);
  videoButton.addEventListener('click', () => {
    // Sem src até o clique: o arquivo de vídeo não é baixado na abertura.
    institutionalVideo.src = 'assets/impulso-institucional.mp4';
    institutionalVideo.hidden = false;
    videoButton.hidden = true;
    document.querySelector('.video-cover').hidden = true;
    institutionalVideo.focus();
    institutionalVideo.play().catch(error => {
      if (error.name === 'NotSupportedError') showVideoError();
      // Se a reprodução automática após o clique for recusada, os controles
      // nativos continuam disponíveis para o visitante iniciar o vídeo.
    });
  }, { once: true });
}

const fullVideoButton = document.querySelector('#play-full-institutional');
fullVideoButton?.addEventListener('click', () => {
  // Capa local: nenhuma conexão com o YouTube antes da escolha do visitante.
  institutionalVideo?.pause();
  const iframe = document.createElement('iframe');
  iframe.title = 'Conheça a Impulso Fisioterapia Veterinária — institucional completo';
  iframe.src = 'https://www.youtube-nocookie.com/embed/9GivsBW1Xxg?autoplay=1&rel=0&playsinline=1&hl=pt-BR&cc_lang_pref=pt';
  iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
  iframe.allowFullscreen = true;
  // Preserva a identificação da origem exigida pelo player do YouTube.
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  document.querySelector('#youtube-institutional').replaceChildren(iframe);
  iframe.addEventListener('load', () => iframe.focus(), { once: true });
}, { once: true });
