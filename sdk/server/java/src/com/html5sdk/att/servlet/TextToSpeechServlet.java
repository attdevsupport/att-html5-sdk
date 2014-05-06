package com.html5sdk.att.servlet;

import java.io.IOException;
import java.io.OutputStream;
import java.io.Writer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.att.api.oauth.OAuthToken;
import com.att.api.speech.service.TtsService;
import com.html5sdk.att.provider.TokenResponse;

/**
 * This class processes requests to the textToSpeech endpoint
 * 
 * @class com.html5sdk.att.servlet.SpeechToTextServlet
 */
public class TextToSpeechServlet extends ServiceServletBase {
    private static final long serialVersionUID = 1L;

    public TextToSpeechServlet() {
        super();
    }

    /**
     * Handle text to speech POST requests
     * 
     * @method doPost
     * 
     */
    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        try {
            String text = request.getParameter("text");
            if (text == null) {
                throw new RuntimeException(
                        "'text' querystring parameter required");
            }
            String accept = request.getParameter("accept");
            if (accept == null) {
                accept = "audio/x-wav";
            }
            String language = request.getParameter("language");
            if (language == null) {
                language = "en-US";
            }
            OAuthToken token = this.credentialsManager.fetchOAuthToken();
            TtsService svc = new TtsService("https://api.att.com", token);
            byte[] rsp = svc.sendRequest("text/plain", text,
                    getMergedXArgs(request), accept, language);
            response.setContentType(accept);
            OutputStream os = response.getOutputStream();
            try {
                os.write(rsp);
            } finally {
                os.close();
            }
        } catch (Exception se) {
            try {
                log(se.toString());
                se.printStackTrace();
                response.reset();
                response.setStatus(500);
                response.setContentType("text/json");
                Writer writer = response.getWriter();
                try {
                    TokenResponse.getResponse(se).write(writer);
                } finally {
                    writer.close();
                }
            } catch (Exception e) {
                log(se.getMessage());
                e.printStackTrace();
            }
        }
    }
}
