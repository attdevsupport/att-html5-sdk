package com.sencha.att.provider;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Map;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.commons.io.IOUtils;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.params.ClientPNames;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.BasicHttpParams;
import org.json.JSONException;
import org.json.JSONObject;

import com.sencha.att.AttConstants;



/**
 *
 * ApiRequestManager provides low level wrappers on the base HTTP methods.
 * Setup and configuration of org.apache.http.client.HttpClient is standardized in this class.
 *
 * @class com.sencha.att.provider.ApiRequestManager
 */
public class ApiRequestManager {

    static {init();}

    
    public static DefaultHttpClient getHTTPClient() {

        try {


            DefaultHttpClient httpclient = new DefaultHttpClient();

            BasicHttpParams params = new BasicHttpParams();
            params.setBooleanParameter(ClientPNames.HANDLE_REDIRECTS, false);


            httpclient.setParams(params);

            return httpclient;
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }



    }

    /**
     * Makes an HTTP GET request and returns a string of the response body.
     * If the response returns a Location header, the body is ignored and the location value
     * is returned instead.
     *
     * @param {String} url The url to get
     * @return
     * @throws ApiRequestException
     * @method get
     * @static
     */
    public static ApiResponse get(String url) throws ApiRequestException {
        return get(url, null);
    }
    
    /**
     * Makes an HTTP GET request and returns a string of the response body.
     * If the response returns a Location header, the body is ignored and the location value
     * is returned instead.
     *
     * @param {String} url The url to get
     * @param {Map<String, String>} headers the headers key-values to be added to the GET request.
     * @return
     * @throws ApiRequestException
     * @method get
     * @static
     */  
    public static ApiResponse get(String url, Map<String, String> headers) throws ApiRequestException {
        HttpGet get = new HttpGet(url);
        
        get.setHeader("Content-Type", "application/json");
        get.setHeader("Accept", "application/json");

        if(headers != null){
        	for (String key : headers.keySet()) {
        		get.setHeader(key, headers.get(key));
        	}
        }
        
        return execute(get);
    }
    
    public static ApiResponse get(String url, String body, Map<String, String> headers){
    	return null;
    }


    public static ApiResponse put(String url) throws ApiRequestException {
        return put(url, null);
    }
    
    public static ApiResponse put(String url,JSONObject body) throws ApiRequestException{
    	return put(url, body, null);
    }
    

    /**
     * This is the wrapper for HTTP PUT calls with no PUT body.
     * @param {String} url
     * @param {JSONObject} body
     * @param {Map<String, String>} headers
     * @return {JSONObject} results of the API call
     * @throws JSONException
     * @throws ApiRequestException
     * @method put
     * @static
     */
    public static ApiResponse put(String url, JSONObject body, Map<String, String> headers) throws ApiRequestException {
        HttpPut put = new HttpPut(url);

        put.setHeader("Content-Type", "application/json");
        put.setHeader("Accept", "application/json");

        if(headers != null){
        	for (String key : headers.keySet()) {
        		put.setHeader(key, headers.get(key));
        	}
        }
        
        StringEntity entity;

        ApiResponse results = null;
        if(body != null) {
            try {
                entity = new StringEntity(body.toString(),"UTF-8");
                put.setEntity(entity);
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        results = execute(put);
        return results;
    }

    /**
     * This is the wrapper for HTTP POST, where the based JSONObject is sent as the HTTP document body.
     * @param {JSONObject} toPost
     * @param {HttpPost} post
     * @return
     * @throws ApiRequestException
     * @method postJSON
     * @static
     */
    public static ApiResponse postJSON(JSONObject toPost, HttpPost post) throws ApiRequestException {
        post.addHeader("Content-Type", "application/json");
        return post(toPost.toString(), post);
    }

    /**
     * Makes an HTTP POST request and returns a string of the response body.
     * If the response returns a Location header, the body is ignored and the location value
     * is returned instead.
     *
     * @param {String} toPost
     * @param {HttpPost} post
     * @return
     * @throws ApiRequestException
     * @method post
     * @static
     */
    public static ApiResponse post(String toPost, HttpPost post)
            throws ApiRequestException {
        post.setHeader("Accept", "application/json");

        StringEntity entity;

        ApiResponse results =  null;
        try {
            entity = new StringEntity(toPost,"UTF-8");
            post.setEntity(entity);
            results = execute(post);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return results;
    }



    /**
     * Takes an HttpUriRequest (POST,GET,PUT) and makes the request to the server returning the results.
     * @param {HttpUriRequest} request
     * @return {String} the response body
     * @throws ApiRequestException
     * @method execute
     * @static
     */
    public static ApiResponse execute(HttpUriRequest request) throws ApiRequestException {
        ApiResponse results = null;
        String body = null, location = null;
        int status = 0;
        HttpClient httpclient = getHTTPClient();

        try {
            HttpResponse response = httpclient.execute(request);

            StatusLine statusLine = response.getStatusLine();


            status = statusLine.getStatusCode();
            location  = getHeader(response, "Location");


            if(location == null) {
                HttpEntity responseEntity = response.getEntity();

                if(responseEntity != null && responseEntity.getContentLength() > 0){
                    InputStream is = responseEntity.getContent();
                    body = IOUtils.toString(is);
                }
            }

        } catch(Exception ex) {
            throw new ApiRequestException("API request caused exception",status, body, ex);

        }



        if(status >= 400) {
            throw new ApiRequestException("invalid response from AT&T", status, body);
        }

        JSONObject json = null;
        if(body != null && body.length() > 0 ){
            json = responseToJSON(body, status);
        }

        results = new ApiResponse(status, body,json, location);

        return results;
    }

    /*
     * Converts a reponse into JSON
     * @param results
     * @param status
     */
    private static JSONObject responseToJSON(String results, int status)
    throws ApiRequestException {
        try {
            return new JSONObject(results);
        } catch (JSONException e) {
            throw new ApiRequestException("Invalid JSON in response", status, results, e);
        }
    }

    /*
     * Returns the header being looked for.  If the header cannot be found, null is returned.
     * @param response
     * @param header
     */
    private static String getHeader(HttpResponse response, String header) {
        Header[] headers = response.getHeaders(header);

        if(headers.length > 0) {
            return headers[0].getValue();
        }
        return null;
    }



    /*
     * Disables HTTPS certificate checking.
     */
    private static void disableHTTPSCertificateChecking() {
        // Create a trust manager that does not validate certificate chains
        TrustManager[] trustAllCerts = new TrustManager[]{
                new X509TrustManager() {

                    public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }

                    public void checkClientTrusted(
                            java.security.cert.X509Certificate[] certs, String authType) {
                    }

                    public void checkServerTrusted(
                            java.security.cert.X509Certificate[] certs, String authType) {
                        System.out.println("trust running");
                    }
                }
        };

        //Install the all-trusting trust manager
        try {
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
        } catch (Exception e) {
        }
    }

    private static void init() {
    	if(!AttConstants.ENABLE_SSL_CHECK){
            disableHTTPSCertificateChecking();
            disableHostnameVerifier();
    	}
    }

    /*
     * Disables HostnameVerifier.
     */
    private static void disableHostnameVerifier() {
        // Create all-trusting host name verifier
        HostnameVerifier allHostsValid = new HostnameVerifier() {
            public boolean verify(String hostname, SSLSession session) {
                return true;
            }
        };

        // Install the all-trusting host verifier
        HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);

    }

}
