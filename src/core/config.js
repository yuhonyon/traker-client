let config={
  durationTime:false,
  env:'production',
  projectId:null,
  token:null,
  version:null,
  domain:'',
  sendType:"cookie",//cookie,live,unload,asyncLive
  autoSendCookie:true
}


export function getConfig(){
  return config
}

export function setConfig(data){
  config={...config,...data}
}
