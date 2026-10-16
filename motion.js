// A real projected sphere: longitude lines, latitude rings and nodes rotate in 3D.
(() => {
  const canvas = document.querySelector('#globe-canvas');
  const context = canvas.getContext('2d');
  const globe = document.querySelector('.network-art');
  const motionButton = document.querySelector('.motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  let paused = false;
  let visible = true;
  let angle = 0;
  let tilt = -.25;
  let targetTilt = -.25;
  let pointerAngle = 0;
  let targetPointer = 0;
  let lastTime = 0;
  let frame = 0;
  let size = 285;
  const nodes = Array.from({length: 36}, (_, i) => ({latitude: Math.asin(-1 + 2 * (i + .5) / 36), longitude: i * 2.39996323}));

  function resize() {
    size = Math.max(1, globe.getBoundingClientRect().width);
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * ratio);
    canvas.height = Math.round(size * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }
  function project(latitude, longitude) {
    const radius = size * .405;
    const x = Math.cos(latitude) * Math.sin(longitude + angle + pointerAngle);
    const z = Math.cos(latitude) * Math.cos(longitude + angle + pointerAngle);
    const y = Math.sin(latitude);
    const yy = y * Math.cos(tilt) - z * Math.sin(tilt);
    const zz = y * Math.sin(tilt) + z * Math.cos(tilt);
    const perspective = 1 + zz * .12;
    return {x: size / 2 + x * radius * perspective, y: size / 2 + yy * radius * perspective, z: zz};
  }
  function curve(points) {
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      context.strokeStyle = `rgba(168, 238, 202, ${.07 + (b.z + 1) * .15})`;
      context.lineWidth = .65;
      context.beginPath();context.moveTo(a.x, a.y);context.lineTo(b.x, b.y);context.stroke();
    }
  }
  function draw() {
    if (!context) return;
    context.clearRect(0, 0, size, size);
    for (let lat = -3; lat <= 3; lat++) {
      curve(Array.from({length: 81}, (_, i) => project(lat * Math.PI / 8, i / 80 * Math.PI * 2)));
    }
    for (let lng = 0; lng < 12; lng++) {
      curve(Array.from({length: 51}, (_, i) => project(-Math.PI / 2 + i / 50 * Math.PI, lng * Math.PI / 6)));
    }
    nodes.map(node => project(node.latitude, node.longitude)).sort((a,b) => a.z-b.z).forEach(node => {
      context.fillStyle = `rgba(204, 255, 221, ${.2 + (node.z+1)*.36})`;
      context.shadowColor = '#b6ffcf';context.shadowBlur = node.z > .1 ? 9 : 0;
      context.beginPath();context.arc(node.x, node.y, 1.1+(node.z+1)*.85,0,Math.PI*2);context.fill();
    });
    context.shadowBlur = 0;
  }
  function tick(time) {
    frame = 0;
    if (paused || reduced.matches || !visible || document.hidden) {lastTime=0;return;}
    if (lastTime) angle += Math.min((time-lastTime)/1000, .05) * .24;
    lastTime = time;
    tilt += (targetTilt-tilt)*.055;
    pointerAngle += (targetPointer-pointerAngle)*.055;
    draw();frame = requestAnimationFrame(tick);
  }
  function resume() {
    if (!frame && !paused && !reduced.matches && visible && !document.hidden) frame=requestAnimationFrame(tick);
    if (reduced.matches) draw();
  }
  motionButton.addEventListener('click', () => {
    paused = !paused;
    document.body.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'Retomar animações' : 'Pausar animações');
    motionButton.textContent = paused ? '▶' : 'Ⅱ';
    if (paused) {cancelAnimationFrame(frame);frame=0;lastTime=0;} else resume();
  });
  globe.addEventListener('pointermove', event => {
    if (!finePointer.matches || paused || reduced.matches) return;
    const rect = globe.getBoundingClientRect();
    targetPointer = ((event.clientX-rect.left)/rect.width-.5)*.65;
    targetTilt = -.25 + ((event.clientY-rect.top)/rect.height-.5)*.65;
  });
  globe.addEventListener('pointerleave', () => {targetTilt=-.25;targetPointer=0;});
  reduced.addEventListener('change', () => {
    if (reduced.matches) {cancelAnimationFrame(frame);frame=0;lastTime=0;draw();} else resume();
  });
  document.addEventListener('visibilitychange', resume);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible=entries[0].isIntersecting;
    if (!visible) {cancelAnimationFrame(frame);frame=0;lastTime=0;} else resume();
  }).observe(globe);
  if (context) {
    globe.classList.add('live');
    new ResizeObserver(resize).observe(globe);
    resize();resume();
  }

  const panel = document.querySelector('.campaign-panel');
  const heading = panel.querySelector('h2');
  const description = panel.querySelector('.campaign-copy p:not(.eyebrow)');
  const artText = panel.querySelector('.campaign-art>span');
  const slides = [
    {lines:['Mais conexão.','Mais cuidado.','Mais futuro.'],text:'Grandes mudanças começam com um olhar diferente. Vamos imaginar um amanhã em que inovar também significa acolher.',art:['O FUTURO','É FEITO DE','CONEXÕES.']},
    {lines:['Ideias que somam.','Pessoas que criam.','Caminhos que abrem.'],text:'O encontro entre diferentes olhares transforma possibilidades em novas experiências. Todo próximo passo começa com uma boa conversa.',art:['IDEIAS NOVAS.','OLHARES','COMPARTILHADOS.']},
    {lines:['Escutar primeiro.','Criar em conjunto.','Cuidar sempre.'],text:'A tecnologia é parte da jornada. A proximidade, a colaboração e o cuidado são o que dão sentido a cada nova conexão.',art:['TECNOLOGIA','COM UM LADO','HUMANO.']}
  ];
  let slide = 0, animationTimer;
  document.querySelectorAll('[data-slide-step]').forEach(button => button.addEventListener('click', () => {
    slide = (slide + Number(button.dataset.slideStep) + slides.length) % slides.length;
    const data=slides[slide];
    heading.replaceChildren();artText.replaceChildren();
    data.lines.forEach((line,i) => {if(i)heading.append(document.createElement('br'));const element=document.createElement(i===2?'em':'span');element.textContent=line;if(i<2)element.style.color='inherit';heading.append(element);});
    data.art.forEach((line,i) => {if(i)artText.append(document.createElement('br'));const element=document.createElement(i===2?'b':'span');element.textContent=line;artText.append(element);});
    description.textContent=data.text;
    document.querySelector('#slide-status').textContent=`0${slide+1} / 03`;
    panel.dataset.slide=slide;
    panel.classList.remove('changing');
    requestAnimationFrame(()=>panel.classList.add('changing'));
    clearTimeout(animationTimer);animationTimer=setTimeout(()=>panel.classList.remove('changing'),800);
  }));

  const progress=document.querySelector('.reading-progress');
  const photo=document.querySelector('.hero-photo');
  let scrollFrame=0;
  function scrollUpdate() {
    scrollFrame=0;
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;
    photo.style.transform=(!paused&&!reduced.matches&&finePointer.matches&&scrollY<900)?`translateY(${Math.min(scrollY*.035,22)}px)`:'none';
  }
  addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(scrollUpdate);},{passive:true});
  scrollUpdate();
})();
