package com.sencha.att.servlet;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.Writer;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.json.JSONException;
import org.json.JSONObject;

import com.sencha.att.AttConstants;
import com.sencha.att.provider.ApiRequestException;
import com.sencha.att.provider.ClientCredentialsManager;
import com.sencha.att.provider.DirectServiceProvider;
import com.sencha.att.provider.FileMapper;
import com.sencha.att.provider.FileMapper.FileMapping;
import com.sencha.att.provider.ServiceProviderConstants;
import com.sencha.att.provider.TokenResponse;

import com.att.api.oauth.OAuthToken;
import com.att.api.speech.model.SpeechResponse;
import com.att.api.speech.service.SpeechService;

/**
 * This class processes requests to the speechtotext endpoint
 * @class com.sencha.att.servlet.SpeechToTextServlet
 */
public class SpeechToTextServlet extends HttpServlet {
  private static final long serialVersionUID = 1L; // first version of this servlet

  /*
   * The servlets instance of the ClientCredentialsManager configured using ATTConstatnts.
   */
  private ClientCredentialsManager credentialsManager;
  
  /*
   * @see HttpServlet#HttpServlet()
   */
  public SpeechToTextServlet() {
    super();
  }

  /**
   * @method init
   */
  public void init() throws ServletException {

    this.credentialsManager  = SharedCredentials.getInstance();
  }
  
  /**
   * Handle speech to text POST requests
   *
   * @method doPost
   *
   */
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
  {
    String filename;
    Writer responseWriter = response.getWriter();
    try {
      Part audio = request.getPart("speechaudio");
      if (audio != null) {
        response.setStatus(500);
        throw new RuntimeException("{\"error\":\"not implemented\"}");
      }
      else {
        filename = request.getParameter("filename");
        if (filename == null) {
          response.setStatus(400);
          throw new RuntimeException("{\"error\":\"'speechaudio' POST form parameter or 'filename' querystring parameter required\"}");
        }
        filename = URLDecoder.decode(filename);
      }

      OAuthToken token = this.credentialsManager.fetchOAuthToken();
      log("using clientCredentials token " + token.getAccessToken());

      String tempdir = System.getProperty("java.io.tmpdir");
      File file = new File(tempdir + File.pathSeparator + filename);
      if (!file.exists()) {
        FileMapper mapper = new FileMapper();
        FileMapping mapping = mapper.getFileForReference(filename);
        FileOutputStream out = new FileOutputStream(file.getAbsoluteFile());
        try {
          byte[] buffer = new byte[16 * 1024];
          int len;
          while ((len = mapping.stream.read(buffer)) != -1) {
            out.write(buffer, 0, len);
          }
        }
        finally {
          out.close();
        }
      }
      SpeechService svc = new SpeechService("https://api.att.com", token);
      SpeechResponse rsp = svc.sendRequest(file.getAbsoluteFile(), null, null, null);

      JSONObject responseJSON = new JSONObject();

      List<String[]> results = rsp.getResult();
      for (String[] keyvalue : results) {
        responseJSON.put(keyvalue[0], keyvalue[1]);
      }
      log(responseJSON.toString());

      responseJSON.write(responseWriter);

      } catch (Exception se) {
      try {
        TokenResponse.getResponse(se).write(responseWriter);
      } catch (Exception e) {
        log(se.getMessage());
        e.printStackTrace();
      }
    } finally {
      responseWriter.flush();
      responseWriter.close();
    }
  }

  private String getClientID() {
    return AttConstants.CLIENTIDSTRING;
  }

  private String getClientSecret() {
    return AttConstants.CLIENTSECRETSTRING;
  }

  private boolean inList(String[] stringArray, String name) {
    List<String> list = Arrays.asList(stringArray);
    Set<String> set = new HashSet<String>(list);
    return set.contains(name);
  }

  private JSONObject getData(HttpServletRequest request) throws JSONException {
    StringBuffer jb = new StringBuffer();
    String line = null;
    try {
      BufferedReader reader = request.getReader();
      while ((line = reader.readLine()) != null)
        jb.append(line);
    } catch (Exception e) {
      return new JSONObject().put(AttConstants.ERROR, e.getMessage());
    }
    return new JSONObject(jb.toString());
  }

}
