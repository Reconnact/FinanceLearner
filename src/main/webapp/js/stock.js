document.addEventListener("DOMContentLoaded", () => {
    readStock();
});
let data = null;
let watchlist = false;
let symbol = null;
function readStock() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    symbol = urlParams.get("symbol");
    document.title = symbol;
    fetch("./api/watchlist/getSymbolWatchlist")
        .then(function (response) {
            if (response.ok) {
                return response;
            }
        })
        .then(response => response.json())
        .then(data => {
            checkWatchlist(data, symbol)
        })
    fetch("./api/stock/getStock?symbol=" + symbol)
        .then(function (response) {
            if (response.ok) {
                return response;
            }
        })
        .then(response => response.json())
        .then(dataResponse => {
            if (dataResponse == null){
                show404();
            }
            data = dataResponse;
            showStock();
            showTable();
        })
        .catch(function (error) {
            console.log(error);
        });
}

function checkWatchlist(data, symbol){
    for (let i = 0; i < data.length; i++) {
        if(data[i].toLowerCase() === symbol.toLowerCase()){
            document.getElementById("star").style.color = "orange";
            watchlist = true;
        }
    }
}

function updateWatchlist(){
    if (watchlist){
        fetch("./api/watchlist/deleteWatchlistSymbol?symbol=" + symbol.toUpperCase(), {method: "DELETE"}).then(function (response){
            document.getElementById("star").style.color = "black";
            watchlist = false;
        });
    } else {
        fetch("./api/watchlist/insertWatchlistSymbol?symbol=" + symbol.toUpperCase(), {method: "POST"}).then(function (response){
            document.getElementById("star").style.color = "orange";
            watchlist = true;
        });
    }
}

function showStock() {
    document.getElementById("detailedStock").style.visibility = "visible";
    document.getElementById("5").style.color = "blue";
    document.getElementById("loader").style.display = "none";
    document.title = data.name + " (" + data.symbol + ")";
    document.getElementById("star").style.visibility = "visible";
    document.getElementById("name").innerHTML = data.name + " (" + data.symbol + ")";
    document.getElementById("value").innerHTML = data.quote.price;
    document.getElementById("change").innerHTML = data.quote.change + " (" + data.quote.changeInPercent + "%)";
    if (data.quote.change < 0){
        document.getElementById("change").style.color = "rgb(255,0,0)"
    } else {
        document.getElementById("change").style.color = "rgb(62,122,0)"
    }
    document.getElementById("timeframes").style.display = "unset";
    showChart(5)
}


function activateBtn(e){
    var childDivs = document.getElementById('timeframes').getElementsByTagName('button');
    for(i=0; i< childDivs.length; i++ ) {
        childDivs[i].style.color = "black"
    }
    e.style.color = "blue"
}

function showChart(days){
        import("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js")
        const ctx = document.getElementById('chart').getContext('2d');
        let values = []
        let dates = []
        let backgroundColor = "rgb(154,169,148)";
        let color = "rgb(62,122,0)";
        if(days == "max" || days > data.history.length){
            days = data.history.length
        }
        if (data.history[data.history.length-days].close > data.quote.price){
            color = "rgb(255,0,0)";
            backgroundColor = "rgb(255,213,213)";
        }
        for (let i = data.history.length-days; i < data.history.length; i++) {
            let currentDate = new Date(data.history[i].date);
            dates[values.length] = currentDate.getDate() + "." + (currentDate.getMonth() + 1) + "." + currentDate.getFullYear()
            values[values.length] = data.history[i].close;

        }
        values[values.length] = data.quote.price
        currentDate = new Date();
        dates[dates.length] = currentDate.getDate() + "." + (currentDate.getMonth() + 1) + "." + currentDate.getFullYear()
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: data.symbol,
                    data: values,
                    borderColor: color,
                    backgroundColor: backgroundColor
                }]
            },
            options: {
                elements: {
                    point:{
                        radius: 0,
                    },
                    line:{
                        tension: 0,
                        borderWidth: 1
                    }
                },
                legend: {
                    display: false
                },

            },
        });
}

function showTable() {
    document.getElementById("stockDetails").style.visibility = "visible";
    document.getElementById("currentValue").innerHTML = data.quote.price;
    document.getElementById("statsChange").innerHTML = data.quote.changeInPercent + "%";
    document.getElementById("previousClose").innerHTML = data.quote.previousClose;
    document.getElementById("ask").innerHTML = data.quote.ask;
    document.getElementById("bid").innerHTML = data.quote.bid;
    document.getElementById("high").innerHTML = data.quote.dayHigh;
    document.getElementById("low").innerHTML = data.quote.dayLow;
    document.getElementById("volume").innerHTML = data.quote.volume;
    document.getElementById("avgVolume").innerHTML = data.quote.avgVolume;
}


