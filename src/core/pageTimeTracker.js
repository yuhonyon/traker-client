import {send} from "./send"


class PageTimeTracker{
  startTime=Date.now()
  endTime=Date.now()
  pageTimes=[]
  invalidStartTime=Date.now()
  invalidEndTime=Date.now()
  totalInvalidTime=0
  url=location.origin

  start(){
    this.startTime=Date.now();
    this.pageTimes=[];
    window.addEventListener('visibilitychange', ()=> {
      var isHidden = document.hidden;
      if (isHidden) {

        this.invalidStartTime=Date.now()
      } else {

        this.invalidEndTime=Date.now();
        this.totalInvalidTime+=(this.invalidEndTime-this.invalidStartTime);
      }
    });
  }

  end(){
    this.change()
    let data={
      startTime:this.startTime,
      endTime:this.endTime,
      pageTimes:this.pageTimes,
      invalidTime:this.totalInvalidTime
    }
    send(data)

  }

  change(){
    this.pageTimes.push({
      url:this.url,
      startTime:this.endTime,
      invalidTime:this.invalidEndTime-this.invalidStartTime,
      endTime:Date.now()
    })
    this.invalidEndTime=this.invalidStartTime=this.endTime=Date.now();
  }
}

let instance=new PageTimeTracker()

export default instance
