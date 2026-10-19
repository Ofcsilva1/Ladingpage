const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
let browser;
before(async()=>{browser=await chromium.launch({headless:true,...(process.env.NEXORA_BROWSER_PATH?{executablePath:process.env.NEXORA_BROWSER_PATH}:{})});});
after(async()=>{await browser?.close();});
async function fixture(options={}){
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce',...options});
  await context.route('**/*',route=>{
    const url=new URL(route.request().url());if(url.hostname!=='nexora.test')return route.abort();
    const file=path.resolve(root,'.'+(decodeURIComponent(url.pathname)==='/'?'/index.html':decodeURIComponent(url.pathname))),relative=path.relative(root,file);
    if(relative.startsWith('..')||path.isAbsolute(relative)||!fs.existsSync(file))return route.abort();
    const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.svg':'image/svg+xml'};
    return route.fulfill({contentType:types[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('https://nexora.test/',{waitUntil:'networkidle'});return {context,page,errors};
}
test('desktop map, contact and manual carousel respond without external services',async()=>{
  const {context,page,errors}=await fixture();
  try{
    assert.match(await page.title(),/Nexora/);
    await page.locator('[data-location="horizonte"]').click();assert.equal(await page.locator('#location-details h3').textContent(),'Nexora Horizonte');
    assert.equal(await page.locator('[data-location="horizonte"]').getAttribute('aria-pressed'),'true');
    await page.locator('#contact-button').click();assert.equal(await page.locator('#contact-details').isVisible(),true);
    await page.locator('#contact-button').click();assert.equal(await page.locator('#contact-details').isVisible(),false);
    await page.locator('[data-slide-step="1"]').click();await page.waitForFunction(()=>document.querySelector('#slide-status').textContent==='02 / 03');
    await page.locator('[data-slide-step="-1"]').click();await page.waitForFunction(()=>document.querySelector('#slide-status').textContent==='01 / 03');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
  }finally{await context.close();}
});
test('mobile menu supports Escape, focus return and link activation',async()=>{
  const {context,page,errors}=await fixture({viewport:{width:390,height:900}});
  try{
    const menu=page.locator('.menu-toggle');await menu.click();assert.equal(await menu.getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Escape');assert.equal(await menu.getAttribute('aria-expanded'),'false');assert.equal(await menu.evaluate(e=>e===document.activeElement),true);
    await menu.click();await page.locator('#navigation a').first().click();assert.equal(await menu.getAttribute('aria-expanded'),'false');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
  }finally{await context.close();}
});
test('sphere animates and the pause control freezes its drawing',async()=>{
  const {context,page,errors}=await fixture({reducedMotion:'no-preference'});
  try{
    await page.locator('#globe-canvas').evaluate(c=>window.__frame=c.toDataURL());
    await page.waitForFunction(()=>document.querySelector('#globe-canvas').toDataURL()!==window.__frame,null,{timeout:3000});
    await page.getByRole('button',{name:'Pausar animações',exact:true}).click();
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    const frame=await page.locator('#globe-canvas').evaluate(c=>c.toDataURL());await page.waitForTimeout(150);
    assert.equal(await page.locator('#globe-canvas').evaluate(c=>c.toDataURL()),frame);
    assert.equal(await page.getByRole('button',{name:'Retomar animações',exact:true}).getAttribute('aria-pressed'),'true');assert.deepEqual(errors,[]);
  }finally{await context.close();}
});
test('reduced motion keeps the sphere static',async()=>{
  const {context,page,errors}=await fixture();
  try{
    const frame=await page.locator('#globe-canvas').evaluate(c=>c.toDataURL());await page.waitForTimeout(150);
    assert.equal(await page.locator('#globe-canvas').evaluate(c=>c.toDataURL()),frame);assert.deepEqual(errors,[]);
  }finally{await context.close();}
});
test('core content remains visible without JavaScript',async()=>{
  const {context,page}=await fixture({javaScriptEnabled:false,viewport:{width:390,height:900}});
  try{
    assert.equal(await page.locator('h1').isVisible(),true);assert.equal(await page.locator('#location-details h3').textContent(),'Nexora Aurora');
    assert.equal(await page.locator('#contact-details').isVisible(),false);
  }finally{await context.close();}
});
