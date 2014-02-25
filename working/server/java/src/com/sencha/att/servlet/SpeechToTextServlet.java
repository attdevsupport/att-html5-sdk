package com.sencha.att.servlet;

import java.io.File;
import java.io.IOException;
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
import com.att.api.speech.model.SpeechResponse;
import com.att.api.speech.service.SpeechService;
import com.att.api.speech.service.SpeechCustomService;

/**
 * @class com.sencha.att.servlet.SpeechToTextServlet
 * This class processes requests to the speechToText
 * and speechToTextCustom endpoints
 */
public class SpeechToTextServlet extends ClientCredentialsServletBase {
  private static final long serialVersionUID = 1L; // first version of this servlet

  /*
   * @see HttpServlet#HttpServlet()
   */
  public SpeechToTextServlet() {
    super();
  }

  /**
   * Handle speech to text POST requests
   *
   * @method doPost
   *
   */
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
  {
    File file;
    String filename;
    Writer responseWriter = response.getWriter();
    response.setContentType("text/json");
    try {
      
      Part audio = request.getPart("speechaudio");
      if (audio != null) { // are we being passed audio data from the browser?

        // copy the audio data to a file - codekit currently requires a file
        // we do some work to make sure the file has the right extension,
        // since codekit relies on the extension to determine content-type.
        String contentType = audio.getContentType();
        MimeTypes types = MimeTypes.getDefaultMimeTypes();
        MimeType type = types.forName(contentType);
        String extension = type.getExtension();
        if (extension.isEmpty() && contentType.equals("audio/wav")) {
          type = types.forName("audio/x-wav");
          extension = type.getExtension();
        }
        if (extension.isEmpty()) {
          throw new RuntimeException("no extension found for Content-Type '" + audio.getContentType() + "'");
        }
        file = File.createTempFile("speechaudio", extension);
        filename = file.getName();
        log(filename);
        copyStreamToFile(audio.getInputStream(), file);
      }
      else { // its not audio data - are we being passed the name of a file on the server?
        filename = request.getParameter("filename");
        if (filename == null) {
          response.setStatus(400);
          throw new RuntimeException("'speechaudio' POST form parameter or 'filename' querystring parameter required");
        }
        // server-based audio files are packaged as resources in
        // the site .war file. Copy it as a single file on disk,
        // so codekit knows how to handle it.
        filename = URLDecoder.decode(filename, "UTF-8");
        file = getFileFromResource(filename);
      }

      String xarg = getMergedXArgs(request);
      
      OAuthToken token = this.credentialsManager.fetchOAuthToken();
      log("using clientCredentials token " + token.getAccessToken());

      String rsp;
      
      if (request.getRequestURI().contains("Custom")) {
        File dictionaryFile = getFileFromResource("dictionary.pls");
        File grammarFile = getFileFromResource("grammar.grxml");
        String[] attachments = new String[] {dictionaryFile.getAbsolutePath(), grammarFile.getAbsolutePath(), file.getAbsolutePath()};
        SpeechCustomService svc = new SpeechCustomService("https://api.att.com", token);
        rsp = svc.sendRequestAndReturnRawJson(attachments, request.getParameter("context"), xarg);
      }
      else { // regular speechToText, not 'custom'
        SpeechService svc = new SpeechService("https://api.att.com", token);
        rsp = svc.sendRequestAndReturnRawJson(file, xarg, request.getParameter("context"), request.getParameter("subcontext"));
      }
      log(rsp);
      responseWriter.write(rsp);
    } 
    catch (Exception se) {
      try {
        log(se.toString());
        se.printStackTrace();
        
        response.setStatus(500);
        TokenResponse.getResponse(se).write(responseWriter);
      } 
      catch (Exception e) {
        log(se.getMessage());
        e.printStackTrace();
      }
    } 
    finally {
      responseWriter.flush();
      responseWriter.close();
    }
  }
}
