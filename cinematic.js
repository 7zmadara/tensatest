(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var seen=false;try{seen=sessionStorage.getItem('cineSeen')==='1'}catch(e){}

/* scroll progress bar + reveal-on-scroll for the app (all pages) */
var bar=document.createElement('div');bar.id='cine-progress';
document.addEventListener('DOMContentLoaded',function(){document.body.appendChild(bar)});
addEventListener('scroll',function(){var h=document.documentElement,m=h.scrollHeight-innerHeight;bar.style.transform='scaleX('+(m>0?Math.min(1,scrollY/m):0)+')'},{passive:true});
if(!reduce&&'IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('cine-in');io.unobserve(e.target)}})},{threshold:.08});
  var scan=function(){document.querySelectorAll('main section, main article, main [class*="card"], main [class*="Card"]').forEach(function(n){if(!n.__c){n.__c=1;var r=n.getBoundingClientRect();if(r.top>innerHeight*.9)io.observe(n)}})};
  new MutationObserver(function(){clearTimeout(scan.t);scan.t=setTimeout(scan,120)}).observe(document.documentElement,{childList:true,subtree:true});
}
if(seen||reduce)return;

var o=document.createElement('div');o.id='cine';
o.innerHTML='<canvas></canvas><div class="c-glow"></div>'+
'<div class="c-layer l1"><h1>VEEN\'S_TASH</h1><p>Study. Focus. Level up.</p></div>'+
'<div class="c-layer l2"><h2>Homework becomes missions.</h2><p>Lessons, quizzes and a focus timer built around you.</p></div>'+
'<div class="c-layer l3"><h2>Thirty-two skill games.<br>One real 3D Earth.</h2></div>'+
'<div class="c-layer l4"><h2>Ready?</h2><p>Keep scrolling to step inside.</p></div>'+
'<div class="c-bar"></div><button class="c-skip" type="button">Skip intro</button><div class="c-hint">Scroll<i></i></div>';
document.documentElement.appendChild(o);
var cv=o.querySelector('canvas'),cx=cv.getContext('2d'),glow=o.querySelector('.c-glow'),L=[1,2,3,4].map(function(i){return o.querySelector('.l'+i)}),pb=o.querySelector('.c-bar'),hint=o.querySelector('.c-hint');
var W,H,stars=[],target=0,cur=0,done=false;
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight}
rs();addEventListener('resize',rs);
for(var i=0;i<260;i++)stars.push({x:Math.random()*2-1,y:Math.random()*2-1,z:Math.random()});
function clamp(v){return Math.max(0,Math.min(1,v))}
function seg(p,a,b){return clamp((p-a)/(b-a))}
function frame(){
  if(done)return;
  cur+=(target-cur)*.07;
  var p=cur;
  cx.fillStyle='rgba(5,7,11,.35)';cx.fillRect(0,0,W,H);
  var speed=.0015+p*.02;
  for(var i=0;i<stars.length;i++){var s=stars[i];s.z-=speed;if(s.z<=.02){s.x=Math.random()*2-1;s.y=Math.random()*2-1;s.z=1}
    var k=1/s.z,x=W/2+s.x*k*W*.12,y=H/2+s.y*k*H*.12,r=Math.max(.4,(1-s.z)*2.2);
    cx.fillStyle='rgba(190,230,255,'+(1-s.z)+')';cx.fillRect(x,y,r,r)}
  glow.style.transform='scale('+(.6+p*4)+')';glow.style.opacity=String(.9-seg(p,.8,1));
  var ranges=[[0,.05,.2,.28],[.22,.3,.42,.5],[.45,.53,.65,.73],[.68,.76,.88,.96]];
  L.forEach(function(el,i){var r=ranges[i],a=seg(p,r[0],r[1])*(1-seg(p,r[2],r[3])),sc=.85+seg(p,r[0],r[3])*.45;
    el.style.opacity=i===0&&p<.05?1:a;el.style.transform='scale('+sc+') translateZ(0)';el.style.filter='blur('+((1-a)*10)+'px)'});
  hint.style.opacity=p>.03?0:'';pb.style.width=(p*100)+'%';
  o.style.opacity=String(1-seg(p,.94,1));
  if(p>.995||target>=1&&p>.985)return finish();
  requestAnimationFrame(frame)
}
function finish(){if(done)return;done=true;try{sessionStorage.setItem('cineSeen','1')}catch(e){}
  removeEventListener('wheel',onw);removeEventListener('keydown',onk);o.remove()}
function add(d){target=clamp(target+d)}
function onw(e){e.preventDefault();add(e.deltaY*.0008)}
function onk(e){if(e.key==='ArrowDown'||e.key===' '||e.key==='PageDown')add(.12);else if(e.key==='ArrowUp')add(-.12);else if(e.key==='Escape')finish()}
addEventListener('wheel',onw,{passive:false});addEventListener('keydown',onk);
var ty=null;o.addEventListener('touchstart',function(e){ty=e.touches[0].clientY},{passive:true});
o.addEventListener('touchmove',function(e){if(ty==null)return;var y=e.touches[0].clientY;add((ty-y)*.0035);ty=y},{passive:true});
o.addEventListener('click',function(e){if(e.target.className!=='c-skip')add(.15)});
o.querySelector('.c-skip').addEventListener('click',function(e){e.stopPropagation();finish()});
/* auto-advance gently if the visitor does nothing, so nobody gets stuck */
var idle=setInterval(function(){if(done)return clearInterval(idle);if(target<.05&&performance.now()>6000)add(.004)},60);
requestAnimationFrame(frame);
})();
