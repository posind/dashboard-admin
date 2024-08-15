import { get, deleteJSON, putJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js";

// Muat data saat halaman dimuat
get(
  "https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/get/prohibited-items/en",
  responsefunction
);

// Fungsi untuk menangani tampilan data
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

// Fungsi untuk menghapus item
function deleteItemEn(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    const targetUrl = `https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/delete/prohibited-items/en?id=${id}`;
    const tokenKey = "Content-Type";
    const tokenValue = "application/json";

    deleteJSON(targetUrl, tokenKey, tokenValue, {}, (response) => {
      if (response.status === 200) {
        alert("Item deleted successfully");
        get(
          "https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/get/prohibited-items/en",
          responsefunction
        ); // Muat ulang data setelah penghapusan
      } else {
        alert("Failed to delete item");
      }
    });
  }
}

// Definisikan data destinasi secara manual
const destinations = [
  { id: '1', destination: 'Afghanistan' },
  { id: '2', destination: 'Albania' },
  // Tambahkan destinasi lain sesuai kebutuhan
];

// Fungsi untuk mengisi elemen <select> dengan opsi
function populateOptions() {
  const selectElement = document.getElementById("destination");

  // Kosongkan elemen <select> jika ada opsi sebelumnya
  selectElement.innerHTML = "";

  // Tambahkan opsi default
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Select a destination";
  defaultOption.value = "";
  selectElement.appendChild(defaultOption);

  // Tambahkan opsi baru dari array destinations
  destinations.forEach((destination) => {
    const option = document.createElement("option");
    option.textContent = destination.destination;
    option.value = destination.destination;
    selectElement.appendChild(option);
  });
}

// Fungsi untuk memuat data item ke dalam form saat halaman dimuat
function loadItemData() {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('id');

  console.log("Item ID:", itemId);

  if (itemId) {
    const targetUrl = `https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/get/prohibited-item/en/${itemId}`;

    console.log("Fetching URL:", targetUrl); // Log URL untuk memverifikasi

    get(targetUrl, (response) => {
      console.log("API Response:", response); // Log respons API untuk debug

      if (response.status === 200) {
        const item = response.data;
        document.getElementById("itemId").value = item.id;
        document.getElementById("destination").value = item.destination;
        document.getElementById("prohibited_items").value = item.prohibited_items;
      } else {
        alert("Failed to load item data");
      }
    });
  } else {
    alert("No item ID provided");
  }
}


// Panggil fungsi saat halaman dimuat
window.onload = function() {
  const destinationElement = document.getElementById("destination");
  if (destinationElement) {
    populateOptions(); // Isi opsi dropdown dengan data manual
  }
  loadItemData(); // Muat data item
};


// Fungsi untuk memperbarui item
function updateItem() {
  const id = document.getElementById("itemId").value;
  const destination = document.getElementById("destination").value;
  const prohibitedItems = document.getElementById("prohibited_items").value;

  const targetUrl = `https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/update/prohibited-items/en`;
  const tokenKey = "Content-Type";
  const tokenValue = "application/json";
  const datajson = {
    id: id,
    destination: destination,
    prohibited_items: prohibitedItems,
  };

  putJSON(targetUrl, tokenKey, tokenValue, datajson, (response) => {
    if (response.status === 200) {
      alert("Item updated successfully");
      window.location.href = "../dashboard.html"; // Kembali ke dashboard setelah pembaruan
    } else {
      alert("Failed to update item");
    }
  });
}

// Pastikan deleteItemEn dan updateItem tersedia secara global
window.deleteItemEn = deleteItemEn;
window.updateItem = updateItem;

// Fungsi untuk menavigasi halaman dengan parameter dinamis
function navigateTo(page) {
  window.location.href = page;
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
    document.getElementById("content-id").innerHTML = ""; // Hapus konten ID jika ada
  } else if (tab === "ID") {
    loadItemsID();
    document.getElementById("content-en").innerHTML = ""; // Hapus konten Bahasa Inggris
  }
}