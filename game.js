const $=s=>document.querySelector(s),C=$('#c'),X=C.getContext('2d'),W=400,H=500;
const held={},KM={arrowleft:'l',a:'l',arrowright:'r',d:'r',arrowup:'u',w:'u',arrowdown:'d',s:'d',' ':'f'};
let G=null,raf=0,last=0,vehicle='🏍️',ls=0;
const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>rnd(a,b)|0;
function em(e,x,y,s){X.font=s+'px serif';X.textAlign='center';X.textBaseline='middle';X.fillText(e,x,y)}
function hi(n,v){try{if(v!=null&&v>(+localStorage['hi'+n]||0))localStorage['hi'+n]=v;return +localStorage['hi'+n]||0}catch(e){return 0}}

const snake={t:'🐍 Snake Game',h:'Arrow keys / swipe / buttons se snake chalao.',
init(){this.s=[{x:10,y:12},{x:9,y:12},{x:8,y:12}];this.d=[1,0];this.nd=[1,0];this.sc=0;this.a=0;this.food()},
food(){do{this.f={x:ri(0,20),y:ri(0,25)}}while(this.s.some(p=>p.x==this.f.x&&p.y==this.f.y))},
update(dt){this.a+=dt;if(this.a<.11)return;this.a=0;this.d=this.nd;
const h={x:this.s[0].x+this.d[0],y:this.s[0].y+this.d[1]},ate=h.x==this.f.x&&h.y==this.f.y;
if(h.x<0||h.y<0||h.x>=20||h.y>=25||this.s.slice(0,ate?undefined:-1).some(p=>p.x==h.x&&p.y==h.y))return over();
this.s.unshift(h);if(ate){this.sc+=10;this.food()}else this.s.pop()},
key(k){const m={l:[-1,0],r:[1,0],u:[0,-1],d:[0,1]}[k];if(m&&!(m[0]==-this.d[0]&&m[1]==-this.d[1]))this.nd=m},
draw(){X.fillStyle='#05050c';X.fillRect(0,0,W,H);em('🍎',this.f.x*20+10,this.f.y*20+10,18);
this.s.forEach((p,i)=>{X.fillStyle=i?'#00bb99':'#00ffcc';X.fillRect(p.x*20,p.y*20,18,18)})}};

const arena={t:'🔫 Battle Arena',h:'WASD/arrows se move. Click/tap karke goli maaro, ya SPACE/🔥 se auto-aim fire.',
init(){this.p={x:200,y:250,hp:100};this.b=[];this.e=[];this.sc=0;this.sp=0;this.cd=0},
fire(tx,ty){if(this.cd>0)return;const a=Math.atan2(ty-this.p.y,tx-this.p.x);this.b.push({x:this.p.x,y:this.p.y,vx:Math.cos(a)*520,vy:Math.sin(a)*520});this.cd=.18;if(window.sfx)sfx('shot')},
tap(x,y){this.fire(x,y)},
update(dt){const p=this.p,v=170*dt;
if(held.l)p.x-=v;if(held.r)p.x+=v;if(held.u)p.y-=v;if(held.d)p.y+=v;
p.x=Math.max(15,Math.min(W-15,p.x));p.y=Math.max(15,Math.min(H-15,p.y));this.cd-=dt;
if(held.f&&this.e.length){let n=this.e[0];this.e.forEach(q=>{if(Math.hypot(q.x-p.x,q.y-p.y)<Math.hypot(n.x-p.x,n.y-p.y))n=q});this.fire(n.x,n.y)}
this.sp-=dt;if(this.sp<=0){this.sp=Math.max(.35,1.1-this.sc/400);const s=ri(0,4);
this.e.push({x:s<2?(s?W:0):rnd(0,W),y:s>=2?(s==2?0:H):rnd(0,H),hp:2})}
this.b.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt});this.b=this.b.filter(b=>b.x>0&&b.x<W&&b.y>0&&b.y<H);
const spd=50+this.sc/6;
this.e.forEach(q=>{const a=Math.atan2(p.y-q.y,p.x-q.x);q.x+=Math.cos(a)*spd*dt;q.y+=Math.sin(a)*spd*dt;
this.b.forEach(b=>{if(Math.hypot(b.x-q.x,b.y-q.y)<16){b.x=-99;q.hp--}});
if(Math.hypot(p.x-q.x,p.y-q.y)<22)p.hp-=30*dt});
this.e=this.e.filter(q=>q.hp>0||(this.sc+=10,false));
if(p.hp<=0)over()},
draw(){X.fillStyle='#10131c';X.fillRect(0,0,W,H);X.strokeStyle='#1c2233';
for(let i=0;i<=W;i+=40){X.beginPath();X.moveTo(i,0);X.lineTo(i,H);X.moveTo(0,i);X.lineTo(W,i);X.stroke()}
X.fillStyle='#ffd23f';this.b.forEach(b=>{X.beginPath();X.arc(b.x,b.y,4,0,7);X.fill()});
this.e.forEach(q=>em('🧟',q.x,q.y,28));em('🪖',this.p.x,this.p.y,32);
X.fillStyle='#333';X.fillRect(10,10,120,10);X.fillStyle='#00ffcc';X.fillRect(10,10,Math.max(0,this.p.hp)*1.2,10)}};

const race={t:'🏍️ Racing Zone',h:'◀ ▶ keys ya screen ke left/right tap se lane badlo. Bike ya Car chuno!',
init(){this.l=1;this.x=150;this.sc=0;this.o=[];this.sp=220;this.st=0;this.off=0},
key(k){if(k=='l')this.l=Math.max(0,this.l-1);if(k=='r')this.l=Math.min(3,this.l+1)},
tap(x){this.key(x<W/2?'l':'r')},
update(dt){this.sp+=8*dt;this.sc+=this.sp*dt/20;this.off=(this.off+this.sp*dt)%40;
this.x+=(this.l*100+50-this.x)*Math.min(1,dt*12);this.st-=dt;
if(this.st<=0){this.st=rnd(.5,1)*420/this.sp;this.o.push({l:ri(0,4),y:-40,e:['🚗','🚕','🚌','🚙'][ri(0,4)]})}
this.o.forEach(o=>{o.y+=(this.sp-100)*dt;if(Math.abs(o.l*100+50-this.x)<40&&Math.abs(o.y-420)<48)over()});
this.o=this.o.filter(o=>o.y<H+50)},
draw(){X.fillStyle='#2a2d34';X.fillRect(0,0,W,H);X.fillStyle='#fff';
for(let l=1;l<4;l++)for(let y=-40+this.off;y<H;y+=40)X.fillRect(l*100-2,y,4,20);
this.o.forEach(o=>em(o.e,o.l*100+50,o.y,44));em(vehicle,this.x,420,46)}};

