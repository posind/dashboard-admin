import { deleteCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

window.logout = function() {
    deleteCookie("login"); 
    window.location.href = "https://pos.in.my.id";
  }