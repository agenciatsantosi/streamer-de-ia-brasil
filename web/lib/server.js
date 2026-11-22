import { neon } from '@neondatabase/serverless';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
export function sql() {
 if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL ausente');
 return neon(process.env.DATABASE_URL);
}
function signature(value) {return createHmac('sha256',process.env.SESSION_SECRET || '').update(value).digest('hex')}
export async function authorized() {
 const secret = process.env.SESSION_SECRET;
 if (!secret || secret.length < 32 || !process.env.ADMIN_PASSWORD) return false;
 const cookie = (await cookies()).get('streamer_session')?.value || '';
 const [expires,mac] = cookie.split('.');
 if (!expires || !mac || !/^\d+$/.test(expires) || Number(expires)<Date.now()) return false;
 const expected=signature(expires);
 return mac.length===expected.length && timingSafeEqual(Buffer.from(mac),Buffer.from(expected));
}
export function makeSession() {const expires=String(Date.now()+7*24*3600*1000);return expires+'.'+signature(expires)}
export const badAuth=()=>Response.json({error:'Não autorizado'},{status:401});
export function validAvatar(data) {
 const name=String(data.name||'').trim(),personality=String(data.personality||'').trim();
 if(!name || name.length>100 || personality.length>12000) return null;
 const voice=String(data.voice||'pt-BR-AntonioNeural');
 if(!/^[a-z]{2}-[A-Z]{2}-[A-Za-z]+Neural$/.test(voice))return null;
 return {name,personality,voice,active:Boolean(data.active)};
}
