import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  set,
  get,
  update,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_e9vc8FFFRqV6Xy3HTaOoKznhTvRN6jY",
  authDomain: "omeal-c7454.firebaseapp.com",
  databaseURL: "https://omeal-c7454-default-rtdb.firebaseio.com",
  projectId: "omeal-c7454",
  storageBucket: "omeal-c7454.appspot.com",
  messagingSenderId: "64609571512",
  appId: "1:64609571512:web:303253a17213cb5b0c9a4d",
  measurementId: "G-R2SY23Z4GX",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getDatabase(firebaseApp);

const ordersRef = ref(db, "orders");
get(ordersRef).then((snapshot) => {
  if (snapshot.exists()) {
    const orders = snapshot.val();

    const ordersTable = document.querySelector(".orders-table");

    for (let key in orders) {
      let order = orders[key];
      let itemList = order.itemList;
      //get array values
      let items = Object.values(itemList);
    
      const orderRow = document.createElement("tr");
      orderRow.setAttribute("data-id", key);
      orderRow.innerHTML = `
      <td>${order.date} ${order.time}</td>
      <td>${order.userName}</td>
      <td>
      ${items.map((item) => `<p>${item.quantity} ${item.name} - $${item.price}</p>`).join("")}

      </td>
      <td>${order.total}</td>
      <td>${order.address}</td>
      <td>
        <select class="order-status form-control">
          <option ${
            order.status == "Pending" ? "selected" : ""
          } value="Pending">Pending</option>
          <option ${
            order.status == "Processing" ? "selected" : ""
          } value="Processing">Processing</option>
          <option ${
            order.status == "Cancelled" ? "selected" : ""
          } value="Cancelled">Cancelled</option>
          <option ${
            order.status == "Delivered" ? "selected" : ""
          } value="Delivered">Delivered</option>
        </select>

      </td>
      `;
      ordersTable.appendChild(orderRow);
    }
  } else {
    console.log("No data available");
  }
});

//update order status
const ordersTable = document.querySelector(".orders-table");
ordersTable.addEventListener("change", (e) => {
  if (e.target.classList.contains("order-status")) {
    const orderId =
      e.target.parentElement.parentElement.getAttribute("data-id");
    const orderStatus = e.target.value;
    const orderRef = ref(db, "orders/" + orderId);

    //update only status property and show success message
    update(orderRef, {
      status: orderStatus,
    })
      .then(() => {
        $(".order_success_alert").show();
        setTimeout(() => {
          $(".order_success_alert").hide();
        }, 3000);
      })
      .catch((error) => {
        $(".order_error_alert").show();
        setTimeout(() => {
          $(".order_error_alert").hide();
        }, 3000);
      });
  }
});
