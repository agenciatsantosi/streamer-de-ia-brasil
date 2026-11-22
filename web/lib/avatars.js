const REPO='agenciatsantosi/streamer-de-ia-brasil',PATH='data/avatars.json';
async function read(){
 const token=process.env.GITHUB_TOKEN;
 if(!token)throw Error('GITHUB_TOKEN não configurado');
 const res=await fetch('https://api.github.com/repos/'+REPO+'/contents/'+PATH+'?ref=main',{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json'},cache:'no-store'});
 if(res.status===404)return {avatars:[],sha:null};
 if(!res.ok)throw Error('GitHub GET '+res.status);
 const file=await res.json(),avatars=JSON.parse(Buffer.from(file.content.replace(/\s/g,''),'base64').toString('utf8'));
 if(!Array.isArray(avatars))throw Error('JSON de avatares inválido');
 return {avatars,sha:file.sha};
}
export async function getAvatars(){return (await read()).avatars}
export async function mutateAvatars(transform){
 const {avatars,sha}=await read(),result=transform(avatars);
 if(result===false)return null;
 const response=await fetch('https://api.github.com/repos/'+REPO+'/contents/'+PATH,{method:'PUT',headers:{Authorization:'Bearer '+process.env.GITHUB_TOKEN,Accept:'application/vnd.github+json','Content-Type':'application/json'},body:JSON.stringify({message:'Atualiza avatares pelo painel',branch:'main',content:Buffer.from(JSON.stringify(avatars,null,2)).toString('base64'),...(sha?{sha}:{})}),cache:'no-store'});
 if(!response.ok){if([409,422].includes(response.status))throw Error('Conflito de gravação. Atualize a página e tente novamente.');throw Error('GitHub PUT '+response.status)}
 return result;
}
export async function saveAvatars(avatars){return mutateAvatars(items=>{items.splice(0,items.length,...avatars);return true})}
