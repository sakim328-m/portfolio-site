/* Custom cursor: a small gradient dot plus a trailing ring.
   The ring grows over clickable things; over media a small tag sits beside the dot
   (no fill, so the content and video controls stay visible).
   Mouse/trackpad only; touch devices and reduced-motion keep the normal cursor. */
(function(){'use strict';
  if(!matchMedia('(hover: hover) and (pointer: fine)').matches)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const dot=document.createElement('div'),ring=document.createElement('div'),lab=document.createElement('div');
  dot.className='cur-dot';ring.className='cur-ring';lab.className='cur-tag';
  dot.setAttribute('aria-hidden','true');ring.setAttribute('aria-hidden','true');lab.setAttribute('aria-hidden','true');
  document.body.append(ring,dot,lab);document.documentElement.classList.add('has-cursor');
  let x=-100,y=-100,rx=-100,ry=-100,raf=0,shown=false;
  const LINK='a,button,summary,label,[role="tab"],.tick,.related a';
  const MEDIA=[['.kv svg','Click'],['video','Watch'],['.art img','View']];
  function loop(){
    rx+=(x-rx)*.32;ry+=(y-ry)*.32;
    dot.style.transform='translate('+x+'px,'+y+'px)';
    lab.style.transform='translate('+x+'px,'+y+'px)';
    ring.style.transform='translate('+rx+'px,'+ry+'px)';
    raf=(Math.abs(x-rx)+Math.abs(y-ry)>.1)?requestAnimationFrame(loop):0;
  }
  addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse')return;
    x=e.clientX;y=e.clientY;
    if(!shown){shown=true;rx=x;ry=y;document.documentElement.classList.add('cur-on');}
    if(!raf)raf=requestAnimationFrame(loop);
  },{passive:true});
  document.addEventListener('pointerover',e=>{
    const t=e.target;let label='';
    for(const [sel,txt] of MEDIA){if(t.closest&&t.closest(sel)){label=txt;break;}}
    const isLink=!label&&t.closest&&t.closest(LINK);
    ring.classList.toggle('is-media',!!label);ring.classList.toggle('is-link',!!isLink);
    lab.classList.toggle('is-on',!!label);
    if(label)lab.textContent=label;
  });
  addEventListener('pointerdown',()=>ring.classList.add('is-press'));
  addEventListener('pointerup',()=>ring.classList.remove('is-press'));
  document.addEventListener('pointerleave',()=>{shown=false;document.documentElement.classList.remove('cur-on');});
  addEventListener('blur',()=>{shown=false;document.documentElement.classList.remove('cur-on');});
})();
