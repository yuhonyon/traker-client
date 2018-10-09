import http from "../utils/http"

import clientInfo from "./clientInfo"
import {getConfig} from "./config"
import {setCookie,getCookie} from "../utils/util"
import {TRACKER_DATA_KEY,SEND_TYPE} from '../constant'

const allData=[];
let timer=null;


export function send(data){
  const config=getConfig();
  const sendType=config.sendType;

  data=_wrapperData(data,config);

  if(sendType===SEND_TYPE.COOKIE){
    let oldData=JSON.parse(getCookie(TRACKER_DATA_KEY)||'[]')
    setCookie(TRACKER_DATA_KEY,JSON.stringify(oldData.concat(data)))
  }else if(sendType===SEND_TYPE.UNLOAD){
    let oldData=JSON.parse(localStorage.getItem(TRACKER_DATA_KEY)||'[]')
    localStorage.setItem(TRACKER_DATA_KEY,JSON.stringify(oldData.concat(data)))
  }else if(sendType===SEND_TYPE.SYNC){
    _sendToServer([data])
  }else if(sendType===SEND_TYPE.ASYNC){
    allData.push(data)
    sendAsyncData(config.delayTime)
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
    _sendToServer(oldData,true).then(()=>{
      setCookie(TRACKER_DATA_KEY,"[]")
    })
  }
}


export function sendStorageData(){
  let oldData=localStorage.getItem(TRACKER_DATA_KEY)
  if(oldData&&oldData!=='[]'){
    _sendToServer(oldData).then(()=>{
      localStorage.removeItem(TRACKER_DATA_KEY)
    })
  }
}


export function sendAsyncData(delayTime=0,unload=false){
  if(!allData.length){
    return;
  }
  clearTimeout(timer)
  if(unload){
    _sendToServer(JSON.stringify(allData))
    allData.length=0;
    return;
  }
  timer=setTimeout(()=>{
    _sendToServer(JSON.stringify(allData))
    allData.length=0;
  },delayTime);
}



function _sendToServer(data,isAjax){
  return http(data,isAjax)
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
