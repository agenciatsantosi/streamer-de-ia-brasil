import {authorized,badAuth} from '../../../../lib/server';
import {getAvatars} from '../../../../lib/avatars';
export const runtime='nodejs';
export async function GET(){
 if(!await authorized())return badAuth();
 const avatar=(await getAvatars()).find(a=>a.active)||null;
 return Response.json({avatar});
}
