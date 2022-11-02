document.addEventListener("DOMContentLoaded", () => {
    readStock();
});

function readStock() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const symbol = urlParams.get("symbol");
    document.title = symbol;
    fetch("./api/finance/getStock?symbol=" + symbol)
        .then(function (response) {
            if (response.ok) {
                return response;
            } else {
                console.log(response);
            }
        })
        .then(response => response.json())
        .then(data => {
            showStock(data);
        })
        .catch(function (error) {
                console.log(error);
            }
        );
}

function showStock(data) {
    document.getElementById("loader").style.display = "none";
    document.title = data.name + " (" + data.symbol + ")";
    document.getElementById("name").innerHTML = data.name + " (" + data.symbol + ")";
    document.getElementById("value").innerHTML = data.quote.price;
    document.getElementById("change").innerHTML = data.quote.change;
    if (data.quote.change < 0){
        document.getElementById("change").style.color = "rgb(255,0,0)"
    } else {
        document.getElementById("change").style.color = "rgb(62,122,0)"
    }
}
