import {handleUpload} from '@vercel/blob/client';
import {del} from '@vercel/blob';
import {authorized,badAuth,sql} from '../../../../lib/server';
export const runtime='nodejs';
const kinds={cover:'cover_url',rest:'rest_video_url',talk:'talk_video_url'};
export async function POST(request){
 if(!await authorized())return badAuth();
 const body=await request.json().catch(()=>null);
 if(!body)return Response.json({error:'Requisição inválida'},{status:400});
 try{
 const result=await handleUpload({
  body,request,
  onBeforeGenerateToken:async(pathname,clientPayload)=>{
   const data=JSON.parse(clientPayload||'{}'),kind=data.kind,id=data.avatarId;
   if(!kinds[kind]||!(/^[0-9a-f-]{36}$/i.test(id))||!pathname.startsWith('avatars/'+id+'/'+kind+'-'))throw Error('Upload inválido');
   const db=sql(),rows=await db`SELECT id FROM avatars WHERE id=${id}`;
   if(!rows.length)throw Error('Avatar inexistente');
   return {allowedContentTypes:kind==='cover'?['image/png','image/jpeg','image/webp']:['video/mp4'],maximumSizeInBytes:kind==='cover'?5*1024*1024:100*1024*1024,tokenPayload:JSON.stringify({id,kind})};
  },
  onUploadCompleted:async({blob,tokenPayload})=>{
   const {id,kind}=JSON.parse(tokenPayload),db=sql();
   const rows=await db`SELECT cover_url,rest_video_url,talk_video_url FROM avatars WHERE id=${id}`;
   if(!rows.length){await del(blob.url);return}
   const old=rows[0][kinds[kind]];
   if(kind==='cover')await db`UPDATE avatars SET cover_url=${blob.url},updated_at=NOW() WHERE id=${id}`;
   else if(kind==='rest')await db`UPDATE avatars SET rest_video_url=${blob.url},updated_at=NOW() WHERE id=${id}`;
   else await db`UPDATE avatars SET talk_video_url=${blob.url},updated_at=NOW() WHERE id=${id}`;
   if(old && old!==blob.url)await del(old).catch(()=>{});
  }
 });
 return Response.json(result);
 }catch(e){return Response.json({error:'Não foi possível concluir o upload'},{status:400})}
}
