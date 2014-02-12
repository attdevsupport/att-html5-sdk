<?php
namespace Att\Api\Speech;

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 */

/**
 * Speech Library
 * 
 * PHP version 5.4+
 * 
 * LICENSE: Licensed by AT&T under the 'Software Development Kit Tools 
 * Agreement.' 2013. 
 * TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTIONS:
 * http://developer.att.com/sdk_agreement/
 *
 * Copyright 2013 AT&T Intellectual Property. All rights reserved.
 * For more information contact developer.support@att.com
 * 
 * @category  API
 * @package   Speech 
 * @author    pk9069
 * @copyright 2013 AT&T Intellectual Property
 * @license   http://developer.att.com/sdk_agreement AT&amp;T License
 * @link      http://developer.att.com
 */
require_once __DIR__ . '../../Srvc/APIService.php';
require_once __DIR__ . '/NBest.php';
require_once __DIR__ . '/SpeechMultipart.php';
require_once __DIR__ . '/SpeechResponse.php';

use Att\Api\OAuth\OAuthToken;
use Att\Api\Restful\HttpPost;
use Att\Api\Restful\RestfulRequest;
use Att\Api\Srvc\APIService;
use Att\Api\Srvc\Service;

use InvalidArgumentException;

/**
 * Used to interact with version 3 of the Speech API.
 *
 * @category API
 * @package  Speech
 * @author   pk9069
 * @license  http://developer.att.com/sdk_agreement AT&amp;T License
 * @version  Release: @package_version@ 
 * @link     https://developer.att.com/docs/apis/rest/3/Speech
 */
class SpeechService extends APIService
{

    /**
     * Gets the MIME type of the specified file. 
     *
     * This implementation currently only looks at the file ending and is 
     * therefore very trivial.
     *
     * @param string $fname file name to examine.
     *
     * @return string MIME type of specified file.
     */
    private function _getFileMIMEType($fname)
    {
        $arr = explode('.', $fname);
        $ending = end($arr);
		// 2/12/2014. Added support for different file extensions.
        if (strcmp('spx', $ending) == 0) {
            $ending = 'x-speex'; 
        } else if (strcmp('awb', $ending) == 0) {
            $ending = 'amr-wb'; 
        } else if (strcmp('jpg', $ending) == 0) {
            $ending = 'jpeg'; 
		} else if (strcmp('mid', $ending) == 0) {
            $ending = 'midi'; 
		}
       $type = 'audio/' . $ending;
        return $type;
    }

    /**
     * Creates an SpeechService object that can be used to interact with
     * the Speech API.
     *
     * @param string     $FQDN  fully qualified domain name to which requests 
     *                          will be sent
     * @param OAuthToken $token OAuth token used for authorization 
     */
    public function __construct($FQDN, OAuthToken $token)
    {
        parent::__construct($FQDN, $token); 
    }

