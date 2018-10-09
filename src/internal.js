import * as decoratorTools from "./decoratiors/decoratorTools"
import PageTracker from "./core/pageTracker"
import PageTimeTracker from "./core/pageTimeTracker"
import {getConfig} from './core/config'
import {sendCookieData,sendStorageData,sendAsyncData} from "./core/send"
import hijackHistoryEvent from "./utils/hijackHistoryEvent"
import {SEND_TYPE} from './constant'

hijackHistoryEvent()



function routeChange(e){
  PageTimeTracker.change()
}

window.addEventListener('DOMContentLoaded', ()=>{
  const config=getConfig();

  if(config.autoSendCookie){
    sendCookieData()
  }

  if(config.autoTrakerPage){
    PageTracker.tracker()
  }

  if(config.pageTime){
    PageTimeTracker.start()
    if (typeof window.onpopstate === 'undefined') {
      window.addEventListener('hashchange', routeChange)
    }
    window.addEventListener('historyPushState', routeChange)
    window.addEventListener('historyPopstate', routeChange)
  }

  window.addEventListener('beforeunload',()=>{
    if(config.pageTime){
      PageTimeTracker.end()
    }
    sendAsyncData(0,true)
    if(config.sendType===SEND_TYPE.UNLOAD){
      sendStorageData()
    }
  })

})



export {decoratorTools,PageTimeTracker,PageTracker}
