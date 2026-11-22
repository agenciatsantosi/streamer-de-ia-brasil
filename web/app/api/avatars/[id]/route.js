import {authorized,badAuth,sql,validAvatar} from '../../../../lib/server';
export const runtime='nodejs';
export async function PATCH(request,{params}){
 if(!await authorized())return badAuth();
 const {id}=await params;
 if(!/^[0-9a-f-]{36}$/i.test(id))return Response.json({error:'ID inválido'},{status:400});
 const data=validAvatar(await request.json().catch(()=>({})));
 if(!data)return Response.json({error:'Dados inválidos'},{status:400});
 const db=sql();
 const [avatar]=await db`UPDATE avatars SET name=${data.name},personality=${data.personality},voice=${data.voice},active=${data.active},updated_at=NOW() WHERE id=${id} RETURNING *`;
 return avatar?Response.json({avatar}):Response.json({error:'Não encontrado'},{status:404});
}
export async function DELETE(request,{params}){
 if(!await authorized())return badAuth();
 const {id}=await params;
 if(!/^[0-9a-f-]{36}$/i.test(id))return Response.json({error:'ID inválido'},{status:400});
 const db=sql();const rows=await db`DELETE FROM avatars WHERE id=${id} RETURNING id`;
 return rows.length?Response.json({ok:true}):Response.json({error:'Não encontrado'},{status:404});
}