const run={t:'🌄 Adventure Run',h:'SPACE / ▲ / tap se kudo. Rukawat se bacho, coins 🪙 lo!',
init(){this.y=400;this.vy=0;this.sc=0;this.sp=240;this.o=[];this.c=[];this.st=1;this.cl=0},
key(k){if((k=='u'||k=='f')&&this.y>=400)this.vy=-640,window.sfx&&sfx("jump")},
tap(){this.key('u')},
update(dt){this.sp+=6*dt;this.sc+=dt*this.sp/25;this.cl=(this.cl+dt*30)%500;
this.vy+=1800*dt;this.y=Math.min(400,this.y+this.vy*dt);if(this.y>=400)this.vy=0;
this.st-=dt;if(this.st<=0){this.st=rnd(.9,1.8)*360/this.sp;this.o.push({x:W+30,e:['🌵','🪨','🔥'][ri(0,3)]});
if(Math.random()<.6)this.c.push({x:W+30+rnd(60,140),y:rnd(280,380)})}
this.o.forEach(o=>{o.x-=this.sp*dt;if(Math.abs(o.x-70)<22&&this.y>365)over()});
this.c.forEach(c=>{c.x-=this.sp*dt;if(Math.abs(c.x-70)<26&&Math.abs(c.y-this.y)<30){c.x=-99;this.sc+=10}});
this.o=this.o.filter(o=>o.x>-40);this.c=this.c.filter(c=>c.x>-40)},
draw(){const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1b2a6b');g.addColorStop(1,'#f2994a');X.fillStyle=g;X.fillRect(0,0,W,H);
em('☁️',(300-this.cl)%500+100,80,50);em('☁️',(100-this.cl*.6+500)%500,150,40);
X.fillStyle='#3b2a1a';X.fillRect(0,420,W,80);
this.o.forEach(o=>em(o.e,o.x,402,36));this.c.forEach(c=>em('🪙',c.x,c.y,26));em('🧍',70,this.y,38)}};

const flap={t:'🐦 Flappy Bird',h:'SPACE / tap se udo, pipes ke beech se nikalo.',
init(){this.y=250;this.vy=0;this.sc=0;this.p=[];this.st=0},
key(k){if(k=='u'||k=='f')(this.vy=-330,window.sfx&&sfx("jump"))},tap(){(this.vy=-330,window.sfx&&sfx("jump"))},
update(dt){this.vy+=950*dt;this.y+=this.vy*dt;this.st-=dt;
if(this.st<=0){this.st=1.5;this.p.push({x:W+30,g:rnd(130,360),d:0})}
this.p.forEach(p=>{p.x-=150*dt;if(!p.d&&p.x<60){p.d=1;this.sc++}if(Math.abs(p.x-80)<38&&Math.abs(this.y-p.g)>50)over()});
this.p=this.p.filter(p=>p.x>-40);if(this.y<0||this.y>H-30)over()},
draw(){const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0b1d3a');g.addColorStop(1,'#3a7bd5');X.fillStyle=g;X.fillRect(0,0,W,H);
X.fillStyle='#2ecc71';this.p.forEach(p=>{X.fillRect(p.x-30,0,60,p.g-55);X.fillRect(p.x-30,p.g+55,60,H-p.g-55)});
X.fillStyle='#6b4a2a';X.fillRect(0,H-30,W,30);em('🐦',80,this.y,34)}};

const space={t:'🚀 Space Shooter',h:'◀ ▶ / drag se jahaz chalao, fire apne aap hota hai. Asteroids se bacho!',
init(){this.x=200;this.b=[];this.e=[];this.sc=0;this.st=0;this.cd=0},
drag(x){this.x=x},
update(dt){const v=280*dt;if(held.l)this.x-=v;if(held.r)this.x+=v;this.x=Math.max(20,Math.min(W-20,this.x));
this.cd-=dt;if(this.cd<=0){this.cd=.2;this.b.push({x:this.x,y:440})}
this.st-=dt;if(this.st<=0){this.st=Math.max(.3,.9-this.sc/600);this.e.push({x:rnd(20,W-20),y:-20,s:rnd(80,150)+this.sc/8,e:Math.random()<.5?'☄️':'👾'})}
this.b.forEach(b=>b.y-=450*dt);
this.e.forEach(q=>{q.y+=q.s*dt;this.b.forEach(b=>{if(Math.abs(b.x-q.x)<20&&Math.abs(b.y-q.y)<20){b.y=-99;q.d=1;this.sc+=10}});if(Math.abs(q.y-460)<28&&Math.abs(q.x-this.x)<28)over()});
this.e=this.e.filter(q=>!q.d&&q.y<H+20);this.b=this.b.filter(b=>b.y>0)},
draw(){X.fillStyle='#04040f';X.fillRect(0,0,W,H);X.fillStyle='#fff';const t=performance.now()/8;for(let i=0;i<40;i++)X.fillRect((i*97)%W,(i*53+t)%H,2,2);
X.fillStyle='#00ffcc';this.b.forEach(b=>X.fillRect(b.x-2,b.y,4,12));this.e.forEach(q=>em(q.e,q.x,q.y,32));em('🚀',this.x,460,40)}};

const brick={t:'🧱 Brick Breaker',h:'◀ ▶ ya ungli drag karke paddle hilao, saari bricks todo.',
init(){this.px=200;this.b={x:200,y:400,vx:170,vy:-240};this.k=[];this.sc=0;for(let r=0;r<5;r++)for(let c=0;c<8;c++)this.k.push({x:c*50+2,y:r*24+50,c:'hsl('+r*55+',80%,55%)'})},
drag(x){this.px=x},
update(dt){const b=this.b;if(held.l)this.px-=380*dt;if(held.r)this.px+=380*dt;this.px=Math.max(40,Math.min(W-40,this.px));
b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<5||b.x>W-5)b.vx*=-1;if(b.y<5)b.vy=Math.abs(b.vy);
if(b.y>470&&b.y<490&&Math.abs(b.x-this.px)<48&&b.vy>0){b.vy=-Math.abs(b.vy);b.vx=(b.x-this.px)*5}
this.k=this.k.filter(k=>{if(b.x>k.x&&b.x<k.x+46&&b.y>k.y&&b.y<k.y+20){b.vy*=-1;this.sc+=10;return false}return true});
if(!this.k.length){this.sc+=100;over()}if(b.y>H)over()},
draw(){X.fillStyle='#0b0e1a';X.fillRect(0,0,W,H);this.k.forEach(k=>{X.fillStyle=k.c;X.fillRect(k.x,k.y,46,20)});
X.fillStyle='#00ffcc';X.fillRect(this.px-40,480,80,10);X.fillStyle='#fff';X.beginPath();X.arc(this.b.x,this.b.y,6,0,7);X.fill()}};

const catcher={t:'🧺 Fruit Catcher',h:'◀ ▶ / drag se tokri hilao. Fruits pakdo, bomb 💣 se bacho! 3 jaan hain.',
init(){this.x=200;this.o=[];this.sc=0;this.st=0;this.hp=3},
drag(x){this.x=x},
update(dt){if(held.l)this.x-=340*dt;if(held.r)this.x+=340*dt;this.x=Math.max(30,Math.min(W-30,this.x));
this.st-=dt;if(this.st<=0){this.st=Math.max(.3,.8-this.sc/800);this.o.push({x:rnd(20,W-20),y:-20,s:rnd(130,200)+this.sc/6,b:Math.random()<.22,e:['🍎','🍌','🍇','🍉','🍊'][ri(0,5)]})}
this.o.forEach(o=>{o.y+=o.s*dt;if(o.y>450&&o.y<490&&Math.abs(o.x-this.x)<42){o.d=1;if(o.b)this.hp--;else this.sc+=10}if(o.y>H)o.d=1});
this.o=this.o.filter(o=>!o.d);if(this.hp<=0)over()},
draw(){const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a0b3a');g.addColorStop(1,'#0f4c5c');X.fillStyle=g;X.fillRect(0,0,W,H);
this.o.forEach(o=>em(o.b?'💣':o.e,o.x,o.y,34));em('🧺',this.x,470,48);em('❤️'.repeat(Math.max(0,this.hp)),60,25,20)}};

