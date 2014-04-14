package com.html5sdk.att.servlet;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Collection;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.tika.io.IOUtils;
import org.apache.tika.mime.MimeTypeException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.att.api.immn.service.DeltaChange;
import com.att.api.immn.service.IMMNService;
import com.att.api.immn.service.MessageListArgs;
import com.att.api.immn.service.MessageType;
import com.att.api.oauth.OAuthToken;
import com.att.api.rest.RESTException;
import com.html5sdk.att.AttConstants;
import com.html5sdk.att.provider.ApiRequestException;
import com.html5sdk.att.util.FileUtil;

public class MessageServlet extends ServiceServletBase {
    private static final long serialVersionUID = 1L;

    public MessageServlet() {
        super();
    }

    @Override
    protected void service(HttpServletRequest request,
            HttpServletResponse response) throws IOException, ServletException {

        OAuthToken token = SessionUtils.getTokenForScope(request.getSession(),
                "MIM");

        if (token == null) {
            response.sendError(401, "app not authorized by user");
            return;
        }

        IMMNService service = new IMMNService(AttConstants.HOST, token);
        request.setAttribute(AttConstants.SERVICE_ATTRIBUTE, service);

        super.service(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response, new Action[] {
                new GetMessageContentAction(), new GetMessageAction(),
                new GetMessageListAction() });
    }

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new SendMessageAction() });
    }

    @Override
    protected void doPut(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response, new Action[] {
                new UpdateMessageAction(), new UpdateMessagesAction() });
    }

    @Override
    protected void doDelete(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response, new Action[] {
                new DeleteMessageAction(), new DeleteMessagesAction() });
    }

    class GetMessageContentAction implements Action {

        private String messageId;
        private String partIndex;

        @Override
        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            if (pathInfo == null) {
                return false;
            }
            Pattern pathPattern = Pattern.compile("/([^/]+)/parts/([^/]+)$");
            Matcher matchResult = pathPattern.matcher(pathInfo);
            if (matchResult.matches()) {
                messageId = matchResult.group(1);
                partIndex = matchResult.group(2);
            }
            return matchResult.matches();
        }

        @Override
        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        @Override
        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            InputStream is = ((IMMNService) request
                    .getAttribute(AttConstants.SERVICE_ATTRIBUTE))
                    .getMessageContentAndReturnStream(messageId, partIndex);
            response.setContentType("image/jpg");
            OutputStream os = response.getOutputStream();
            try {
                IOUtils.copy(is, os);
            } finally {
                is.close();
                os.close();
            }
        }
    }

    class GetMessageAction implements Action {

        private String messageId;

        @Override
        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            if (pathInfo == null) {
                return false;
            }
            Pattern pathPattern = Pattern.compile("/([^/]+)$");
            Matcher matchResult = pathPattern.matcher(pathInfo);
            if (matchResult.matches()) {
                messageId = matchResult.group(1);
            }
            return matchResult.matches();
        }

        @Override
        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        @Override
        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            String jsonResult = ((IMMNService) request
                    .getAttribute(AttConstants.SERVICE_ATTRIBUTE))
                    .getMessageAndReturnRawJson(messageId);
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }

    class GetMessageListAction implements Action {

        @Override
        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            return (pathInfo == null);
        }

        @Override
        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        @Override
        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            String param = request.getParameter("count");
            if (param == null) {
                throw new IllegalArgumentException(
                        "'count' querystring parameter required");
            }
            int count = Integer.parseInt(param);

            int offset = 0;
            param = request.getParameter("offset");
            if (param != null) {
                offset = Integer.parseInt(param);
            }
            MessageListArgs.Builder argBuilder = new MessageListArgs.Builder(
                    count, offset);

            param = request.getParameter("messageIds");
            if (param != null) {
                argBuilder.setMessageIds(new String[] { param });
            }

            param = request.getParameter("isUnread");
            if (param != null) {
                argBuilder.setIsUnread(Boolean.parseBoolean(param));
            }

            param = request.getParameter("isFavorite");
            if (param != null) {
                argBuilder.setIsFavorite(Boolean.parseBoolean(param));
            }

            param = request.getParameter("type");
            if (param != null) {
                argBuilder.setType(param.equals("SMS") ? MessageType.SMS
                        : MessageType.MMS);
            }

            param = request.getParameter("keyword");
            if (param != null) {
                argBuilder.setKeyword(param);
            }

            param = request.getParameter("isIncoming");
            if (param != null) {
                argBuilder.setIsIncoming(Boolean.parseBoolean(param));
            }

            String jsonResult = ((IMMNService) request
                    .getAttribute(AttConstants.SERVICE_ATTRIBUTE))
                    .getMessageListAndReturnRawJson(argBuilder.build());
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }

    class SendMessageAction implements Action {

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

            String addresses = request.getParameter("addresses");
            if (addresses == null) {
                throw new IllegalArgumentException(
                        "'addresses' querystring parameter required");
            }
            String message = request.getParameter("message");
            String subject = request.getParameter("subject");
            String group = request.getParameter("group");

            Collection<Part> parts = request.getParts();
            int numParts = parts.size();
            String[] files = new String[numParts];
            int i = 0;
            for (Part part : parts) {
                files[i++] = FileUtil.createFileFromPart(part)
                        .getAbsolutePath();
            }

            try {
                String jsonResult = ((IMMNService) request
                        .getAttribute(AttConstants.SERVICE_ATTRIBUTE))
                        .sendMessageAndReturnRawJson(
                                new String[] { addresses }, message, subject,
                                Boolean.parseBoolean(group), files);
                submitJsonResponseFromJsonResult(jsonResult, response);

            } finally {
                for (String file : files) {
                    new File(file).delete();
                }
            }
        }
    }

    class UpdateMessageAction implements Action {

        private String messageId;

        @Override
        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            if (pathInfo == null) {
                return false;
            }
            Pattern pathPattern = Pattern.compile("/([^/]+)$");
            Matcher matchResult = pathPattern.matcher(pathInfo);
            if (matchResult.matches()) {
                messageId = matchResult.group(1);
            }
            return matchResult.matches();
        }

        @Override
        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        @Override
        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException, JSONException {

            String body = IOUtils.toString(request.getInputStream());
            JSONObject json = new JSONObject(body);

            boolean isUnread = json.optBoolean("isUnread", true);
            boolean isFavorite = json.optBoolean("isFavorite", false);

            ((IMMNService) request.getAttribute(AttConstants.SERVICE_ATTRIBUTE))
                    .updateMessage(messageId, isUnread, isFavorite);

            response.setStatus(204);
        }
    }

    class UpdateMessagesAction implements Action {

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
                RESTException, IOException, JSONException {

            String body = IOUtils.toString(request.getInputStream());
            JSONObject jsonBody = new JSONObject(body);
            JSONArray jsonMessages = jsonBody.getJSONArray("messages");
            DeltaChange[] updates = new DeltaChange[jsonMessages.length()];
            for (int i = 0; i < jsonMessages.length(); i++) {
                JSONObject jsonUpdate = jsonMessages.getJSONObject(i);
                DeltaChange update = new DeltaChange(
                        jsonUpdate.getString("id"),
                        jsonUpdate.getBoolean("isUnread"),
                        jsonUpdate.optBoolean("isFavorite"));
                updates[i] = update;
            }

            ((IMMNService) request.getAttribute(AttConstants.SERVICE_ATTRIBUTE))
                    .updateMessages(updates);

            response.setStatus(204);
        }
    }

    class DeleteMessageAction implements Action {

        private String messageId;

        @Override
        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            if (pathInfo == null) {
                return false;
            }
            Pattern pathPattern = Pattern.compile("/([^/]+)$");
            Matcher matchResult = pathPattern.matcher(pathInfo);
            if (matchResult.matches()) {
                messageId = matchResult.group(1);
            }
            return matchResult.matches();
        }

        @Override
        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        @Override
        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            ((IMMNService) request.getAttribute(AttConstants.SERVICE_ATTRIBUTE))
                    .deleteMessage(messageId);

            response.setStatus(204);
        }
    }

    class DeleteMessagesAction implements Action {

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
                RESTException, IOException {

            String messageIds = request.getParameter("messageIds");

            ((IMMNService) request.getAttribute(AttConstants.SERVICE_ATTRIBUTE))
                    .deleteMessages(new String[] { messageIds });

            response.setStatus(204);
        }
    }
}
