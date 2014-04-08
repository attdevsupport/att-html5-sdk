package com.sencha.att.util;



/**
 * Address Utility class 
 * @class com.sencha.att.util.AddressUtil
 */
public class AddressUtil {

	private final static String REG_EX_PHONE = "(\\+?[1]-?)?[0-9]{3}-?[0-9]{3}-?[0-9]{4}";
	private final static String REG_EX_EMAIL = "[a-zA-Z]\\w+(.\\w+)*@\\w+(.[0-9a-zA-Z]+)*.[a-zA-Z]{2,4}";
	private final static String REG_EX_SHORT_CODE = "\\d{3,8}";

	private final static String PREFIX_PHONE = "tel:";
	private final static String PREFIX_EMAIL = "";
	private final static String PREFIX_SHORT_CODE = "short:";
	
	/**
	 * Determine if the given address is a valid email address
	 * @param address the address to validate
	 * @return {Boolean} whether or not address is a valid email
	 * @method isEmail
	 * @static
	 */
	public static boolean isEmail(String address){
		return address != null && address.matches(REG_EX_EMAIL);
	}
	
	/**
	 * Determine if the given address is a valid phone number
	 * @param address the address to validate
	 * @return {Boolean} whether or not address is a valid phone number
	 * @method isPhone
	 * @static
	 */	
	public static boolean isPhone(String address){
		return address != null && address.matches(REG_EX_PHONE);
	}

	/**
	 * Determine if the given address is a valid email short code
	 * @param address the address to validate
	 * @return {Boolean} whether or not address is a valid short code
	 * @method isShortCode
	 * @static
	 */
	public static boolean isShortCode(String address){
		return address != null && address.matches(REG_EX_SHORT_CODE);
	}
	
	/**
	 * Returns the address prefixed with the corresponding value:
	 * - tel: if the address is a phone number
	 * - short: if the address is a short code
	 * - no prefix if the address is email 
	 * @param address
	 * @return {java.lang.String}
	 * @method addressWithPrefix
	 * @static
	 */
	public static String addressWithPrefix(String address){
		String ret = null;
		
		if(isPhone(address)){
			ret = PREFIX_PHONE;
		}
		
		if(isShortCode(address)){
			ret = PREFIX_SHORT_CODE;
		}
		
		if(isEmail(address)){
			ret = PREFIX_EMAIL;
		}
		
		return ret + address;
	}
	
	/**
	 * Return the array elements with their corresponding prefixes using {@link com.sencha.att.util.AddressUtil.addressWithPrefix} 
	 * on each element 
	 * @param array {String[]} The array of addresses
	 * @return {String[]} the array with prefixed addresses.
	 * @method parseAddresses
	 * @static
	 */
	public static String[] parseAddresses(String[] array){
		int l = array.length;
		String[] addresses = new String[l];

		for(int i=0; i<l; i++){
			addresses[i] = addressWithPrefix(array[i].trim());
		}
		
		return addresses;
	}
	
}
