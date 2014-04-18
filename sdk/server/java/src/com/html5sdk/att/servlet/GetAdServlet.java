package com.html5sdk.att.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.att.api.ads.service.ADSArguments;
import com.att.api.ads.service.ADSService;
import com.att.api.ads.service.Category;
import com.att.api.ads.service.Gender;
import com.att.api.ads.service.Type;
import com.att.api.oauth.OAuthToken;
import com.att.api.rest.RESTException;
import com.html5sdk.att.AttConstants;
import com.html5sdk.att.provider.ApiRequestException;

public class GetAdServlet extends ServiceServletBase {
    private static final long serialVersionUID = 1L;

    public GetAdServlet() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new GetAdAction() });
    }

    class GetAdAction implements Action {

        public boolean match(HttpServletRequest request) {
            return true; // matches all paths for this servlet
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            OAuthToken token = SharedCredentials.getInstance()
                    .fetchOAuthToken();

            Category category = Category.fromString(getRequiredParameter(
                    request, "Category"));
            String userAgent = request.getParameter("UserAgent");
            if (userAgent == null) {
                userAgent = request.getHeader("User-Agent");
            }
            String udid = request.getParameter("Udid");
            if (udid == null) {
                udid = "HTML5 SDK Sample ID providing a short-term unique advertising identity for the user";
            }
            ADSArguments.Builder builder = new ADSArguments.Builder(category,
                    userAgent, udid);

            String param = request.getParameter("AgeGroup");
            if (param != null) {
                builder.setAgeGroup(param);
            }

            param = request.getParameter("AreaCode");
            if (param != null) {
                builder.setAreaCode(Integer.parseInt(param));
            }

            param = request.getParameter("City");
            if (param != null) {
                builder.setCity(param);
            }

            param = request.getParameter("Country");
            if (param != null) {
                builder.setCountry(param);
            }

            param = request.getParameter("Gender");
            if (param != null) {
                if (param.equals("F")) {
                    builder.setGender(Gender.Female);
                } else if (param.equals("M")) {
                    builder.setGender(Gender.MALE);
                } else {
                    throw new RuntimeException("Gender querystring parameter must be either 'M' or 'F'");
                }
            }

            param = request.getParameter("Keywords");
            if (param != null) {
                String[] keywords = param.split(",");
                builder.setKeywords(keywords);
            }

            param = request.getParameter("Latitude");
            if (param != null) {
                builder.setLatitude(Double.parseDouble(param));
            }

            param = request.getParameter("Longitude");
            if (param != null) {
                builder.setLongitude(Double.parseDouble(param));
            }

            param = request.getParameter("MaxHeight");
            if (param != null) {
                builder.maxHeight(Integer.parseInt(param));
            }

            param = request.getParameter("MaxWidth");
            if (param != null) {
                builder.maxWidth(Integer.parseInt(param));
            }

            param = request.getParameter("MinHeight");
            if (param != null) {
                builder.minHeight(Integer.parseInt(param));
            }

            param = request.getParameter("MinWidth");
            if (param != null) {
                builder.minWidth(Integer.parseInt(param));
            }

            param = request.getParameter("Type");
            if (param != null) {
                builder.setType(Type.valueOf(param));
            }

            param = request.getParameter("ZipCode");
            if (param != null) {
                builder.setZipCode(Integer.parseInt(param));
            }

            ADSService svc = new ADSService(AttConstants.HOST, token);
            String jsonResult = svc.getAdvertisementAndReturnRawJson(builder
                    .build());
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }
}
