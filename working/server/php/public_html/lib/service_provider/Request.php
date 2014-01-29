<?php

	/**
	 * This class produces a cURL request object consisting of one or more parts. Each part is configured by passing a multi-dimensional 
	 * hash array of both the header values and the body of the request.
	 *	
	 *     $request = new Request(array(
	 *			"headers" => array(
	 *				"Content-Type" => "application/json",
	 *				"Accept" => "application/json"
	 *			),
	 *			"postfields" => '{ "Subject" : "Test Subject", "Message" : "Test message." }'
	 *		));
	 *
	 * @class Request
 	 *
	 */

class Request {

  	/*
   	 * The array of the parts that will be sent in the message.  Use #content to implode the parts into a valid format needed for a MIME multipart message.
   	 * @property {string} contents
   	 */

	private $start 			= "";
	private $contents     	= array();
	private $multipart      = false;
	private $prepared       = false;

	/*
	 * Creates a unique boundary used to separate each part of the MIME multipart message
	 * @property {String} boundary
	 */
	private $boundary = "";

	/**
	 * @constructor
	 *
	 * Creates a new Request object.
	 *
	 * @param {array} [config] Hash array of the header and postfield or content values. The configuration array may be omitted for requests which will not be sending information (eg GET). For detailed information about the format of the configuration array, please see {@link Request#addContent}
	 * 
	 * @return {object} The Request object for use by the Base class method {@link Base#makeRequest}
	 */

	public function __construct($contents = null) {
		$this->boundary	= "----=_Part_0_" . rand() . "." . ((string) time());

		$this->addContent((array) $contents);
	}

	/**
	 * Appends content (parts) to a Request object. This method automatically turns the request into a multipart (MMS) request if more 
	 * than one part is found.  Multipart request boundaries, content IDs and formatting are automatically handled for you.
	 *
	 *		$request->addContent(array(
	 *			"headers" => array(
	 *				"Content-Type" => "text/html"
	 *			),
	 *			"content" => '<b>Html formatted text to send as a body</b>'
	 *		));
	 *
	 * 
	 * @method addContent
	 *
	 * @param {array} config Hash array containing header and body values. Use of the **postfield** and **content** hash keys are mutually exclusive.
	 * @param {array} config.headers An hash array of headers to send in this part of the Request object. Any valid header parameter may be used as a key in this array. If not specified, Content-Type and Accept headers are both sent as "application/json".
	 * @param {array | string} [config.postfields] An array of key/value pairs or a JSON string representing key and value pairs to send in the request. 
	 * @param {mixed} [config.content] Used if you wish to send unformatted raw content in the request body.
	 *
	 */
	public function addContent($configs) {
		$contentid = "<" . rand() . "." . ((string) time()) . "@sencha.com>";

		$content = array(
			"headers" => array(
				"Content-Type" 	=> "application/json",
				"Accept"        => "application/json",
				"Content-ID" 	=> $contentid
			),
			"postfields" => array()
		);

		array_push($this->contents, $this->MergeArrays($content, $configs));

		if (count($this->contents) == 1) {
			$this->start = $contentid;
		}
	}

	/**
	 * Return the header array from the first element of the contents array as a newly formatted array of strings made by combining the key and value 
	 * fields into single strings separated by a colon. This format is intended to be used by cURL for the 'CURLOPT_HTTPHEADER' setting.
	 *
	 * @method getHeaders
	 *
	 * @return {array} An array of individual headers for the request in the format of "key: value"
	 *
	 */
	public function getHeaders() {
		$this->prepareRequest();

		$headers = array();
		$contentSize = count($this->contents);

		foreach ($this->contents[0]['headers'] as $key => $value) {
			if ($key === 'Content-ID' && $contentSize == 1) {
				continue;
			}
			if (isset($value) && $value <> '') {
				array_push($headers, "$key: $value");
			}
		}
		return $headers;
	}

	/**
	 * Returns the entire body of the request.
	 *
	 * @method getPostfields
	 *
	 * @returns {string} The body of the request. If multipart, then the body will contain the boundaries, headers and contents of all parts as a single text string.
	 *
	 */
	public function getPostfields() {
		$this->prepareRequest();
		return $this->contents[0]["postfields"];
	}

