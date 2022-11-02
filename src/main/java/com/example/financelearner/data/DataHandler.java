package com.example.financelearner.data;

import com.example.financelearner.service.Config;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;


import java.io.*;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class DataHandler {

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
}
