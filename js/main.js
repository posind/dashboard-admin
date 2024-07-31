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

// Menambahkan event listener untuk tab
document.addEventListener('DOMContentLoaded', () => {
  // Mendapatkan elemen konten untuk bahasa Inggris dan Indonesia
  const contentEN = document.getElementById("content-en");
  const contentID = document.getElementById("content-id");

  // Fungsi untuk memuat konten Bahasa Inggris
  async function loadItems() {
    try {
      const response = await fetch('https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/crud/item/en');
      if (!response.ok) throw new Error('Network response was not ok');
      const items = await response.json();

      let tableRows = '';
      let lastRowStyle = 'bg-gray-50'; // Mulai dengan gaya pertama

      items.forEach(item => {
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
                <a class="inline-block mr-2" href="#" >
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
      const response = await fetch('https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/crud/item/id');
      if (!response.ok) throw new Error('Network response was not ok');
      const barangs = await response.json();

      let tableRows = '';
      let lastRowStyle = 'bg-gray-50'; // Mulai dengan gaya pertama

      barangs.forEach(barang => {
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
                <a class="inline-block" href="#" onclick="deleteItemId('${barang.id}')">
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
    if (document.querySelector('[x-data]').__x.$data.tab === 'EN') {
      loadItems();
      contentID.innerHTML = ''; // Hapus konten Bahasa Indonesia
    } else if (document.querySelector('[x-data]').__x.$data.tab === 'ID') {
      loadBarang();
      contentEN.innerHTML = ''; // Hapus konten Bahasa Inggris
    }
  }

  // Menambahkan event listener untuk menangani perubahan tab
  document.querySelector('[x-data]').__x.$data.tab = 'EN';
  handleTabChange(); // Muat konten saat halaman pertama kali dimuat

  // Tambahkan listener untuk tab untuk memuat ulang konten saat tab berubah
  document.querySelectorAll('[x-on\\:click]').forEach(button => {
    button.addEventListener('click', handleTabChange);
  });
});

// Fungsi untuk menghapus item Inggris
function deleteItemEn(id) {
  if (confirm('Are you sure you want to delete this item?')) {
    fetch(`https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/crud/item/en?id=${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        alert('Item deleted successfully');
        // Update tampilan setelah penghapusan
        location.reload(); // Refresh halaman untuk melihat perubahan
      } else {
        alert('Failed to delete item');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error deleting item');
    });
  }
}

// Fungsi untuk menghapus item Indonesia
function deleteItemId(id) {
  if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
    fetch(`https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/crud/item/id?id=${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        alert('Item berhasil dihapus');
        // Update tampilan setelah penghapusan
        location.reload(); // Refresh halaman untuk melihat perubahan
      } else {
        alert('Gagal menghapus item');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error deleting item');
    });
  }
}


