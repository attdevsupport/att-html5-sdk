package com.html5sdk.att.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tika.io.IOUtils;

import com.att.api.payment.service.NotaryService;
import com.att.api.rest.RESTException;
import com.html5sdk.att.AttConstants;
import com.html5sdk.att.provider.ApiRequestException;

public class NotaryServlet extends ServiceServletBase {
    private static final long serialVersionUID = 1L;

    public NotaryServlet() {
        super();
    }

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new SignPayloadAction() });
    }

    class SignPayloadAction implements Action {

        public boolean match(HttpServletRequest request) {
            return true; // matches all paths for this servlet
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            String body = IOUtils.toString(request.getInputStream());
            
            NotaryService svc = new NotaryService(AttConstants.HOST,
                    AttConstants.CLIENTIDSTRING,
                    AttConstants.CLIENTSECRETSTRING);
            
            String jsonResult = svc.getNotaryAndReturnRawJson(body);
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }
}
