# Nexora · Landing page demonstrativa

Redesenho da antiga landing page do Proteja com identidade de empresa fictícia. Página estática em português, sem build e sem backend.

## Visualizar

Abra `index.html` no navegador ou sirva a pasta em um servidor HTTP. Para GitHub Pages, publique os arquivos desta pasta juntos, incluindo `editorial.css`, `motion.js` e `nexora-care.jpg`. A capitalização de `Script.js` deve ser preservada. A revisão visual usa a referência `20261016.2` nos recursos locais para atualizar o cache.

## Conteúdo e interações

- Marca Nexora, novo texto institucional e três soluções ilustrativas.
- Direção editorial com verde profundo, áreas claras, fotografia conceitual própria e composição em camadas. `editorial.css` contém a revisão visual sobre a base `style.css`.
- Globo desenhado em canvas com projeção tridimensional: meridianos, paralelos e pontos giram juntos, com resposta ao mouse. O N permanece legível no centro. Botão para pausar/retomar movimentos, preferência de movimento reduzido respeitada, suspensão quando o globo sai da tela ou a aba fica oculta e desenho estático SVG disponível sem JavaScript.
- Órbitas, etiquetas flutuantes, profundidade suave na fotografia ao rolar, progresso de leitura e entrada gradual das seções.
- Banner em carrossel com três manifestos, controles anterior/próximo, contador, transição de textos e cores e portais animados. O primeiro slide “Mais conexão. Mais cuidado. Mais futuro.” permanece no HTML; os três conteúdos ficam em `motion.js`. A troca é manual, sem avanço automático.
- Mapa esquemático de três unidades fictícias com botões que atualizam os detalhes e a marcação. Os dados ficam em `locations`, em `Script.js`; a unidade inicial Aurora também está no HTML para leitura sem JavaScript.
- Menu responsivo com Escape, links de navegação nativos e contato demonstrativo expansível.
- Respeito a movimento reduzido; conteúdo legível sem JavaScript. A fonte Google Fonts é opcional, com fontes locais de fallback.

Nexora, serviços, campanha, unidades, horários e endereços são fictícios. O mapa não possui coordenadas reais. `nexora.example` é um domínio reservado para exemplos; não há envio de mensagens. A página não carrega os antigos logos, folders, contato ou mapa do Proteja, nem se conecta ao sistema de prontuários.

## Validação

### Regressão automatizada

Use Node 22, `npm ci --ignore-scripts`, `npm run check`, `npx --no-install playwright install chromium` e `npm test`. Se já houver Edge/Chromium instalado, `NEXORA_BROWSER_PATH` pode apontar para seu executável. A instalação é necessária só para testes; o site continua estático, sem build ou backend.

A suíte cobre mapa, contato, carrossel manual, menu móvel/Escape/foco, animação/pausa do globo, movimento reduzido e conteúdo sem JavaScript. Requests externos são bloqueados; não há envio de contato. O workflow Quality tem apenas permissão de leitura, actions fixadas e não faz deploy. A execução hospedada depende de publicação posterior autorizada. `check` verifica sintaxe, sem alegar lint ou typecheck inexistentes.

### Histórico da revisão visual

Verificação em Edge com larguras de 320, 390, 760, 768, 1024 e 1440 pixels, sem transbordamento horizontal. Conferidos os links internos, as três unidades do mapa, abertura/fechamento do contato, menu móvel e Escape, movimento reduzido, conteúdo sem JavaScript e ausência de erros de execução. Apresentação inspecionada em capturas de desktop e celular.

A revisão também verifica que o canvas muda entre quadros, congela ao pausar e respeita movimento reduzido; os controles do carrossel percorrem os três slides nas duas direções; a fotografia local carrega corretamente.

## Fotografia

`nexora-care.jpg` é uma cena conceitual gerada com a ferramenta nativa Imagegen e otimizada em JPEG para a página. Não representa uma equipe ou atendimento real. O prompt usado está em `IMAGE-PROMPT.md`.