const mole={t:'🔨 Whack-a-Mole',h:'Mole 🐹 par tap/click karo! 30 second hai.',
init(){this.sc=0;this.tl=30;this.m=-1;this.mt=.5},
tap(x,y){const i=((y-90)/120|0)*3+Math.min(2,x/134|0);if(y>=90&&y<450&&i==this.m){this.sc+=10;this.m=-1;this.mt=.15}},
update(dt){this.tl-=dt;if(this.tl<=0)return over();this.mt-=dt;if(this.mt<=0){this.m=this.m<0?ri(0,9):-1;this.mt=this.m<0?.25:Math.max(.5,1-this.sc/400)}},
draw(){X.fillStyle='#14301f';X.fillRect(0,0,W,H);X.fillStyle='#fff';X.font='20px sans-serif';X.textAlign='center';X.fillText('⏱ '+Math.max(0,Math.ceil(this.tl)),200,45);
for(let i=0;i<9;i++){const x=(i%3)*133+66,y=(i/3|0)*120+150;X.fillStyle='#3b2a1a';X.beginPath();X.ellipse(x,y+22,50,20,0,0,7);X.fill();if(i==this.m)em('🐹',x,y,56)}}};

const memo={t:'🧠 Brain Challenge',h:'Cards palto aur jodi match karo. Kam moves = zyada score.',
init(){const e=['🍎','🚀','🎮','⚽','🐱','🌟','🍕','🎧'];this.c=[...e,...e].sort(()=>Math.random()-.5).map(v=>({v,o:0,m:0}));this.f=[];this.mvs=0;this.sc=0;this.t=0;this.m=0},
tap(x,y){if(this.t>0)return;const c=this.c[(y/125|0)*4+Math.min(3,x/100|0)];if(!c||c.o||c.m)return;c.o=1;this.f.push(c);
if(this.f.length==2){this.mvs++;if(this.f[0].v==this.f[1].v){this.f.forEach(c=>c.m=1);this.f=[];this.m++;this.sc=Math.max(0,this.m*20-this.mvs)}else this.t=.7}},
update(dt){if(this.t>0){this.t-=dt;if(this.t<=0){this.f.forEach(c=>c.o=0);this.f=[]}}if(this.m==8&&this.t<=0){this.sc+=100;over()}},
draw(){X.fillStyle='#0b0e1a';X.fillRect(0,0,W,H);this.c.forEach((c,i)=>{const x=i%4*100+6,y=(i/4|0)*125+6;X.fillStyle=c.m?'#0a7a4a':c.o?'#334':'#4a2a8a';X.fillRect(x,y,88,113);em(c.o||c.m?c.v:'❓',x+44,y+56,44)})}};

const pong={t:'🏓 Ping Pong',h:'◀ ▶ / drag se paddle hilao. Computer ko haraao!',
init(){this.px=200;this.ax=200;this.b={x:200,y:250,vx:150,vy:230};this.sc=0},
drag(x){this.px=x},
update(dt){const b=this.b;if(held.l)this.px-=420*dt;if(held.r)this.px+=420*dt;this.px=Math.max(45,Math.min(W-45,this.px));
this.ax+=Math.max(-1,Math.min(1,(b.x-this.ax)/30))*Math.min(240+this.sc,320)*dt;this.ax=Math.max(45,Math.min(W-45,this.ax));
b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<8||b.x>W-8)b.vx*=-1;
if(b.vy>0&&b.y>470&&b.y<490&&Math.abs(b.x-this.px)<50){b.vy=-b.vy*1.04;b.vx=(b.x-this.px)*5}
if(b.vy<0&&b.y<30&&b.y>10&&Math.abs(b.x-this.ax)<50){b.vy=-b.vy;b.vx=(b.x-this.ax)*4;this.sc+=10}
if(b.y<0){this.sc+=50;b.x=200;b.y=250;b.vx=rnd(-150,150);b.vy=230}if(b.y>H)over()},
draw(){X.fillStyle='#0b0e1a';X.fillRect(0,0,W,H);X.fillStyle='#223';X.fillRect(0,247,W,4);X.fillStyle='#ff3864';X.fillRect(this.ax-45,12,90,10);
X.fillStyle='#00ffcc';X.fillRect(this.px-45,480,90,10);X.fillStyle='#fff';X.beginPath();X.arc(this.b.x,this.b.y,7,0,7);X.fill()}};

/* ===== NAYE GAMES ===== */
const sf=n=>{if(window.sfx)sfx(n)};
const NS=['race','run','sub','geo','br','piano','stack','ninja','candy','blob','cross','ludo'];
const T=[[1,6],[2,6],[3,6],[4,6],[5,6],[6,5],[6,4],[6,3],[6,2],[6,1],[6,0],[7,0],[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[9,6],[10,6],[11,6],[12,6],[13,6],[14,6],[14,7],[14,8],[13,8],[12,8],[11,8],[10,8],[9,8],[8,9],[8,10],[8,11],[8,12],[8,13],[8,14],[7,14],[6,14],[6,13],[6,12],[6,11],[6,10],[6,9],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8],[0,7],[0,6]];
const HC=[[[1,7],[2,7],[3,7],[4,7],[5,7]],[[7,1],[7,2],[7,3],[7,4],[7,5]],[[13,7],[12,7],[11,7],[10,7],[9,7]],[[7,13],[7,12],[7,11],[7,10],[7,9]]];
const LS=[0,13,26,39],SAFE=[0,13,26,39,8,21,34,47],LC=['#e74c3c','#2ecc71','#f1c40f','#3498db'],LN=['Aap (Laal)','Hara','Peela','Neela'];

