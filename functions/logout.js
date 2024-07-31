import Router from "next/router";
import Cookies from "js-cookie";
import { setTempToken } from "./setAccesLevels";

function logout(){
    setTempToken(null, true);
    Cookies.remove("username");
    Cookies.remove("companyId");
    Cookies.remove("designation");
    Cookies.remove("token");
    // Cookies.remove("access");
    Cookies.remove("loginId");
    Router.push('/login')
}

export default logout