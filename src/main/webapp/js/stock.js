document.addEventListener("DOMContentLoaded", () => {
    readStock();
});
let data = null;
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
        .then(dataResponse => {
            data = dataResponse;
            showStock();
        })
        .catch(function (error) {
                console.log(error);
            }
        );
}

function showStock() {
    document.getElementById("5").style.color = "blue";
    document.getElementById("loader").style.display = "none";
    document.title = data.name + " (" + data.symbol + ")";
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
            dates[values.length] = currentDate.getDate() + "." + currentDate.getMonth()+ "." + currentDate.getFullYear()
            values[values.length] = data.history[i].close;

        }
        values[values.length] = data.quote.price
        currentDate = new Date();
        dates[dates.length] = currentDate.getDate() + "." + currentDate.getMonth()+ "." + currentDate.getFullYear()
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