const ludo={t:'🎲 Ludo',h:'Dice ke liye tap/SPACE. 6 aane par goti nikalti hai. Phir apni laal goti par tap karo. Sabse pehle 4 goti ghar pahunchao!',
init(){this.P=[0,1,2,3].map(()=>[-1,-1,-1,-1]);this.tr=0;this.ph=0;this.d=0;this.m=[];this.tm=.5;this.win=-1;this.sc=0},
calc(){return this.P[0].reduce((a,s)=>a+s+1,0)+(this.win==0?200:0)},
mv(p,d){return this.P[p].map((s,i)=>s<0?(d==6?i:-1):(s+d<=56?i:-1)).filter(i=>i>=0)},
roll(){this.d=ri(1,7);this.m=this.mv(this.tr,this.d);sf('dice');this.tm=this.tr?.3:.45;this.ph=this.m.length?1:2},
hit(p,c){let h=false;if(SAFE.includes(c))return h;for(let q=0;q<4;q++)if(q!=p)this.P[q].forEach((t,j)=>{if(t>=0&&t<=50&&(LS[q]+t)%52==c){if(p<0)h=true;else{this.P[q][j]=-1;h=true;sf('hit')}}});return h},
go(i){const p=this.tr,P=this.P[p];let s=P[i],b=this.d==6;s=s<0?0:s+this.d;P[i]=s;
 if(s<=50&&this.hit(p,(LS[p]+s)%52))b=true;if(s==56)b=true;
 if(P.every(x=>x==56)){this.win=p;if(p==0)this.won=1;this.sc=this.calc();return over()}
 if(!b)this.tr=(p+1)%4;this.ph=0;this.tm=this.tr?.4:.5},
bot(){const p=this.tr;let best=this.m[0],bs=-1;this.m.forEach(i=>{const s=this.P[p][i],ns=s<0?0:s+this.d;let v=ns+(s<0?30:0)+(ns==56?60:0);
 if(ns<=50){const c=(LS[p]+ns)%52;if(!SAFE.includes(c))for(let q=0;q<4;q++)if(q!=p)this.P[q].forEach(t=>{if(t>=0&&t<=50&&(LS[q]+t)%52==c)v+=80})}
 if(v>bs){bs=v;best=i}});return best},
update(dt){this.sc=this.calc();this.tm-=dt;if(this.tm>0||this.win>=0)return;
 if(this.ph==2){this.tr=(this.tr+1)%4;this.ph=0;this.tm=.4;return}
 if(this.tr==0){if(this.ph==1&&this.m.length==1)this.go(this.m[0]);return}
 if(this.ph==0)this.roll();else this.go(this.bot())},
key(k){if(k=='f'&&this.tr==0&&this.ph==0&&this.tm<=0&&this.win<0)this.roll()},
tap(x,y){if(this.tr!=0||this.win>=0||this.tm>0)return;if(this.ph==0)return this.roll();
 let bi=-1,bd=1e9;this.m.forEach(i=>{const [px,py]=this.xy(0,i),dd=Math.hypot(px-x,py-y);if(dd<bd){bd=dd;bi=i}});if(bd<32)this.go(bi)},
xy(p,i){const s=this.P[p][i];let c;
 if(s<0){const b=[[0,0],[9,0],[9,9],[0,9]][p];c=[b[0]+1.5+(i%2)*2,b[1]+1.5+(i>>1)*2]}
 else if(s<=50){const q=T[(LS[p]+s)%52];c=[q[0]+.5,q[1]+.5]}
 else if(s<=55){const q=HC[p][s-51];c=[q[0]+.5,q[1]+.5]}
 else c=[7.5+(p-1.5)*.3,7.5+(i-1.5)*.3];
 return[c[0]*26+5,c[1]*26+5]},
draw(){const c=26,o=5;X.fillStyle='#0b0e1a';X.fillRect(0,0,W,H);
 [[0,0],[9,0],[9,9],[0,9]].forEach((b,p)=>{X.fillStyle=LC[p]+'66';X.fillRect(o+b[0]*c,o+b[1]*c,6*c,6*c)});
 T.forEach((q,i)=>{X.fillStyle=SAFE.includes(i)?(i%13==0?LC[i/13]:'#ffe9a8'):'#e8e8f0';X.fillRect(o+q[0]*c+1,o+q[1]*c+1,c-2,c-2)});
 HC.forEach((h,p)=>{X.fillStyle=LC[p];h.forEach(q=>X.fillRect(o+q[0]*c+1,o+q[1]*c+1,c-2,c-2))});
 em('⭐',7.5*c+o,7.5*c+o,22);
 for(let p=0;p<4;p++)for(let i=0;i<4;i++){const [x,y]=this.xy(p,i);X.fillStyle=LC[p];X.beginPath();X.arc(x,y,10,0,7);X.fill();X.strokeStyle='#fff';X.lineWidth=2;X.stroke()}
 if(this.tr==0&&this.ph==1&&this.win<0)this.m.forEach(i=>{const [x,y]=this.xy(0,i);X.strokeStyle='#fff';X.beginPath();X.arc(x,y,14+Math.sin(performance.now()/120)*2,0,7);X.stroke()});
 const msg=this.win>=0?'🏆 '+LN[this.win]+' jeet gaya!':this.tr==0?(this.ph==0?'🎲 Dice ke liye tap karo':this.ph==1?'Apni goti chuno (tap)':'Koi chaal nahi'):'Khel raha hai: '+LN[this.tr];
 X.fillStyle='#fff';X.font='bold 17px sans-serif';X.textAlign='center';X.textBaseline='middle';X.fillText(msg,200,418);
 X.fillStyle=LC[this.tr];X.fillRect(168,438,64,50);X.fillStyle='#fff';X.font='bold 32px sans-serif';X.fillText(this.d||'?',200,463)}};

const br={t:'🪖 Battle Royale',h:'BGMI style! Zone (laal ghera) chhota hota jayega. WASD/stick se move, tap se goli, 🔥 se auto-aim. 🩹 se health lo. Aakhri bano!',
init(){this.p={x:200,y:250,hp:100};this.b=[];this.e=Array.from({length:8},()=>({x:rnd(30,370),y:rnd(30,470),hp:40,cd:rnd(.5,2),a:rnd(0,6.28)}));this.m=[];this.z=330;this.pts=0;this.tt=0;this.cd=0;this.md=4;this.mt=6;this.sc=0},
fire(tx,ty){if(this.cd>0)return;const a=Math.atan2(ty-this.p.y,tx-this.p.x);this.b.push({x:this.p.x,y:this.p.y,vx:Math.cos(a)*520,vy:Math.sin(a)*520,o:0});this.cd=.22;sf('shot')},
tap(x,y){this.fire(x,y)},
update(dt){const p=this.p,v=150*dt,Z=this.z,al=this.e;this.tt+=dt;this.z=Math.max(45,this.z-3.2*dt);this.cd-=dt;
 if(held.l)p.x-=v;if(held.r)p.x+=v;if(held.u)p.y-=v;if(held.d)p.y+=v;p.x=Math.max(12,Math.min(W-12,p.x));p.y=Math.max(12,Math.min(H-12,p.y));
 if(Math.hypot(p.x-200,p.y-250)>Z)p.hp-=8*dt;
 if(held.f&&al.length){let n=al[0];al.forEach(q=>{if(Math.hypot(q.x-p.x,q.y-p.y)<Math.hypot(n.x-p.x,n.y-p.y))n=q});this.fire(n.x,n.y)}
 this.md-=dt;if(this.md<=0&&al.length>2){this.md=rnd(5,9);al.splice(ri(0,al.length),1)}
 this.mt-=dt;if(this.mt<=0){this.mt=8;const a=rnd(0,6.28),r=rnd(0,this.z*.8);this.m.push({x:200+Math.cos(a)*r,y:250+Math.sin(a)*r})}
 this.m=this.m.filter(m=>{if(Math.hypot(m.x-p.x,m.y-p.y)<18){p.hp=Math.min(100,p.hp+30);sf('score');return false}return true});
 al.forEach(q=>{const d=Math.hypot(p.x-q.x,p.y-q.y),out=Math.hypot(q.x-200,q.y-250)>Z;q.cd-=dt;
  if(out||d>170){const a=out?Math.atan2(250-q.y,200-q.x):q.a;q.x+=Math.cos(a)*40*dt;q.y+=Math.sin(a)*40*dt;if(Math.random()<.01)q.a=rnd(0,6.28)}
  else if(d<110){const a=Math.atan2(q.y-p.y,q.x-p.x);q.x+=Math.cos(a)*25*dt;q.y+=Math.sin(a)*25*dt}
  if(out)q.hp-=8*dt;
  if(d<190&&q.cd<=0){q.cd=rnd(1,2);const a=Math.atan2(p.y-q.y,p.x-q.x)+rnd(-.3,.3);this.b.push({x:q.x,y:q.y,vx:Math.cos(a)*260,vy:Math.sin(a)*260,o:1})}});
 this.b.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;
  if(b.o){if(Math.hypot(b.x-p.x,b.y-p.y)<12){p.hp-=10;b.x=-999;sf('hit')}}
  else al.forEach(q=>{if(Math.hypot(b.x-q.x,b.y-q.y)<14){b.x=-999;q.hp-=20}})});
 this.b=this.b.filter(b=>b.x>0&&b.x<W&&b.y>0&&b.y<H);
 this.e=al.filter(q=>q.hp>0||(this.pts+=100,sf('score'),false));
 this.sc=this.pts+(this.tt*2|0);
 if(!this.e.length){this.pts+=300;this.sc=this.pts+(this.tt*2|0);this.won=1;return over()}
 if(p.hp<=0)over()},
