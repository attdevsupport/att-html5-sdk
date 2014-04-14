package com.html5sdk.att.servlet;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.tika.mime.MimeTypeException;

import com.att.api.mms.service.MMSService;
import com.att.api.rest.RESTException;
import com.html5sdk.att.AttConstants;
import com.html5sdk.att.provider.ApiRequestException;
import com.html5sdk.att.util.FileUtil;

public class MmsOutboxServlet extends ServiceServletBase {
    private static final long serialVersionUID = 1L;

    public MmsOutboxServlet() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new GetMmsStatusAction() });
    }

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new SendMmsAction() });
    }

    class GetMmsStatusAction implements Action {

        @Override
        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            return pathInfo != null;
        }

        @Override
        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        @Override
        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            // pathInfo includes the leading forward-slash in front of the MMS
            // ID - the substring() call gets rid of it.
            String mmsId = request.getPathInfo().substring(1);
            MMSService svc = new MMSService(AttConstants.HOST, clientToken);
            String jsonResult = svc.getMMSStatusAndReturnRawJson(mmsId);
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }

    class SendMmsAction implements Action {

        @Override
        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            return pathInfo == null;
        }

        @Override
        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        @Override
        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException, MimeTypeException, ServletException {

            String addresses = getRequiredParameter(request, "addresses");
            String subject = getRequiredParameter(request, "message");
            boolean shouldNotify = getNotifyParameter(request);

            ArrayList<String> files = new ArrayList<String>();

            String serverFile = request.getParameter("fileId");
            if (serverFile != null) {
                files.add(FileUtil.getFileFromResource(serverFile)
                        .getAbsolutePath());
            }
            for (Part part : request.getParts()) {
                files.add(FileUtil.createFileFromPart(part).getAbsolutePath());
            }

            try {
                MMSService svc = new MMSService(AttConstants.HOST, clientToken);
                String jsonResult = svc.sendMMSAndReturnRawJson(addresses,
                        files.toArray(new String[files.size()]), subject, null,
                        shouldNotify);
                submitJsonResponseFromJsonResult(jsonResult, response);
            } finally {
                for (String file : files) {
                    if (!file.endsWith(serverFile)) {
                        new File(file).delete();
                    }
                }
            }
        }
    }
}
