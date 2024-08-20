import { setAccesLevels } from '/functions/setAccesLevels';
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';

function checkEmployeeAccess(){

    let token = null;
  if(Cookies.get("token") != null && Cookies.get("token") != "" && Cookies.get("token") != "undefined"){
    let tempToken = Cookies.get('token');
    let firstCall = false;
    if(tempToken == Cookies.get('token')){
      token = jwt_decode(Cookies.get("token"));
      console.log(token.access) 
    }else{
      logout();
    }
  }else if(!firstCall){
    logout();
  }

  let levels = null;
  if(token != null){
    levels = token.access;
  }

  let access = false;
  let newTemp = [];
  if(levels.length > 0){
    levels.split(",").forEach((x)=>{
      newTemp.push(x)
    })
    // levels.forEach((x)=>{
    //   x.children.forEach((y)=>{
    //     if(y){
    //       newTemp.push(y)
    //     }
    //   })
    // })
  }
  // console.log(newTemp);
  newTemp.forEach((x)=>{
    // console.log(x)
    if(x == 'admin' || x == ' Delete'){
      access = true;
      // console.log(access);
    }
  })
  
  
  // console.log(access)

  return access
}

export { checkEmployeeAccess }