draw(){X.fillStyle='#16241a';X.fillRect(0,0,W,H);X.fillStyle='#ff304744';X.beginPath();X.rect(0,0,W,H);X.arc(200,250,this.z,0,7,true);X.fill('evenodd');
 X.strokeStyle='#4da6ff';X.lineWidth=2;X.beginPath();X.arc(200,250,this.z,0,7);X.stroke();
 this.m.forEach(m=>em('🩹',m.x,m.y,22));this.b.forEach(b=>{X.fillStyle=b.o?'#ff3864':'#ffd23f';X.beginPath();X.arc(b.x,b.y,3.5,0,7);X.fill()});
 this.e.forEach(q=>em('😎',q.x,q.y,26));em('🪖',this.p.x,this.p.y,30);
 X.fillStyle='#333';X.fillRect(10,10,120,10);X.fillStyle=this.p.hp>35?'#00ffcc':'#ff3864';X.fillRect(10,10,Math.max(0,this.p.hp)*1.2,10);
 X.fillStyle='#fff';X.font='14px sans-serif';X.textAlign='left';X.textBaseline='top';X.fillText('👥 '+(this.e.length+1)+' bache',140,8)}};

const sub={t:'🏃 Subway Runner',h:'◀ ▶ / swipe se lane badlo, ▲ ya tap se kudo (🚧 par). Train 🚆 se lane badalke bacho, coins 🪙 lo!',sw:1,
init(){this.l=1;this.x=200;this.j=0;this.sc=0;this.sp=260;this.o=[];this.c=[];this.st=0;this.off=0},
key(k){if(k=='l')this.l=Math.max(0,this.l-1);if(k=='r')this.l=Math.min(2,this.l+1);if(k=='u'&&this.j<=0){this.j=.6;sf('jump')}},
tap(){this.key('u')},
update(dt){this.sp+=7*dt;this.sc+=this.sp*dt/25;this.j-=dt;this.x+=(this.l*120+80-this.x)*Math.min(1,dt*14);this.off=(this.off+this.sp*dt)%40;
 this.st-=dt;if(this.st<=0){this.st=rnd(.45,.9)*300/this.sp;this.o.push({l:ri(0,3),y:-40,k:Math.random()<.5?'🚆':'🚧'});if(Math.random()<.7)this.c.push({l:ri(0,3),y:-120})}
 this.o.forEach(o=>{o.y+=this.sp*dt;if(o.l==this.l&&Math.abs(o.y-410)<34&&(o.k=='🚆'||this.j<=0))over()});
 this.c.forEach(c=>{c.y+=this.sp*dt;if(c.l==this.l&&Math.abs(c.y-410)<30){c.y=999;this.sc+=10;sf('score')}});
 this.o=this.o.filter(o=>o.y<H+40);this.c=this.c.filter(c=>c.y<H+40)},
draw(){X.fillStyle='#22252e';X.fillRect(0,0,W,H);X.fillStyle='#fff';[140,260].forEach(x=>{for(let y=-40+this.off;y<H;y+=40)X.fillRect(x-2,y,4,18)});
 this.o.forEach(o=>em(o.k,o.l*120+80,o.y,o.k=='🚆'?56:40));this.c.forEach(c=>em('🪙',c.l*120+80,c.y,28));
 const yo=this.j>0?Math.sin((.6-this.j)/.6*Math.PI)*70:0;em('🏃',this.x,410-yo,46)}};

const ninja={t:'🍉 Fruit Ninja',h:'Ungli / mouse se fruits ko kaato! 💣 kaate to game over. 3 fruit girne par bhi game over.',
init(){this.f=[];this.tr=[];this.sc=0;this.st=0;this.lv=3;this.px=null;this.pt=0},
drag(x,y){const n=performance.now();if(n-this.pt>120)this.px=null;this.pt=n;
 if(this.px!=null)for(let i=0;i<=4;i++){const sx=this.px+(x-this.px)*i/4,sy=this.py+(y-this.py)*i/4;
  this.f.forEach(f=>{if(!f.d&&Math.hypot(f.x-sx,f.y-sy)<30){f.d=1;this.tr.push({x:f.x,y:f.y,t:.35,s:1});f.y=H+999;if(f.b){this.lv=0;sf('over')}else{this.sc+=10;sf('slice')}}})}
 this.px=x;this.py=y;this.tr.push({x,y,t:.25})},
update(dt){this.st-=dt;if(this.st<=0){this.st=Math.max(.5,1.1-this.sc/500);for(let n=ri(1,4);n--;)this.f.push({x:rnd(60,340),y:H+20,vx:rnd(-90,90),vy:-rnd(560,720),b:Math.random()<.18,e:['🍉','🍊','🍎','🍍','🥝','🍋'][ri(0,6)]})}
 this.f.forEach(f=>{f.vy+=620*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;if(f.y>H+30&&f.vy>0&&!f.d){f.d=1;if(!f.b){this.lv--;sf('hit')}}});
 this.f=this.f.filter(f=>!(f.d&&f.y>H));this.tr.forEach(t=>t.t-=dt);this.tr=this.tr.filter(t=>t.t>0);if(this.lv<=0)over()},
draw(){const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#3b2a1a');g.addColorStop(1,'#1a0f08');X.fillStyle=g;X.fillRect(0,0,W,H);
 this.f.forEach(f=>em(f.b?'💣':f.e,f.x,f.y,46));
 this.tr.forEach(t=>{X.fillStyle=t.s?'#ff3864aa':'rgba(255,255,255,'+Math.min(1,t.t*3)+')';X.beginPath();X.arc(t.x,t.y,t.s?16:5,0,7);X.fill()});
 em('❤️'.repeat(Math.max(0,this.lv)),60,25,20)}};

