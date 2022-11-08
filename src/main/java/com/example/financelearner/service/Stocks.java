package com.example.financelearner.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import yahoofinance.YahooFinance;
import yahoofinance.histquotes.Interval;

import java.io.IOException;
import java.util.Calendar;

@Path("/stock")
public class Stocks {
    ObjectMapper mapper = new ObjectMapper();
    @GET
    @Path("getStock")
    @Produces(MediaType.APPLICATION_JSON)
    public String getStock(@QueryParam("symbol") String symbol) throws IOException {
        Calendar from = Calendar.getInstance();
        Calendar to = Calendar.getInstance();
        from.add(Calendar.YEAR, -100);
        yahoofinance.Stock stock = YahooFinance.get(symbol, from, to, Interval.DAILY);
        String jsonString = mapper.writeValueAsString(stock);
        return jsonString;
    }
}
