'use strict';
/* v24: student navigation, readable feedback, and responsive workspaces.
   All learning content, scoring, profile keys, and v23 audio are retained. */
let v24Starting=false;
function v24FullscreenLabel(){
  const active=!!(document.fullscreenElement||document.webkitFullscreenElement);
  document.querySelectorAll('[data-v24-fullscreen]').forEach(b=>{
    b.textContent=active?'⛶ Perkecil':'⛶ Layar penuh';
    b.setAttribute('aria-label',active?'Keluar dari layar penuh':'Masuk layar penuh');
    b.setAttribute('aria-pressed',String(active));
  });
}
function v24RequestFullscreen(){
  if(document.fullscreenElement||document.webkitFullscreenElement)return Promise.resolve();
  const el=document.documentElement,request=el.requestFullscreen||el.webkitRequestFullscreen;
  if(!request)return Promise.resolve();
  try{return Promise.resolve(request.call(el)).catch(()=>{}).then(v24FullscreenLabel)}catch(e){return Promise.resolve()}
}
async function v24ToggleFullscreen(){
  try{
    if(document.fullscreenElement)await document.exitFullscreen();
    else if(document.webkitFullscreenElement)document.webkitExitFullscreen();
    else await v24RequestFullscreen();
  }catch(e){}
  v24FullscreenLabel();
  if(!document.fullscreenElement&&!document.webkitFullscreenElement&&!document.documentElement.requestFullscreen&&!document.documentElement.webkitRequestFullscreen)toast('Browser ini memakai tampilan penuh di dalam tab. Kamu tetap bisa melanjutkan belajar.');
}
function v24Begin(){
  if(v24Starting)return;
  v24Starting=true;
  // Request during the click itself; navigation must also work if it is denied.
  v24RequestFullscreen();
  v23StartMusic();
  if(state.student.name&&state.student.className){
    navigate(state.onboarding.completed?'dashboard':'guide',{onboarding:!state.onboarding.completed});
  }else navigate('identity');
  v24Starting=false;
}
renderOpening=function(){
  setApp(`<section class="v8-cover v20-game-cover v24-cover" aria-label="Halaman pembuka Nefi's Kidney Lab">
    <img class="v20-cover-bg" src="${V8_ASSETS.cover}" alt="" aria-hidden="true">
    <img class="v20-cover-art" src="${V8_ASSETS.cover}" alt="Nefi’s Kidney Lab, laboratorium ginjal interaktif">
    <div class="v20-cover-shade" aria-hidden="true"></div>
    <div class="v24-launch"><span class="v24-launch-tag">IPA · Kelas VIII</span>
      <button class="btn primary v24-start" onclick="v24Begin()">${state.student.name&&state.onboarding.completed?'Lanjut belajar':'Mulai belajar'} <span aria-hidden="true">→</span></button>
      <p>Satu ketukan untuk mulai dengan layar penuh.</p>
    </div></section>`);
};