const GM=['🍬','🍭','🍫','🍩','🍓','🍋'];
const candy={t:'🍬 Candy Match',h:'Pass ki do candy par tap karke badlo. 3 ya zyada ek jaisi milao! Sirf 20 moves hain.',
init(){this.mv=20;this.sc=0;this.s=-1;do{this.g=Array.from({length:64},()=>ri(0,6))}while(this.fm().length)},
fm(){const m=new Set,g=this.g;for(let r=0;r<8;r++)for(let c=0;c<8;c++){const i=r*8+c,v=g[i];if(v<0)continue;
 if(c<6&&g[i+1]==v&&g[i+2]==v){m.add(i);m.add(i+1);m.add(i+2)}if(r<6&&g[i+8]==v&&g[i+16]==v){m.add(i);m.add(i+8);m.add(i+16)}}return[...m]},
cl(){let ch=1;for(let m=this.fm();m.length;m=this.fm()){m.forEach(i=>this.g[i]=-1);this.sc+=m.length*10*ch;ch++;sf('score');
 for(let c=0;c<8;c++){const col=[];for(let r=7;r>=0;r--)if(this.g[r*8+c]>=0)col.push(this.g[r*8+c]);while(col.length<8)col.push(ri(0,6));for(let r=7;r>=0;r--)this.g[r*8+c]=col[7-r]}}},
tap(x,y){const c=Math.floor((x-8)/48),r=Math.floor((y-60)/48);if(c<0||c>7||r<0||r>7)return;const i=r*8+c;
 if(this.s<0){this.s=i;return}
 const a=this.s;this.s=-1;if(Math.abs(a%8-c)+Math.abs((a/8|0)-r)!=1){this.s=i;return}
 [this.g[a],this.g[i]]=[this.g[i],this.g[a]];
 if(!this.fm().length){[this.g[a],this.g[i]]=[this.g[i],this.g[a]];return}
 this.mv--;this.cl();if(this.mv<=0)over()},
update(){},
draw(){X.fillStyle='#1a0b3a';X.fillRect(0,0,W,H);X.fillStyle='#fff';X.font='bold 20px sans-serif';X.textAlign='center';X.textBaseline='middle';X.fillText('Moves: '+this.mv,200,30);
 this.g.forEach((v,i)=>{const x=8+i%8*48,y=60+(i/8|0)*48;X.fillStyle=i==this.s?'#00ffcc66':'#ffffff14';X.fillRect(x+2,y+2,44,44);em(GM[v],x+24,y+25,34)})}};

const geo={t:'🟦 Geometry Dash',h:'SPACE / ▲ / tap se kudo. Spikes aur blocks se bacho, speed badhti jayegi!',
init(){this.y=426;this.vy=0;this.sc=0;this.sp=250;this.o=[];this.st=1;this.r=0},
key(k){if((k=='u'||k=='f')&&this.y>=426){this.vy=-640;sf('jump')}},tap(){this.key('u')},
update(dt){this.sp+=5*dt;this.sc+=this.sp*dt/20;this.vy+=1900*dt;this.y=Math.min(426,this.y+this.vy*dt);
 if(this.y>=426){this.vy=0;this.r=Math.round(this.r/(Math.PI/2))*Math.PI/2}else this.r+=dt*7;
 this.st-=dt;if(this.st<=0){this.st=rnd(.8,1.6)*330/this.sp;const b=Math.random()<.35;this.o.push({x:W+30,w:b?30:28,h:b?44:28,b})}
 this.o.forEach(o=>{o.x-=this.sp*dt;if(Math.abs(o.x-80)<o.w/2+12&&this.y+14>440-o.h+6)over()});this.o=this.o.filter(o=>o.x>-40)},
draw(){const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a0b3a');g.addColorStop(1,'#5b1a78');X.fillStyle=g;X.fillRect(0,0,W,H);
 X.fillStyle='#00ffcc';X.fillRect(0,440,W,4);X.fillStyle='#0d0d22';X.fillRect(0,444,W,56);
 X.fillStyle='#ff3864';this.o.forEach(o=>{if(o.b){X.fillStyle='#b46bff';X.fillRect(o.x-15,440-44,30,44)}else{X.fillStyle='#ff3864';X.beginPath();X.moveTo(o.x-14,440);X.lineTo(o.x,412);X.lineTo(o.x+14,440);X.fill()}});
 X.save();X.translate(80,this.y);X.rotate(this.r);X.fillStyle='#00ffcc';X.fillRect(-14,-14,28,28);X.strokeStyle='#fff';X.lineWidth=2;X.strokeRect(-14,-14,28,28);X.restore()}};

const piano={t:'🎹 Piano Tiles',h:'Sirf kaali tile par tap karo (ya A W S D). Safed par tap ya tile miss = game over!',
init(){this.rows=[];this.sc=0;this.sp=240;for(let i=0;i<6;i++)this.rows.push({c:ri(0,4),y:300-125*i,h:0})},
hit(c){const r=this.rows.find(r=>!r.h);if(!r)return;if(c==r.c&&r.y+125>0){r.h=1;this.sc++;this.sp+=4;sf('note')}else over()},
key(k){const c={l:0,u:1,d:2,r:3}[k];if(c!=null)this.hit(c)},
tap(x){this.hit(Math.max(0,Math.min(3,x/100|0)))},
update(dt){this.rows.forEach(r=>r.y+=this.sp*dt);while(this.rows[this.rows.length-1].y>-130)this.rows.push({c:ri(0,4),y:this.rows[this.rows.length-1].y-125,h:0});
 const r=this.rows.find(r=>!r.h);if(r&&r.y>H)return over();while(this.rows.length&&this.rows[0].y>H)this.rows.shift()},
draw(){X.fillStyle='#f4f4f8';X.fillRect(0,0,W,H);X.fillStyle='#ccd';for(let i=1;i<4;i++)X.fillRect(i*100-1,0,2,H);
 this.rows.forEach(r=>{X.fillStyle=r.h?'#bbb':'#111';X.fillRect(r.c*100+2,r.y+2,96,121)})}};

const stack={t:'🏗️ Stack Tower',h:'Tap / SPACE se block girao. Sahi jagah rakho, warna block chhota ho jata hai!',
init(){this.b=[{x:100,w:200}];this.x=0;this.w=200;this.d=1;this.sp=170;this.sc=0},
tap(){this.drop()},key(k){if(k=='f'||k=='u')this.drop()},
drop(){const p=this.b[this.b.length-1],l=Math.max(this.x,p.x),r=Math.min(this.x+this.w,p.x+p.w);if(r-l<=2)return over();
 this.b.push({x:l,w:r-l});this.w=r-l;this.x=Math.min(this.x,W-this.w);this.sc++;this.sp+=6;sf('score')},
update(dt){this.x+=this.d*this.sp*dt;if(this.x<0){this.x=0;this.d=1}if(this.x+this.w>W){this.x=W-this.w;this.d=-1}},
draw(){const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#10133a');g.addColorStop(1,'#431b5e');X.fillStyle=g;X.fillRect(0,0,W,H);const n=this.b.length;
 this.b.forEach((b,i)=>{X.fillStyle='hsl('+i*22+',75%,55%)';X.fillRect(b.x,260+(n-1-i)*28,b.w,26)});
 X.fillStyle='hsl('+n*22+',75%,60%)';X.fillRect(this.x,232,this.w,26)}};

