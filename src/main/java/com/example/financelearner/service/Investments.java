package com.example.financelearner.service;

import com.example.financelearner.data.DataHandler;
import com.example.financelearner.model.Investment;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import yahoofinance.Stock;
import yahoofinance.YahooFinance;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Path("/investments")
public class Investments {
    ObjectMapper mapper = new ObjectMapper();

    @GET
    @Path("getInvestments")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getInvestments() throws IOException {
        List<Investment> investmentsList = DataHandler.getInvestmentList();
        for (int i = 0; i < investmentsList.size(); i++) {
            investmentsList.get(i).setCurrentPrice(YahooFinance.get(investmentsList.get(i)
                    .getSymbol()).getQuote().getPrice());
        }
        Response response = Response
                .status(200)
                .entity(investmentsList)
                .build();
        return response;
    }
}
