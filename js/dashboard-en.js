import { get, deleteJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js";

function getCookie(name) {
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const token = getCookie('login'); // Ambil token dari cookie

if (!token) {
  console.error("Login token not found in cookies.");
} else {
  console.log("Login token found:", token);
}

function loadItems() {
  if (!token) {
    alert("You are not logged in!");
    return;
  }

  const headers = new Headers({
    "login": token,
    "Content-Type": "application/json"
  });

  get(
    "https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/get/prohibited-items/en",
    responsefunction,
    { headers }
  );
}

function responsefunction(items) {
  if (!Array.isArray(items)) {
    console.error("Expected an array but got:", items);
    return;
  }

  let tableRows = "";
  let lastRowStyle = "bg-gray-50"; // Mulai dengan gaya pertama

  items.forEach((item) => {
    const rowStyle = lastRowStyle;
    lastRowStyle = lastRowStyle === "bg-gray-50" ? "" : "bg-gray-50"; // Berganti gaya

    tableRows += `
      <tr class="text-xs ${rowStyle}">
        <td class="flex px-4 py-3">
          <div>
            <p class="font-medium">${item.prohibited_items || "N/A"}</p>
          </div>
        </td>
        <td class="font-medium">${item.max_weight || "N/A"}</td>
        <td class="font-medium">${item.destination || "N/A"}</td>
        <td>
          <div>
            <!-- Ikon Edit -->
            <a class="inline-block mr-2" href="crud/edititem.html?id=${item.id}">
              <i class="fas fa-edit" style="font-size: 18px; color: #382CDD;"></i>
            </a>
            
            <!-- Ikon Delete -->
            <a class="inline-block" href="#" onclick="deleteItemEn('${item.id}')">
              <i class="fas fa-trash" style="font-size: 20px; color: #E85444;"></i>
            </a>
          </div>
        </td>
      </tr>
    `;
  });

  document.getElementById("content-en").innerHTML = `
   <table class="table-auto w-full">
     <thead>
       <tr class="text-xs text-gray-500 text-left">
         <th class="font-medium">Items Name</th>
         <th class="font-medium">Max Weight</th>
         <th class="font-medium">Destination</th>
         <th class="font-medium">Action</th>
       </tr>
     </thead>
     <tbody class="visibility-item">
       ${tableRows}
     </tbody>
   </table>
 `;
}

function deleteItemEn(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    const targetUrl = `https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/delete/prohibited-items/en?id=${id}`;
    const headers = new Headers({
      "login": token,
      "Content-Type": "application/json"
    });

    deleteJSON(targetUrl, headers, {}, (response) => {
      if (response.status === 200) {
        alert("Item deleted successfully");
        loadItems(); // Muat ulang data setelah penghapusan
      } else {
        alert("Failed to delete item");
      }
    });
  }
}

// Pastikan deleteItemEn tersedia secara global
window.deleteItemEn = deleteItemEn;

// Menambahkan event listener untuk Alpine.js
document.addEventListener("alpine:init", () => {
  document.addEventListener("alpine:initialized", () => {
    setTimeout(() => {
      if (typeof Alpine !== "undefined") {
        console.log("Alpine.js is defined.");
        const xDataElement = document.querySelector("[x-data]");
        if (xDataElement && xDataElement.__x) {
          console.log("Alpine.js data is available.");
          handleTabChange();
        } else {
          console.error("Alpine.js data is not available.");
        }
      } else {
        console.error("Alpine.js is not defined.");
      }
    }, 100); // Tunggu sebentar untuk memastikan Alpine.js terinisialisasi
  });
});

// Menangani perubahan tab
function handleTabChange() {
  const xDataElement = document.querySelector("[x-data]");
  if (!xDataElement) {
    console.error("Element with [x-data] attribute not found.");
    return;
  }

  const tab = xDataElement.__x.$data.tab;
  if (tab === "EN") {
    loadItems();
    document.getElementById("content-id").innerHTML = ""; // Hapus konten ID jika ada
  } else if (tab === "ID") {
    loadItemsID();
    document.getElementById("content-en").innerHTML = ""; // Hapus konten Bahasa Inggris
  }
}
