<?php
/**
 * @class Response
 *
 * The AT&T Provider class for PHP utilizes cURL for sending requests and receiving responses back from all AT&T APIs. The Response class 
 * is used to package and parse the cURL responses received and provides simple methods to access different parts of the response, including 
 * any error codes and messages. 
 *
 * This class is not generally instantiated by your own code: it is rather utitilized by the Provider API calling methods to return a packaged 
 * response for use in your own code. The following code shows an example of how an object of this class is used to its full potential with the AT&T 
 * provider methods:
 *
 *     $response = $provider.sendSms(['abc123', '415-555-2425', 'Test SMS']);
 *
 *     if ($response.isError()) {
 *			return "Error! " + $response.getErrorMessage();
 *     } else {
 *			return "Success! " + $response.getParsedResponse();
 *     }
 *
 */

class Response {
	private $curl_info;
	private $curl_response;
	private $response;
	private $rawResponse;
	private $headers = array();
	private $http_code = 200;
	private $error = false;
	private $errorCode = 0;
	private $errorMessage = "No error";

	/**
	 * @constructor
	 * Creates and parses a CURL response.
	 *
	 *		$curl_response = curl_exec($curl);
	 *		$curl_info = curl_getinfo($curl);
	 *
	 *  	$response = new Response(array(
	 *			"curl_info"     => $curl_info,
	 *			"curl_response" => $curl_response
	 *		));
	 *
	 * @param {array} config response parts
	 * @param {object} config.curl_info The link to the cURL info
	 * @param {object} config.curl_response The full cURL response.
	 *
	 */
	public function __construct($response) {
		$curl_info      = isset($response['curl_info']) ? $response['curl_info'] : null;
		$curl_response  = isset($response['curl_response']) ? $response['curl_response'] : null;

		if ($response instanceof Exception) {
			// if it's an exception object then grab the error message
			$this->error = $response->getMessage();

		} else {

			$this->curl_info        = $curl_info;
			$this->curl_response    = $curl_response;
			$this->http_code        = $curl_info['http_code'];

			// Extract headers from response

			$headers_string = substr($curl_response, 0, $curl_info["header_size"] - 4);
			$body_string    = substr($curl_response, $curl_info["header_size"]);
			$body_size 		= strlen($body_string);
			$headersRaw     = explode("\r\n", $headers_string);

			array_shift($headersRaw); // Remove the HTTP response as it's in the CURL info

			foreach ($headersRaw as $header) {
				$headerparts = explode(":", $header, 2);
				if (isset($headerparts[1])) {
					$this->headers[$headerparts[0]] = trim($headerparts[1], " ");
				}
			}

			$this->rawResponse = $body_string;

			if ($body_string) { // isset($body_string)) {
				$this->rawResponse = $body_string;
				$this->response    = $this->parse_response($body_string);
			}

			if ($this->http_code == 204) {
				// Empty Response
				$this->response = "";
			}
			else if ($this->http_code >= 400) {
				$this->errorCode = $this->http_code;
				if ($body_string) {
					$this->error = json_decode($body_string);
					$this->errorMessage = $body_string; // $this->error->error;
				} else {
					$this->error = $this->http_code . ": Unauthorized request";
				}
			} else {
				// Else parse the response, it could be either JSON or XML
				if ($body_string) {
					$this->response = $this->parse_response($body_string);
				} else {
					$parsed = $this->parse_response(json_encode($response));
					if (isset($response['error'])) {
						$this->error = $parsed->error;
						$this->errorMessage = $parsed->error;
					} else {
						$this->response = $parsed;
					}
				}
			}
		}
	}

	/**
	 * Retrieve HTTP response code from returned from the API request.
	 *
	 * @method getHttpCode
	 *
	 * @return {integer} The HTTP response code returned from the request.
	 *
	 */
	public function getHttpCode() {
		return $this->http_code;
	}

	/**
	 * Used to see whether or not the API response returned an error.
	 * @method isError
	 * @return {boolean} true | false
	 */
	public function isError() {
		return $this->error ? true : false;
	}

	/**
	 * Retrieves any error message returned from the API request. Empty if the request was successful. 
	 * @method getErrorMessage
	 * @return {string} The error message returned from the request
	 */
	public function getErrorMessage() {
		return $this->errorMessage;
	}
	/**
	 * Retrieves the HTTP error response code returned from the API request.
	 * @method getErrorCode
	 * @return {integer} The HTTP response code returned from the request. This method returns the same value as getHttpCode and is provided as a convenience function for getting HTTP response codes which are 400 and above.
	 */
	public function getErrorCode() {
	   return $this->errorCode;
	}
	
	/**
	 * Returns the error message, if any was found.
	 * @method error 
	 * @deprecated Please use {@link Response#getErrorMessage} instead.
	 */
	public function error() {
		return  $this->error;
	}

	/**
	 * Returns the decoded data from the server (assuming there was no exception)
	 * @method data
	 * @deprecated Please use {@link Reponse#getRawResponse} or {@link Reponse#getParsedResponse}
	 */
	public function data() {
		return $this->response;
	}

	/**
	 * Retreives the HTTP headers returned from the API request.
	 * @method getHeaders
	 * @return {array} Returns an array of key/value pairs of the headers returned from the API request.
	 */
	public function getHeaders() {
		return $this->headers;
	}

	/**
	 * Retreives the response body without any preprocessing.
	 * @method getRawResponse
	 * @return {string} Returns the body of the response received from the API as is and unprocessed.
	 */
	public function getRawResponse() {
		return $this->rawResponse;
	}

	/**
	 * Attempts to parse the response returned from request and returns it as a JSON or XML object. If the response cannot be parsed, the response is returned as is.
	 * @method getParsedResponse
	 * @return {mixed} JSON or XML object, or original contents of the response if it cannot be parsed.
	 */
	public function getParsedResponse() {
		return $this->response;
	}

	/**
	 * Parses the data passed in.
	 * It first tries json_decode and if it fails tries simplexml_load_string.
	 * If both fail, the original value passed in is returned.
	 *
	 * @method parse_response 
	 * @param {string} response the CURL response body
	 * @return {string} parsed JSON, XML or original contents of response.
	 *
	 * @method parse_response
	 * @hide
	 */
	private function parse_response($body) {
		$isParsed = false;

		$parsed = json_decode($body);

		// If parsing as JSON failed, try parsing as XML...
		if (is_null($parsed)) {
			libxml_use_internal_errors(true);
//			$parsed = simplexml_load_string("<xml>$body</xml>");
			$parsed = simplexml_load_string($body);
			if ($parsed) {
				$parsed = json_decode(json_encode($parsed));
				$isParsed = true;
			}
		}
		else {
			$isParsed = true;
		}

//		if (! $isParsed) {
//			error_log("Non JSON/XML response returned - returning response contents verbatim.");
//		}
		return $isParsed ? $parsed : $body;
	}
}

?>