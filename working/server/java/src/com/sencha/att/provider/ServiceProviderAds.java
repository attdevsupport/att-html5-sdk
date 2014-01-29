package com.sencha.att.provider;


public class ServiceProviderAds {
//    private static final String URN_ADS = "/rest/1/ads";
//	private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);


	
	/**
	 * @hide
	 * @param host
	 * @param accessToken
	 * @param userAgent
	 * @param udid
	 * @param params
	 * @return
	 * @throws ApiRequestException
	 * @throws JSONException 
	 * @throws UnsupportedEncodingException 
	 */
//	public static ApiResponse getAd(String host, String accessToken, String userAgent, String udid, JSONObject params) throws ApiRequestException, JSONException, UnsupportedEncodingException {
//        ApiResponse response = null;
//		String url = host + URN_ADS;
//		String query = "";
//		boolean first = true;
//		
//		Map<String, String> headers = new HashMap<String, String>();
//		
//		for (String name : JSONObject.getNames(params)) {
//			Object value = params.get(name);
//			if(null != value && JSONObject.NULL != value){
//				String v = (String) value;
//				
//				if(v.length() > 0){
//					query += (first ? "?" : "&") + name + "=" + URLEncoder.encode(v, "utf-8");
//					first = false;
//				}
//			}
//		}
//		
//        headers.put("Authorization", "Bearer " + accessToken);
//        headers.put("User-agent", userAgent);
//        headers.put("UDID", udid);
//		response = ApiRequestManager.get(url+query, headers);
//		
//		log.info("ServiceProviderAds :: getAd Response: " + response.toJson());
//		
//		return response;
//	}
}
