import {send} from "./send"

class PageTracker{

  url=location.origin

  tracker(pageId=null){
    let data={
      url:this.url,
      pageId
    }
    send(data)
  }
}

export default new PageTracker()
