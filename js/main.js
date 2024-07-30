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

// Dashboard Bahasa Inggris
let lastRowStyle = 'bg-gray-50'; // Mulai dengan gaya pertama

async function loadItems() {
  const content = document.getElementById("content");

  try {
    // Mengambil data dari backend
    const response = await fetch('https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/crud/item/en');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const items = await response.json();

    let tableRows = '';

    items.forEach(item => {
      // Tentukan gaya baris berdasarkan gaya terakhir
      const rowStyle = lastRowStyle;
      lastRowStyle = (lastRowStyle === 'bg-gray-50') ? '' : 'bg-gray-50'; // Berganti gaya

      tableRows += `
        <tr class="text-xs ${rowStyle}">
          <td class="flex px-4 py-3">
            <div>
              <p class="font-medium">${item.prohibited_items || 'N/A'}</p>
            </div>
          </td>
          <td class="font-medium">${item.destination || 'N/A'}</td>
          <td>
            <div>
            <!-- Ikon Edit -->
              <a class="inline-block mr-2" href="#">
                  <i class="fas fa-edit" style="font-size: 18px; color: #382CDD;"></i>
              </a>
            <!-- Ikon Delete -->
              <a class="inline-block" href="#">
                  <i class="fas fa-trash" style="font-size: 20px; color: #E85444;"></i>
              </a>
            </div>
          </td>
        </tr>
      `;
    });

    // Mengatur konten tabel setelah baris tabel dibuat
    content.innerHTML = `
      <table class="table-auto w-full">
        <thead x-show="tab == 'EN'">
          <tr class="text-xs text-gray-500 text-left">
            <th class="font-medium">Items Name</th>
            <th class="font-medium">Destination</th>
            <th class="font-medium">Action</th>
          </tr>
        </thead>
        <tbody x-show="tab == 'EN'" class="visibility-item">
          ${tableRows}
        </tbody>
      </table>
    `;

  } catch (error) {
    console.error("Error loading items:", error);
    content.innerHTML = `<p class="text-red-500">Failed to load items. Please try again later.</p>`;
  }
}


// Dashboard Bahasa Indonesia
async function loadBarang() {
  const content = document.getElementById("content");

  try {
    // Mengambil data dari backend
    const response = await fetch('https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/crud/item/id');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const barangs = await response.json();

    let tableRows = '';

    barangs.forEach(barang => {
      // Tentukan gaya baris berdasarkan gaya terakhir
      const rowStyle = lastRowStyle;
      lastRowStyle = (lastRowStyle === 'bg-gray-50') ? '' : 'bg-gray-50'; // Berganti gaya

      tableRows += `
        <tr class="text-xs ${rowStyle}">
          <td class="flex px-4 py-3">
            <div>
              <p class="font-medium">${barang.barang_terlarang || 'N/A'}</p>
            </div>
          </td>
          <td class="font-medium">${barang.destinasi || 'N/A'}</td>
          <td>
            <div>
            <!-- Ikon Edit -->
              <a class="inline-block mr-2" href="#">
                  <i class="fas fa-edit" style="font-size: 18px; color: #382CDD;"></i>
              </a>
            <!-- Ikon Delete -->
              <a class="inline-block" href="#">
                  <i class="fas fa-trash" style="font-size: 20px; color: #E85444;"></i>
              </a>
            </div>
          </td>
        </tr>
      `;
    });

    content.innerHTML = `
        <thead x-show="tab == 'ID'">
          <tr class="text-xs text-gray-500 text-left">
            <th class="font-medium">Nama Barang</th>
            <th class="font-medium">Destinasi</th>
            <th class="font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody x-show="tab == 'ID'" class="visibility-item">
          ${tableRows}
        </tbody>
    `;

  } catch (error) {
    console.error("Error loading items:", error);
    content.innerHTML = `<p class="text-red-500">Failed to load items. Please try again later.</p>`;
  }
}

