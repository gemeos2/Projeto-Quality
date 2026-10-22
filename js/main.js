(function(){
  var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- entrada da hero (sequência do Nereo) ---------- */
  function heroIntro(){
    if(!window.gsap||reduce)return;
    var tl=gsap.timeline();
    tl.from('#hero-heading h1 span',{y:'100%',opacity:0,stagger:.15,duration:1,ease:'power4.out'})
      .from('#hero-sub',{opacity:0,y:15,duration:.8,ease:'power3.out'},'-=.5')
      .from('#hero-seal',{opacity:0,scale:.9,duration:.8,ease:'power3.out'},'-=.5')
      .from('#hero-ctas',{opacity:0,y:20,duration:.8,ease:'power3.out'},'-=.5');
  }

  /* ---------- preloader ---------- */
  var pre=$('#preloader'),fill=$('#pre-fill'),p=0,loaded=false,t0=Date.now(),MIN=2700;
  function setP(v){p=v;fill.style.transform='scaleX('+v+')'}
  var tick=setInterval(function(){if(!loaded&&p<.9)setP(p+(.9-p)*.12)},90);
  function finish(){if(loaded)return;loaded=true;clearInterval(tick);setP(1);setTimeout(function(){pre.classList.add('done');document.documentElement.classList.remove('preloading');heroIntro();setTimeout(function(){pre.remove()},900)},400)}
  function onLoad(){setTimeout(finish,Math.max(0,MIN-(Date.now()-t0)))}
  if(document.readyState==='complete')onLoad();else addEventListener('load',onLoad);
  setTimeout(finish,6000);

  /* ---------- foto de fundo: usa hero.jpg se existir, senão fica o emblema ---------- */
  var media=$('#hero-media'),photo=$('.photo',media);
  function photoOk(){media.classList.remove('no-photo')}
  if(photo){
    photo.addEventListener('load',photoOk);
    photo.addEventListener('error',function(){media.classList.add('no-photo')});
    if(photo.complete&&photo.naturalWidth)photoOk();
  }

  /* ---------- brasas ---------- */
  $$('[data-embers]').forEach(function(box){for(var i=0;i<+box.dataset.embers;i++){var e=document.createElement('span');e.className='ember-dot';var s=2+Math.random()*5;
    e.style.cssText='left:'+(Math.random()*100)+'%;width:'+s+'px;height:'+s+'px;animation-duration:'+(7+Math.random()*9)+'s;animation-delay:-'+(Math.random()*14)+'s;--dx:'+((Math.random()-.5)*160)+'px';box.appendChild(e)}});

  /* ---------- navbar / drawer / progresso ---------- */
  var nav=$('#navbar'),bar=$('#progress');
  function onScroll(){nav.classList.toggle('scrolled',scrollY>30);var h=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')'}
  onScroll();addEventListener('scroll',onScroll,{passive:true});
  var d=$('#drawer'),dov=$('#drawer-overlay');dov.onclick=function(){tog(false)};
  function tog(o){d.classList.toggle('open',o);dov.classList.toggle('open',o);d.setAttribute('aria-hidden',!o);document.body.style.overflow=o?'hidden':''}
  $('#open-menu').onclick=function(){tog(true)};$('#close-menu').onclick=function(){tog(false)};
  $$('a',d).forEach(function(a){a.addEventListener('click',function(){tog(false)})});
  addEventListener('keydown',function(e){if(e.key==='Escape')tog(false)});

  /* ---------- link ativo (só para seções que existirem) ---------- */
  var links=$$('.nav-links .side-link');
  var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)links.forEach(function(l){l.classList.toggle('active',!l.hasAttribute('data-tab')&&l.getAttribute('href')==='#'+e.target.id)})})},{rootMargin:'-45% 0px -50% 0px'});
  links.forEach(function(l){var t=document.getElementById(l.getAttribute('href').slice(1));if(t)so.observe(t)});

  /* ---------- Lenis + GSAP ---------- */
  try{
    if(window.Lenis&&!reduce){var lenis=new Lenis({duration:1.15,smoothWheel:true});
      if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0)}
      else{(function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(0)}
      $$('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href');if(id.length>1&&document.querySelector(id)){e.preventDefault();lenis.scrollTo(id,{offset:0,duration:1.4})}})})}
    if(window.gsap&&window.ScrollTrigger&&!reduce){
      gsap.to('.hero-media',{yPercent:12,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:true}});
    }
  }catch(e){}

  /* ---------- cardápio: abas ---------- */
  var tabs=$$('.menu-tab');
  function selTab(t,focus,still){tabs.forEach(function(b){var on=b===t;b.classList.toggle('active',on);b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;document.getElementById(b.getAttribute('aria-controls')).hidden=!on});if(focus)t.focus();if(!still)t.scrollIntoView({block:'nearest',inline:'center',behavior:reduce?'auto':'smooth'});stickRow()}
  /* mobile: ao rolar o cardápio, o filtro vira uma linha só de ícones (texto só na aba ativa) */
  var tabsBar=$('.menu-tabs'),mqTabs=matchMedia('(max-width:899px)');
  function stickRow(){
    var on=mqTabs.matches&&tabsBar.getBoundingClientRect().top<=nav.offsetHeight+1;
    if(on===tabsBar.classList.contains('compact'))return;
    var from=tabs.map(function(t){return t.getBoundingClientRect()});
    tabsBar.classList.toggle('compact',on);
    if(reduce||!tabs[0].animate)return;
    tabs.forEach(function(t,i){
      var to=t.getBoundingClientRect(),dx=from[i].left-to.left,dy=from[i].top-to.top;
      t.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'none'}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});
      if(t.classList.contains('active')&&on){var s=$('.tab-short',t);if(s)s.animate([{opacity:0},{opacity:1}],{duration:380,easing:'ease-out'})}
    })
  }
  addEventListener('scroll',stickRow,{passive:true});addEventListener('resize',stickRow);stickRow();
  tabs.forEach(function(t,i){t.addEventListener('click',function(){selTab(t)});
    t.addEventListener('keydown',function(e){var n=e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:e.key==='Home'?0:e.key==='End'?tabs.length-1:-1;if(n>=0){e.preventDefault();selTab(tabs[(n+tabs.length)%tabs.length],true)}})});

  /* links com data-tab abrem a aba correspondente do cardápio */
  $$('a[data-tab]').forEach(function(a){a.addEventListener('click',function(){var t=document.getElementById('t-'+a.getAttribute('data-tab'));if(t)selTab(t,false,true)})});

  /* ---------- carrinho (pedido por WhatsApp) ---------- */
  var WA='5513997744613',KEY='quality-cart',cart=[];
  try{cart=JSON.parse(localStorage.getItem(KEY))||[]}catch(e){}
  var cEl=$('#cart'),cOv=$('#cart-overlay'),cList=$('#cart-list'),cEmpty=$('#cart-empty'),cFab=$('#cart-fab'),cCount=$('#cart-count'),cSend=$('#cart-send'),cName=$('#cart-name'),cAddr=$('#cart-address'),cTotal=$('#cart-total');
  function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){}}
  function total(){return cart.reduce(function(a,i){return a+i.q},0)}
  function brl(v){return 'R$ '+v.toFixed(2).replace('.',',')}
  function sum(){return cart.reduce(function(a,i){return a+(i.p||0)*i.q},0)}
  function msg(){var l=['Olá! Gostaria de fazer um pedido:',''];cart.forEach(function(i){l.push('• '+i.q+'x '+i.n+(i.p?' — '+brl(i.p*i.q):''))});
    if(sum())l.push('','Total: '+brl(sum()));
    if(cName.value.trim())l.push('','Nome: '+cName.value.trim());
    if(cAddr.value.trim())l.push((cName.value.trim()?'':'\n')+'Endereço: '+cAddr.value.trim());return l.join('\n')}
  function render(){var n=total();cCount.textContent=n;cEmpty.hidden=n>0;cEl.classList.toggle('has-items',n>0);
    cList.innerHTML=cart.map(function(i,x){return '<li><span class="ci-name">'+esc(i.n)+(i.p?'<small>'+brl(i.p)+'</small>':'')+'</span><span class="ci-qty"><button type="button" data-a="dec" data-i="'+x+'" aria-label="Diminuir">−</button><b>'+i.q+'</b><button type="button" data-a="inc" data-i="'+x+'" aria-label="Aumentar">+</button></span></li>'}).join('');
    cTotal.textContent=brl(sum());cSend.href='https://wa.me/'+WA+'?text='+encodeURIComponent(msg());save()}
  function openCart(o){cEl.classList.toggle('open',o);cOv.classList.toggle('open',o);cEl.setAttribute('aria-hidden',!o);document.body.style.overflow=o?'hidden':'';render()}
  function add(name,price){var f=cart.filter(function(i){return i.n===name})[0];if(f)f.q++;else cart.push({n:name,q:1,p:price||0});render();cFab.classList.remove('bump');void cFab.offsetWidth;cFab.classList.add('bump')}
  $$('.mi').forEach(function(card){var name=card.querySelector('h3').textContent,price=parseFloat(card.dataset.price)||0,b=document.createElement('button'),sel=null;
    b.type='button';b.className='mi-add';b.setAttribute('aria-label','Adicionar '+name+' ao pedido');b.innerHTML='<iconify-icon icon="solar:cart-large-2-bold"></iconify-icon><span>Adicionar</span>';
    b.addEventListener('click',function(){add(sel?name+' – '+sel.value:name,price);b.classList.add('ok');setTimeout(function(){b.classList.remove('ok')},500)});
    if(card.dataset.flavors){/* produtos com vários sabores: seletor ao lado do botão */
      sel=document.createElement('div');sel.className='mi-flavor';sel.value='';
      var tg=document.createElement('button'),ul=document.createElement('ul');
      tg.type='button';tg.className='mi-flavor-btn';tg.setAttribute('aria-haspopup','listbox');tg.setAttribute('aria-expanded','false');tg.setAttribute('aria-label','Escolher sabor de '+name);
      ul.className='mi-flavor-list';ul.setAttribute('role','listbox');
      function pick(v){sel.value=v;tg.textContent=v;$$('li',ul).forEach(function(li){li.setAttribute('aria-selected',li.textContent===v)})}
      function openL(o){sel.classList.toggle('open',o);tg.setAttribute('aria-expanded',o)}
      card.dataset.flavors.split('|').forEach(function(f){var li=document.createElement('li');li.setAttribute('role','option');li.tabIndex=-1;li.textContent=f;
        li.addEventListener('click',function(){pick(f);openL(false);tg.focus()});
        li.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();li.click()}else if(e.key==='ArrowDown'&&li.nextSibling){e.preventDefault();li.nextSibling.focus()}else if(e.key==='ArrowUp'&&li.previousSibling){e.preventDefault();li.previousSibling.focus()}});
        ul.appendChild(li)});
      pick(card.dataset.flavors.split('|')[0]);
      tg.addEventListener('click',function(){var o=!sel.classList.contains('open');openL(o);if(o){var c=$('[aria-selected=true]',ul);if(c)c.focus()}});
      sel.addEventListener('keydown',function(e){if(e.key==='Escape'){openL(false);tg.focus()}});
      document.addEventListener('click',function(e){if(!sel.contains(e.target))openL(false)});
      sel.appendChild(tg);sel.appendChild(ul);
      var row=document.createElement('div');row.className='mi-buy';row.appendChild(sel);row.appendChild(b);card.appendChild(row)}
    else card.appendChild(b)});
  $$('.mi').forEach(function(card){var pr=parseFloat(card.dataset.price);if(!pr)return;var el=document.createElement('span');el.className='mi-price';el.textContent=brl(pr);card.insertBefore(el,card.querySelector('h3').nextSibling)});
  cList.addEventListener('click',function(e){var b=e.target.closest('button[data-a]');if(!b)return;var i=cart[+b.dataset.i];if(!i)return;i.q+=b.dataset.a==='inc'?1:-1;if(i.q<1)cart.splice(+b.dataset.i,1);render()});
  cFab.onclick=function(){openCart(true)};$('#cart-close').onclick=cOv.onclick=function(){openCart(false)};
  $('#cart-clear').onclick=function(){cart=[];openCart(false)};
  cName.addEventListener('input',render);
  cAddr.addEventListener('input',render);
  cSend.addEventListener('click',function(e){if(!cart.length){e.preventDefault()}});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&cEl.classList.contains('open'))openCart(false)});
  render();

  /* ---------- revelar ao rolar ---------- */
  var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{threshold:.12});
  /* cartões do cardápio entram em sequência (animação própria, para não travar o hover) */
  $$('.menu-grid').forEach(function(g){$$('.mi',g).forEach(function(c,i){c.classList.add('rv');c.style.setProperty('--d',(i%3)*90+'ms')})});
  $$('.loc-item,.location-info .btn,.footer-card,.footer-mark').forEach(function(el,i){el.classList.add('reveal');el.style.transitionDelay=(el.classList.contains('loc-item')?i*120:0)+'ms'});
  $$('.reveal,.mi.rv').forEach(function(el){ro.observe(el)});

  /* ---------- fechamento: bolos descem junto com o scroll ---------- */
  var closing=$('#pedido'),cakes=$$('.closing-cake');
  if(closing&&cakes.length&&!reduce){
    var speeds=[110,300],ticking=false;
    function moveCakes(){
      ticking=false;
      var r=closing.getBoundingClientRect(),vh=innerHeight;
      if(r.bottom<0||r.top>vh)return;
      var prog=(vh-r.top)/(vh+r.height);
      cakes.forEach(function(c,i){c.style.translate='0 '+((prog-.5)*speeds[i%2]).toFixed(1)+'px'});
      var pie=$('.closing-cake.c2');if(pie)pie.style.rotate=(prog*360).toFixed(1)+'deg';
    }
    addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(moveCakes)}},{passive:true});
    addEventListener('resize',moveCakes);
    moveCakes();
  }

  /* ---------- ripple nos botões ---------- */
  document.addEventListener('click',function(e){var b=e.target.closest('.btn');if(!b)return;var r=b.getBoundingClientRect(),s=Math.max(r.width,r.height),sp=document.createElement('span');sp.className='ripple';sp.style.cssText='width:'+s+'px;height:'+s+'px;left:'+(e.clientX-r.left-s/2)+'px;top:'+(e.clientY-r.top-s/2)+'px';b.appendChild(sp);setTimeout(function(){sp.remove()},700)});
})();
