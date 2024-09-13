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
  alert("You are not logged in!");
} else {
  console.log("Login token found:", token);
}

// Memuat data dari API untuk barang dalam Bahasa Indonesia
function loadBarangData() {
  if (!token) {
    alert("You are not logged in!");
    return;
  }

  const headers = new Headers({
    "Authorization": `Bearer ${token}`, // Gunakan token login yang diambil dari cookie dalam format Bearer
    "Content-Type": "application/json"
  });

  get(
    "https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/get/item",
    loadBarang,
    { headers }
  );
}

// Fungsi untuk memuat konten Bahasa Indonesia
function loadBarang(barangs) {
  console.log("Data received:", barangs);

  // Cek apakah 'barangs' adalah array sebelum memproses
  if (!Array.isArray(barangs)) {
    console.error("Expected an array but got:", barangs);
    return;
  }

  let tableRows = "";
  let lastRowStyle = "bg-gray-50"; // Mulai dengan gaya pertama

  // Iterasi melalui data barang
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
        <td class="font-medium">${barang.berat_barang || "N/A"}</td>
        <td class="font-medium">${barang.destinasi || "N/A"}</td>
        <td>
          <div>
            <!-- Ikon Edit -->
            <a class="inline-block mr-2" href="crud/editbrg.html?id=${barang.id}">
              <i class="fas fa-edit" style="font-size: 18px; color: #382CDD;"></i>
            </a>
            
            <!-- Ikon Delete -->
            <a class="inline-block" href="#" onclick="deleteItemId('${barang.id}')">
              <i class="fas fa-trash" style="font-size: 20px; color: #E85444;"></i>
            </a>
          </div>
        </td>
      </tr>
    `;
  });

  // Menampilkan tabel barang di elemen dengan id "content-id"
  const contentIdElement = document.getElementById("content-id");
  if (contentIdElement) {
    contentIdElement.innerHTML = `
      <table class="table-auto w-full">
        <thead>
          <tr class="text-xs text-gray-500 text-left">
            <th class="font-medium">Nama Barang</th>
            <th class="font-medium">Berat Barang</th>
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

// Fungsi untuk menghapus item Bahasa Indonesia
function deleteItemId(id) {
  if (!token) {
    alert("You are not logged in!");
    return;
  }

  if (confirm("Apakah Anda yakin ingin menghapus item ini?")) {
    const targetUrl = `https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/delete/item?id=${id}`;
    const headers = new Headers({
      "Authorization": `Bearer ${token}`, // Gunakan token login dari cookie dalam format Bearer
      "Content-Type": "application/json"
    });

    deleteJSON(targetUrl, headers, {}, (response) => {
      if (response.status === 200) {
        alert("Item berhasil dihapus");
        // Muat ulang data setelah penghapusan
        loadBarangData();
      } else {
        console.error("Failed to delete item. Response:", response);
        alert("Gagal menghapus item");
      }
    });
  }
}

// Pastikan deleteItemId tersedia secara global
window.deleteItemId = deleteItemId;

// Memuat data ketika halaman pertama kali diakses
loadBarangData();

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
    loadItems(); // Fungsi ini harus ada untuk tab EN
    const contentIdElement = document.getElementById("content-id");
    if (contentIdElement) contentIdElement.innerHTML = ""; // Hapus konten Bahasa Indonesia
  } else if (tab === "ID") {
    loadBarangData(); // Panggil loadBarangData untuk memuat data barang Bahasa Indonesia
    const contentEnElement = document.getElementById("content-en");
    if (contentEnElement) contentEnElement.innerHTML = ""; // Hapus konten Bahasa Inggris
  }
}
