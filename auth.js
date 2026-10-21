// Google login + leaderboard (Firebase). Is file me kuch badalne ki zarurat nahi.
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc,collection,query,orderBy,limit,getDocs,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {firebaseConfig as cfg} from "./firebase-config.js";

const $=s=>document.querySelector(s);
const ready=!Object.values(cfg).some(v=>String(v).includes('YOUR_'));
let auth,db,user=null;
const lg=$('#lg');
const label=()=>{lg.textContent=user?'👤 '+(user.displayName||'Player')+' (Logout)':'🔐 Login with Google'};
label();

function msg(t){const ol=$('#lbl');ol.textContent='';const li=document.createElement('li');li.textContent=t;ol.append(li)}

async function loadBoard(){
  if(!ready)return;
  try{
    const snap=await getDocs(query(collection(db,'scores_'+$('#lbg').value),orderBy('score','desc'),limit(10)));
    if(snap.empty)return msg('Abhi koi score nahi. Pehle aap bano!');
    const ol=$('#lbl');ol.textContent='';let i=1;
    snap.forEach(d=>{const x=d.data(),li=document.createElement('li'),a=document.createElement('span'),b=document.createElement('b');
      a.textContent=(i++)+'. '+x.name;b.textContent=x.score;li.append(a,b);ol.append(li)});
  }catch(e){console.error(e);msg('Leaderboard load nahi hua. Firestore rules check karo.')}
}

if(ready){
  const app=initializeApp(cfg);auth=getAuth(app);db=getFirestore(app);
  onAuthStateChanged(auth,u=>{user=u;label()});
  loadBoard();
}

lg.onclick=async e=>{
  e.preventDefault();$('#nv').classList.remove('on');
  if(!ready)return alert('Pehle firebase-config.js me apni Firebase keys daalo.');
  try{if(user)await signOut(auth);else await signInWithPopup(auth,new GoogleAuthProvider())}
  catch(err){alert('Login nahi hua: '+err.message)}
};

// game.js ka over() har game ke baad ye function chalata hai
window.onGameOver=async(game,score)=>{
  if(!ready||!user||score<=0)return;
  try{
    const ref=doc(db,'scores_'+game,user.uid),old=await getDoc(ref);
    if(old.exists()&&old.data().score>=score)return;
    await setDoc(ref,{uid:user.uid,name:user.displayName||'Player',score:Math.floor(score),t:serverTimestamp()});
    if($('#lbg').value==game)loadBoard();
  }catch(e){console.error(e)}
};
$('#lbg').onchange=loadBoard;