	/**
	 * Return the contents of this request, properly formatted for delivery to an API. Once called, this method 'locks' the contents, performing any transformation to multipart as required.
	 *
	 * @method prepareRequest
	 *
	 * @hide
	 */
	public function prepareRequest() {
		if (! $this->prepared) {
			if (count($this->contents) > 1 || $this->multipart) {
				// Convert entire package to multipart mime ....

				$content    = $this->getContentsAsMultipart();
				$type 		= $this->contents[0]['headers']['Content-Type'];
//				$header     = "multipart/form-data; type=\"$type\"; start=\"$this->start\"; boundary=\"$this->boundary\"";
				$header     = "multipart/related; type=\"$type\"; start=\"$this->start\"; boundary=\"$this->boundary\"";

				// Wrap mime contents in multipart header making sure to preserve any credential headers from the first element
				// and copy them to the new headers.

				$this->contents[0] = $this->MergeArrays($this->contents[0], 
					array(
						"headers" => array(
							"Content-Type" => $header,
							"Content-Disposition" => null,
							"Content-ID" => null
						),
						"postfields" => $content
					)
				);

				array_splice($this->contents, 1); // remove all trailing elements of the array as they are now in the postfields as multipart.
			}

			if ($this->contents[0]['headers']['Content-Type'] === 'application/json' && ! $this->isJson($this->contents[0]['postfields'])) {
				$this->contents[0]['postfields'] = json_encode($this->contents[0]['postfields']);
			}
		}

		$this->prepared = true;
	}

	/** 
	 * Send the Request object as a multipart request even if there is only one part to it. This is required for some messages where the packet size would be greater than 160 characters and therefore cannot be sent as SMS
	 *
	 * @method forceMultipart
	 *
	 */
	public function forceMultipart() {
		$this->multipart = true;
	}

	/**
	 * Returns true if the Request object has multiple parts or if it has been forced as multipart using {@link #forceMultipart}. 
	 *
	 * @method isMultipart
	 * 
	 * @returns {boolean} true | false
	 */
	public function isMultipart() {
		return $this->multipart;
	}

	/**
	 * Returns the multipart Mime content, correctly formatted for a MIME multipart message, by imploding the contents array using #boundary that produces a unique boundary for each part.
	 *
	 * @method getContentsAsMultipart
	 *
	 * @private
	 */
	private function getContentsAsMultipart() {
		$parts = array();

		foreach ($this->contents as $content) {
			$result = "";

			foreach ($content['headers'] as $key => $headervalue) {
				if (isset($headervalue)) {
					$result .= "$key: $headervalue\n";
				}
			}

			// '{ }'
			// array of things to concat
			// array of hash to do 'this:that'
			// string to send as is
			if (count($content['postfields']) > 0) {
				if ($content['headers']['Content-Type'] == 'application/json') {
					$result .= "\n" . ($this->isJson($content['postfields']) ? $content['postfields'] : json_encode($content['postfields'])) . "\n";
				}
			}
			else if (isset($content['content'])) {
				$result .= "\n" . $content['content'];
			}

			if (substr($result, -1) != "\n") {
				$result .= "\n";
			}

			array_push($parts, $result);
		}
		return "--$this->boundary\n" . implode("--$this->boundary\n", $parts) . "\n--$this->boundary--\n";
	}

	/*
	 * Merge two arrays recursively
	 */
	private function MergeArrays($Arr1, $Arr2) {
		foreach($Arr2 as $key => $Value) {
			if(array_key_exists($key, $Arr1) && is_array($Value))
				$Arr1[$key] = $this->MergeArrays($Arr1[$key], $Arr2[$key]);
			else
				$Arr1[$key] = $Value;
		}
		return (array) $Arr1;
	}

	/*
	 * Determine if input string is a properly formatted JSON object.
	 * @method isJson
	 */
	private function isJson($string) {
		if (is_string($string)) {
			json_decode($string);
			return (json_last_error() == JSON_ERROR_NONE);
		}
		return false;
	}

}

?>