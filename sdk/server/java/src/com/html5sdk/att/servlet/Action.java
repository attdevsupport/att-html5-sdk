package com.html5sdk.att.servlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface Action {

    boolean match(HttpServletRequest request);

    void handleException(Exception e, HttpServletResponse response);

    void execute(HttpServletRequest request, HttpServletResponse response)
            throws Exception;
}
