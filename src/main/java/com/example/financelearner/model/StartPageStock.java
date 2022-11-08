package com.example.financelearner.model;

import java.math.BigDecimal;

public class StartPageStock {
    private String name;
    private String symbol;
    private BigDecimal price;
    private String currency;
    private BigDecimal changeInPercent;

    public StartPageStock(String name, String symbol, BigDecimal price, String currency, BigDecimal changeInPercent) {
        this.name = name;
        this.symbol = symbol;
        this.price = price;
        this.currency = currency;
        this.changeInPercent = changeInPercent;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getChangeInPercent() {
        return changeInPercent;
    }

    public void setChangeInPercent(BigDecimal changeInPercent) {
        this.changeInPercent = changeInPercent;
    }
}
