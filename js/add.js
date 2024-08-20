import { postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js";

      // Fungsi untuk menambahkan item
      function addItem(event) {
        event.preventDefault();

        const destination = document.getElementById("destination").value;
        const prohibitedItems =
          document.getElementById("prohibited_items").value;
        const maxweight = document.getElementById('max_weight').value;

        if (!destination || !prohibitedItems || !maxweight) {
          alert("Please fill out all fields.");
          return;
        }

        const targetUrl =
          "https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/webhook/post/prohibited-items/en";

        const tokenKey = "Content-Type"; 
        const tokenValue = "application/json"; 
        const datajson = {
          destination: destination,
          prohibited_items: prohibitedItems,
          max_weight: maxweight
        };

        postJSON(targetUrl, tokenKey, tokenValue, datajson, (response) => {
          if (response.status === 200) {
            alert("Item added successfully");
            window.location.href = "../dashboard.html";
          } else {
            alert("Failed to add item: " + (response.data.message ));
          }
        });
      }

      // Attach event listener to form submit
      document
        .getElementById("addItemForm")
        .addEventListener("submit", addItem);