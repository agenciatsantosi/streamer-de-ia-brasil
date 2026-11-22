import {makeSession} from '../../../lib/server';
import {timingSafeEqual,createHash} from 'node:crypto';
const PASSWORD_SHA256='2e75be5bfc4aa27e113eaf41c56e09878548515c2e1d73cd74540cf1aa65c381';
export async function POST(request){
 const {password}=await request.json().catch(()=>({}));
 if(!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length<32)return Response.json({error:'SESSION_SECRET ausente ou curta'},{status:503});
 const a=Buffer.from(createHash('sha256').update(String(password||'')).digest('hex')),b=Buffer.from(PASSWORD_SHA256);
 if(a.length!==b.length || !timingSafeEqual(a,b))return Response.json({error:'Senha inválida'},{status:401});
 const response=Response.json({ok:true});
 response.headers.append('Set-Cookie','streamer_session='+makeSession()+'; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800');
 return response;
}