// Utility controls have reserved space; no floating mascot or audio button.
const v24BaseSetApp=setApp;
setApp=function(html){
  const audio=document.getElementById('v23AudioRoot');
  if(audio)document.body.append(audio);
  v24BaseSetApp(html);
  document.body.classList.toggle('v24-playing',route.name==='game'&&!!document.querySelector('.v8-arcade'));
  const tools=document.createElement('div');tools.id='v24Tools';tools.className='v24-tools';
  tools.setAttribute('aria-label','Bantuan dan tampilan');
  const cover=route.name==='opening',story=route.name==='aperception';
  if(!cover&&!story){
    tools.innerHTML=`<div class="v24-tool-row"><span class="v24-location">${esc(({identity:'Selamat datang',guide:'Panduan belajar',dashboard:'Beranda',materialHub:'Materi',lab:'Baca materi',simulation:'Lab simulasi',game:'Nefi Arcade',evaluation:'Evaluasi',checkpoint:'Cek pemahaman',reflection:'Refleksi',results:'Hasil belajar',objectives:'Tujuan belajar'})[route.name]||'Kidney Lab')}</span>
      ${state.student.name?'<button class="btn" onclick="home()">⌂ Beranda</button>':''}
      <button id="v24Help" class="btn" aria-expanded="false" aria-controls="v13GuideRoot" onclick="v13GuideToggle(!v13GuideOpen)">? Bantuan</button>
      <button class="btn" data-v24-fullscreen onclick="v24ToggleFullscreen()">⛶ Layar penuh</button>
      <span id="v24AudioSlot"></span></div><div id="v24GuideSlot"></div>`;
  }else tools.innerHTML='<span id="v24AudioSlot"></span>';
  const main=document.getElementById('mainContent');
  if(story)document.querySelector('.v14-top-actions').append(tools);
  else main.before(tools);
  document.getElementById('v24AudioSlot').append(document.getElementById('v23AudioRoot'));
  V23_AUDIO_PANEL_OPEN=false;v23RefreshAudioUI();v24FullscreenLabel();
  document.getElementById('v13GuideRoot')?.remove();
  v13Guide();
};
v13Guide=function(){
  document.getElementById('v13GuideRoot')?.remove();
  v13GuideOpen=false;v13GuideKey=route.name;
  const slot=document.getElementById('v24GuideSlot');if(!slot)return;
  const root=document.createElement('aside');root.id='v13GuideRoot';root.hidden=true;
  root.setAttribute('aria-label','Bantuan aktivitas');slot.append(root);v13GuideDraw();
};
v13GuideDraw=function(){
  const root=document.getElementById('v13GuideRoot');if(!root)return;
  const g=V13_GUIDES[route.name]||['nefi','Belajar bersama Nefi','Gunakan Beranda untuk memilih aktivitas. Baca petunjuk, lakukan satu langkah, lalu amati hasilnya.'];
  root.className='v24-guide';root.hidden=!v13GuideOpen;
  root.innerHTML=`<div><strong>${esc(g[1])}</strong><p>${esc(g[2])}</p></div><button class="btn" onclick="v13GuideToggle(false)">Tutup bantuan</button>`;
  const b=document.getElementById('v24Help');if(b)b.setAttribute('aria-expanded',String(v13GuideOpen));
};
v13GuideToggle=function(open){v13GuideOpen=!!open;v13GuideDraw();if(!open)document.getElementById('v24Help')?.focus({preventScroll:true})};

// Readable, dismissible status messages. Empty values never create a blank box.
function v24DismissToast(){clearTimeout(toastTimer);document.getElementById('toast').classList.remove('show')}
toast=function(message){
  const el=document.getElementById('toast'),value=String(message??'').trim();
  if(!value){v24DismissToast();return}
  el.setAttribute('aria-atomic','true');
  el.innerHTML=`<span>${esc(value)}</span><button type="button" aria-label="Tutup pemberitahuan" onclick="v24DismissToast()">×</button>`;
  el.classList.add('show');clearTimeout(toastTimer);
  toastTimer=setTimeout(v24DismissToast,Math.min(15000,Math.max(7000,value.length*65)));
};
const v24Navigate=navigate;
navigate=function(name,params={}){v24DismissToast();return v24Navigate(name,params)};

