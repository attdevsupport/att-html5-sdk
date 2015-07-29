package com.html5sdk.att.servlet;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import javax.servlet.annotation.MultipartConfig;

import com.att.api.oauth.OAuthToken;
import com.att.api.speech.service.SpeechCustomService;
import com.att.api.speech.service.SpeechService;
import com.html5sdk.att.AttConstants;
import com.html5sdk.att.util.FileUtil;

@MultipartConfig
public class SpeechToTextServlet extends ServiceServletBase {
    private static final long serialVersionUID = 1L;

    public SpeechToTextServlet() {
        super();
    }

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new SpeechToTextAction() });
    }

    class SpeechToTextAction implements Action {

        public boolean match(HttpServletRequest request) {
            return true; // matches all paths for this servlet
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws Exception {

            File file;
            String filename;
            Part audio = request.getPart("speechaudio");

            // are we being passed audio data from the browser?
            if (audio != null) {

                // Copy the audio data to a file - codekit currently requires a
                // file.
                file = FileUtil.createFileFromPart(audio);
                filename = file.getName();
                log(filename);
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
                file = FileUtil.getFileFromResource(filename);
            }

            String xarg = getMergedXArgs(request);
            xarg = setClientSdk(xarg);
            
            String language = request.getParameter("language");
            if (language == null) {
                language = "en-US";
            }
            
            OAuthToken token = SharedCredentials.getInstance()
                    .fetchOAuthToken();
            log("using clientCredentials token " + token.getAccessToken());

            String jsonResult;

            if (request.getRequestURI().contains("Custom")) {
                File dictionaryFile = FileUtil
                        .getFileFromResource("dictionary.pls");
                File grammarFile = FileUtil
                        .getFileFromResource("grammar.grxml");
                SpeechCustomService svc = new SpeechCustomService(
                        AttConstants.HOST, token);
                jsonResult = svc.sendRequestAndReturnRawJson(file, grammarFile, dictionaryFile,
                        request.getParameter("context"), xarg, language);
            } else { // regular speechToText, not 'custom'
                SpeechService svc = new SpeechService("https://api.att.com",
                        token);
                jsonResult = svc.sendRequestAndReturnRawJson(file, xarg,
                        request.getParameter("context"),
                        request.getParameter("subcontext"),
                        language);
            }
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }
}
