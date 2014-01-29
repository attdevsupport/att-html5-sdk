package com.sencha.att.provider;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.logging.Logger;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.sencha.att.AttConstants;
import com.sencha.att.provider.FileMapper.FileMapping;


/**
 *
 * DirectServiceProvider is the glue code between the AttDirectRouterServlet and the Service methods.
 * When a request is made to the AttDirectRouterServlet it will lookup the method in this class.
 * The methods in this class will make the call to the appropriate service provider implementation.
 *
 * @author jason
 * @class com.sencha.att.provider.DirectServiceProvider
 */
public class DirectServiceProvider {

    private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);

    /**
     * Unpacks the JSONObject and forwards the request to ServiceProviderOauth.oauthUrl
     *
     * @param request the JSONObject
     * @return will return a JSON Object with the response from the ServiceProviderOauth.oauthUrl
     * @method oauthUrl
     * @static
     */
    public static JSONObject oauthUrl(JSONObject request) {
        JSONObject theReturn = new JSONObject();
        try {
            JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
            theReturn.put(
                    ServiceProviderConstants.RESULT,
                    ServiceProviderOauth.oauthUrl(
                            request.getString(ServiceProviderConstants.HOST),
                            array.getString(0),
                            request.getString(ServiceProviderConstants.CLIENTID),
                            request.getString(ServiceProviderConstants.CALLBACK)));
        } catch (Exception e) {
            try {
                theReturn.put(ServiceProviderConstants.ERROR, e.getMessage());
            } catch (JSONException e1) {
                System.out.println(e1.getMessage());
                e1.printStackTrace();
            }
        }
        return theReturn;

    }


    /**
     * Unpacks the JSONObject and forwards the request to ServiceProvider.deviceInfo
     * @param request the JSONObject
     * @return will return a JSON Object with the response from the ServiceProvider.deviceInfo call
     * @throws JSONException
     * @throws ApiRequestException
     * @method deviceInfo
     * @static
     */
    public static JSONObject deviceInfo(JSONObject request) throws ApiRequestException, JSONException {

        ApiResponse response = ServiceProvider.deviceInfo(
                request.getString(ServiceProviderConstants.HOST),
                request.getString(ServiceProviderConstants.TOKEN));

        return response.toJson();

    }


    /**
     * Unpacks the JSONObject and forwards the request to ServiceProvider.deviceLocation
     *
     * @param request the JSONObject
     * @return will return a JSON Object with the response from the ServiceProvider.deviceLocation call
     * @throws JSONException
     * @throws ApiRequestException
     * @throws UnsupportedEncodingException 
     * @method deviceLocation
     * @static
     */
    public static JSONObject deviceLocation(JSONObject request) throws ApiRequestException, JSONException, UnsupportedEncodingException {
        JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
        JSONObject response;

        int accuracy = -1;
        int acceptableAccuracy = -1;
        String tolerance = "";

        if(array.length() >= 1) {
            accuracy = array.getInt(0);
        }

        if(array.length() >= 2) {
            acceptableAccuracy = array.getInt(1);
        }

        if(array.length() >= 3) {
            tolerance = array.getString(2);
        }

		ApiResponse result = ServiceProvider.deviceLocation(
		        request.getString(ServiceProviderConstants.HOST),
		        request.getString(ServiceProviderConstants.TOKEN),
		        accuracy,
		        acceptableAccuracy,
		        tolerance);
		response = result.toJson();

        return response;

    }

    /**
     * Unpacks the JSONObject and forwards request to ServiceProviderSms.sendSms
     *
     * @param request the JSONObject
     * @return will return a JSON Object with the response from the ServiceProviderSms.sendSms call
     * @throws JSONException
     * @throws ApiRequestException
     * @method sendSms
     * @static
     */
    public static JSONObject sendSms(JSONObject request) throws ApiRequestException, JSONException {
        JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
        ApiResponse response = ServiceProviderSms.sendSms(
                request.getString(ServiceProviderConstants.HOST),
                request.getString(ServiceProviderConstants.TOKEN),
                array.getString(0),
                array.getString(1));
        return response.toJson();
    }



    /**
     * Unpacks the JSONObject and forwards the request to ServiceProviderSms.smsStatus
     *
     * @param request the JSONObject
     * @return will return a JSON Object with the response from the ServiceProviderSms.msStatus call
     * @method smsStatus
     * @static
     */
    public static JSONObject smsStatus(JSONObject request) throws ApiRequestException, JSONException {
        JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
        ApiResponse response = ServiceProviderSms.smsStatus(
                request.getString(ServiceProviderConstants.HOST),
                request.getString(ServiceProviderConstants.TOKEN),
                array.getString(0));
        return response.toJson();
    }

    /**
     * Unpacks the JSONObject and forwards the request to ServiceProviderSms.receiveSms
     *
     * @param request the JSONObject
     * @return will return a JSON Object with the response from the ServiceProviderSms.receiveSms call
     * @method receiveSms
     * @static
     */
    public static JSONObject receiveSms(JSONObject request) throws ApiRequestException, JSONException{
        JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
        ApiResponse response = ServiceProviderSms.receiveSms(request.getString(ServiceProviderConstants.HOST),
                request.getString(ServiceProviderConstants.TOKEN), array.getString(0));
        return response.toJson();
    }

    /**
     * Unpacks the JSONObject and forwards the request to ServiceProviderMMS.sendMms
     *
     * @param request the JSONObject
     * @return will return a JSON Object with the response from the ServiceProviderMMS.sendMms call
     * @method sendMms
     * @static
     */
    public static JSONObject sendMms(JSONObject request) {
        JSONObject theReturn = new JSONObject();
        FileMapper fileMapper = new FileMapper();
        try {
            JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);

            FileMapping file = fileMapper.getFileForReference(array.getString(1));


            theReturn.put(
                    ServiceProviderConstants.RESULT,
                    ServiceProviderMms.sendMms(
                            request.getString(ServiceProviderConstants.HOST),
                            request.getString(ServiceProviderConstants.TOKEN),
                            array.getString(0),
                            file.fileType,
                            file.fileName,
                            file.stream,
                            array.getString(2),
                            array.getString(3)));
        } catch (Exception e) {
            try {
                theReturn.put(ServiceProviderConstants.ERROR, e.getMessage());
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
        }
        return theReturn;
    }

    /**
     * Unpacks the JSONObject and forwards the request to ServiceProviderMms.mmsStatus
     *
     * @param request the JSONObject
     * @return will return a JSON Object with the response from the ServiceProviderMms.mmsStatus call
     * @throws JSONException
     * @throws ApiRequestException
     * @method mmsStatus
     * @static
     */
    public static JSONObject mmsStatus(JSONObject request) throws JSONException, ApiRequestException {
        JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
        ApiResponse results = ServiceProviderMms.mmsStatus(
                request.getString(ServiceProviderConstants.HOST),
                request.getString(ServiceProviderConstants.TOKEN),
                array.getString(0));
        return results.toJson();
    }


    /**
     * Unpacks the JSONObject and forwards the request to ServiceProvider.wapPush
     *
     * @param request the JSONObject
     * @return will return a JSON Object with the response from the ServiceProvider.wapPush call
     * @method wapPush
     * @static
     */
    public static JSONObject wapPush(JSONObject request) {
        JSONObject theReturn = new JSONObject();
        try {
            JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
            log.info(array.toString(2));
            theReturn.put(
                    ServiceProviderConstants.RESULT,
                    ServiceProvider.wapPush(
                            request.getString(ServiceProviderConstants.HOST),
                            request.getString(ServiceProviderConstants.TOKEN),
                            array.getString(0),
                            array.getString(1)));
        } catch (Exception e) {
            try {
                theReturn.put(ServiceProviderConstants.ERROR, e.getMessage());
            } catch (JSONException e1) {
                System.out.println(e1.getMessage());
                e1.printStackTrace();
            }
        }
        return theReturn;
    }




    /**
     * Unpacks the JSONObject and forwards the request to NotaryProvider.signPayload
     *
     * @param request the JSONObject
     * @return will return a JSON Object with the response from the NotaryProvider.signPayload call
     * @throws JSONException
     * @throws ApiRequestException
     * @method signPayload
     * @static
     */
    public static JSONObject signPayload(JSONObject request) throws JSONException, ApiRequestException {
        JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
        NotaryProvider notary = new NotaryProvider(AttConstants.HOST, AttConstants.CLIENTIDSTRING, AttConstants.CLIENTSECRETSTRING);
        ApiResponse results = notary.signPayload(array.getJSONObject(0));
        return results.toJson();
    }



    /**
     * Unpacks the JSONObject and forwards the request to Payment.requestChargeAuth
     *
     * @param request the JSONObject
     * @return will return a JSON Object with the response from the Payment.requestChargeAuth call
     * @throws JSONException
     * @throws ApiRequestException
     * @method requestChargeAuth
     * @static
     */
    public static JSONObject requestChargeAuth(JSONObject request) throws JSONException, ApiRequestException {
        JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
        Payment payment = new Payment(AttConstants.HOST,  AttConstants.CLIENTIDSTRING, AttConstants.CLIENTSECRETSTRING);
        ApiResponse results = payment.requestChargeAuth(array.getString(0), array.getJSONObject(1));
        return results.toJson();
    }




    /**
     * Unpacks the JSONObject and forwards the request to Payment.subscriptionDetails
     *
     * @param request the JSONObject
     * @return will return a JSON Object with the response from Payment.subscriptionDetails
     * @method subscriptionDetails
     * @static
     */
    public static JSONObject subscriptionDetails(JSONObject request) throws JSONException, ApiRequestException {
        JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
        Payment payment = new Payment(AttConstants.HOST, AttConstants.CLIENTIDSTRING, AttConstants.CLIENTSECRETSTRING);
        ApiResponse results = payment.subscriptionDetails(request.getString(ServiceProviderConstants.TOKEN), array.getString(0),array.getString(1));
        return results.toJson();
    }



    /**
     * Unpacks the JSONObject and forwards the request to Payment.subscriptionStatus
     *
     * @param request the JSONObject
     * @return will return a JSON Object with the response from Payment.subscriptionStatus
     * @method subscriptionStatus
     * @static
     */
    public static JSONObject subscriptionStatus(JSONObject request) throws JSONException, ApiRequestException {
        JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
        Payment payment = new Payment(AttConstants.HOST,  AttConstants.CLIENTIDSTRING, AttConstants.CLIENTSECRETSTRING);
        ApiResponse results = payment.subscriptionStatus(request.getString(ServiceProviderConstants.TOKEN), array.getString(0),array.getString(1));
        return results.toJson();
    }




    /**
     * Unpacks the JSONObject and forwards the request to Payment.refundTransaction
     *
     * @param request the JSONObject
     * @return will return a JSON Object with the response from Payment.refundTransaction
     * @method refundTransaction
     * @static
     */
    public static JSONObject refundTransaction(JSONObject request)  throws JSONException, ApiRequestException {
        JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
        Payment payment = new Payment(AttConstants.HOST, AttConstants.CLIENTIDSTRING, AttConstants.CLIENTSECRETSTRING);
        ApiResponse results = payment.refundTransaction(request.getString(ServiceProviderConstants.TOKEN), array.getString(0),  array.getJSONObject(1));
        return results.toJson();
    }


    /**
     * Unpacks the JSONObject and forwards the request to Payment.transactionStatus
     *
     * @param request the JSONObject
     * @return will return a JSON Object with the response from Payment.transactionStatus
     * @method transactionStatus
     * @static
     */
    public static JSONObject  transactionStatus(JSONObject request)  throws JSONException, ApiRequestException {
        JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
        Payment payment = new Payment(AttConstants.HOST, AttConstants.CLIENTIDSTRING, AttConstants.CLIENTSECRETSTRING);
        ApiResponse results = payment.transactionStatus(request.getString(ServiceProviderConstants.TOKEN), array.getString(0), array.getString(1));
        return results.toJson();
    }
    
   /**
    * Unpacks the JSONObject and forwards request to ServiceProviderMobo.sendMessageOnBehalfOf
    *
    * @param request the JSONObject
    * @return will return a JSON Object with the response from the ServiceProviderMobo.sendMessageOnBehalfOf call
    * @throws JSONException
    * @throws ApiRequestException
    * @method sendMobo
    * @static
    */
    public static JSONObject sendMobo(JSONObject request) throws ApiRequestException, JSONException{
    	JSONObject theReturn = new JSONObject();
        FileMapping[] files = null;
        FileMapper fileMapper = new FileMapper();

    	JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);

    	try {
	    	if(!array.isNull(4)){
	        	JSONArray fileArray = array.getJSONArray(4);
	        	int fl = fileArray.length();
				files = new FileMapping[fl];
				for(int i=0; i<fl; i++){
						files[i]=fileMapper.getFileForReference(fileArray.getString(i));
		    	}
	    	}
    	
	  		
	    	TokenResponse response = ServiceProviderMobo.sendMessageOnBehalfOf(
	                request.getString(ServiceProviderConstants.HOST),
	                request.getString(ServiceProviderConstants.TOKEN),
	                array.getString(0),
	                array.getString(1),
	                array.getString(2),
	                array.getBoolean(3),
	                files);
	    	
	        theReturn.put(ServiceProviderConstants.RESULT, response);

    	} catch (FileNotFoundException e) {
    		e.printStackTrace();
    	}catch(JSONException e){
    		theReturn.put(ServiceProviderConstants.ERROR, e.getMessage());
    	}
        return theReturn;
    }
    
    /**
     * Unpacks the JSONObject and forwards request to ServiceProviderMim.getMessageHeaders
     * @param request
     * @return
     * @throws ApiRequestException
     * @throws JSONException
     * @method getMessageHeaders
     * @static
     */
    public static JSONObject getMessageHeaders(JSONObject request) throws ApiRequestException, JSONException{
        JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
        JSONObject response;
        ApiResponse result;
		try {
			result = ServiceProviderMim.getMessageHeaders(
			        request.getString(ServiceProviderConstants.HOST),
			        request.getString(ServiceProviderConstants.TOKEN),
			        array.getString(0),
			        array.getString(1));
			response = result.toJson();
		} catch (Exception e) {
			response = new JSONObject();
			response.put(ServiceProviderConstants.ERROR, e.getMessage());
		}
    	
    	return response;
    }

    /**
     * Unpacks the JSONObject and forwards request to ServiceProviderSpeech.sendSpeech
     * @param request
     * @return the response from sendSpeech method or a JSON object with the error message if it fails.
     * @throws ApiRequestException
     * @throws JSONException
     * @throws IOException 
     * @method speechToText
     * @static
     */
    public static JSONObject speechToText(JSONObject request)  throws ApiRequestException, JSONException, IOException{
       
    	JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
        FileMapper fileMapper = new FileMapper();
        FileMapping file;
        String fileType = array.getString(1);
        boolean streamed = array.getBoolean(2);
        String context = array.getString(3);
        JSONObject xargs = array.getJSONObject(4);
        try {
			file = fileMapper.getFileForReference(array.getString(0));
		} catch (FileNotFoundException e) {
			JSONObject obj = new JSONObject();
			obj.put(ServiceProviderConstants.ERROR, e.getMessage());
			return obj;
		}
        ApiResponse response = ServiceProviderSpeech.sendSpeech(
	            request.getString(ServiceProviderConstants.HOST),
	            request.getString(ServiceProviderConstants.TOKEN),
	            fileType,
	            file.stream,
	            streamed,
	            context,
	            xargs
	               
       );
    
        return response.toJson();
    }
    
    /**
     * @hide
     * Unpacks the JSONObject and forwards request to ServiceProviderAds.getAd
     * @param request
     * @return
     * @throws JSONException
     * @throws UnsupportedEncodingException
     * @throws ApiRequestException
     */
