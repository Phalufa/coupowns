package com.miko.couponsystemfullstack.controllers;

import com.miko.couponsystemfullstack.services.ClientService;

public class Session {

    private ClientService clientService;
    private long lastSeen;

    public Session(ClientService clientService, long lastSeen) {
        this.clientService = clientService;
        this.lastSeen = lastSeen;
    }

    public ClientService getClientService() {
        return clientService;
    }

    public long getLastSeen() {
        return lastSeen;
    }

    public void setLastSeen(long lastSeen) {
        this.lastSeen = lastSeen;
    }
}
