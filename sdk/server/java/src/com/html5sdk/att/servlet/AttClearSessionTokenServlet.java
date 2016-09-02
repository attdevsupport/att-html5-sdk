package com.html5sdk.att.servlet;

import com.html5sdk.att.servlet.SessionUtils;
import java.io.IOException;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.io.Writer;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.json.JSONException;
import org.json.JSONObject;

public class AttClearSessionTokenServlet
extends HttpServlet {
    private static final long serialVersionUID = 1;

    public AttClearSessionTokenServlet() {
        //default constructor
    }

    public void init() throws ServletException {
        //no-op
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        try {
            JSONObject object = new JSONObject();
            String[] scopes = new String[]{"IMMN", "MIM"};
            HttpSession session = request.getSession();
            SessionUtils.revokeTokens(session, scopes);
            session.removeAttribute("ATT_TOKEN_MAP");
            object.put("removed", (Object)"ATT_TOKEN_MAP");
            PrintWriter out = response.getWriter();
            object.write((Writer)out);
            out.flush();
            out.close();
        }
        catch (JSONException se) {
            try {
                PrintWriter out = response.getWriter();
                JSONObject resp = new JSONObject();
                resp.put("error", (Object)se.getMessage());
                resp.write((Writer)out);
                out.flush();
                out.close();
            }
            catch (Exception e) {
                this.log(se.getMessage());
                e.printStackTrace();
            }
        }
    }
}

