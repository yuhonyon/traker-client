import {SERVER_URL} from '../constant'
import Base64 from './base64'


export default function http(data,isAjax=false,isSendBeacon=true){
  return new Promise((resolve,reject)=>{
    data=Base64.encode(JSON.stringify(data));
    if(isSendBeacon&&window.navigator.sendBeacon) {
      const formData = new FormData();
      formData.append(data,data);
      const success=window.navigator.sendBeacon(SERVER_URL, formData);
      if(success){
        resolve()
        return;
      }
    }else if(isAjax){
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          resolve();
        }
      });
      xhr.open('POST', SERVER_URL, true);
      xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
      xhr.withCredentials = true;
      xhr.send(data);
    }else{
      const img=new Image()
      img.onload=()=>{
        resolve();
      }
      img.src=`${SERVER_URL}?data=${data}`
    }

  })
}




// {
//   project:'1212',
//   type:'track',
//   time:234523452345,
//   data:{
//     screen_width:1213,
//     screen_heith:234,
//     referrer:"",
//     url:"",
//     path:"",
//     title:"",
//     id:1111
//
//   }
//
// }