// A missing prerequisite is explained beside the relevant controls and focused.
function v24PredictionStatus(focus=false){
  const box=document.getElementById('v24PredictError');if(!box)return;
  const p=state.simulation.prediction||{},missing=[];
  if(!p.volume)missing.push('volume urin');if(!p.concentration)missing.push('kepekatan urin');
  box.hidden=!missing.length;
  box.textContent=missing.length?'Sebelum menjalankan simulasi, pilih prediksi '+missing.join(' dan ')+'. Dugaanmu boleh belum tepat.':'';
  if(focus&&missing.length){
    v10Side('settings');simUiTab('predict');
    document.querySelector('.v9-control')?.scrollIntoView({block:'start',behavior:'auto'});
    box.focus({preventScroll:true});
  }
}
const v24Run=runSimulation;
runSimulation=function(){
  const p=state.simulation.prediction||{};
  if(!p.volume||!p.concentration){v24PredictionStatus(true);return}
  v24Run();
  document.querySelector('.v9-main-column')?.scrollIntoView({block:'start',behavior:'auto'});
};
const v24Predict=simPredict;
simPredict=function(kind,value){v24Predict(kind,value);v24PredictionStatus()};
const v24Sim=renderSimulation;
renderSimulation=function(){
  v24Sim();
  const root=document.getElementById('simRoot');root.classList.add('v24-sim');
  const side=root.querySelector('.v9-control');side.id='v24Settings';
  const guide=document.createElement('div');guide.className='v24-sim-steps';
  guide.innerHTML='<strong>Mulai percobaanmu</strong><span>1. Pilih kondisi</span><span>2. Buat dua prediksi</span><span>3. Jalankan & amati</span>';
  root.prepend(guide);
  const control=root.querySelector('.sim-control-core');
  control.querySelector('h2').textContent='Jalankan & amati';
  const settings=root.querySelector('#v10Settings');
  control.after(settings);
  const error=document.createElement('p');error.id='v24PredictError';error.className='v24-inline-feedback';
  error.hidden=true;error.tabIndex=-1;error.setAttribute('role','status');
  document.getElementById('simPanelPredict').prepend(error);
  // Controls and notes remain accessible in one column, without nested modes.
  root.querySelector('.v10-side-switch')?.remove();
  const notes=root.querySelector('#v10ProcessNotes');notes.hidden=false;notes.querySelector('h2').textContent='Keterangan proses';
  const mobile=root.querySelector('.v9-mobile-switch');
  mobile.innerHTML='<button onclick="document.querySelector(\'.v9-main-column\').scrollIntoView({block:\'start\'})">Lihat proses</button><button onclick="v24OpenSettings()">Kondisi & prediksi</button><button id="v9MobilePlay" onclick="runSimulation()">▶ Jalankan</button>';
  // Move the entire sidebar before rendering large diagrams on small screens.
  v10Side('settings');simUiTab('conditions');notes.hidden=false;
  const preview=document.createElement('button');preview.className='btn primary v24-predict-next';preview.textContent='Lanjut: buat prediksi →';preview.onclick=()=>{simUiTab('predict',true);document.getElementById('simPanelPredict').scrollIntoView({block:'start'})};
  document.getElementById('simPanelConditions').append(preview);
  const play=document.createElement('button');play.className='btn primary v24-predict-next';play.textContent='▶ Jalankan simulasi';play.onclick=()=>runSimulation();
  document.querySelector('#simPanelPredict .sim-prediction>.sim-learning-step').after(play);
  root.querySelector('.v15-back')?.remove();
  const pending=root.querySelector('.v9-short-note');if(pending)pending.textContent='Bandingkan dengan kondisi normal. Pilih volume dan kepekatan, lalu jalankan simulasi.';
  const missions=document.createElement('details');missions.className='v24-missions';missions.innerHTML='<summary>Misi tambahan (opsional)</summary>';
  const head=root.querySelector('.sim-mission-head');head.before(missions);
  let sibling=head;while(sibling){const next=sibling.nextElementSibling;missions.append(sibling);sibling=next}
  root.querySelectorAll('.sim-labels-mobile>.sim-mobile-label').forEach(el=>el.remove());
  const names=['Arteriol aferen','Glomerulus','Arteriol eferen','Kapsula Bowman','Kapiler peritubulus','Tubulus proksimal','Lengkung Henle','Tubulus distal','Duktus kolektivus','Pelvis ginjal','Ureter','Vena renalis'];
  const key=document.createElement('details');key.className='v24-diagram-key';
  key.innerHTML='<summary>Nama bagian nefron</summary><ol>'+names.map(n=>'<li>'+n+'</li>').join('')+'</ol>';
  root.querySelector('.sim-diagram-wrap').after(key);
  const back=document.createElement('button');back.className='btn v24-settings-back';back.textContent='↑ Ubah kondisi & prediksi';back.onclick=v24OpenSettings;
  root.querySelector('.v10-process-tools').append(back);
  v24ResponsiveLayout();
  V7SIM.wide=innerWidth>=800;simUiApplyResponsiveSvg();simPositionParticles(simRuntime.progress);
};
v10Side=function(name){
  V10.side=name;
  const settings=document.getElementById('v10Settings'),notes=document.getElementById('v10ProcessNotes');
  if(settings)settings.hidden=false;if(notes)notes.hidden=false;
};
v9MobilePanel=function(name){V9.mobilePanel=name};
function v24OpenSettings(){simUiTab('conditions',true);document.getElementById('v24Settings')?.scrollIntoView({block:'start',behavior:'auto'})}
function v24ResponsiveLayout(){
  const root=document.getElementById('simRoot'),notes=document.getElementById('v10ProcessNotes');
  if(!root||!notes)return;
  (innerWidth<800?root.querySelector('.v9-main-column'):root.querySelector('.v9-control')).append(notes);
}

