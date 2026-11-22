import {makeSession} from '../../../lib/server';
import {timingSafeEqual} from 'node:crypto';
export async function POST(request){
 const {password}=await request.json().catch(()=>({}));
 const expected=process.env.ADMIN_PASSWORD||'';
 if(!expected || !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length<32)return Response.json({error:'Configuração de autenticação ausente'},{status:503});
 const a=Buffer.from(String(password||'')),b=Buffer.from(expected);
 if(a.length!==b.length || !timingSafeEqual(a,b))return Response.json({error:'Senha inválida'},{status:401});
 const response=Response.json({ok:true});
 response.headers.append('Set-Cookie','streamer_session='+makeSession()+'; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800');
 return response;
}
