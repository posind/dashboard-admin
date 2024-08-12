import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

function checkLoginAndFetchData() {
  if (getCookie("login") === "") {
    redirect("/"); 
    return; 
  }

  getJSON("https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/pibackend/data/user", "login", getCookie("login"), responseFunction);
}

function responseFunction(result) {
  if (result.status === 200) {
    setInner("navbarName", result.data.name);
    setInner("welcomeMessage", "Welcome, " + result.data.name + " 👋");
    setTimeout(() => redirect("/dashboard"), 1000);
  } else {
    console.log('Error response:', result);
    setInner("content", "Silahkan lakukan chat ke bot helpdesk pemilihan operator");
    redirect("https://wa.me/62895800006000?text=bantuan+operator");
  }
  console.log('Response Function called with result:', result);
}

checkLoginAndFetchData();

function logout() {
  window.location.href = "https://pos.in.my.id/login/login.html";
}
