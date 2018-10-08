import * as decoratorTools from "./decoratiors/decoratorTools"
import PageTracker from "./core/pageTracker"
import {getConfig} from './core/config'
import {sendCookieData} from "./core/send"
import hijackHistoryEvent from "./utils/hijackHistoryEvent"

hijackHistoryEvent()



function routeChange(e){
  PageTracker.change()
}

window.addEventListener('DOMContentLoaded', ()=>{
  const config=getConfig();
  if(config.autoSendCookie){
    sendCookieData()
  }
  PageTracker.start()
})

if (typeof window.onpopstate === 'undefined') {
  window.addEventListener('hashchange', routeChange)
}
window.addEventListener('historyPushState', routeChange)
window.addEventListener('historyPopstate', routeChange)



export {decoratorTools,PageTracker}
