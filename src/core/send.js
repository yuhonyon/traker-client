import http from "../utils/http"

import clientInfo from "./clientInfo"
import {getConfig} from "./config"
import {setCookie,getCookie} from "../utils/util"
import {TRACKER_DATA_KEY} from '../constant'

const allData=[];
let timer=null;

export function send(data){
  const config=getConfig();
  const sendType=config.sendType;
  data=_wrapperData(data,config);
  if(sendType==='cookie'){
    let oldData=JSON.parse(getCookie(TRACKER_DATA_KEY)||'[]')
    setCookie(TRACKER_DATA_KEY,JSON.stringify(oldData.concat(data)))
  }else if(sendType==='unload'){
    let oldData=JSON.parse(localStorage.getItem(TRACKER_DATA_KEY)||'[]')
    localStorage.setItem(TRACKER_DATA_KEY,JSON.stringify(oldData.concat(data)))
  }else if(sendType==='live'){
    _sendToServer([data])
  }else if(sendType==='asyncLive'){
    allData.push(data)
    clearTimeout(timer)
    timer=setTimeout(()=>{_sendToServer(allData)},0);
  }
}

export function syncSend(data){
  const config=getConfig();
  data=_wrapperData(data,config);
  _sendToServer([data])
}

export function sendCookieData(){
  let oldData=getCookie(TRACKER_DATA_KEY)
  if(oldData&&oldData!=='[]'){
    _sendToServer(oldData).then(()=>{
      setCookie(TRACKER_DATA_KEY,"[]")
    })
  }
}


function _sendToServer(data){
  return http(data)
}

function _wrapperData(data,config){
  return {
    data:data,
    clientInfo,
    timeStamp:Date.now(),
    uid:config.projectId+Date.now(),
    projectId:config.projectId,
    version:config.version
  }
}
