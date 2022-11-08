package com.example.financelearner.service;

import com.example.financelearner.data.DataHandler;
import com.example.financelearner.model.StartPageStock;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import yahoofinance.Stock;
import yahoofinance.YahooFinance;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Path("/watchlist")
public class Watchlist {
    ObjectMapper mapper = new ObjectMapper();

    @GET
    @Path("getSymbolWatchlist")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSymbolWatchlist() {
        List<String> symbolWatchlist = DataHandler.readWatchlist();
        Response response = Response
                .status(202)
                .entity(symbolWatchlist)
                .build();
        return response;
    }

    @GET
    @Path("getWatchlist")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getWatchlist() throws IOException {
        List<String> watchlistList = DataHandler.readWatchlist();
        String[] watchlist = new String[watchlistList.size()];
        watchlistList.toArray(watchlist);
        Map<String, Stock> stocks  = YahooFinance.get(watchlist, false);
        ArrayList<StartPageStock> startPageStocks = new ArrayList<>();
        for (int i = 0; i < stocks.size(); i++) {
            Stock stock = stocks.get(watchlist[i]);
            startPageStocks.add( new StartPageStock(
                    stock.getName(), stock.getSymbol(), stock.getQuote().getPrice(), stock.getCurrency(),
                    stock.getQuote().getChangeInPercent()));
        }
        Response response = Response
                .status(200)
                .entity(startPageStocks)
                .build();
        return response;
    }

    @POST
    @Path("insertWatchlistSymbol")
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertWatchlistSymbol(@QueryParam("symbol") String symbol) throws IOException {
        List<String> watchlist = DataHandler.readWatchlist();
        watchlist.add(symbol);
        DataHandler.writeWatchlistJSON(watchlist);
        Response response = Response
                .status(202)
                .entity("Success")
                .build();
        return response;
    }

    @DELETE
    @Path("deleteWatchlistSymbol")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteWatchlistSymbol(@QueryParam("symbol") String symbol) throws IOException {
        List<String> watchlist = DataHandler.readWatchlist();
        watchlist.remove(symbol);
        DataHandler.writeWatchlistJSON(watchlist);
        Response response = Response
                .status(202)
                .entity("Success")
                .build();
        return response;
    }
}
