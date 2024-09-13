import { get, deleteJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js";

function getCookie(name) {
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Ambil token dari cookie
const token = getCookie('login'); 

if (!token) {
  console.error("Login token not found in cookies.");
  alert("You are not logged in!");
} else {
  console.log("Login token found:", token);
}

// Fungsi untuk memuat item dari API
function loadItems() {
  if (!token) {
    alert("You are not logged in!");
    return;
  }

  const headers = new Headers({
    "Authorization": `Bearer ${token}`, // Gunakan format Bearer token untuk otentikasi
    "Content-Type": "application/json"
  });

  get(
    "https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/get/prohibited-items/en",
    responsefunction,
    { headers }
  );
}

// Fungsi untuk menangani respons API
function responsefunction(response) {
  console.log("Response from API:", response);

  // Cek apakah respons berisi status sukses dan array items
  if (!response || response.status !== 'success' || !Array.isArray(response.items)) {
    console.error("Unexpected response format:", response);
    return;
  }

  const items = response.items;
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

  const contentEnElement = document.getElementById("content-en");
  if (contentEnElement) {
    contentEnElement.innerHTML = `
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
  } else {
    console.error("Element with id 'content-en' not found.");
  }
}

// Fungsi untuk menghapus item
function deleteItemEn(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    const targetUrl = `https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/delete/prohibited-items/en?id=${id}`;
    const headers = new Headers({
      "Authorization": `Bearer ${token}`, // Gunakan Bearer token di header Authorization
      "Content-Type": "application/json"
    });

    deleteJSON(targetUrl, headers, {}, (response) => {
      if (response.status === 200) {
        alert("Item deleted successfully");
        loadItems(); // Muat ulang data setelah penghapusan
      } else {
        console.error("Failed to delete item. Response:", response);
        alert("Failed to delete item");
      }
    });
  }
}

// Pastikan deleteItemEn tersedia secara global
window.deleteItemEn = deleteItemEn;

// Event listener untuk Alpine.js
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

// Fungsi untuk menangani perubahan tab
function handleTabChange() {
  const xDataElement = document.querySelector("[x-data]");
  if (!xDataElement) {
    console.error("Element with [x-data] attribute not found.");
    return;
  }

  const tab = xDataElement.__x.$data.tab;
  if (tab === "EN") {
    loadItems();
    const contentIdElement = document.getElementById("content-id");
    if (contentIdElement) contentIdElement.innerHTML = ""; // Hapus konten ID jika ada
  } else if (tab === "ID") {
    loadItemsID(); // Fungsi ini harus diimplementasikan untuk tab ID
    const contentEnElement = document.getElementById("content-en");
    if (contentEnElement) contentEnElement.innerHTML = ""; // Hapus konten Bahasa Inggris
  }
}

// Fungsi tambahan untuk memuat item dalam bahasa Indonesia (ID)
function loadItemsID() {
  if (!token) {
    alert("You are not logged in!");
    return;
  }

  const headers = new Headers({
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  });

  get(
    "https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/get/prohibited-items/id",
    responsefunctionID,
    { headers }
  );
}

// Fungsi untuk menangani respons API dalam bahasa Indonesia
function responsefunctionID(response) {
  console.log("Response from API (ID):", response);

  // Cek apakah respons berisi status sukses dan array items
  if (!response || response.status !== 'success' || !Array.isArray(response.items)) {
    console.error("Unexpected response format:", response);
    return;
  }

  const items = response.items;
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

  const contentIdElement = document.getElementById("content-id");
  if (contentIdElement) {
    contentIdElement.innerHTML = `
     <table class="table-auto w-full">
       <thead>
         <tr class="text-xs text-gray-500 text-left">
           <th class="font-medium">Nama Barang</th>
           <th class="font-medium">Berat Maksimal</th>
           <th class="font-medium">Destinasi</th>
           <th class="font-medium">Aksi</th>
         </tr>
       </thead>
       <tbody class="visibility-item">
         ${tableRows}
       </tbody>
     </table>
   `;
  } else {
    console.error("Element with id 'content-id' not found.");
  }
}