//    public static JSONObject getAd(JSONObject request) throws JSONException, UnsupportedEncodingException, ApiRequestException{
//    	JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
//    	ApiResponse response = ServiceProviderAds.getAd(
//    			request.getString(ServiceProviderConstants.HOST), 
//    			request.getString(ServiceProviderConstants.TOKEN),
//    			request.getString(ServiceProviderConstants.USER_AGENT),
//    			array.getString(0),
//    			array.getJSONObject(1));
//    	return response.toJson();
//    }
    
    
    
    public static JSONObject cmsCreateSession(JSONObject request) throws ApiRequestException, JSONException {
    	JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);
    	
    	JSONObject params = array.getJSONObject(0);
    	
        ApiResponse response = ServiceProviderCms.createSession(
                request.getString(ServiceProviderConstants.HOST),
                request.getString(ServiceProviderConstants.TOKEN),
                params
        );

        return response.toJson();

    }

    public static JSONObject cmsSendSignal(JSONObject request) throws ApiRequestException, JSONException {
    	JSONArray array = request.getJSONArray(ServiceProviderConstants.DATA);

    	String sessionId = array.getString(0);
    	String signal = array.getString(1);
    	
        ApiResponse response = ServiceProviderCms.sendSignal(
                request.getString(ServiceProviderConstants.HOST),
                request.getString(ServiceProviderConstants.TOKEN),
                sessionId, 
                signal
        );

        return response.toJson();
    }
}
