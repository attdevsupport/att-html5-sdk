package com.sencha.att.servlet;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.IOException;
import java.io.Writer;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URLEncoder;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.Collection;
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

import org.apache.tika.config.TikaConfig;
import org.apache.tika.mime.MimeTypes;
import org.apache.tika.mime.MimeType;

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
import com.att.api.speech.service.SpeechCustomService;

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
    File file;
    String filename;
    Writer responseWriter = response.getWriter();
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

      // we'll accept both xarg and xargs input, and merge
      // them if necessary.
      String xarg = request.getParameter("xarg");
      String xargs = request.getParameter("xargs");
      
      if ((xarg != null) && (xargs != null)) {
        xarg = URLEncoder.encode(URLDecoder.decode(xarg, "UTF-8") + "," + URLDecoder.decode(xargs, "UTF-8"), "UTF-8");
      }
      else if (xarg == null) {
        xarg = xargs;
      }

      OAuthToken token = this.credentialsManager.fetchOAuthToken();
      log("using clientCredentials token " + token.getAccessToken());

      SpeechResponse rsp;
      
      if (request.getRequestURI().contains("Custom")) {
        File dictionaryFile = getFileFromResource("dictionary.pls");
        File grammarFile = getFileFromResource("grammar.grxml");
        String[] attachments = new String[] {dictionaryFile.getAbsolutePath(), grammarFile.getAbsolutePath(), file.getAbsolutePath()};
        SpeechCustomService svc = new SpeechCustomService("https://api.att.com", token);
        rsp = svc.sendRequest(attachments, request.getParameter("context"), xarg);
      }
      else { // regular speechToText, not 'custom'
        SpeechService svc = new SpeechService("https://api.att.com", token);
        rsp = svc.sendRequest(file, xarg, request.getParameter("context"), request.getParameter("subcontext"));
      }
      // convert the speech-to-text response into JSON
      JSONObject responseJSON = new JSONObject();
      List<String[]> results = rsp.getResult();
      for (String[] keyvalue : results) {
        responseJSON.put(keyvalue[0], keyvalue[1]);
      }
      log(responseJSON.toString());

      responseJSON.write(responseWriter);
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

  private File getFileFromResource(String filename) throws FileNotFoundException, IOException
  {
    String tempdir = System.getProperty("java.io.tmpdir");
    String filepath = tempdir + filename;
    File file = new File(filepath);
    copyResourceToFile(filename, file);
    return file;
  }
  
  private void copyStreamToFile(InputStream stream, File file) throws FileNotFoundException, IOException
  {
    FileOutputStream out = new FileOutputStream(file.getAbsoluteFile());
    try {
      byte[] buffer = new byte[16 * 1024];
      int len;
      while ((len = stream.read(buffer)) != -1) {
        out.write(buffer, 0, len);
      }
    }
    finally {
      out.close();
    }
  }
  
  private void copyResourceToFile(String resourceName, File file) throws FileNotFoundException, IOException
  {
    FileMapper mapper = new FileMapper();
    FileMapping mapping = mapper.getFileForReference(file.getName());
    copyStreamToFile(mapping.stream, file);
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
