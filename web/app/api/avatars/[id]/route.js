import {authorized,badAuth,validAvatar} from '../../../../lib/server';
import {getAvatars,saveAvatars} from '../../../../lib/avatars';
import {del} from '@vercel/blob';
export const runtime='nodejs';
export async function PATCH(request,{params}){
 if(!await authorized())return badAuth();
 const {id}=await params;
 const data=validAvatar(await request.json().catch(()=>({})));
 if(!data)return Response.json({error:'Dados inválidos'},{status:400});
 const avatars=await getAvatars(),idx=avatars.findIndex(a=>a.id===id);
 if(idx<0)return Response.json({error:'Não encontrado'},{status:404});
 if(data.active) for(const item of avatars)item.active=false;
 const avatar={...avatars[idx],...data,updated_at:new Date().toISOString()};
 avatars[idx]=avatar;await saveAvatars(avatars);
 return Response.json({avatar});
}
export async function DELETE(request,{params}){
 if(!await authorized())return badAuth();
 const {id}=await params;
 const avatars=await getAvatars(),idx=avatars.findIndex(a=>a.id===id);
 if(idx<0)return Response.json({error:'Não encontrado'},{status:404});
 const [removed]=avatars.splice(idx,1);
 await saveAvatars(avatars);
 for(const url of [removed.cover_url,removed.rest_video_url,removed.talk_video_url])if(url)await del(url).catch(()=>{});
 return Response.json({ok:true});
}
