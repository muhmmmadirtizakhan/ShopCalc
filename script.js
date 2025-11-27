
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  if (username === "irtiza" && password === "1234") {
    document.getElementById("login-card").classList.add("hidden");
    document.getElementById("invoice-app").classList.remove("hidden");
    initInvoice();
  } else {
    error.classList.remove("hidden");
  }
}

// LOGOUT
function logout() {
  document.getElementById("login-card").classList.remove("hidden");
  document.getElementById("invoice-app").classList.add("hidden");
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("error").classList.add("hidden");
  
  // Reset the invoice
  document.getElementById("receipt-body").innerHTML = "";
  total = 0;
  document.getElementById("total").innerText = "0.00";
}

// INVOICE
let total = 0;
let billNo = Math.floor(Math.random() * 10000);
let currentEmployee = "irtiza"; // Set based on login

function initInvoice() {
  document.getElementById("bill-no").innerText = billNo;
  document.getElementById("bill-date").innerText = new Date().toLocaleDateString();
}

function addItem() {
  const item = document.getElementById("item").value;
  const qty = parseInt(document.getElementById("qty").value);
  const price = parseFloat(document.getElementById("price").value);

  if (item && qty > 0 && !isNaN(price)) {
    const receiptBody = document.getElementById("receipt-body");
    const row = document.createElement("tr");
    const itemTotal = qty * price;

    row.innerHTML = `
      <td class="p-2 border-b">${item}</td>
      <td class="p-2 border-b">Rs ${price.toFixed(2)}</td>
      <td class="p-2 border-b">${qty}</td>
      <td class="p-2 border-b">Rs ${itemTotal.toFixed(2)}</td>
    `;
    receiptBody.appendChild(row);

    total += itemTotal;
    document.getElementById("total").innerText = total.toFixed(2);

    document.getElementById("item").value = "";
    document.getElementById("qty").value = "";
    document.getElementById("price").value = "";
  }
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Set font
  doc.setFont("helvetica", "normal");
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(237, 106, 12); // Orange color
  doc.text("Noor Bakery Invoice", 105, 20, { align: "center" });
  
  // Date and Branch Code
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black color
  const now = new Date();
  const formattedDate = now.toLocaleDateString();
  const formattedTime = now.toLocaleTimeString();
  doc.text(`Date: ${formattedDate} ${formattedTime}`, 20, 35);
  doc.text("Branch Code: 2222-2234343", 20, 45);
  
  // Bill No
  doc.text(`Bill No: ${billNo}`, 160, 35);
  
  // Table header
  doc.setFillColor(237, 106, 12);
  doc.setTextColor(255, 255, 255);
  doc.rect(20, 60, 170, 10, 'F');
  doc.text("Product", 25, 67);
  doc.text("Price", 85, 67);
  doc.text("Qty", 125, 67);
  doc.text("Total", 165, 67);
  
  // Table rows
  doc.setTextColor(0, 0, 0);
  let y = 75;
  const rows = document.querySelectorAll("#receipt-body tr");
  
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    doc.text(cells[0].innerText, 25, y);
    doc.text(cells[1].innerText, 85, y);
    doc.text(cells[2].innerText, 125, y);
    doc.text(cells[3].innerText, 165, y);
    y += 8;
  });
  
  // Grand Total
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`Grand Total: Rs ${total.toFixed(2)}`, 20, y + 15);
  
  // Employee
  doc.setFontSize(12);
  doc.text(`Employee: ${currentEmployee}`, 20, y + 30);
  
  // Save the PDF
  doc.save(`Noor_Bakery_Invoice_${billNo}.pdf`);
}