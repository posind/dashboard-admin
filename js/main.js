// Fungsi logout
function logout() {
  window.location.href = "https://pos.in.my.id/login/login.html";
}

// Fungsi untuk menavigasi ke halaman tambah item
function addItem() {
  window.location.href = "crud/additem.html";
}

// Fungsi untuk menavigasi ke halaman tambah barang
function tambahBarang() {
  window.location.href = "crud/tambahbr.html";
}

document.addEventListener("alpine:init", () => {
  document.addEventListener("DOMContentLoaded", () => {
    // Mendapatkan elemen konten untuk bahasa Inggris dan Indonesia
    const contentEN = document.getElementById("content-en");
    const contentID = document.getElementById("content-id");

    // Fungsi untuk memuat konten Bahasa Inggris
    async function loadItems() {
      try {
        const response = await fetch(
          "https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/crud/items/eng"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const items = await response.json();

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
                <a class="inline-block mr-2" id="editItemLink" href="#">
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

        contentEN.innerHTML = `
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
      } catch (error) {
        console.error("Error loading items:", error);
        contentEN.innerHTML = `<p class="text-red-500">Failed to load items. Please try again later.</p>`;
      }
    }

    // Fungsi untuk memuat konten Bahasa Indonesia
    async function loadBarang() {
      try {
        const response = await fetch(
          "https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/crud/items/ind"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const barangs = await response.json();

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
                <a class="inline-block mr-2" id="editBrgLink" href="#">
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

        contentID.innerHTML = `
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
      } catch (error) {
        console.error("Error loading barangs:", error);
        contentID.innerHTML = `<p class="text-red-500">Gagal memuat barang. Coba lagi nanti.</p>`;
      }
    }

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
        contentID.innerHTML = ""; // Hapus konten Bahasa Indonesia
      } else if (tab === "ID") {
        loadBarang();
        contentEN.innerHTML = ""; // Hapus konten Bahasa Inggris
      }
    }

    // Cek jika elemen x-data ada sebelum mengakses propertinya
    const xDataElement = document.querySelector("[x-data]");
    if (xDataElement) {
      handleTabChange();
    } else {
      console.error("Element with [x-data] attribute not found.");
    }

    // Tambahkan listener untuk tab untuk memuat ulang konten saat tab berubah
    document.querySelectorAll("[x-on\\:click]").forEach((button) => {
      button.addEventListener("click", handleTabChange);
    });
  });
});

