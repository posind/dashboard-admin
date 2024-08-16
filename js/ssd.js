import { postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js";

function send(event) {
  event.preventDefault();

  const question = document.getElementById("question").value;
  const answer = document.getElementById("answer").value;

  if (!question || !answer) {
    alert("Please fill out all fields.");
    return;
  }

  const targetUrl =
    "https://asia-southeast2-civil-epigram-429004-t8.cloudfunctions.net/pibackend/data/ssd/input";

  const tokenKey = "Content-Type";
  const tokenValue = "application/json";
  const datajson = {
    question: question,
    answer: answer,
  };

  postJSON(targetUrl, tokenKey, tokenValue, datajson, (response) => {
    if (response.status === 200) {
      alert("Send data successfully");
    } else {
      alert("Failed to send data: " + response.data.message);
    }
  });
}

document.getElementById("SSDForm").addEventListener("submit", send);
