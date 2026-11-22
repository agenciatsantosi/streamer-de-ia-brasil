'use client';
import {useEffect,useState} from 'react';
import {upload} from '@vercel/blob/client';
const initial={name:'',personality:'',voice:'pt-BR-AntonioNeural',active:false};
export default function Home(){
 const [password,setPassword]=useState(''),[logged,setLogged]=useState(false),[avatars,setAvatars]=useState([]),[form,setForm]=useState(initial),[editing,setEditing]=useState(null),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 async function request(url,options={}){const res=await fetch(url,{...options,headers:{'Content-Type':'application/json',...options.headers}});const body=await res.json().catch(()=>({}));if(!res.ok)throw Error(body.error||'Erro '+res.status);return body}
 async function refresh(){try{const data=await request('/api/avatars');setAvatars(data.avatars);setLogged(true)}catch{setLogged(false)}}
 useEffect(()=>{refresh()},[]);
 async function login(e){e.preventDefault();try{await request('/api/login',{method:'POST',body:JSON.stringify({password})});setPassword('');await refresh();setMessage('')}catch(e){setMessage(e.message)}}
 async function save(e){e.preventDefault();setBusy(true);try{await request(editing?'/api/avatars/'+editing:'/api/avatars',{method:editing?'PATCH':'POST',body:JSON.stringify(form)});setForm(initial);setEditing(null);await refresh();setMessage('Avatar salvo com sucesso')}catch(e){setMessage(e.message)}finally{setBusy(false)}}
 function edit(a){setEditing(a.id);setForm({name:a.name,personality:a.personality,voice:a.voice,active:a.active});window.scrollTo({top:0,behavior:'smooth'})}
 async function remove(a){if(!confirm('Excluir avatar '+a.name+'?'))return;try{await request('/api/avatars/'+a.id,{method:'DELETE'});await refresh()}catch(e){setMessage(e.message)}}
 async function duplicate(a){setBusy(true);try{await request('/api/avatars/'+a.id+'/duplicate',{method:'POST'});await refresh();setMessage('Avatar duplicado')}catch(e){setMessage(e.message)}finally{setBusy(false)}}
 async function activate(a){setBusy(true);try{await request('/api/avatars/'+a.id+'/activate',{method:'POST'});await refresh();setMessage('Avatar ativo: '+a.name)}catch(e){setMessage(e.message)}finally{setBusy(false)}}
 async function media(a,kind,file){if(!file)return;setBusy(true);setMessage('Enviando '+file.name+'...');try{
  const isVideo=kind!=='cover',limit=isVideo?100*1024*1024:5*1024*1024;
  if(file.size>limit||!(isVideo?file.type==='video/mp4':['image/jpeg','image/png','image/webp'].includes(file.type)))throw Error('Arquivo inválido. MP4 até 100 MB; capa até 5 MB.');
  await upload('avatars/'+a.id+'/'+kind+'-'+crypto.randomUUID()+'-'+file.name,file,{access:'public',handleUploadUrl:'/api/blob/upload',clientPayload:JSON.stringify({avatarId:a.id,kind})});
  await refresh();setMessage('Upload concluído. Aguarde a confirmação do processamento...');
  for(let attempt=0;attempt<8;attempt++){
    await new Promise(resolve=>setTimeout(resolve,1500));
    const data=await request('/api/avatars');
    const updated=data.avatars.find(item=>item.id===a.id);
    const key={cover:'cover_url',rest:'rest_video_url',talk:'talk_video_url'}[kind];
    if(updated?.[key] && updated[key]!==a[key]){setAvatars(data.avatars);setMessage('Arquivo salvo e vinculado ao avatar');break}
    if(attempt===7)setMessage('Upload recebido. O processamento ainda não foi confirmado; atualize a página em instantes.');
  }
 }catch(e){setMessage(e.message)}finally{setBusy(false)}}
 const panel={maxWidth:1080,margin:'auto',padding:24},card={background:'#182338',border:'1px solid #334155',borderRadius:14,padding:20,marginBottom:18},input={width:'100%',boxSizing:'border-box',background:'#0f172a',border:'1px solid #475569',borderRadius:8,padding:12,color:'white',marginTop:8},button={background:'#2563eb',color:'white',border:0,borderRadius:8,padding:'11px 16px',cursor:'pointer',marginRight:8};
 return <main style={panel}><h1>Streamer de IA Brasil</h1><p style={{color:'#94a3b8'}}>Gerenciador de avatares na nuvem</p>
 {message&&<p role="status" style={{color:'#93c5fd'}}>{message}</p>}
 {!logged?<form onSubmit={login} style={{...card,maxWidth:440}}><h2>Acesso administrativo</h2><label>Senha<input style={input} type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><p><button style={button}>Entrar</button></p></form>:
 <>
 <button style={{...button,background:'#334155',float:'right'}} onClick={async()=>{await request('/api/logout',{method:'POST'});setLogged(false)}}>Sair</button>
 <form onSubmit={save} style={card}><h2>{editing?'Editar avatar':'Cadastrar avatar'}</h2>
 <label>Nome<input style={input} maxLength={100} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></label>
 <label>Personalidade<textarea style={{...input,minHeight:130}} maxLength={12000} value={form.personality} onChange={e=>setForm({...form,personality:e.target.value})}/></label>
 <label>Voz<select style={input} value={form.voice} onChange={e=>setForm({...form,voice:e.target.value})}><option value="pt-BR-AntonioNeural">Antônio</option><option value="pt-BR-FranciscaNeural">Francisca</option><option value="pt-BR-ThalitaNeural">Thalita</option></select></label>
 <label style={{display:'block',margin:'15px 0'}}><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})}/> Ativo</label>
 <button style={button} disabled={busy}>{editing?'Salvar alterações':'Cadastrar avatar'}</button>
 {editing&&<button type="button" style={{...button,background:'#475569'}} onClick={()=>{setEditing(null);setForm(initial)}}>Cancelar</button>}
 </form>
 <h2>Biblioteca de avatares ({avatars.length})</h2>
 <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
 {avatars.map(a=><article key={a.id} style={card}>
 <h3>{a.name} {a.active?'• Ativo':''}</h3>
 {a.cover_url&&<img src={a.cover_url} alt={'Capa de '+a.name} style={{width:'100%',maxHeight:200,objectFit:'cover',borderRadius:8}}/>}
 <p style={{color:'#94a3b8',fontSize:13}}>{a.voice}</p>
 {['cover','rest','talk'].map(kind=><div key={kind} style={{margin:'12px 0'}}><label style={{fontSize:14}}>{({cover:'Capa',rest:'Vídeo de repouso',talk:'Vídeo falando'})[kind]}<input type="file" accept={kind==='cover'?'image/png,image/jpeg,image/webp':'video/mp4'} disabled={busy} onChange={e=>{media(a,kind,e.target.files?.[0]);e.target.value=''}} style={{display:'block',maxWidth:'100%',marginTop:6}}/></label>
 {kind!=='cover'&&a[kind==='rest'?'rest_video_url':'talk_video_url']&&<video controls muted playsInline preload="metadata" src={a[kind==='rest'?'rest_video_url':'talk_video_url']} style={{width:'100%',marginTop:8}}/>}
 </div>)}
 <button style={button} disabled={busy} onClick={()=>edit(a)}>Editar</button><button style={{...button,background:"#047857"}} disabled={busy||a.active} onClick={()=>activate(a)}>{a.active?"Ativo":"Ativar"}</button><button style={{...button,background:"#475569"}} disabled={busy} onClick={()=>duplicate(a)}>Duplicar</button><button style={{...button,background:'#b91c1c'}} disabled={busy} onClick={()=>remove(a)}>Excluir</button>
 </article>)}
 </section></>}
 </main>
}
