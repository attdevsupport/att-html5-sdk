package com.sencha.att.servlet;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.tika.mime.MimeTypeException;

import com.att.api.mms.service.MMSService;
import com.att.api.rest.RESTException;
import com.sencha.att.AttConstants;
import com.sencha.att.provider.ApiRequestException;
import com.sencha.att.util.FileUtil;

/**
 * This class processes requests to the sendMms endpoint
 * 
 * @class com.sencha.att.servlet.MmsOutboxServlet
 */
public class MmsOutboxServlet extends ClientCredentialsServletBase {
    private static final long serialVersionUID = 1L;

    public MmsOutboxServlet() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    /**
     * Handle sendMms POST requests
     * 
     * @method doPost
     */
    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        executeWithJsonErrorHandling(request, response);
    }

    @Override
    protected String execute(HttpServletRequest request) throws RESTException,
            ApiRequestException, FileNotFoundException, IOException,
            MimeTypeException, ServletException {
        MMSService svc = new MMSService(AttConstants.HOST, clientToken);

        // requests sent to the outbox URL can be sendMms, if it is a POST to
        // the outbox URL with no MMS ID specified in the path; or it can be
        // mmsStatus, if it is a GET with the MMS ID specified in the request
        // URL path. We use the path to tell the difference; pathInfo tells us
        // if an MMS ID was specified.
        String responseJson;
        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.equals("")) {
            responseJson = sendMms(request, svc);
        } else {
            responseJson = mmsStatus(request, svc, pathInfo);
        }
        return responseJson;
    }

    private String sendMms(HttpServletRequest request, MMSService svc)
            throws RESTException, ApiRequestException, FileNotFoundException,
            IOException, ServletException, MimeTypeException {

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

        return svc.sendMMSAndReturnRawJson(addresses,
                files.toArray(new String[files.size()]), subject, null,
                shouldNotify);
    }

    private String mmsStatus(HttpServletRequest request, MMSService svc,
            String pathInfo) throws RESTException {

        // pathInfo includes the leading forward-slash in front of the MMS ID -
        // the substring() call gets rid of it.
        return svc.getMMSStatusAndReturnRawJson(pathInfo.substring(1));
    }

    private boolean getNotifyParameter(HttpServletRequest request) {
        boolean shouldNotify = true;
        String notify = request.getParameter("notify");
        if ((notify == null) || notify.equalsIgnoreCase("false")
                || (notify.equals("0"))) {
            shouldNotify = false;
        }
        return shouldNotify;
    }
}
