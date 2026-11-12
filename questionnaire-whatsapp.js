'use strict';

(() => {
  const form = document.querySelector('#ficha');
  const button = document.querySelector('[data-contact="questionario_em_casa"]');
  if (!form || !button) return;

  function messageUrl() {
    const destination = new URL(button.href);
    const baseMessage = destination.searchParams.get('text') || 'Olá! Gostaria de atendimento para o meu pet.';
    const observations = [];
    // A ordem da mensagem acompanha os grupos mostrados na ficha.
    form.querySelectorAll('fieldset').forEach(group => {
      const checked = Array.from(group.querySelectorAll('input[type="checkbox"]:checked'));
      if (!checked.length) return;
      const title = group.querySelector('legend').textContent.trim();
      const lines = checked.map(input => `- ${input.closest('label').textContent.trim()}`);
      observations.push(`${title}:\n${lines.join('\n')}`);
    });
    const message = observations.length
      ? `${baseMessage}\n\nPreenchi o questionário "O que percebo no dia a dia do meu pet?".\nMinhas observações da última semana:\n\n${observations.join('\n\n')}`
      : baseMessage;
    destination.search = '';
    destination.hash = '';
    return `${destination.href}?text=${encodeURIComponent(message)}`;
  }

  function openWhatsApp(event) {
    if (event.type === 'auxclick' ? event.button !== 1 : event.button !== 0) return;
    event.preventDefault();
    // O href permanece geral: medições automáticas de cliques não recebem as
    // respostas. O texto selecionado é montado só nesta ação do visitante.
    window.open(messageUrl(), '_blank', 'noopener,noreferrer');
  }

  button.addEventListener('click', openWhatsApp);
  button.addEventListener('auxclick', openWhatsApp);
})();
