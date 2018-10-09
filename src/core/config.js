import {SEND_TYPE,ENVIRONMENT} from '../constant'
let config={
  pageTime:false,
  env:ENVIRONMENT.PRODUCTION,
  projectId:null,
  token:null,
  version:null,
  domain:'',
  sendType:SEND_TYPE.ASYNC,
  delayTime:1000,
  autoSendCookie:true,
  autoTrakerPage:true,
}


export function getConfig(){
  return config
}

export function setConfig(data){
  config={...config,...data}
}
