const state={dialect:'amdo',genre:'all'};
const names={amdo:'安多',utsang:'卫藏',kham:'康巴'};
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text)node.textContent=text;return node;}
function player(src,label){const a=el('audio');a.controls=true;a.preload='none';a.src=src;a.setAttribute('aria-label',label);a.addEventListener('play',()=>document.querySelectorAll('audio').forEach(other=>{if(other!==a)other.pause();}));a.addEventListener('error',()=>{a.insertAdjacentElement('afterend',el('small','muted','音频暂时无法加载，请刷新后重试。'));},{once:true});return a;}
function render(){
  document.querySelectorAll('audio').forEach(a=>a.pause());
  const root=document.querySelector('#sample-groups');root.replaceChildren();
  const rows=window.ZETA_SAMPLES.filter(x=>x.dialect===state.dialect&&(state.genre==='all'||x.genre===state.genre));
  document.querySelector('#sample-count').textContent=`${names[state.dialect]} · ${rows.length} 个文本条件 · ${rows.reduce((n,r)=>n+Object.keys(r).filter(k=>["dots_tts","cosyvoice3","cosyvoice2","f5_tts"].includes(k)).length,0)} 条合成音频`;
  for(const speaker of [...new Set(rows.map(x=>x.speaker))]){
    const group=rows.filter(x=>x.speaker===speaker),first=group[0],box=el('article','voice-group'),head=el('div','voice-header'),title=el('div');
    title.append(el('h3','',`${names[state.dialect]} · ${first.genre==='read'?'朗读 Read':'新闻 News'}`),el('p','',`参考音色 · ${speaker}`));
    head.append(title);box.append(head);
    const wrap=el('div','table-wrap'),table=el('table'),thead=el('thead'),hr=el('tr');
    for(const label of ['藏文文本 / Tibetan text','dots.tts','CosyVoice3','CosyVoice2','F5-TTS']){const th=el('th','',label);th.scope='col';hr.append(th);}thead.append(hr);table.append(thead);const body=el('tbody');
    for(const row of group){const tr=el('tr'),text=el('td'),p=el('p','tibetan',row.text);p.lang='bo';const meta=el('div','source'),source=el('a','','文本来源 ↗');source.href=row.source;source.target='_blank';source.rel='noopener noreferrer';meta.append(el('span','',row.id),source);text.append(p,meta);tr.append(text);for(const model of ['dots_tts','cosyvoice3','cosyvoice2','f5_tts']){const td=el('td');if(row[model])td.append(player(row[model],`${row.id} ${model}`));else td.append(el("span","muted","仅安多"));tr.append(td);}body.append(tr);}table.append(body);wrap.append(table);box.append(wrap);root.append(box);
  }
}
document.querySelectorAll('[data-dialect]').forEach(b=>b.addEventListener('click',()=>{state.dialect=b.dataset.dialect;document.querySelectorAll('[data-dialect]').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});render();}));
document.querySelector('#genre').addEventListener('change',e=>{state.genre=e.target.value;render();});render();
