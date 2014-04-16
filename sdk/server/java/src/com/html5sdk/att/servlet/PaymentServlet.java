package com.html5sdk.att.servlet;

import java.io.IOException;
import java.security.InvalidParameterException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tika.io.IOUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.att.api.payment.model.AppCategory;
import com.att.api.payment.model.Notary;
import com.att.api.payment.model.Subscription;
import com.att.api.payment.model.Transaction;
import com.att.api.payment.service.NotaryService;
import com.att.api.payment.service.PaymentService;
import com.att.api.rest.RESTException;
import com.html5sdk.att.AttConstants;
import com.html5sdk.att.provider.ApiRequestException;

public class PaymentServlet extends ServiceServletBase {
    private static final long serialVersionUID = 1L;

    public PaymentServlet() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response, new Action[] {
                new GetTransactionInfoAction(),
                new GetSubscriptionInfoAction(),
                new GetSubscriptionDetailAction() });
    }

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response, new Action[] {
                new RequestTransactionUrlAction(),
                new RequestSubscriptionUrlAction() });
    }

    @Override
    protected void doPut(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new CancelRefundAction() });
    }

    class GetTransactionInfoAction implements Action {

        private String type;
        private String id;

        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            if (pathInfo == null) {
                return false;
            }
            Pattern pathPattern = Pattern
                    .compile("/Transactions/([^/]+)/([^/]+)$");
            Matcher matchResult = pathPattern.matcher(pathInfo);
            if (matchResult.matches()) {
                type = matchResult.group(1);
                id = matchResult.group(2);
            }
            return matchResult.matches();
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            PaymentService svc = new PaymentService(AttConstants.HOST,
                    SharedCredentials.getInstance().fetchOAuthToken());
            String jsonResult = svc.getTransactionStatusAndReturnRawJson(type,
                    id);
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }

    class GetSubscriptionInfoAction implements Action {

        private String type;
        private String id;

        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            if (pathInfo == null) {
                return false;
            }
            Pattern pathPattern = Pattern
                    .compile("/Subscriptions/([^/]+)/([^/]+)$");
            Matcher matchResult = pathPattern.matcher(pathInfo);
            if (matchResult.matches()) {
                type = matchResult.group(1);
                id = matchResult.group(2);
            }
            return matchResult.matches();
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            PaymentService svc = new PaymentService(AttConstants.HOST,
                    SharedCredentials.getInstance().fetchOAuthToken());
            String jsonResult = svc.getSubscriptionStatusAndReturnRawJson(type,
                    id);
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }

    class GetSubscriptionDetailAction implements Action {

        private String merchantId;
        private String consumerId;

        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            if (pathInfo == null) {
                return false;
            }
            Pattern pathPattern = Pattern
                    .compile("/Subscriptions/([^/]+)/Detail/([^/]+)$");
            Matcher matchResult = pathPattern.matcher(pathInfo);
            if (matchResult.matches()) {
                merchantId = matchResult.group(1);
                consumerId = matchResult.group(2);
            }
            return matchResult.matches();
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            PaymentService svc = new PaymentService(AttConstants.HOST,
                    SharedCredentials.getInstance().fetchOAuthToken());
            String jsonResult = svc.getSubscriptionDetailsAndReturnRawJson(
                    merchantId, consumerId);
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }

    class RequestTransactionUrlAction implements Action {

        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            return (pathInfo.equals("/Transactions"));
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException, JSONException {

            String payload = IOUtils.toString(request.getInputStream());
            JSONObject json = new JSONObject(payload);
            Double amount = json.getDouble("amount");
            String categoryString = json.getString("category");
            AppCategory category = AppCategory.values()[Integer.parseInt(categoryString)];
            String desc = json.getString("desc");
            String transactionId = json.getString("merch_trans_id");
            String productId = json.getString("merch_prod_id");
            String redirectUrl = json.getString("redirect_uri");

            Transaction.Builder builder = new Transaction.Builder(amount,
                    category, desc, transactionId, productId, redirectUrl);
            NotaryService notarySvc = new NotaryService(AttConstants.HOST,
                    AttConstants.CLIENTIDSTRING,
                    AttConstants.CLIENTSECRETSTRING);
            Notary notary = notarySvc.getTransactionNotary(builder.build());
            String url = PaymentService.getNewTransactionURL(AttConstants.HOST,
                    AttConstants.CLIENTIDSTRING, notary);
            submitJsonResponseFromJsonResult("{\"url\":\"" + url + "\"}", response);
        }
    }

    class RequestSubscriptionUrlAction implements Action {

        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            return (pathInfo.equals("/Subscriptions"));
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException, JSONException {

            String payload = IOUtils.toString(request.getInputStream());
            JSONObject json = new JSONObject(payload);
            Double amount = json.getDouble("amount");
            String categoryString = json.getString("category");
            AppCategory category = AppCategory.values()[Integer.parseInt(categoryString)];
            String desc = json.getString("desc");
            String transactionId = json.getString("merch_trans_id");
            String productId = json.getString("merch_prod_id");
            String listId = json.getString("merch_sub_id_list");
            int recurrences = json.getInt("sub_recurrences");
            String redirectUrl = json.getString("redirect_uri");

            Subscription.Builder builder = new Subscription.Builder(amount,
                    category, desc, transactionId, productId, redirectUrl,
                    listId);
            builder.setRecurrences(recurrences);
            NotaryService notarySvc = new NotaryService(AttConstants.HOST,
                    AttConstants.CLIENTIDSTRING,
                    AttConstants.CLIENTSECRETSTRING);
            Notary notary = notarySvc.getSubscriptionNotary(builder.build());
            String url = PaymentService.getNewSubscriptionURL(AttConstants.HOST,
                    AttConstants.CLIENTIDSTRING, notary);
            submitJsonResponseFromJsonResult("{\"url\":\"" + url + "\"}", response);
        }
    }

    class CancelRefundAction implements Action {

        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            return (pathInfo.equals("/Transactions"));
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            String state = request.getParameter("state");
            String transactionId = request.getParameter("transactionId");
            int reasonId = Integer.parseInt(request.getParameter("reasonId")); 
            String reasonText = request.getParameter("reasonText");

            PaymentService svc = new PaymentService(AttConstants.HOST,
                    SharedCredentials.getInstance().fetchOAuthToken());
            
            String jsonResult;
            if (state.equals("SubscriptionCancelled")) {
                jsonResult = svc.cancelSubscriptionAndReturnRawJson(transactionId, reasonText, reasonId);
            } else if (state.equals("Refunded")) {
                jsonResult = svc.refundTransactionAndReturnRawJson(transactionId, reasonText, reasonId);
            } else {
                throw new InvalidParameterException("unexpected state: " + state);
            }
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }
}