const cross={t:'🐔 Crossy Road',h:'▲ / tap = aage kudo, ◀ ▶ / swipe = side me. Gaadiyon ke beech se sadak paar karo!',sw:1,
init(){this.r=0;this.x=200;this.rows=[];this.sc=0;for(let i=0;i<14;i++)this.row(i)},
row(i){const road=i>1&&Math.random()<.7,cars=[];if(road)for(let k=ri(2,4);k--;)cars.push(rnd(0,W));this.rows[i]={road,d:Math.random()<.5?1:-1,sp:rnd(60,150)+i*2,cars,e:['🚗','🚕','🚙','🚌'][ri(0,4)]}},
key(k){if(k=='u')this.fw();if(k=='l')this.x=Math.max(25,this.x-50);if(k=='r')this.x=Math.min(375,this.x+50);if(k=='d'&&this.r>0)this.r--},tap(){this.fw()},
fw(){this.r++;this.sc=Math.max(this.sc,this.r);while(this.rows.length<this.r+14)this.row(this.rows.length)},
update(dt){for(let i=Math.max(0,this.r-2);i<this.r+10;i++){const w=this.rows[i];if(w.road)w.cars=w.cars.map(c=>{c+=w.d*w.sp*dt;return c>W+30?-30:c<-30?W+30:c})}
 const w=this.rows[this.r];if(w.road&&w.cars.some(c=>Math.abs(c-this.x)<32))over()},
draw(){for(let i=Math.max(0,this.r-2);i<this.r+10;i++){const w=this.rows[i],y=420-(i-this.r)*50;X.fillStyle=w.road?'#2b2e36':(i%2?'#2e7d32':'#388e3c');X.fillRect(0,y-25,W,50);if(w.road)w.cars.forEach(c=>em(w.e,c,y,36))}em('🐔',this.x,420,36)}};

const blob={t:'🟣 Blob Battle',h:'Ungli / mouse se move karo. Chhote blobs ko kha jao, bade se bacho!',
init(){this.p={x:200,y:250,r:14};this.tx=200;this.ty=250;this.e=[];this.f=[];this.sc=0;for(let i=0;i<9;i++)this.sp(i<5?rnd(8,18):rnd(22,34));for(let i=0;i<30;i++)this.f.push({x:rnd(10,390),y:rnd(10,490)})},
sp(r){let x,y;do{x=rnd(20,380);y=rnd(20,480)}while(Math.hypot(x-this.p.x,y-this.p.y)<120);this.e.push({x,y,r,a:rnd(0,6.28),h:ri(0,360),t:0})},
drag(x,y){this.tx=x;this.ty=y},tap(x,y){this.tx=x;this.ty=y},
update(dt){const p=this.p;if(held.l)this.tx=p.x-60;if(held.r)this.tx=p.x+60;if(held.u)this.ty=p.y-60;if(held.d)this.ty=p.y+60;
 const a=Math.atan2(this.ty-p.y,this.tx-p.x),k=Math.min(1,Math.hypot(this.tx-p.x,this.ty-p.y)/40),s=Math.max(40,200-p.r*1.6)*k*dt;
 p.x=Math.max(p.r,Math.min(W-p.r,p.x+Math.cos(a)*s));p.y=Math.max(p.r,Math.min(H-p.r,p.y+Math.sin(a)*s));
 this.f=this.f.filter(f=>{if(Math.hypot(f.x-p.x,f.y-p.y)<p.r){p.r+=.4;this.sc+=1;return false}return true});while(this.f.length<30)this.f.push({x:rnd(10,390),y:rnd(10,490)});
 this.e.forEach(q=>{const d=Math.hypot(p.x-q.x,p.y-q.y);q.t-=dt;if(q.t<=0){q.t=rnd(.6,1.6);q.a=d<160?Math.atan2(p.y-q.y,p.x-q.x)+(q.r>p.r?0:Math.PI):rnd(0,6.28)}
  const s=Math.max(30,110-q.r)*dt;q.x=Math.max(q.r,Math.min(W-q.r,q.x+Math.cos(q.a)*s));q.y=Math.max(q.r,Math.min(H-q.r,q.y+Math.sin(q.a)*s));
  if(d<Math.max(p.r,q.r)){if(p.r>q.r*1.1){p.r+=q.r*.25;this.sc+=20;q.dead=1;sf('score')}else if(q.r>p.r*1.1)over()}});
 this.e=this.e.filter(q=>!q.dead);while(this.e.length<9)this.sp(rnd(8,Math.max(20,p.r*1.4)))},
draw(){X.fillStyle='#0d1020';X.fillRect(0,0,W,H);X.fillStyle='#77ccff';this.f.forEach(f=>X.fillRect(f.x-3,f.y-3,6,6));
 this.e.forEach(q=>{X.fillStyle='hsl('+q.h+',70%,'+(q.r>this.p.r?'42%':'62%')+')';X.beginPath();X.arc(q.x,q.y,q.r,0,7);X.fill()});
 X.fillStyle='#00ffcc';X.shadowColor='#00ffcc';X.shadowBlur=16;X.beginPath();X.arc(this.p.x,this.p.y,this.p.r,0,7);X.fill();X.shadowBlur=0}};

const g2048={t:'🔢 2048',h:'Arrow keys / WASD / swipe se tiles milao. Ek jaise do tiles jud jate hain!',sw:1,
ix(d,r,c){return d%2?(d==1?c*4+r:(3-c)*4+r):(d==0?r*4+c:r*4+3-c)},
init(){this.g=Array(16).fill(0);this.sc=0;this.add();this.add()},
add(){const e=[];this.g.forEach((v,i)=>v||e.push(i));if(e.length)this.g[e[ri(0,e.length)]]=Math.random()<.9?2:4},
can(){const g=this.g;for(let i=0;i<16;i++)if(g[i]&&((i%4<3&&g[i]==g[i+1])||(i<12&&g[i]==g[i+4])))return true;return false},
key(k){const d={l:0,u:1,r:2,d:3}[k];if(d==null)return;const old=this.g.slice();
 for(let r=0;r<4;r++){let ln=[];for(let c=0;c<4;c++)ln.push(this.g[this.ix(d,r,c)]);ln=ln.filter(x=>x);
  for(let i=0;i<ln.length-1;i++)if(ln[i]==ln[i+1]){ln[i]*=2;this.sc+=ln[i];ln.splice(i+1,1)}
  while(ln.length<4)ln.push(0);for(let c=0;c<4;c++)this.g[this.ix(d,r,c)]=ln[c]}
 if(old.some((v,i)=>v!=this.g[i])){this.add();if(!this.g.includes(0)&&!this.can())over()}},
update(){},
draw(){X.fillStyle='#10131c';X.fillRect(0,0,W,H);X.fillStyle='#1c2233';X.fillRect(10,70,380,380);
 this.g.forEach((v,i)=>{const x=20+i%4*92,y=80+(i/4|0)*92;X.fillStyle=v?'hsl('+(220-Math.log2(v)*18)+',70%,'+(35+Math.min(v,512)/20)+'%)':'#2a3148';X.fillRect(x,y,86,86);
  if(v){X.fillStyle='#fff';X.font='bold '+(v>999?24:32)+'px sans-serif';X.textAlign='center';X.textBaseline='middle';X.fillText(v,x+43,y+43)}})}};

