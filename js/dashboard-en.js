import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

const token = getCookie('Login'); 

if (!token) {
  console.error("Login token not found in cookies.");
  alert("You are not logged in!");
  redirect("../");
} else {
  console.log("Login token found:", token);
}

function loadItems() {
  if (!token) {
    alert("You are not logged in!");
    return;
  }

  const headers = {
    "Login": `Bearer ${token}`, 
    "Content-Type": "application/json"
  };

  getJSON(
    "https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/get/prohibited-items/en",
    headers,
    responsefunction
  );
}

// Function to handle API response
function responsefunction(response) {
  console.log("Response from API:", response);

  // Check if response contains success status and items array
  if (!response || response.status !== 'success' || !Array.isArray(response.items)) {
    console.error("Unexpected response format:", response);
    return;
  }

  const items = response.items;
  let tableRows = "";
  let lastRowStyle = "bg-gray-50"; // Start with the first style

  items.forEach((item) => {
    const rowStyle = lastRowStyle;
    lastRowStyle = lastRowStyle === "bg-gray-50" ? "" : "bg-gray-50"; // Toggle row style

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
            <!-- Edit Icon -->
            <a class="inline-block mr-2" href="crud/edititem.html?id=${item.id}">
              <i class="fas fa-edit" style="font-size: 18px; color: #382CDD;"></i>
            </a>
            
            <!-- Delete Icon -->
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

// Function to delete an item using the fetch API
function deleteItemEn(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    const targetUrl = `https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/delete/prohibited-items/en?id=${id}`;
    const headers = {
      "Login": `Bearer ${token}`, // Use 'Login' header with token
      "Content-Type": "application/json"
    };

    // Using fetch API to send a DELETE request
    fetch(targetUrl, {
      method: 'DELETE',
      headers: headers
    })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
      if (data.status === 'success') {
        alert("Item deleted successfully");
        loadItems(); // Reload items after deletion
      } else {
        console.error("Failed to delete item. Response:", data);
        alert("Failed to delete item");
      }
    })
    .catch(error => {
      console.error("Error while deleting item:", error);
      alert("An error occurred while deleting the item");
    });
  }
}

// Make deleteItemEn globally accessible
window.deleteItemEn = deleteItemEn;

// Event listener for Alpine.js initialization
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
    }, 100); // Wait briefly to ensure Alpine.js is initialized
  });
});

// Function to handle tab change
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
    if (contentIdElement) contentIdElement.innerHTML = ""; // Clear ID content if present
  } else if (tab === "ID") {
    loadItemsID(); // Implement this function for the ID tab
    const contentEnElement = document.getElementById("content-en");
    if (contentEnElement) contentEnElement.innerHTML = ""; // Clear English content
  }
}
