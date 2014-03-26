package com.sencha.att.servlet;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.tika.mime.MimeType;
import org.apache.tika.mime.MimeTypes;

import com.att.api.oauth.OAuthToken;
import com.att.api.speech.service.SpeechCustomService;
import com.att.api.speech.service.SpeechService;
import com.sencha.att.AttConstants;

/**
 * @class com.sencha.att.servlet.SpeechToTextServlet This class processes
 *        requests to the speechToText and speechToTextCustom endpoints
 */
public class SpeechToTextServlet extends ClientCredentialsServletBase {
    private static final long serialVersionUID = 1L; // first version of this
                                                     // servlet

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
    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        this.executeWithJsonErrorHandling(request, response);
    }

    @Override
    protected String execute(HttpServletRequest request) throws Exception {

        File file;
        String filename;
        Part audio = request.getPart("speechaudio");

        // are we being passed audio data from the browser?
        if (audio != null) {

            // copy the audio data to a file - codekit currently requires a
            // file
            // we do some work to make sure the file has the right
            // extension,
            // since codekit relies on the extension to determine
            // content-type.
            String contentType = audio.getContentType();
            MimeTypes types = MimeTypes.getDefaultMimeTypes();
            MimeType type = types.forName(contentType);
            String extension = type.getExtension();
            if (extension.isEmpty() && contentType.equals("audio/wav")) {
                type = types.forName("audio/x-wav");
                extension = type.getExtension();
            }
            if (extension.isEmpty()) {
                throw new RuntimeException(
                        "no extension found for Content-Type '"
                                + audio.getContentType() + "'");
            }
            file = File.createTempFile("speechaudio", extension);
            filename = file.getName();
            log(filename);
            copyStreamToFile(audio.getInputStream(), file);
        } else { // its not audio data - are we being passed the name of a
                 // file on the server?
            filename = request.getParameter("filename");
            if (filename == null) {
                throw new IllegalArgumentException(
                        "'speechaudio' POST form parameter or 'filename' querystring parameter required");
            }
            // server-based audio files are packaged as resources in
            // the site .war file. Copy it as a single file on disk,
            // so codekit knows how to handle it.
            filename = URLDecoder.decode(filename, "UTF-8");
            file = getFileFromResource(filename);
        }

        String xarg = getMergedXArgs(request);

        OAuthToken token = this.clientToken;
        log("using clientCredentials token " + token.getAccessToken());

        String jsonResponse;

        if (request.getRequestURI().contains("Custom")) {
            File dictionaryFile = getFileFromResource("dictionary.pls");
            File grammarFile = getFileFromResource("grammar.grxml");
            String[] attachments = new String[] {
                    dictionaryFile.getAbsolutePath(),
                    grammarFile.getAbsolutePath(), file.getAbsolutePath() };
            SpeechCustomService svc = new SpeechCustomService(
                    AttConstants.HOST, token);
            jsonResponse = svc.sendRequestAndReturnRawJson(attachments,
                    request.getParameter("context"), xarg);
        } else { // regular speechToText, not 'custom'
            SpeechService svc = new SpeechService("https://api.att.com", token);
            jsonResponse = svc.sendRequestAndReturnRawJson(file, xarg,
                    request.getParameter("context"),
                    request.getParameter("subcontext"));
        }
        return jsonResponse;
    }
}
