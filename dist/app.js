'use strict';
const {collection,projects,source}=window.WORKSHOP;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORAGE_KEY='mccann-audio-workshop-notebook-v1';
let filter='All',query='',expanded=false,sort='featured',selectedProject=projects[0].id,saveTimer,toastTimer;
let notebook={};let storageReady=true;
function validateBackup(value){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Invalid notebook');
 const clean={};
 for(const project of projects){const item=value[project.id];if(item===undefined)continue;if(!item||typeof item!=='object'||typeof item.notes!=='string'||item.notes.length>50000||!Array.isArray(item.checks)||item.checks.length!==project.steps.length||!item.checks.every(v=>typeof v==='boolean'))throw new Error('Invalid project');clean[project.id]={notes:item.notes,checks:item.checks,updated:typeof item.updated==='string'?item.updated:''};}
 return clean;
}
try{const saved=localStorage.getItem(STORAGE_KEY);if(saved)notebook=validateBackup(JSON.parse(saved));}catch(error){storageReady=false;}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4000);}
function artwork(item){
 const dark=item.tone!=='silver',face=dark?'#333f36':'#c6c7b8',edge=dark?'#17281d':'#8d9784',light=dark?'#c7cbb8':'#354b35';
 let shape='';
 if(item.form==='speaker'){
 shape='<ellipse cx="210" cy="235" rx="111" ry="12" fill="#768069" opacity=".15"/><path d="m133 39 109-15 45 25v177l-108 22-46-26Z" fill="#8c6845"/><path d="m133 39 46 25 108-15M179 64v184" stroke="#d4b08a" stroke-width="1" fill="none"/><path d="m188 76 89-16v149l-89 17Z" fill="#344033"/><path d="m200 89 64-11v27l-64 11Z" fill="#192b20"/><ellipse cx="232" cy="161" rx="32" ry="35" fill="#1c2c20"/><ellipse cx="232" cy="161" rx="22" ry="25" fill="#596048"/><ellipse cx="232" cy="161" rx="8" ry="10" fill="#273823"/><path d="m221 215 24-5v5l-24 5Z" fill="#c7ab79"/>';
 }else if(item.form==='turntable'){
 shape=`<ellipse cx="210" cy="222" rx="158" ry="11" fill="#768069" opacity=".15"/><path d="m57 131 245-29 66 58-245 36Z" fill="${face}"/><path d="m57 131 66 65v22l-66-66Z" fill="${edge}"/><path d="m123 196 245-36v21l-245 37Z" fill="${face}"/><ellipse cx="213" cy="150" rx="90" ry="36" fill="#192a20"/><ellipse cx="213" cy="150" rx="65" ry="26" fill="none" stroke="#65745b" stroke-width=".5"/><ellipse cx="213" cy="150" rx="24" ry="10" fill="#c1a36c"/><circle cx="213" cy="150" r="2" fill="#d7d8c6"/><path d="m318 131-44 43-22 3" stroke="#b4baa4" stroke-width="4" fill="none"/><circle cx="318" cy="131" r="6" fill="#263e2a"/><path d="m90 178 24-3" stroke="${light}" stroke-width="3"/>`;
 }else if(item.form==='center'){
 shape=`<ellipse cx="210" cy="217" rx="154" ry="12" fill="#768069" opacity=".15"/><path d="m49 127 256-30 62 38-255 35Z" fill="#4e5039"/><path d="m112 170 255-35v65l-255 37Z" fill="#2b3d2b"/><path d="m49 127 63 43v67l-63-44Z" fill="#78613f"/><ellipse cx="166" cy="194" rx="26" ry="25" fill="#a48451"/><ellipse cx="310" cy="175" rx="26" ry="25" fill="#a48451"/><path d="m214 177 49-7v28l-49 7Z" fill="#162b1c"/>`;
 }else{
 const isMeter=item.form==='meter',isPre=item.form==='preamp';
 shape=`<ellipse cx="210" cy="226" rx="163" ry="12" fill="#768069" opacity=".15"/><path d="m46 109 252-30 78 54-254 37Z" fill="${edge}"/><path d="m59 110 239-27 62 43-239 35Z" fill="#4b5948"/><path d="m46 109 76 61v58l-76-58Z" fill="${edge}"/><path d="m122 170 254-37v61l-254 34Z" fill="${face}"/><path d="m122 171 254-37" stroke="${light}" stroke-opacity=".4"/><path d="m146 220 26-4v10l-26 4Zm173-24 26-4v10l-26 4Z" fill="#1e301f"/>`;
 for(let i=0;i<9;i++)shape+=`<path d="m${93+i*18} 109 39 26" stroke="#203321" stroke-width="3" opacity=".6"/>`;
 if(isMeter){for(let i=0;i<2;i++)shape+=`<g transform="translate(${160+i*82},${177-i*12}) skewY(-8)"><rect width="67" height="29" rx="2" fill="#d7c89a"/><path d="M7 23Q32 0 60 23" stroke="#69704d" fill="none"/><path d="m33 28-8-19" stroke="#a16c3b"/><text x="33" y="22" text-anchor="middle" font-size="5" fill="#5a6346" font-family="sans-serif">VU</text></g>`;}
 else if(isPre||item.form==='silver'||item.form==='receiver'){for(let i=0;i<5;i++)shape+=`<ellipse cx="${175+i*28}" cy="${198-i*4}" rx="6" ry="7" fill="${light}"/><path d="m${175+i*28} ${192-i*4}v3" stroke="${edge}"/>`;shape+=`<ellipse cx="340" cy="171" rx="18" ry="20" fill="${light}"/><path d="m340 155v9" stroke="${edge}" stroke-width="2"/>`;}
 else{shape+=`<path d="M180 187 302 170" stroke="${light}" stroke-width="1" opacity=".4"/><text x="242" y="198" transform="rotate(-8 242 198)" text-anchor="middle" font-size="9" font-family="sans-serif" fill="${light}" letter-spacing="3">${escapeHTML(item.brand.toUpperCase())}</text>`;}
 shape+=`<circle cx="145" cy="204" r="4" fill="${light}"/><circle cx="157" cy="202" r="1.6" fill="#a6b16d"/>`;
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 270" aria-hidden="true" focusable="false">${shape}</svg>`;
}
function renderCollection(){
 const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
 let items=collection.filter(item=>(filter==='All'||item.type===filter)&&terms.every(t=>`${item.brand} ${item.model} ${item.type} ${item.tag}`.toLowerCase().includes(t)));
 if(sort==='brand')items.sort((a,b)=>`${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
 if(sort==='model')items.sort((a,b)=>a.model.localeCompare(b.model));
 const total=items.length,visible=expanded?items:items.slice(0,6);
 $('#result-count').textContent=`${total} ${total===1?'record':'records'}${total>visible.length?` · ${visible.length} shown`:''}`;
 $('#collection-grid').innerHTML=visible.length?visible.map(item=>`<article class="piece"><button class="piece-link" data-piece="${item.id}" aria-label="View ${escapeHTML(item.brand)} ${escapeHTML(item.model)} record"><div class="piece-art"><span class="piece-index">ARCHIVE / ${String(collection.indexOf(item)+1).padStart(2,'0')}</span>${artwork(item)}<span class="piece-arrow" aria-hidden="true">↗</span></div><div class="piece-meta"><div><h3><span>${escapeHTML(item.brand)}</span> ${escapeHTML(item.model)}</h3><p>${escapeHTML(item.tag)}</p></div><span class="piece-type">${escapeHTML(item.type.toUpperCase())}</span></div></button></article>`).join(''):'<div class="empty-state"><h3>No pieces found.</h3><p>Try a different model, brand, or category.</p><button class="button button-outline" id="reset-search">Clear filters ↗</button></div>';
 $('#show-all').hidden=total<=6;
 $('#show-all').innerHTML=expanded?'Show selected six <span aria-hidden="true">↑</span>':`View all ${total} records <span aria-hidden="true">↓</span>`;
}
function openDetail(id){const item=collection.find(p=>p.id===id);if(!item)return;
 $('#detail-content').innerHTML=`<div class="detail-art">${artwork(item)}</div><p class="eyebrow">${escapeHTML(item.type.toUpperCase())} / SELECTED ARCHIVE</p><h2>${escapeHTML(item.brand)} ${escapeHTML(item.model)}</h2><p>${escapeHTML(item.note)}</p><dl class="detail-facts"><div><dt>RECORDED STATUS</dt><dd>${escapeHTML(item.record)}</dd></div><div><dt>INVENTORY BASELINE</dt><dd>${source.date}</dd></div></dl><p class="source-note">Historical inventory status does not confirm present possession, location, or working condition. Model specifications have not been independently verified here.</p>${item.project?`<button class="button button-dark" data-notebook="${item.project}">Open project notebook <span>↗</span></button>`:''}<br><a class="subtle-link" href="${source.url}" target="_blank" rel="noopener">Open source inventory ↗</a>`;
 $('#detail-dialog').showModal();}
function openSources(){
 $('#detail-content').innerHTML=`<div class="source-copy"><p class="eyebrow">SOURCES & PRIVACY</p><h2 class="source-heading">Good records matter.</h2><p>The collection contains 24 selected records from <strong>${source.title}</strong>, revised ${source.date}. It is a curated selection, not the complete inventory or a live stock system.</p><a class="subtle-link" href="${source.url}" target="_blank" rel="noopener">Open the original inventory ↗</a><h3>What the dates mean</h3><p>Acquisition, shipping, and active-system labels preserve the July snapshot. Later conversations inform the Rotel RB-991, Klipsch KG4, and Marantz SR6011 notes. No current repair outcome is assumed.</p><h3>Build concepts</h3><p>DaveHorns is based on January 2026 design discussions. The walnut equipment rack is based on August 2026 discussions. Dimensions are targets; illustrations are conceptual.</p><h3>Your notebook</h3><p>Notes and checklists are saved only in this browser on this device. They are not synchronized between devices. Export a JSON backup from the notebook to preserve your changes. Restoring a backup replaces this browser’s notebook.</p><h3>About the imagery</h3><p>All equipment imagery is original vector illustration. It represents the workshop and equipment types, not photographs or accurate renderings of your individual units.</p></div>`;
 $('#detail-dialog').showModal();}
function renderProject(){
 const project=projects.find(p=>p.id===selectedProject),entry=notebook[selectedProject]||{notes:'',checks:project.steps.map(()=>false)};
 $('#project-select').value=selectedProject;$('#project-reference').textContent=project.source;
 $('#checklist').innerHTML='<legend>Project checklist</legend>'+project.steps.map((text,i)=>`<label class="check-item"><input type="checkbox" data-check="${i}" ${entry.checks[i]?'checked':''}><span>${escapeHTML(text)}</span></label>`).join('');
 $('#project-notes').value=entry.notes;
 $('#save-state').textContent=!storageReady?'Storage unavailable or unreadable. Export notes to keep them.':entry.updated?`Saved ${new Date(entry.updated).toLocaleString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})} · this browser`:'No notes yet · this browser';
}
function captureProject(){const project=projects.find(p=>p.id===selectedProject);notebook[selectedProject]={notes:$('#project-notes').value,checks:project.steps.map((_,i)=>$(`[data-check="${i}"]`).checked),updated:new Date().toISOString()};}
function persistNotebook(explicit=false){clearTimeout(saveTimer);captureProject();try{localStorage.setItem(STORAGE_KEY,JSON.stringify(notebook));storageReady=true;$('#save-state').textContent='Saved · this browser';if(explicit)toast('Project notes saved in this browser.');}catch(error){storageReady=false;$('#save-state').textContent='Cannot save in this browser. Export a backup.';if(explicit)toast('Browser storage is unavailable. Export your notebook.');}}
function openNotebook(id){if($('#notebook-dialog').open){persistNotebook();}else{$('#detail-dialog').close();}selectedProject=projects.some(p=>p.id===id)?id:projects[0].id;renderProject();if(!$('#notebook-dialog').open)$('#notebook-dialog').showModal();}
function exportNotebook(){persistNotebook();const backup={format:'mccann-audio-workshop',version:1,exportedAt:new Date().toISOString(),projects:notebook};const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`mccann-audio-notebook-${new Date().toISOString().slice(0,10)}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);toast('Notebook backup exported.');}
$('#project-select').innerHTML=projects.map(p=>`<option value="${p.id}">${escapeHTML(p.brand)} — ${escapeHTML(p.title)}</option>`).join('');
$('#bench-grid').innerHTML=projects.slice(0,3).map(project=>`<article class="bench-card"><div class="bench-card-top"><span>${project.number} / BENCH NOTES</span><span class="project-tag">${project.label}</span></div><h3><span>${project.brand.toUpperCase()}</span>${project.title}</h3><p>${project.description}</p><button class="text-link" data-notebook="${project.id}">Open project <span aria-hidden="true">↗</span></button></article>`).join('');
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;expanded=false;$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderCollection();}));
$('#search').addEventListener('input',event=>{query=event.target.value;expanded=false;renderCollection();});
$('#sort').addEventListener('change',event=>{sort=event.target.value;renderCollection();});
$('#show-all').addEventListener('click',()=>{expanded=!expanded;renderCollection();if(!expanded)$('#collection').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
$('#source-button').addEventListener('click',openSources);$('#footer-source').addEventListener('click',openSources);
$('#menu-button').addEventListener('click',()=>{const open=$('#navigation').classList.toggle('open');$('#menu-button').setAttribute('aria-expanded',String(open));});
$$('#navigation a').forEach(link=>link.addEventListener('click',()=>{$('#navigation').classList.remove('open');$('#menu-button').setAttribute('aria-expanded','false');}));
document.addEventListener('click',event=>{const piece=event.target.closest('[data-piece]');if(piece)openDetail(piece.dataset.piece);const notebookButton=event.target.closest('[data-notebook]');if(notebookButton)openNotebook(notebookButton.dataset.notebook);if(event.target.closest('[data-close]'))event.target.closest('dialog').close();if(event.target.closest('#reset-search')){filter='All';query='';expanded=false;$('#search').value='';$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='All')));renderCollection();}});
$('#project-select').addEventListener('change',event=>{persistNotebook();selectedProject=event.target.value;renderProject();});
$('#project-notes').addEventListener('input',()=>{$('#save-state').textContent='Saving…';clearTimeout(saveTimer);saveTimer=setTimeout(()=>persistNotebook(),500);});
$('#checklist').addEventListener('change',()=>persistNotebook());$('#save-notes').addEventListener('click',()=>persistNotebook(true));
$('#notebook-dialog').addEventListener('close',()=>persistNotebook());
$('#export-notebook').addEventListener('click',exportNotebook);
$('#import-notebook').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>1000000)throw new Error('Too large');const parsed=JSON.parse(await file.text());if(parsed.format!=='mccann-audio-workshop'||parsed.version!==1)throw new Error('Unsupported format');const validated=validateBackup(parsed.projects);if(Object.keys(validated).length===0)throw new Error('Empty backup');if(!window.confirm('Replace this browser’s project notes with this backup? Export first if you need to keep the existing notes.'))return;clearTimeout(saveTimer);notebook=validated;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(notebook));storageReady=true;}catch(error){storageReady=false;}renderProject();toast(storageReady?'Notebook backup restored.':'Backup loaded. Browser storage unavailable; export to preserve.');}catch(error){toast('Unable to restore: select a valid McCann notebook backup.');}finally{event.target.value='';}});
window.addEventListener('pagehide',()=>{if($('#notebook-dialog').open)persistNotebook();});
renderCollection();
