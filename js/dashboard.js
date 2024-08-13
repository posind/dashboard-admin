import {get}from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js";
import { deleteJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js';


get("https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/get/prohibited-items/en", responsefunction);


// Fungsi untuk memuat konten Bahasa Inggris
function responsefunction(items) {
 console.log(items);
 
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
       <td class="font-medium">${item.destination || "N/A"}</td>
       <td>
         <div>
           <!-- Ikon Edit -->
           <a class="inline-block mr-2" href="edititem.html?id=${item.id}">
             <i class="fas fa-edit" style="font-size: 18px; color: #382CDD;"></i>
           </a>
           
           <!-- Ikon Delete -->
           <a class="inline-block" href="#" onclick="deleteItemEn('${
             item.id
           }')">
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

get("https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/get/item", loadBarang);

// Fungsi untuk memuat konten Bahasa Indonesia
function loadBarang(barangs) {
  console.log(barangs);
  
  let tableRows = "";
  let lastRowStyle = "bg-gray-50"; // Mulai dengan gaya pertama

  barangs.forEach((barang) => {
    const rowStyle = lastRowStyle;
    lastRowStyle = lastRowStyle === "bg-gray-50" ? "" : "bg-gray-50"; // Berganti gaya

    tableRows += `
      <tr class="text-xs ${rowStyle}">
        <td class="flex px-4 py-3">
          <div>
            <p class="font-medium">${barang.barang_terlarang || "N/A"}</p>
          </div>
        </td>
        <td class="font-medium">${barang.destinasi || "N/A"}</td>
        <td>
          <div>
            <!-- Ikon Edit -->
            <a class="inline-block mr-2" href="editbrg.html?id=${barang.id}">
              <i class="fas fa-edit" style="font-size: 18px; color: #382CDD;"></i>
            </a>
            
            <!-- Ikon Delete -->
            <a class="inline-block" href="#" onclick="deleteItemId('${
              barang.id
            }')">
              <i class="fas fa-trash" style="font-size: 20px; color: #E85444;"></i>
            </a>
          </div>
        </td>
      </tr>
    `;
  });

  document.getElementById("content-id").innerHTML = `
    <table class="table-auto w-full">
      <thead>
        <tr class="text-xs text-gray-500 text-left">
          <th class="font-medium">Nama Barang</th>
          <th class="font-medium">Destinasi</th>
          <th class="font-medium">Aksi</th>
        </tr>
      </thead>
      <tbody class="visibility-item">
        ${tableRows}
      </tbody>
    </table>
  `;
 }

// Fungsi untuk menavigasi halaman dengan parameter dinamis
function navigateTo(page) {
  window.location.href = page;
}

function logout() {
  navigateTo("https://pos.in.my.id/login/login.html");
}

function addItem() {
  navigateTo("crud/additem.html");
}

function tambahBarang() {
  navigateTo("crud/tambahbr.html");
}


// Fungsi untuk menghapus item Bahasa Inggris
function deleteItemEn(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    const targetUrl = "https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/delete/prohibited-items/en?id=${id}";

    deleteJSON(targetUrl, '', '', {}, (response) => {
      if (response.status === 200) {
        alert("Item deleted successfully");
        loadItems(); // Memuat ulang data tanpa memuat ulang halaman
      } else {
        alert("Failed to delete item");
      }
    });
  }
}



// Fungsi untuk menghapus item Bahasa Indonesia
function deleteItemId(id) {
  if (confirm("Apakah Anda yakin ingin menghapus item ini?")) {
    const targetUrl = "https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/delete/item?id=${id}";
    
    deleteJSON(targetUrl, '', '', {}, (response) => {
      if (response.status === 200) {
        alert("Item berhasil dihapus");
        loadBarang();
      } else {
        alert("Gagal menghapus item");
      }
    });
  }
}

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
    document.getElementById("content-id").innerHTML = ""; // Hapus konten Bahasa Indonesia
  } else if (tab === "ID") {
    loadBarang();
    document.getElementById("content-en").innerHTML = ""; // Hapus konten Bahasa Inggris
  }
}
