package com.html5sdk.att.servlet;

public class AttAuthorizationException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public AttAuthorizationException(String errorMessage) {
        super(errorMessage);
    }

}
