let userData = {
  balance: 10000,
  holdings: {
    bitcoin: 0,
    ethereum: 0,
    solana: 0
  },
  history: []
};

// LOAD DATA
function loadData(){
  let data = localStorage.getItem("tradex");
  if(data){
    userData = JSON.parse(data);
  }
}

// SAVE DATA
function saveData(){
  localStorage.setItem("tradex", JSON.stringify(userData));
}
function buyAsset(coin, price, qty){
  let cost = price * qty;

  if(userData.balance < cost){
    alert("Not enough balance");
    return;
  }

  userData.balance -= cost;
  userData.holdings[coin] += qty;

  userData.history.push({
    type:"BUY",
    coin,
    price,
    qty,
    time:Date.now()
  });

  saveData();
}