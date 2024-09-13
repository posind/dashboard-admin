import { get, deleteJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js";

// Fungsi untuk mengambil token dari cookie
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
  // alert("You are not logged in!");
} else {
  console.log("Login token found:", token);
}

// Fungsi untuk memuat item dari file JSON (bahasa Inggris)
function loadItems() {
  // Gunakan file JSON dummy
  fetch('webhook.prohibited_items_en.json')
    .then(response => response.json())
    .then(items => {
      console.log("Data received (EN):", items);

      // Cek apakah 'items' adalah array sebelum memproses
      if (!Array.isArray(items)) {
        console.error("Expected an array but got:", items);
        return;
      }

      let tableRows = "";
      let lastRowStyle = "bg-gray-50"; // Mulai dengan gaya pertama

      // Iterasi melalui data items
      items.forEach((item) => {
        const rowStyle = lastRowStyle;
        lastRowStyle = lastRowStyle === "bg-gray-50" ? "" : "bg-gray-50"; // Berganti gaya

        tableRows += `
          <tr class="text-xs ${rowStyle}">
            <td class="flex px-4 py-3">
              <div>
                <p class="font-medium">${item['Prohibited Items'] || "N/A"}</p>
              </div>
            </td>
            <td class="font-medium">${"N/A"}</td> <!-- Kolom 'Max Weight' tidak ada di JSON, jadi tampilkan 'N/A' -->
            <td class="font-medium">${item.Destination || "N/A"}</td>
            <td>
              <div>
                <!-- Ikon Edit -->
                <a class="inline-block mr-2" href="../edititem.html?id=${item._id['$oid']}">
                  <i class="fas fa-edit" style="font-size: 18px; color: #382CDD;"></i>
                </a>
                
                <!-- Ikon Delete -->
                <a class="inline-block" href="#" onclick="deleteItemEn('${item._id['$oid']}')">
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
               <th class="font-medium">Prohibited Item</th>
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
    })
    .catch(error => {
      console.error("Error loading dummy data:", error);
    });
}

// Fungsi untuk menghapus item Bahasa Inggris
function deleteItemEn(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    // Simulasi penghapusan item
    alert(`Item with ID ${id} successfully deleted (simulation)`);

    // Muat ulang data setelah penghapusan (simulasi tanpa mengubah JSON)
    loadItems();
  }
}

// Pastikan deleteItemEn tersedia secara global
window.deleteItemEn = deleteItemEn;

// Memuat data ketika halaman pertama kali diakses
loadItems();

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
    loadItems(); // Panggil loadItems untuk memuat data barang Bahasa Inggris
    const contentIdElement = document.getElementById("content-id");
    if (contentIdElement) contentIdElement.innerHTML = ""; // Hapus konten Bahasa Indonesia
  } else if (tab === "ID") {
    loadItemsID(); // Panggil loadItemsID untuk memuat data barang Bahasa Indonesia
    const contentEnElement = document.getElementById("content-en");
    if (contentEnElement) contentEnElement.innerHTML = ""; // Hapus konten Bahasa Inggris
  }
}