function show404(){
    document.getElementById("html").innerHTML = "<style>\n" +
        "@import 'https://fonts.googleapis.com/css?family=Inconsolata';\n" +
        " html {\n" +
        "\t min-height: 100%;\n" +
        "}\n" +
        " body {\n" +
        "\t box-sizing: border-box;\n" +
        "\t height: 100%;\n" +
        "\t background-color: #000;\n" +
        "\t background-image: radial-gradient(#11581e, #041607), url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif');\n" +
        "\t background-repeat: no-repeat;\n" +
        "\t background-size: cover;\n" +
        "\t font-family: 'Inconsolata', Helvetica, sans-serif;\n" +
        "\t font-size: 1.5rem;\n" +
        "\t color: rgba(128, 255, 128, 0.8);\n" +
        "\t text-shadow: 0 0 1ex rgba(51, 255, 51, 1), 0 0 2px rgba(255, 255, 255, 0.8);\n" +
        "}\n" +
        " .noise {\n" +
        "\t pointer-events: none;\n" +
        "\t position: absolute;\n" +
        "\t width: 100%;\n" +
        "\t height: 100%;\n" +
        "\t background-image: url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif\');\n" +
        "\t background-repeat: no-repeat;\n" +
        "\t background-size: cover;\n" +
        "\t z-index: -1;\n" +
        "\t opacity: 0.02;\n" +
        "}\n" +
        " .overlay {\n" +
        "\t pointer-events: none;\n" +
        "\t position: absolute;\n" +
        "\t width: 100%;\n" +
        "\t height: 100%;\n" +
        "\t background: repeating-linear-gradient(180deg, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%);\n" +
        "\t background-size: auto 4px;\n" +
        "\t z-index: 1;\n" +
        "}\n" +
        " .overlay::before {\n" +
        "\t content: \"\";\n" +
        "\t pointer-events: none;\n" +
        "\t position: absolute;\n" +
        "\t display: block;\n" +
        "\t top: 0;\n" +
        "\t left: 0;\n" +
        "\t right: 0;\n" +
        "\t bottom: 0;\n" +
        "\t width: 100%;\n" +
        "\t height: 100%;\n" +
        "\t background-image: linear-gradient(0deg, transparent 0%, rgba(32, 128, 32, 0.2) 2%, rgba(32, 128, 32, 0.8) 3%, rgba(32, 128, 32, 0.2) 3%, transparent 100%);\n" +
        "\t background-repeat: no-repeat;\n" +
        "\t animation: scan 7.5s linear 0s infinite;\n" +
        "}\n" +
        " @keyframes scan {\n" +
        "\t 0% {\n" +
        "\t\t background-position: 0 -100vh;\n" +
        "\t}\n" +
        "\t 35%, 100% {\n" +
        "\t\t background-position: 0 100vh;\n" +
        "\t}\n" +
        "}\n" +
        " .terminal {\n" +
        "\t box-sizing: inherit;\n" +
        "\t position: absolute;\n" +
        "\t height: 100%;\n" +
        "\t width: 1000px;\n" +
        "\t max-width: 100%;\n" +
        "\t padding: 4rem;\n" +
        "\t text-transform: uppercase;\n" +
        "}\n" +
        " .output {\n" +
        "\t color: rgba(128, 255, 128, 0.8);\n" +
        "\t text-shadow: 0 0 1px rgba(51, 255, 51, 0.4), 0 0 2px rgba(255, 255, 255, 0.8);\n" +
        "}\n" +
        " .output::before {\n" +
        "\t content: \"> \";\n" +
        "}\n" +
        "/* .input {\n" +
        "\t color: rgba(192, 255, 192, 0.8);\n" +
        "\t text-shadow: 0 0 1px rgba(51, 255, 51, 0.4), 0 0 2px rgba(255, 255, 255, 0.8);\n" +
        "}\n" +
        " .input::before {\n" +
        "\t content: \"$ \";\n" +
        "}\n" +
        " */\n" +
        " a {\n" +
        "\t color: #fff;\n" +
        "\t text-decoration: none;\n" +
        "}\n" +
        " a::before {\n" +
        "\t content: \"[\";\n" +
        "}\n" +
        " a::after {\n" +
        "\t content: \"]\";\n" +
        "}\n" +
        " .errorcode {\n" +
        "\t color: white;\n" +
        "}\n" +
        " \n" +
        "</style>\n" +
        "<div class=\"noise\"></div>\n" +
        "<div class=\"overlay\"></div>\n" +
        "<div class=\"terminal\">\n" +
        "  <h1>Error <span class=\"errorcode\">404</span></h1>\n" +
        "  <p class=\"output\">The page you are looking for might have been removed, had its name changed or is temporarily unavailable.</p>\n" +
        "  <p class=\"output\">Please try to <a href=\"./\">return to the homepage</a>.</p>\n" +
        "  <p class=\"output\">Good luck.</p>\n" +
        "</div>"
}
