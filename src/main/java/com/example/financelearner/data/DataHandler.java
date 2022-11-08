package com.example.financelearner.data;

import com.example.financelearner.model.Investment;
import com.example.financelearner.model.Money;
import com.example.financelearner.service.Config;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;


import java.io.*;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class DataHandler {
    private static List<Investment> investmentList;
    private static BigDecimal money = new BigDecimal(0);

    public static void writeWatchlistJSON(List<String> watchList) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.writeValue(new File(String.valueOf(Paths.get(Config.getProperty("stockWatchlist")))), watchList);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static List<String> readWatchlist() {
        List<String> watchlist = new ArrayList<>();
        try {
            Type listType = new TypeToken<List<String>>() {
            }.getType();

            InputStream fis = new FileInputStream(Config.getProperty("stockWatchlist"));
            InputStreamReader isr = new InputStreamReader(fis, StandardCharsets.UTF_8);
            Reader reader = new BufferedReader(isr);
            watchlist = new Gson().fromJson(reader, listType);
            if (watchlist == null){
                watchlist = new ArrayList<>();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return watchlist;
    }

    public static void readInvestmentsJSON() {
        try {
            String path = Config.getProperty("stockInvestments");
            byte[] jsonData = Files.readAllBytes(
                    Paths.get(path)
            );
            ObjectMapper objectMapper = new ObjectMapper();
            Investment[] investments = objectMapper.readValue(jsonData, Investment[].class);
            for (Investment investment : investments) {
                investmentList.add(investment);
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public static void readMoneyJSON() {
        try {
            String path = Config.getProperty("money");
            byte[] jsonData = Files.readAllBytes(
                    Paths.get(path)
            );
            ObjectMapper objectMapper = new ObjectMapper();
            Money moneyData = objectMapper.readValue(jsonData, Money.class);
            money = moneyData.getMoney();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public static List<Investment> getInvestmentList() {
        investmentList = new ArrayList<>();
        readInvestmentsJSON();
        return investmentList;
    }

    public static void setInvestmentList(List<Investment> investmentList) {
        DataHandler.investmentList = investmentList;
    }

    public static BigDecimal getMoney() {
        readMoneyJSON();
        return money;
    }

    public static void setMoney(BigDecimal money) {
        DataHandler.money = money;
    }
}
