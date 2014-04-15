<?php
// Include codekit files
require_once __DIR__ . '/Html5_ServiceProvider_Base_Att.php';
require_once __DIR__ . '/../codekit.lib/Speech/SpeechService.php';

// use any namespaced classes
use Att\Api\Speech\SpeechService;

	/**
	 * The Speech_ServiceProvider class.
	 *
	 * This class provides reusable and extendable server code written in PHP. The SDK server takes requests from the client side Att.Provider 
	 * object and maps them to the corresponding server side method which takes care of sending the requests to the AT&T API Platform.
	 *
	 * You can create an instance directly like this:
	 *
	 *      $speech_provider = new Speech_ServiceProvider(array(
	 *          "AppKey"            => "XXXXXX",
	 *          "Secret" 	        => "XXXXXX",
	 *          "localServer"       => "http://127.0.0.1:8888",
	 *          "apiHost"           => "https://api.att.com",
	 *          "clientModelScope"  => "ADS"
	 *      ));
	 *
	 *
	 * @class Speech_ServiceProvider
	 * @extends Html5_ServiceProvider_Base_Att
	 *
	 * @cfg {string} AppKey The AppKey generated when creating an app in the AT&T Dev Connect portal.
	 * @cfg {string} Secret The Secret generated when creating an app in the AT&T Dev Connect portal.
	 * @cfg {string} localServer The url of the locally running server that is used to build the callback urls.
	 * @cfg {string} apiHost The url endpoint through which all AT&T API requests are made.
	 * @cfg {string} clientModelScope The list of scopes that the application wants to gain access to when making API calls that use Autonomous Client.
	 */
	class Speech_ServiceProvider extends Html5_ServiceProvider_Base_Att {

		public function __construct($config) {
			parent::__construct($config);
		}

		/**
		 * Sends audio file to API and a text representation is sent back.
		 *
		 * @method speechToText
		 *
		 * @param {string} file Name and path of local audio file to send to codekit
		 * @param {string} context Speech context for translation. Please see SpeechToText API documentation for parameter values
		 * @param {string} xargs X-Arg objects. Please see SpeechToText API documentation for information about this parameter
		 * @param {boolean} chunked True to send the file using chunked transfer.
		 *
		 * @return {Response} Returns Response object.
		 * @throws ServiceException if API request was not successful.
		 *
		 */
		public function speechToText($file, $context, $xargs, $chunked) {
			$filecontents = $this->getFile($file); // throws Exception
			
			// Get OAuth token
			$token = $this->getCurrentClientToken();
			$speechSrvc = new SpeechService($this->base_url, $token);
			
			return $speechSrvc->speechToText($file, $context, null, $xargs, $chunked, true);
		}

		/**
		 * Sends audio file to API and a text representation is sent back. Used to process posted file data.
		 *
		 * @method speechToTextWithFileType
		 *
		 * @param {string} file Name and path of local audio file to send to codekit
		 * @param {string} filetype Filetype to send to the codekit
		 * @param {string} context Speech context for translation. Please see SpeechToText API documentation for parameter values
		 * @param {string} xargs X-Arg objects. Please see SpeechToText API documentation for information about this parameter
		 * @param {boolean} chunked True to send the file using chunked transfer.
		 *
		 * @return {Response} Returns Response object.
		 * @throws ServiceException if API request was not successful.
		 *
		 */
		public function speechToTextWithFileType($file, $filetype, $context, $xargs, $chunked) {
			$filecontents = $this->getFile($file); // throws Exception
			
			// Get OAuth token
			$token = $this->getCurrentClientToken();
			$speechSrvc = new SpeechService($this->base_url, $token);
			
			return $speechSrvc->speechToTextWithFileType($file, $filetype, $context, null, $xargs, $chunked, true);
		}

		/**
		 * Sends audio file to API and a text representation is sent back. Supports custom dictionary and/or grammar file.
		 *
		 * @method speechToTextCustom
		 *
		 * @param {string} file Name and path of local audio file to send to codekit
		 * @param {string} context Speech context for translation. Please see SpeechToText API documentation for parameter values
		 * @param {string} grammar_file Name and path of the grammar file.
		 * @param {string} dictionary_file Name and path of the dictionary file.
		 * @param {string} xargs X-Arg objects. Please see SpeechToText API documentation for information about this parameter
		 *
		 * @return {Response} Returns Response object.
		 * @throws ServiceException if API request was not successful.
		 *
		 */
		public function speechToTextCustom($file, $context, $grammar_file, $dictionary_file, $xargs) {
			$filecontents = $this->getFile($file); // throws Exception
			
			// Get OAuth token
			$token = $this->getCurrentClientToken();
			$speechSrvc = new SpeechService($this->base_url, $token);
			
			return $speechSrvc->speechToTextCustom($context, $file, $grammar_file, $dictionary_file, $xargs, true);
		}

		/**
		 * Sends the text for conversion to the codekit and returns the audio file.
		 *
		 * @method textToSpeech
		 *
		 * @param {string} data.0 Token for authentication
		 * @param {string} ctype Content type - generally 'text/plain'
		 * @param {string} text Text to be converted to speech
		 * @param {string} xargs X-Arg objects. Please see SpeechToText API documentation for information about this parameter
		 *
		 * @return {Response} Returns Response object.
		 * @throws ServiceException if API request was not successful.
		 *
		 */
		public function textToSpeech($ctype, $text, $xargs) {
			// Get OAuth token
			$token = $this->getCurrentClientToken();
			$speechSrvc = new SpeechService($this->base_url, $token);
			
			return $speechSrvc->textToSpeech($ctype, $text, $xargs);
		}
	}
?>