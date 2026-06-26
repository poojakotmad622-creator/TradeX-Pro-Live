const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
};

let users = [];

/* ================= USERS ================= */

async function loadUsers() {
  const res = await fetch("/api/users", { headers });
  const data = await res.json();

  users = data || [];

  document.getElementById("totalUsers").innerText = users.length;

  document.getElementById("userTable").innerHTML =
    users.map(u => `
      <tr>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td><button class="danger" onclick="deleteUser('${u._id}')">Delete</button></td>
      </tr>
    `).join("");
}

async function createUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  if (!name || !email) return alert("Fill all fields");

  await fetch("/api/users", {
    method: "POST",
    headers,
    body: JSON.stringify({ name, email })
  });

  loadUsers();
}

async function deleteUser(id) {
  await fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers
  });

  loadUsers();
}

/* ================= DEPOSITS ================= */

async function loadDeposits() {
  const res = await fetch("/api/deposits", { headers });
  const data = await res.json();

  document.getElementById("depositTable").innerHTML =
    data.map(d => `
      <tr>
        <td>${d.userId?.name || d.userId}</td>
        <td>₹${d.amount}</td>
        <td>${d.status}</td>
        <td>
          <button class="ok" onclick="approveDeposit('${d._id}')">Approve</button>
          <button class="danger" onclick="rejectDeposit('${d._id}')">Reject</button>
        </td>
      </tr>
    `).join("");
}

async function approveDeposit(id) {
  await fetch(`/api/deposit/${id}/approve`, { method: "PUT", headers });
  loadDeposits();
  loadUsers();
  loadWallets();
}

async function rejectDeposit(id) {
  await fetch(`/api/deposit/${id}/reject`, { method: "PUT", headers });
  loadDeposits();
}

/* ================= WITHDRAW ================= */

async function loadWithdrawals() {
  const res = await fetch("/api/withdrawals", { headers });
  const data = await res.json();

  document.getElementById("withdrawTable").innerHTML =
    data.map(w => `
      <tr>
        <td>${w.userId?.name || w.userId}</td>
        <td>₹${w.amount}</td>
        <td>${w.status}</td>
        <td>
          <button class="ok" onclick="approveWithdraw('${w._id}')">Approve</button>
          <button class="danger" onclick="rejectWithdraw('${w._id}')">Reject</button>
        </td>
      </tr>
    `).join("");
}

async function approveWithdraw(id) {
  await fetch(`/api/withdraw/${id}/approve`, { method: "PUT", headers });
  loadWithdrawals();
  loadUsers();
  loadWallets();
}

async function rejectWithdraw(id) {
  await fetch(`/api/withdraw/${id}/reject`, { method: "PUT", headers });
  loadWithdrawals();
}

/* ================= WALLETS ================= */

async function loadWallets() {
  const res = await fetch("/api/wallets", { headers });
  const data = await res.json();

  let total = 0;

  document.getElementById("walletTable").innerHTML =
    data.map(w => {
      total += w.balance;

      return `
        <tr>
          <td>${w.name}</td>
          <td>₹${w.balance}</td>
          <td><button onclick="updateBalance('${w.id}')">Update</button></td>
        </tr>
      `;
    }).join("");

  document.getElementById("totalBalance").innerText = total;
}

async function updateBalance(id) {
  const val = prompt("Enter balance");
  if (!val) return;

  await fetch(`/api/wallet/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ balance: Number(val) })
  });

  loadWallets();
}

/* ================= INIT ================= */

loadUsers();
loadDeposits();
loadWithdrawals();
loadWallets();