import {authorized,badAuth} from '../../../../../lib/server';
import {getAvatars,saveAvatars} from '../../../../../lib/avatars';
export const runtime='nodejs';
export async function POST(request,{params}){
 if(!await authorized())return badAuth();
 const {id}=await params,avatars=await getAvatars(),target=avatars.find(a=>a.id===id);
 if(!target)return Response.json({error:'Avatar não encontrado'},{status:404});
 for(const a of avatars){a.active=a.id===id;a.updated_at=new Date().toISOString()}
 await saveAvatars(avatars);
 return Response.json({avatar:target});
}
