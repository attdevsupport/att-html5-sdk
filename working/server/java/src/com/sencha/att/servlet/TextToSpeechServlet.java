package com.sencha.att.servlet;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.Writer;
import java.net.URLEncoder;
import java.net.URLDecoder;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.json.JSONObject;

import org.apache.tika.mime.MimeTypes;
import org.apache.tika.mime.MimeType;

import com.sencha.att.provider.TokenResponse;

import com.att.api.oauth.OAuthToken;
import com.att.api.speech.service.TtsService;

/**
 * This class processes requests to the textToSpeech endpoint
 * @class com.sencha.att.servlet.SpeechToTextServlet
 */
public class TextToSpeechServlet extends ClientCredentialsServletBase {
  private static final long serialVersionUID = 1L; // first version of this servlet

  /*
   * @see HttpServlet#HttpServlet()
   */
  public TextToSpeechServlet() {
    super();
  }

  /**
   * Handle text to speech POST requests
   *
   * @method doPost
   *
   */
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
  {
    try {
      String text = request.getParameter("text");
      if (text == null) {
        throw new RuntimeException("'text' querystring parameter required");
      }
      OAuthToken token = this.credentialsManager.fetchOAuthToken();
      TtsService svc = new TtsService("https://api.att.com", token);
      byte[] rsp = svc.sendRequest("text/plain", text, getMergedXArgs(request));
      response.setContentType("audio/x-wav"); // codekit hard-codes this content type
      OutputStream os = response.getOutputStream();
      try {
        os.write(rsp);
      }
      finally {
        os.close();
      }
    } 
    catch (Exception se) {
      try {
        log(se.toString());
        se.printStackTrace();
        response.reset();
        response.setStatus(500);
        response.setContentType("text/json");
        Writer writer = response.getWriter();
        try {
          TokenResponse.getResponse(se).write(writer);
        }
        finally {
          writer.close();
        }
      } 
      catch (Exception e) {
        log(se.getMessage());
        e.printStackTrace();
      }
    } 
  }
}
