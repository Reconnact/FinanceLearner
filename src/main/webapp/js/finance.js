document.addEventListener("DOMContentLoaded", () => {
    readFinance();
});

function readFinance() {
    let url = "./api/finance/getWatchlist";
    fetch(url)
        .then(function (response) {
            return response;
        })
        .then(response => response.json())
        .then(data => {
            showStock(data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function showStock(data) {
    document.getElementById("loader").style.display = "none";
    let tBody = document.getElementById("stocks");
    for (var key in data) {
        let stock = document.createElement("a")
        stock.href = window.location.href + "stock.html?symbol=" + key;
        stock.style.color = "black";
        stock.style.textDecoration = "none";
        stock.innerHTML = data[key].name + " (" + data[key].symbol + "): " + data[key].quote.price + " " + data[key].currency + " (";
        let change = document.createElement("change")
        change.type = "div";
        change.innerHTML = data[key].quote.change;
        if (data[key].quote.change < 0){
            change.style.color = "rgb(255,0,0)"
        } else {
            change.style.color = "rgb(62,122,0)"
        }
        stock.appendChild(change)
        stock.innerHTML += ")"
        tBody.appendChild(stock)
        linebreak = document.createElement("br");
        tBody.appendChild(linebreak)
    };

}
