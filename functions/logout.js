import Router from "next/router";
import Cookies from "js-cookie";

function logout(){
    Cookies.remove("username");
    Cookies.remove("companyId");
    Cookies.remove("designation");
    Cookies.remove("token");
    Cookies.remove("access");
    Cookies.remove("loginId");
    Router.push('/login')
}

export default logout