import {authorized,badAuth,validAvatar} from '../../../lib/server';
import {getAvatars,saveAvatars} from '../../../lib/avatars';
export const runtime='nodejs';
export async function GET(){
 if(!await authorized())return badAuth();
 const avatars=await getAvatars();
 return Response.json({avatars:avatars.sort((a,b)=>b.created_at.localeCompare(a.created_at))});
}
export async function POST(request){
 if(!await authorized())return badAuth();
 const data=validAvatar(await request.json().catch(()=>({})));
 if(!data)return Response.json({error:'Dados inválidos'},{status:400});
 const now=new Date().toISOString();
 const avatar={id:crypto.randomUUID(),...data,active:false,cover_url:null,rest_video_url:null,talk_video_url:null,created_at:now,updated_at:now};
 const avatars=await getAvatars();avatars.push(avatar);await saveAvatars(avatars);
 return Response.json({avatar},{status:201});
}
