<?php
// Include codekit files
require_once __DIR__ . '/Html5_ServiceProvider_Base_Att.php';
require_once __DIR__ . '/../codekit.lib/IMMN/IMMNService.php';
require_once __DIR__ . '/../codekit.lib/IMMN/DeltaChange.php';

// use any namespaced classes
use Att\Api\IMMN\IMMNService;
use Att\Api\IMMN\IMMNDeltaChange;

	/**
	 * The IMMN_ServiceProvider class.
	 *
	 * This class provides reusable and extendable server code written in PHP. The SDK server takes requests from the client side Att.Provider 
	 * object and maps them to the corresponding server side method which takes care of sending the requests to the AT&T API Platform.
	 *
	 * You can create an instance directly like this:
	 *
	 *      $immn_provider = new IMMN_ServiceProvider(array(
	 *          "AppKey"            => "XXXXXX",
	 *          "Secret" 	        => "XXXXXX",
	 *          "localServer"       => "http://127.0.0.1:8888",
	 *          "apiHost"           => "https://api.att.com",
	 *          "clientModelScope"  => "ADS"
	 *      ));
	 *
	 *
	 * @class IMMN_ServiceProvider
	 * @extends Html5_ServiceProvider_Base_Att
	 *
	 * @cfg {string} AppKey The AppKey generated when creating an app in the AT&T Dev Connect portal.
	 * @cfg {string} Secret The Secret generated when creating an app in the AT&T Dev Connect portal.
	 * @cfg {string} localServer The url of the locally running server that is used to build the callback urls.
	 * @cfg {string} apiHost The url endpoint through which all AT&T API requests are made.
	 * @cfg {string} clientModelScope The list of scopes that the application wants to gain access to when making API calls that use Autonomous Client.
	 */
	class IMMN_ServiceProvider extends Html5_ServiceProvider_Base_Att {

		public function __construct($config) {
			parent::__construct($config);
		}

		/**
		 * Recreates the message index
		 *
		 * @method createMessageIndex
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function createMessageIndex() {
			// Get OAuth token
			$token = $this->getSessionConsentToken('MIM');
			$immnSrvc = new IMMNService($this->base_url, $token);
			return $immnSrvc->createMessageIndex(true);
		}

		/**
		 * Get the message index information
		 *
		 * @method getMessageIndexInfo
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function getMessageIndexInfo() {
			// Get OAuth token
			$token = $this->getSessionConsentToken('MIM');
			$immnSrvc = new IMMNService($this->base_url, $token);
			return $immnSrvc->getMessageIndexInfo(true);
		}

		/**
		 * Retrieve Message Headers List from Server
		 *
		 * @method getMessageList
		 *
		 * @param {integer} headerCount - the number of records to retrieve
		 * @param {array} offset and optional parameters
		 * 		- offset => (opts[:offset] || 0)
         * 	    - messageIds => opts[:messageIds]
         * 	    - isUnread => opts[:isUnread]
         * 	    - isFavorite => opts[:isFavorite]
         * 	    - type => opts[:type]
         * 	    - keyword => opts[:keyword]
         * 	    - isIncoming => opts[:isIncoming]
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function getMessageList($headerCount, $opts) {
			// Get OAuth token
			$token = $this->getSessionConsentToken('MIM');
			$immnSrvc = new IMMNService($this->base_url, $token);
			$offset = isset($opts['offset']) ? $opts['offset'] : '0';
			if ($offset == '') $offset = '0'; // This could be sent as blank.
			$msgIds = isset($opts['messageIds']) ? $opts['messageIds'] : null;
			$isUnread = isset($opts['isUnread']) ? $opts['isUnread'] : null;
			$type = isset($opts['type']) ? $opts['type'] : null;
			$keyword = isset($opts['keyword']) ? $opts['keyword'] : null;
			$isIncoming = isset($opts['isIncoming']) ? $opts['isIncoming'] : null;
			$isFavorite = isset($opts['isFavorite']) ? $opts['isFavorite'] : null;
			// getMessageList($limit, $offset, $msgIds=null,$isUnread=null, $type=null, $keyword=null, $isIncoming=null, $isFav=null, $raw_response = false)
			return $immnSrvc->getMessageList($headerCount, $offset, $msgIds, $isUnread, $type, $keyword, $isIncoming, $isFavorite, true);
		}

		/**
		 * Retrieve the Message from Server
		 *
		 * @method getMessage
		 *
		 * @param {string} msgId - Id of the message to retrieve
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function getMessage($msgId) {
			// Get OAuth token
			$token = $this->getSessionConsentToken('MIM');
			$immnSrvc = new IMMNService($this->base_url, $token);
			return $immnSrvc->getMessage($msgId, true);
		}

		/**
		 * Retrieves details about the credentials, endpoint, and resource information required to set up a notification connection
		 *
		 * @method getNotificationConnectionDetails
		 *
		 * @param {string} queues - Specifies the name of the resource - TEXT or MMS
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function getNotificationConnectionDetails($queues) {
			// Get OAuth token
			$token = $this->getSessionConsentToken('MIM');
			$immnSrvc = new IMMNService($this->base_url, $token);
			return $immnSrvc->getNotificationConnectionDetails($queues, true);
		}

		/**
		 * Retrieves the contents of an IMMN message part.
		 *
		 * @method getMessageContent
		 * 
		 * @param {string} msgId The messageId of the message 
		 * @param {string} partId The partNumber to retrieve
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function getMessageContent($msgId, $partId) {
			$token = $this->getSessionConsentToken('MIM');
			$immnSrvc = new IMMNService($this->base_url, $token);
			$result = $immnSrvc->getMessageContent($msgId, $partId, true);
			http_response_code($result->getResponseCode());
			if ($result->getResponseCode() == 200) {
				header("Content-Type:".$result->getHeader('content_type'));
				header("Content-Length:".$result->getHeader('download_content_length'));
			}
			return $result->getResponseBody();
		}

		/**
		 * Delete the Message from Server
		 *
		 * @method deleteMessage
		 *
		 * @param {string} msgId - Id of the message to delete
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function deleteMessage($msgId) {
			// Get OAuth token
			$token = $this->getSessionConsentToken('MIM');
			$immnSrvc = new IMMNService($this->base_url, $token);
			return $immnSrvc->deleteMessage($msgId, true);
		}

		/**
		 * Delete the Messages from Server
		 *
		 * @method deleteMessages
		 *
		 * @param {array} messageIds - Array of MessageIds to delete
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function deleteMessages($msgId) {
			$token = $this->getSessionConsentToken('MIM');
			$immnSrvc = new IMMNService($this->base_url, $token);
			return $immnSrvc->deleteMessages($msgId, true);
		}

		/**
		 * Update the properties of a message
		 *
		 * @method updateMessage
		 *
		 * @param {string} msgId - Id of the message to update
		 * @param {bool} isUnread - mark as unread or read
		 * @param {bool} isFavorite - mark as favorite or not
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function updateMessage($msgId, $isUnread, $isFavorite) {
			$token = $this->getSessionConsentToken('MIM');
			$immnSrvc = new IMMNService($this->base_url, $token);
			return $immnSrvc->updateMessage($msgId, $isUnread, $isFavorite, true);
		}

		/**
		 * Update the messages
		 *
		 * @method updateMessages
		 *
		 * @param {json} immnDeltaChanges - Array containing information about which changes are requested
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function updateMessages($immnDeltaJson) {
			$token = $this->getSessionConsentToken('MIM');
			$immnSrvc = new IMMNService($this->base_url, $token);
			$immnDeltaChanges = array();
			foreach($immnDeltaJson['messages'] as $message) {
				if (isset($message['id'])) {
					$id = $message['id'];
					$isUnread = isset($message['isUnread']) ? $message['isUnread'] : null;
					$isFavorite = isset($message['isFavorite']) ? $message['isFavorite'] : null;
					array_push($immnDeltaChanges, new IMMNDeltaChange($id, $isUnread, $isFavorite));
				}
			}
			return $immnSrvc->updateMessages($immnDeltaChanges, true);
		}

		/**
		 * Update the properties of a message
		 *
		 * @method getMessagesDelta
		 *
		 * @param {string} state - State to get delta from
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function getMessagesDelta($state) {
			$token = $this->getSessionConsentToken('IMMN');
			$immnSrvc = new IMMNService($this->base_url, $token);
			return $immnSrvc->getMessagesDelta($state, true);
		}

		/**
		 * Sends an IMMN to a recipient,
		 *
		 * @method sendImmnMessage
		 * 
		 * @param string      $address   addresses to which the specified messages will be sent. 
		 * @param string|null $text      text body of message or null if none
		 * @param string|null $subject   subject of message or null if none
		 * @param array|null  $fnames    file names of attachments or null if none 
		 * @param bool|null   $isGroup   whether to send as broadcast or null to use default
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function sendImmnMessage($address, $text, $subject, $fnames = null, $isGroup = false) {
			// Parse address(es)
			if (strstr($address, ",")) {
				// If it's csv, split and iterate over each value prepending each value with "tel:"
				$address = explode(",", $address);
				foreach ($address as $key => $value) {
					// Determine if string is tel, short or email
					$address[$key] = $this->parseAddress($value); 
				}
			} else {
				$address = array($this->parseAddress($address));
			}
			$token = $this->getSessionConsentToken('IMMN');
			$immnSrvc = new IMMNService($this->base_url, $token);
			return $immnSrvc->sendMessage($address, $text, $subject, $fnames, $isGroup, true);
		}		
	}
?>