const games={snake,arena,race,run,flap,space,brick,catcher,mole,memo,pong,ludo,br,sub,ninja,candy,geo,piano,stack,cross,blob,g2048};
const list=[['ludo','🎲','Ludo','Computer ke 3 players ke saath Ludo. 6 aaye to goti nikalo, katke bhejo, ghar pahunchao!','BOARD'],
['br','🪖','Battle Royale','BGMI style: zone chhota hota hai, 8 dushmano ke beech aakhri bano!','NEW'],
['sub','🏃','Subway Runner','Trains se bacho, kudo aur coins lo.','NEW'],
['ninja','🍉','Fruit Ninja','Ungli se fruits kaato, bomb se bacho.','NEW'],
['candy','🍬','Candy Match','Candy Crush style match-3 puzzle.','NEW'],
['geo','🟦','Geometry Dash','Spikes se bacho, neon runner.','NEW'],
['piano','🎹','Piano Tiles','Kaali tiles par tap karo, music banao.','NEW'],
['stack','🏗️','Stack Tower','Perfect timing se tower banao.','NEW'],
['cross','🐔','Crossy Road','Gaadiyon ke beech se sadak paar karo.','NEW'],
['blob','🟣','Blob Battle','Agar.io style: chhote ko khao, bade se bacho.','NEW'],
['g2048','🔢','2048','Tiles milao aur 2048 banao.','PUZZLE'],
['snake','🐍','Snake Game','Khana khao, snake badhao aur high score todo.','CLASSIC'],
['arena','🔫','Battle Arena','BGMI style survival shooter: zombies se bacho aur kill karo.','ACTION'],
['race','🏍️','Racing Zone','Bike ya car chalao, traffic se bachte hue high speed race karo.','RACING'],
['run','🌄','Adventure Run','Hero ke saath kudo, coins jama karo, adventure poora karo.','ADVENTURE'],
['flap','🐦','Flappy Bird','Pipes ke beech se udo, jitna door jao utna score.','ARCADE'],
['space','🚀','Space Shooter','Asteroids aur aliens ko udao, galaxy bachao.','SHOOTER'],
['brick','🧱','Brick Breaker','Ball se saari rangeen bricks tod do.','ARCADE'],
['catcher','🧺','Fruit Catcher','Fruits pakdo aur bomb se bacho.','CASUAL'],
['mole','🔨','Whack-a-Mole','30 second me jitne mole maar sako maaro.','REFLEX'],
['memo','🧠','Brain Challenge','Memory cards match karke apna dimaag test karo.','PUZZLE'],
['pong','🏓','Ping Pong','Computer ke khilaf paddle battle jeeto.','SPORTS']];
$('#gl').innerHTML=list.map(g=>`<div class="card"><div class="tag">${g[4]}</div><div class="ic">${g[1]}</div><h3>${g[2]}</h3><p>${g[3]}</p><button class="btn" onclick="openG('${g[0]}')">PLAY NOW</button></div>`).join('');

function openG(n){G=games[n];G.n=n;$('#ov').classList.add('on');document.body.style.overflow='hidden';
$('#gt').textContent=G.t;$('#hp').textContent=G.h;$('#vm').style.display=n=='race'?'flex':'none';restart()}
function restart(){for(const k in held)delete held[k];G.init();G.on=true;ls=0;if(window.sfx)sfx('start');if(window.mstart)mstart(G.n);$('#msg').textContent='';
cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(loop)}
function closeG(){if(window.mstop)mstop();G=null;cancelAnimationFrame(raf);$('#ov').classList.remove('on');document.body.style.overflow=''}
function over(){if(!G.on)return;G.on=false;if(window.mstop)mstop();if(window.sfx)sfx(G.won?'win':'over');const b=hi(G.n,G.sc|0);$('#msg').textContent='Game Over! Score: '+(G.sc|0)+' | Best: '+b;if(window.onGameOver)window.onGameOver(G.n,G.sc|0)}
function loop(t){if(!G)return;const dt=Math.min((t-last)/1000,.05);last=t;if(G.on)G.update(dt);G.draw();const s=G.sc|0,stp=G.n=='flap'||G.n=='memo'?1:NS.includes(G.n)?1e9:10;if(G.on&&window.sfx&&s-ls>=stp){sfx('score');ls=s}else if(s<ls)ls=s;
$('#sc').textContent='Score: '+(G.sc|0);raf=requestAnimationFrame(loop)}

addEventListener('keydown',e=>{if(!G)return;if(e.key=='Escape')return closeG();const k=KM[e.key.toLowerCase()];if(!k)return;
e.preventDefault();held[k]=1;if(!e.repeat&&G.on&&G.key)G.key(k)});
addEventListener('keyup',e=>{delete held[KM[e.key.toLowerCase()]]});
document.querySelectorAll('[data-k]').forEach(b=>{const k=b.dataset.k;
b.addEventListener('pointerdown',e=>{e.preventDefault();held[k]=1;if(G&&G.on&&G.key)G.key(k)});
['pointerup','pointerleave','pointercancel'].forEach(v=>b.addEventListener(v,()=>delete held[k]))});
let ps=null;
C.addEventListener('pointerdown',e=>{ps={x:e.clientX,y:e.clientY}});
C.addEventListener('pointerup',e=>{if(!ps||!G||!G.on)return;const dx=e.clientX-ps.x,dy=e.clientY-ps.y;ps=null;
if(Math.abs(dx)>30||Math.abs(dy)>30){if(G.sw||G.n=='snake')G.key(Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):(dy>0?'d':'u'));return}
const r=C.getBoundingClientRect();if(G.tap)G.tap((e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height)});
C.addEventListener('pointermove',e=>{if(G&&G.on&&G.drag){const r=C.getBoundingClientRect();G.drag((e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height)}});
const bg=$('#bgc'),B=bg.getContext('2d');let pt=[];
function rs(){bg.width=innerWidth;bg.height=innerHeight;pt=Array.from({length:Math.min(80,innerWidth/12|0)},()=>({x:rnd(0,bg.width),y:rnd(0,bg.height),r:rnd(1,3),s:rnd(10,45),h:Math.random()<.5?170:280}))}
function orb(x,y,r,c){const g=B.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');B.fillStyle=g;B.fillRect(x-r,y-r,2*r,2*r)}
rs();addEventListener('resize',rs);
(function f(t){if(G||document.hidden){requestAnimationFrame(f);return}const w=bg.width,h=bg.height;B.fillStyle='#090914';B.fillRect(0,0,w,h);
orb(w*(.2+.08*Math.sin(t/3000)),h*(.3+.1*Math.cos(t/4000)),420,'rgba(130,50,255,.28)');orb(w*(.8+.08*Math.cos(t/3500)),h*(.7+.1*Math.sin(t/4500)),420,'rgba(0,255,204,.16)');
B.strokeStyle='rgba(0,255,204,.07)';B.beginPath();const o=(t/40)%50;for(let x=-o;x<w;x+=50){B.moveTo(x,0);B.lineTo(x,h)}for(let y=o;y<h;y+=50){B.moveTo(0,y);B.lineTo(w,y)}B.stroke();
pt.forEach(p=>{p.y-=p.s*.016;if(p.y<0)p.y=h;B.fillStyle='hsla('+p.h+',100%,65%,.7)';B.beginPath();B.arc(p.x,p.y,p.r,0,7);B.fill()});
requestAnimationFrame(f)})(0);
$('#mb').onclick=()=>$('#nv').classList.toggle('on');
document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>$('#nv').classList.remove('on'));
