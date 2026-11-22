import {authorized,badAuth,sql} from '../../../../../lib/server';
import {put,del} from '@vercel/blob';
export const runtime='nodejs';
export async function POST(request,{params}){
 if(!await authorized())return badAuth();
 const {id}=await params;
 if(!/^[0-9a-f-]{36}$/i.test(id))return Response.json({error:'ID inválido'},{status:400});
 const form=await request.formData(),kind=form.get('kind'),file=form.get('file');
 const column={rest:'rest_video_url',talk:'talk_video_url',cover:'cover_url'}[kind];
 if(!column || !(file instanceof File))return Response.json({error:'Arquivo inválido'},{status:400});
 const isVideo=kind!=='cover';
 const limit=isVideo? 20*1024*1024:5*1024*1024;
 if(file.size===0 || file.size>limit || (isVideo?file.type!=='video/mp4':!['image/jpeg','image/png','image/webp'].includes(file.type)))
  return Response.json({error:'Formato ou tamanho inválido. Vídeos até 20 MB; capas até 5 MB.'},{status:413});
 const db=sql(),rows=await db`SELECT * FROM avatars WHERE id=${id}`;
 if(!rows.length)return Response.json({error:'Avatar não encontrado'},{status:404});
 const ext=isVideo?'mp4':file.type.split('/')[1];
 const blob=await put('avatars/'+id+'/'+kind+'-'+crypto.randomUUID()+'.'+ext,file,{access:'public',addRandomSuffix:false,contentType:file.type});
 try{
  const [avatar]=kind==='rest'?await db`UPDATE avatars SET rest_video_url=${blob.url},updated_at=NOW() WHERE id=${id} RETURNING *`:
  kind==='talk'?await db`UPDATE avatars SET talk_video_url=${blob.url},updated_at=NOW() WHERE id=${id} RETURNING *`:
  await db`UPDATE avatars SET cover_url=${blob.url},updated_at=NOW() WHERE id=${id} RETURNING *`;
  const old=rows[0][column];
  if(old && old!==blob.url)await del(old).catch(()=>{});
  return Response.json({avatar});
 }catch(e){await del(blob.url).catch(()=>{});throw e}
}
