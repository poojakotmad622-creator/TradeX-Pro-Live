// BALANCE
let balance = localStorage.getItem("balance")
  ? parseFloat(localStorage.getItem("balance"))
  : 100000;

// PORTFOLIO
let portfolio =
  JSON.parse(localStorage.getItem("portfolio")) || [];

// UPDATE BALANCE
if (document.getElementById("balance")) {
  document.getElementById("balance").innerText =
    balance.toLocaleString();
}

// DISPLAY PORTFOLIO
function displayPortfolio() {

  let tbody = document.querySelector("#portfolioTable tbody");

  if (!tbody) return;

  tbody.innerHTML = "";

  portfolio.forEach(asset => {

    let row = `
      <tr>
        <td>${asset.name}</td>
        <td>${asset.qty}</td>
        <td>$${asset.buyPrice}</td>
        <td>$${(asset.qty * asset.buyPrice).toLocaleString()}</td>
      </tr>
    `;

    tbody.innerHTML += row;

  });

}

displayPortfolio();

// BUY ASSET
function buyAsset(name, price, qty) {

  let cost = price * qty;

  if (balance < cost) {
    alert("Insufficient Balance!");
    return;
  }

  balance -= cost;

  let found = portfolio.find(item => item.name === name);

  if (found) {
    found.qty += qty;
  } else {
    portfolio.push({
      name: name,
      qty: qty,
      buyPrice: price
    });
  }

  localStorage.setItem("balance", balance);
  localStorage.setItem(
    "portfolio",
    JSON.stringify(portfolio)
  );

  if (document.getElementById("balance")) {
    document.getElementById("balance").innerText =
      balance.toLocaleString();
  }

  displayPortfolio();

  let history =
    JSON.parse(localStorage.getItem("history")) || [];

  history.push({
    type: "BUY",
    asset: name,
    qty: qty,
    price: price,
    time: new Date().toLocaleString()
  });

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

  alert("Bought " + qty + " " + name);
}

// SELL ASSET
function sellAsset(name, price, qty) {

  let found = portfolio.find(item => item.name === name);

  if (!found || found.qty < qty) {
    alert("Not enough quantity!");
    return;
  }

  found.qty -= qty;

  balance += price * qty;

  portfolio = portfolio.filter(item => item.qty > 0);

  localStorage.setItem("balance", balance);
  localStorage.setItem(
    "portfolio",
    JSON.stringify(portfolio)
  );

  if (document.getElementById("balance")) {
    document.getElementById("balance").innerText =
      balance.toLocaleString();
  }

  displayPortfolio();

  let history =
    JSON.parse(localStorage.getItem("history")) || [];

  history.push({
    type: "SELL",
    asset: name,
    qty: qty,
    price: price,
    time: new Date().toLocaleString()
  });

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

  alert("Sold " + qty + " " + name);
}

// THEME
function toggleTheme() {

  document.body.classList.toggle("light-theme");

  if (document.body.classList.contains("light-theme")) {

    localStorage.setItem("theme", "light");

    const btn = document.getElementById("themeBtn");

    if (btn) {
      btn.innerHTML = "☀ Light Mode";
    }

  } else {

    localStorage.setItem("theme", "dark");

    const btn = document.getElementById("themeBtn");

    if (btn) {
      btn.innerHTML = "🌙 Dark Mode";
    }

  }
}

// LOAD SAVED THEME
if (localStorage.getItem("theme") === "light") {

  document.body.classList.add("light-theme");

  const btn = document.getElementById("themeBtn");

  if (btn) {
    btn.innerHTML = "☀ Light Mode";
  }
}