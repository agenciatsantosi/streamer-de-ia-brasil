export async function POST(){const r=Response.json({ok:true});r.headers.append('Set-Cookie','streamer_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0');return r}
