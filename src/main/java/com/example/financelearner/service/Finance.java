package com.example.financelearner.service;

import com.example.financelearner.data.DataHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import yahoofinance.Stock;
import yahoofinance.YahooFinance;
import yahoofinance.quotes.stock.StockQuote;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Path("/finance")
public class Finance {
    ObjectMapper mapper = new ObjectMapper();
    @GET
    @Path("getStock")
    @Produces(MediaType.APPLICATION_JSON)
    public String getStock(@QueryParam("symbol") String symbol) throws IOException {
        Stock stock = YahooFinance.get(symbol);
        String jsonString = mapper.writeValueAsString(stock);
        return jsonString;
    }

    @GET
    @Path("getWatchlist")
    @Produces(MediaType.APPLICATION_JSON)
    public String getWatchlist() throws IOException {
        List<String> watchlistList = DataHandler.readWatchlist();
        String[] watchlist = new String[watchlistList.size()];
        watchlistList.toArray(watchlist);
        Map<String, Stock> stocks  = YahooFinance.get(watchlist);
        String jsonString = mapper.writeValueAsString(stocks);
        return jsonString;
    }
}