    /**
     * Sends a request to the API for converting speech to text.
     *
     * @param string      $fname            file location that contains speech 
     *                                      to convert.
     * @param string      $speechContext    speech context to use.
     * @param string|null $speechSubContext speech sub context to use, if not 
     *                                      null.
     * @param string|null $xArg             optional arguments to use, if not 
     *                                      null.
     * @param boolean     $chunked          whether to send the request chunked.
     *
     * @return SpeechResponse API response as a SpeechResponse object.
     * @throws ServiceException if API request was not successful.
     */
	// 2/8/2014. Reafctored code to add a function to directly take binary data.
    public function speechToTextWithBinary($fileBinary, $mimeType, $filesize, $speechContext, 
        $speechSubContext = null, $xArg = null, $chunked = true
    ) {
        $endpoint = $this->getFqdn() . '/speech/v3/speechToText';
        $req = new RESTFulRequest($endpoint);
        $req
            ->setAuthorizationHeader($this->getToken())
            ->setHeader('Accept', 'application/json')
            ->setHeader('Content-Type', $mimeType)
            ->setHeader('X-SpeechContext', $speechContext);

        if ($chunked) {
            $req->setHeader('Content-Transfer-Encoding', 'chunked');
        } else {
            $req->setHeader('Content-Length', $filesize);
        }
        if ($xArg != null) {
            $req->setHeader('xArg', $xArg);
        }

        if ($speechSubContext != null) {
            $req->setHeader('X-SpeechSubContext', $speechSubContext);
        }
    
        $httpPost = new HttpPost();
        $httpPost->setBody($fileBinary);

        $result = $req->sendHttpPost($httpPost);

		// 2/6/2014. Handle the flag to return json, not the SpeechResponse object.
        if ($this->getReturnJsonResponse() == true) {
			$body = Service::parseApiResposeBody($result); // Note: This could throw ServiceExeption
			return $body;
        }
		
        $jsonArr = Service::parseJson($result);
		return SpeechResponse::fromArray($jsonArr);
    }
    public function speechToTextWithFileType($fname, $filetype, $speechContext, 
        $speechSubContext = null, $xArg = null, $chunked = true
    ) {
        // read file
        $fileResource = fopen($fname, 'r');
        if (!$fileResource) {
            throw new InvalidArgumentException('Could not open file ' . $fname);
        }
        $fileBinary = fread($fileResource, filesize($fname));
        fclose($fileResource);

        $response = $this->speechToTextWithBinary($fileBinary, $filetype, filesize($fname),  
										$speechContext, $speechSubContext, $xArg, $chunked);
		
		return $response;
	}
    public function speechToText($fname, $speechContext, 
        $speechSubContext = null, $xArg = null, $chunked = true
    ) {
        $response = $this->speechToTextWithFileType($fname, $this->_getFileMIMEType($fname),  
										$speechContext, $speechSubContext, $xArg, $chunked);
		
		return $response;
	}
    /**
     * Sends a request to the API for converting text to speech.
     *
     * @param string      $ctype content type.
     * @param string      $txt   text to convert to speech.
     * @param string|null $xArg  optional arguments to set, if not null.
     *
     * @return raw audio/x-wave data.
     * @throws ServiceException if API request was not successful.
     */
    public function textToSpeech($ctype, $txt, $xArg = null) 
    {
        $endpoint = $this->getFqdn() . '/speech/v3/textToSpeech';
        $req = new RESTFulRequest($endpoint);
        $req
            ->setAuthorizationHeader($this->getToken())
            ->setHeader('Accept', 'audio/x-wav')
            ->setHeader('Content-Type', $ctype);

        if ($xArg != null) {
            $req->setHeader('X-Arg', $xArg);
        }
        
        $httpPost = new HttpPost();
        $httpPost->setBody($txt);

        $result = $req->sendHttpPost($httpPost);
		
		// 2/8/2014 Fixed a bug. $body was being set after throwing the ServiceException
        $body = $result->getResponseBody();
        $code = $result->getResponseCode();
        if ($code != 200 && $code != 201) {
            throw new ServiceException($body, $code);
        }

        return $body;
    }

    /**
     * Sends a custom API request for converting speech to text.
     *
     * @param string $cntxt  speech context.
     * @param string $fname  path to file that contains speech to convert.
     * @param string $gfname path to file that contains grammar.
     * @param string $dfname path to file that contains dictionary.
     * @param string $xArg   optional arguments.
     *
     * @return array API response as an array of key-value pairs.
     * @throws ServiceException if API request was not successful.
     */
	// 2/8/2014. Added support to return jsonResponse
    public function speechToTextCustom($cntxt, $fname, $gfname = null, 
        $dfname = null, $xArg = null
    ) {
        $endpoint = $this->getFqdn() . '/speech/v3/speechToTextCustom';
        $mpart = new SpeechMultipartBody();

        $req = new RESTFulRequest($endpoint);
        $req
            ->setHeader('Accept', 'application/json')
            ->setAuthorizationHeader($this->getToken())
            ->setHeader('Content-Type', $mpart->getContentType());
        
        if ($xArg != null) {
            $req->setHeader('X-Arg', $xArg);
        }
        if ($dfname != null) {
            $mpart->addXDictionaryPart($dfname);
        }
        if ($gfname != null) {
            $mpart->addXGrammarPart($gfname);
        }
        $mpart->addFilePart($fname);
        $result = $req->sendHttpMultipart($mpart);

		// 2/6/2014. Handle the flag to return json and not the SpeechResponse object.
        if ($this->getReturnJsonResponse() == true) {
			$body = Service::parseApiResposeBody($result); // Note: This could throw ServiceExeption
			return $body;
        }
		
        return Service::parseJson($result);
    }

}

?>
