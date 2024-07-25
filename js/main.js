function logout() {
    window.location.href = "https://pos.in.my.id/login/login.html";
  }

document.getElementById("en-tab").addEventListener("click", function () {
    loadItems();
  });
  
document.getElementById("id-tab").addEventListener("click", function () {
    loadBarang();
  });

async function addItem() {
    window.location.href = "additem.html";
  }

async function tambahBarang() {
    window.location.href = "tambah.html";
  }