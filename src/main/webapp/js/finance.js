document.addEventListener("DOMContentLoaded", () => {
    readWatchlist();
    readInvestments();
});

function readWatchlist() {
    let url = "./api/watchlist/getWatchlist";
    fetch(url)
        .then(function (response) {
            return response;
        })
        .then(response => response.json())
        .then(data => {
            showWatchlist(data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function readInvestments() {
    let url = "./api/investments/getInvestments";
    fetch(url)
        .then(function (response) {
            if (response.ok){
                return response;
            } else if (response.status == 500){
                let msg = document.createElement("div")
                msg.innerHTML = "No Investments"
                document.getElementById("investments").appendChild(msg)
                document.getElementById("investedlistLoader").style.display = "none";
                return null;
            }
        })
        .then(response => response.json())
        .then(data => {
            let investments = new Array();
            let doubleInvestments = new Array();
            for (let i = 0; i < data.length; i++) {
                if (!containsObject(data[i], investments)){
                    investments.push(data[i])
                } else {
                    var result = investments.findIndex(investment => investment.symbol === data[i].symbol);
                    if (investments[result].addedProfit){
                        investments[result]["addedProfit"] += investments[result].currentPrice - data[i].buyPrice;
                    } else {
                        investments[result]["addedProfit"] = investments[result].currentPrice - data[i].buyPrice;
                    }
                }
            }
            console.log(investments)
            showInvestments(investments);
            calculateMoney(data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function containsObject(obj, list){
    for (let i = 0; i < list.length; i++) {
        if (list[i].symbol === obj.symbol) {
            return true;
        }
    }
    return false;
}

function calculateMoney(investmentData){
    let url = "./api/money/getMoney";
    fetch(url)
        .then(function (response) {
            return response;
        })
        .then(response => response.json())
        .then(data => {
            let absoluteMoney = data;
            let money = data;
            let change = 0;
            let changePercent = 0;
            let portfolio = 0;
            for (let i = 0; i < investmentData.length; i++) {
                money += investmentData[i].currentPrice;
                change += Math.round((investmentData[i].currentPrice - investmentData[i].buyPrice) * 100) / 100;
                changePercent += (investmentData[i].currentPrice - investmentData[i].buyPrice)
                    / investmentData[i].buyPrice * 100;
                portfolio += investmentData[i].currentPrice;
            }
            changePercent = Math.round(changePercent * 100) / 100
            showValues({absoluteMoney, portfolio, money, change, changePercent})
            if (changePercent >= 0) changePercent = "+" + changePercent
            document.getElementById("money").innerHTML = "USD " + Math.round(money * 100) / 100 + " "
            let changeDiv = getChangeElement(change, change + "(" + changePercent + "%)")
            document.getElementById("money").appendChild(changeDiv)
        })
        .catch(function (error) {
            console.log(error);
        });
}

function showValues(data){
    document.getElementById("balance").innerHTML = Math.round(data.money * 100) / 100 + "$"
    document.getElementById("portfolio").innerHTML = Math.round(data.portfolio * 100) / 100 + "$"
    document.getElementById("available").innerHTML = Math.round(data.absoluteMoney * 100) / 100 + "$"
    let absoluteChange = getChangeElement(data.change, data.change + "$")
    document.getElementById("absoluteChange").appendChild(absoluteChange)
    let relativeChange = getChangeElement(Math.round(data.changePercent * 100) / 100, Math.round(data.changePercent * 100) / 100 + "%")
    document.getElementById("relativeChange").appendChild(relativeChange)
}

function showInvestments(investments) {
    document.getElementById("investedlistLoader").style.display = "none";
    let tBody = document.getElementById("investments");
    for (let i = 0; i < investments.length; i++) {
        let stock = document.createElement("a")
        stock.href = window.location.href + "stock.html?symbol=" + investments[i].symbol;
        stock.style.color = "black";
        stock.style.textDecoration = "none";
        stock.innerHTML = investments[i].name + " (" + investments[i].symbol + "): " + investments[i].currentPrice +
            " USD (";
        let change;
        if (investments[i].addedProfit){
            change = Math.round(((investments[i].currentPrice - investments[i].buyPrice) +
                investments[i].addedProfit) * 100) / 100;
        } else {
            change = Math.round((investments[i].currentPrice - investments[i].buyPrice) * 100) / 100;
        }
        let changeDiv = getChangeElement(change, change);
        stock.appendChild(changeDiv)
        stock.innerHTML += ")"
        let linebreak = document.createElement("br");
        tBody.appendChild(stock)
        tBody.appendChild(linebreak)
    }
}


function showWatchlist(data) {
    document.getElementById("watchlistLoader").style.display = "none";
    let tBody = document.getElementById("watchlist");
    for (let i = 0; i < data.length; i++) {
        let stock = document.createElement("a")
        stock.href = window.location.href + "stock.html?symbol=" + data[i].symbol;
        stock.style.color = "black";
        stock.style.textDecoration = "none";
        stock.innerHTML = data[i].name + " (" + data[i].symbol + "): " + data[i].price + " " + data[i].currency + " (";
        let change = data[i].changeInPercent + "%"
        let changeDiv = getChangeElement(data[i].changeInPercent, change);
        stock.appendChild(changeDiv)
        stock.innerHTML += ")"
        tBody.appendChild(stock)
        let linebreak = document.createElement("br");
        tBody.appendChild(linebreak)
    };
}

function getChangeElement(change, value){
    let changeDiv = document.createElement("change")
    changeDiv.type = "div";
    if (change < 0){
        changeDiv.style.color = "rgb(255,0,0)"
    } else {
        changeDiv.style.color = "rgb(62,122,0)"
        changeDiv.innerHTML = "+"
    }
    changeDiv.innerHTML += value
    return changeDiv;
}


