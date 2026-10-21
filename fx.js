// Animations + sound (sab free: koi image ya audio file nahi chahiye)
(()=>{
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];

/* Loader */
addEventListener('load',()=>setTimeout(()=>q('#ld').classList.add('x'),900));
setTimeout(()=>q('#ld').classList.add('x'),3500);

/* Stats count-up */
function count(){qa('.stats b').forEach(b=>{const n=+b.dataset.n,s=b.dataset.s||'';let t0=null;
(function f(t){t0=t0||t;const p=Math.min((t-t0)/1200,1);b.textContent=Math.round(n*p)+s;if(p<1)requestAnimationFrame(f)})(performance.now())})}

/* Scroll reveal */
const rv=qa('.sec h2,.card,.lbl,#leaderboard .row,.hero p,.hero .btn,.stats');
rv.forEach(e=>{e.classList.add('rv');const i=[...e.parentElement.children].indexOf(e);e.style.setProperty('--d',Math.min(i,6)*.08+'s')});
let io=null;
if('IntersectionObserver' in window){
  io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);if(x.target.classList.contains('stats'))count()}}),{threshold:.15});
  rv.forEach(e=>io.observe(e));
}else{rv.forEach(e=>e.classList.add('in'));count()}

/* Typewriter */
const WD=['22 free games','Snake, Racing aur Shooter','Flappy Bird aur Brick Breaker','leaderboard par top karo'],ty=q('#ty');
let wi=0,ci=0,del=false;
(function tp(){const w=WD[wi];ci+=del?-1:1;ty.textContent=w.slice(0,ci);let d=del?35:70;
if(!del&&ci==w.length){del=true;d=1400}else if(del&&ci==0){del=false;wi=(wi+1)%WD.length;d=300}
setTimeout(tp,d)})();

/* Floating emojis in hero */
['🎮','🕹️','👾','🚀','🏍️','🧱','🐍','🏓'].forEach((e,i)=>{const s=document.createElement('span');
s.className='fe';s.textContent=e;
s.style.cssText=`left:${5+i*12}%;top:${(i*37)%80+5}%;font-size:${24+(i%3)*12}px;animation-duration:${5+i%4*2}s;animation-delay:-${i}s`;
q('.hero').append(s)});

/* Scroll progress + back to top */
const pg=q('#pg'),up=q('#up');
addEventListener('scroll',()=>{const m=document.documentElement.scrollHeight-innerHeight;
pg.style.width=(m>0?scrollY/m*100:0)+'%';up.classList.toggle('on',scrollY>500)},{passive:true});
up.onclick=()=>{scrollTo({top:0,behavior:'smooth'})};

/* Cursor glow (sirf mouse par) */
const gl=document.createElement('div');gl.id='glow';document.body.append(gl);
addEventListener('pointermove',e=>{if(e.pointerType=='mouse'){gl.style.left=e.clientX+'px';gl.style.top=e.clientY+'px'}},{passive:true});

/* Sound: sirf game khelte waqt, har game ka apna music */
let AC=null,on=true,mi=null,st=0,th=null;
try{on=localStorage.snd!='0'}catch(e){}
function ctx(){if(!AC){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;AC=new A()}if(AC.state=='suspended')AC.resume();return AC}
function tone(f,d,ty='square',v=.05,t0=0){const a=ctx();if(!a)return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+t0;
o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(v*1.6,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.02)}
const SF={score:()=>{tone(880,.07,'triangle',.07);tone(1320,.09,'triangle',.06,.06)},
over:()=>[440,330,247,185].forEach((f,i)=>tone(f,.25,'sawtooth',.06,i*.18)),
win:()=>[523,659,784,1047,1319].forEach((f,i)=>tone(f,.22,'triangle',.08,i*.12)),
start:()=>[392,523,659,784].forEach((f,i)=>tone(f,.1,'square',.05,i*.07)),
jump:()=>tone(520,.1,'sine',.08),shot:()=>tone(220,.05,'square',.03),hit:()=>tone(140,.15,'sawtooth',.06),
dice:()=>[0,.06,.12,.18].forEach((t,i)=>tone(300+i*90,.05,'square',.05,t)),
slice:()=>{tone(900,.06,'sawtooth',.04);tone(600,.09,'triangle',.05,.04)},
note:()=>tone([523,587,659,784,880,1047][Math.random()*6|0],.28,'sine',.1)};
window.sfx=n=>{if(on&&SF[n])SF[n]()};
const TH={chill:[[262,330,392,523,392,330,294,349],380,'triangle',0],action:[[220,262,330,262,220,196,247,294],150,'sawtooth',1],
race:[[330,392,494,392,330,392,523,392],120,'square',1],arcade:[[262,392,330,523,392,330,294,349],210,'square',0]};
const GT={ludo:'chill',candy:'chill',memo:'chill',g2048:'chill',stack:'chill',blob:'chill',mole:'chill',
br:'action',arena:'action',space:'action',ninja:'action',snake:'arcade',flap:'arcade',brick:'arcade',catcher:'arcade',pong:'arcade',cross:'arcade',
race:'race',sub:'race',run:'race',geo:'race'};
function mus(){clearInterval(mi);mi=null;if(!on||!th||document.hidden)return;const [n,ms,w,b]=th;st=0;
mi=setInterval(()=>{const k=st%n.length,sh=(st/n.length|0)%2?1.125:1;tone(n[k]*sh,ms/1000*1.3,w,.025);if(b&&k%2==0)tone(n[k]/2,ms/1000*2,'sine',.05);st++},ms)}
window.mstart=g=>{th=TH[GT[g]]||null;mus()};
window.mstop=()=>{th=null;mus()};
const sb=q('#snd');
function ui(){sb.textContent=on?'🔊':'🔇';sb.title=on?'Sound band karo':'Sound chalao'}
ui();
sb.onclick=()=>{on=!on;try{localStorage.snd=on?'1':'0'}catch(e){}ui();if(on){ctx();SF.start()}mus()};
document.addEventListener('visibilitychange',mus);
})();
