import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { get } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

// Fungsi untuk memeriksa token login dan memuat data barang
function checkLoginAndFetchData() {
  const loginToken = getCookie("login");
  if (!loginToken) {
    alert("You are not logged in! Redirecting to login page.");
    redirect("../");
    return;
  }

  console.log("Login token found:", loginToken);

  // Memuat data barang
  loadBarangData(loginToken);
}

// Memuat data dari API untuk barang dalam Bahasa Indonesia
function loadBarangData(token) {
  const headers = new Headers({
    "Authorization": `Bearer ${token}`, // Gunakan token login yang diambil dari cookie dalam format Bearer
    "Content-Type": "application/json"
  });

  console.log("Sending request with headers:", headers);

  get(
    "https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/get/item",
    (response) => {
      console.log("Response status:", response.status);
      if (response.status === 200) {
        loadBarang(response.data); // Memuat data jika respons sukses
      } else {
        console.error("Failed to load data. Status code:", response.status);
        alert("Failed to load data. Please check your login status.");
      }
    },
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

// Fungsi untuk menghapus item
function deleteItemId(id) {
  const loginToken = getCookie("login"); // Ambil token dari cookie
  if (!loginToken) {
    alert("You are not logged in! Redirecting to login page.");
    redirect("../"); // Arahkan ke halaman login jika tidak ada token
    return;
  }

  if (confirm("Apakah Anda yakin ingin menghapus item ini?")) {
    const targetUrl = `https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/delete/item?id=${id}`;
    const headers = {
      "Authorization": `Bearer ${loginToken}`, // Gunakan token login dari cookie dalam format Bearer
      "Content-Type": "application/json"
    };

    console.log("Sending delete request with headers:", headers);

    // Gunakan fetch API untuk melakukan request DELETE
    fetch(targetUrl, {
      method: 'DELETE',
      headers: headers
    })
    .then(response => response.json()) // Parsing respons sebagai JSON
    .then(data => {
      console.log("Delete response data:", data);
      if (data.status === 'success') { // Jika status dari respons adalah 'success'
        alert("Item berhasil dihapus");
        // Muat ulang data setelah penghapusan
        loadBarangData(loginToken);
      } else {
        console.error("Failed to delete item. Response:", data);
        alert("Gagal menghapus item");
      }
    })
    .catch(error => {
      console.error("Error while deleting item:", error);
      alert("Terjadi kesalahan saat menghapus item");
    });
  }
}

// Pastikan deleteItemId tersedia secara global
window.deleteItemId = deleteItemId;

// Memuat data ketika halaman pertama kali diakses
checkLoginAndFetchData();

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
    checkLoginAndFetchData(); // Panggil checkLoginAndFetchData untuk memuat data barang Bahasa Indonesia
    const contentEnElement = document.getElementById("content-en");
    if (contentEnElement) contentEnElement.innerHTML = ""; // Hapus konten Bahasa Inggris
  }
}
