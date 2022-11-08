package com.example.financelearner.service;

import com.example.financelearner.data.DataHandler;
import com.example.financelearner.model.Investment;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import yahoofinance.YahooFinance;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@Path("/money")
public class MoneyService {

    @GET
    @Path("getMoney")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getInvestments() throws IOException {
        BigDecimal money = DataHandler.getMoney();
        Response response = Response
                .status(200)
                .entity(money)
                .build();
        return response;
    }
}
