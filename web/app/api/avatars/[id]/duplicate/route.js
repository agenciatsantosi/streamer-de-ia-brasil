import {authorized,badAuth} from '../../../../../lib/server';
import {getAvatars,saveAvatars} from '../../../../../lib/avatars';
export const runtime='nodejs';
export async function POST(request,{params}){
 if(!await authorized())return badAuth();
 const {id}=await params,avatars=await getAvatars(),source=avatars.find(a=>a.id===id);
 if(!source)return Response.json({error:'Avatar não encontrado'},{status:404});
 const now=new Date().toISOString();
 const copy={...source,id:crypto.randomUUID(),name:(source.name+' (cópia)').slice(0,100),active:false,created_at:now,updated_at:now};
 avatars.push(copy);await saveAvatars(avatars);
 return Response.json({avatar:copy},{status:201});
}
