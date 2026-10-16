const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
const desktop = window.matchMedia('(min-width: 761px)');
desktop.addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();

const locations = {
  aurora: {name: 'Nexora Aurora', type: 'HUB DE INOVAÇÃO', description: 'Um espaço imaginário para conectar pessoas e desenvolver novas experiências digitais.', address: 'Alameda do Amanhã, 128', district: 'Distrito Aurora · Cidade Nova', hours: 'Segunda a sexta · 9h às 18h', x: 180, y: 260},
  horizonte: {name: 'Nexora Horizonte', type: 'ESTÚDIO DE CONEXÕES', description: 'Um estúdio conceitual de cocriação, onde equipes imaginam jornadas mais simples e humanas.', address: 'Avenida das Possibilidades, 360', district: 'Bairro Horizonte · Cidade Nova', hours: 'Segunda a sexta · 8h às 17h', x: 350, y: 130},
  orbita: {name: 'Nexora Órbita', type: 'LABORATÓRIO DE IDEIAS', description: 'Um laboratório fictício para experimentar caminhos e transformar boas conversas em novas ideias.', address: 'Praça das Conexões, 42', district: 'Parque Órbita · Cidade Nova', hours: 'Segunda a sexta · 10h às 19h', x: 520, y: 350}
};
const details = document.querySelector('#location-details');
const buttons = document.querySelectorAll('[data-location]');
buttons.forEach(button => button.addEventListener('click', () => {
  const location = locations[button.dataset.location];
  buttons.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  details.querySelector('.location-type').textContent = location.type;
  details.querySelector('h3').textContent = location.name;
  details.querySelector('.location-description').textContent = location.description;
  const address = details.querySelector('dd');
  address.replaceChildren(document.createTextNode(location.address), document.createElement('br'), document.createTextNode(location.district));
  details.querySelectorAll('dd')[1].textContent = location.hours;
  const halo = document.querySelector('#map-halo');
  halo.setAttribute('cx', location.x);
  halo.setAttribute('cy', location.y);
}));
const contactButton = document.querySelector('#contact-button');
contactButton.setAttribute('aria-expanded', 'false');
contactButton.setAttribute('aria-controls', 'contact-details');
contactButton.addEventListener('click', () => {
  const contact = document.querySelector('#contact-details');
  contact.hidden = !contact.hidden;
  contactButton.setAttribute('aria-expanded', String(!contact.hidden));
});

// Content remains visible without JavaScript or when motion reduction is enabled.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('pending');
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.08});
  document.querySelectorAll('.reveal').forEach(element => {
    element.classList.add('pending');
    observer.observe(element);
  });
}