const v24Identity=renderIdentity;
renderIdentity=function(){
  v24Identity();
  const fields=['name','className'].map(id=>document.getElementById(id));
  const form=document.createElement('form');form.id='v24IdentityForm';form.noValidate=true;
  const grid=document.querySelector('.formgrid');grid.before(form);form.append(grid);
  const error=document.createElement('p');error.id='v24IdentityError';error.className='v24-inline-feedback';error.hidden=true;error.setAttribute('role','status');form.append(error);
  const actions=document.querySelector('.v9-identity>.actions');if(actions)form.append(actions);
  form.querySelectorAll('button').forEach(button=>{button.type='button';if(button.classList.contains('primary')){button.type='submit';button.removeAttribute('onclick')}});
  fields.forEach(input=>{input.required=true;input.maxLength=80;input.setAttribute('aria-describedby','v24IdentityError');input.addEventListener('input',()=>{input.removeAttribute('aria-invalid');if(fields.every(x=>x.value.trim()))error.hidden=true});input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submitIdentity()}})});
  form.addEventListener('submit',e=>{e.preventDefault();submitIdentity()});
};
const v24SubmitIdentity=submitIdentity;
submitIdentity=function(){
  const inputs=['name','className'].map(id=>document.getElementById(id)),missing=inputs.filter(x=>!x.value.trim());
  if(missing.length){
    const error=document.getElementById('v24IdentityError');error.hidden=false;error.textContent='Isi '+missing.map(x=>x.id==='name'?'nama':'kelas').join(' dan ')+' terlebih dahulu, lalu tekan Lanjut.';
    missing.forEach(x=>x.setAttribute('aria-invalid','true'));missing[0].focus();return;
  }
  v24SubmitIdentity();
};

// Dialogs always sit above utilities, scroll internally, and pause animation.
const v24ShowModal=showModal,v24CloseModal=closeModal;
let v24ResumeSimulation=false;
showModal=function(title,body,buttons){
  v23ToggleAudioPanel(false);v24DismissToast();
  v24ResumeSimulation=!!state.simulation.running;
  if(v24ResumeSimulation){state.simulation.running=false;simStopLoop(false)}
  v24ShowModal(title,body,buttons);
  document.getElementById('app').inert=true;
};
closeModal=function(){
  document.getElementById('app').inert=false;v24CloseModal();
  if(route.name==='game'&&v8State()?.v===8){arcadeStop();v8StartClock()}
  if(v24ResumeSimulation&&route.name==='simulation'){v24ResumeSimulation=false;state.simulation.running=true;simStartLoop();simUpdateUI(false)}
};
document.addEventListener('fullscreenchange',v24FullscreenLabel);
document.addEventListener('webkitfullscreenchange',v24FullscreenLabel);
window.addEventListener('resize',()=>requestAnimationFrame(()=>{if(route.name==='simulation'){v24ResponsiveLayout();simUiApplyResponsiveSvg()}}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){v23ToggleAudioPanel(false);if(v13GuideOpen)v13GuideToggle(false);v24DismissToast()}});
document.addEventListener('pointerdown',e=>{if(V23_AUDIO_PANEL_OPEN&&!e.target.closest('#v23AudioRoot'))v23ToggleAudioPanel(false)});
const v24AudioToggle=v23ToggleAudioPanel;
v23ToggleAudioPanel=function(force){
  const wasOpen=V23_AUDIO_PANEL_OPEN;v24AudioToggle(force);
  if(wasOpen&&!V23_AUDIO_PANEL_OPEN&&document.getElementById('v23AudioFab'))document.getElementById('v23AudioFab').focus({preventScroll:true});
};
// Show the cover on each fresh load, including returning students.
route={name:'opening',params:{}};
render();
