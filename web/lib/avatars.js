import {list,put} from '@vercel/blob';
const STORE='data/avatars.json';
async function current(){
 const result=await list({prefix:STORE,limit:100});
 const found=result.blobs.filter(b=>b.pathname===STORE).sort((a,b)=>new Date(b.uploadedAt)-new Date(a.uploadedAt))[0];
 if(!found)return [];
 const response=await fetch(found.url,{cache:'no-store'});
 if(!response.ok)throw Error('Não foi possível ler os avatares');
 const data=await response.json();
 return Array.isArray(data)?data:[];
}
export async function getAvatars(){return current()}
export async function saveAvatars(avatars){
 await put(STORE,JSON.stringify(avatars,null,2),{access:'public',allowOverwrite:true,contentType:'application/json',cacheControlMaxAge:60});
}
export async function updateAvatar(id,fn){
 const avatars=await current(),idx=avatars.findIndex(a=>a.id===id);
 if(idx<0)return null;
 const before=avatars[idx],after=fn(before);
 avatars[idx]={...after,updated_at:new Date().toISOString()};
 await saveAvatars(avatars);
 return {before,avatar:avatars[idx]};
}
