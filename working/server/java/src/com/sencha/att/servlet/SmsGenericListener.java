package com.sencha.att.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * 
 * @class com.sencha.att.servlet.SmsGenericListener
 */
public class SmsGenericListener extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String body = IOUtils.toString(req.getInputStream(), "UTF-8");
        try {
            JSONObject smsJson = new JSONObject(body);
            this.processSmsMessage(smsJson);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     * @method processSmsMessage This method should be override on child class
     *         of this generic listener.
     * @param message
     */
    public void processSmsMessage(JSONObject message) {
        // NO OP
    }
}
