import {authorized,badAuth,sql,validAvatar} from '../../../lib/server';
export const runtime='nodejs';
export async function GET(){
 if(!await authorized())return badAuth();
 const db=sql();const avatars=await db`SELECT id,name,personality,voice,active,rest_video_url,talk_video_url,cover_url,created_at FROM avatars ORDER BY created_at DESC`;
 return Response.json({avatars});
}
export async function POST(request){
 if(!await authorized())return badAuth();
 const body=await request.json().catch(()=>({})),data=validAvatar(body);
 if(!data)return Response.json({error:'Dados inválidos'},{status:400});
 const db=sql();
 const [avatar]=await db`INSERT INTO avatars(name,personality,voice,active) VALUES(${data.name},${data.personality},${data.voice},false) RETURNING *`;
 return Response.json({avatar},{status:201});
}
