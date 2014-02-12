<?php
namespace Att\Api\Srvc;

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 */

/**
 * Service Library
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
 * @package   Service
 * @author    pk9069
 * @copyright 2013 AT&T Intellectual Property
 * @license   http://developer.att.com/sdk_agreement AT&amp;T License
 * @link      http://developer.att.com
 */

require_once __DIR__ . '/Service.php';

use Att\Api\OAuth\OAuthToken;

/**
 * Base class used to hold common code for sending API requests. 
 *
 * @category API
 * @package  Service
 * @author   pk9069
 * @license  http://developer.att.com/sdk_agreement AT&amp;T License
 * @version  Release: @package_version@ 
 * @link     http://developer.att.com
 * @see      Service
 */
abstract class APIService extends Service
{

    /**
     * OAuth token used for authorization.
     *
     * @var OAuthToken
     */
    private $_returnJsonResponse; // 2/10/2014. Added to expose this. Default is set to false. Needs to changed explicitly.

    /**
     * OAuth token used for authorization.
     *
     * @var OAuthToken
     */
    private $_token;

    /**
     * Fully qualified domain name to which requests will be sent.
     *
     * @var string
     */
    private $_fqdn;

    /**
     * Creates an APIService object that an be used to interact with
     * APIs.
     *
     * @param string     $fqdn  fully qualified domain name to send requests to
     * @param OAuthToken $token OAuth token used for authorization 
     */
    protected function __construct($fqdn, OAuthToken $token)
    {
        $this->_token = $token; 
        $this->_fqdn = $fqdn;
		$this->_returnJsonResponse = false; // 2/10/2014. Default value. Needs to be explicitly set to true.
    }

    /**
     * Gets the fully qualified domain name.
     *
     * @return string fully qualified domain name
     */
    protected function getFqdn()
    {
        return $this->_fqdn;
    }

    /**
     * Gets OAuthToken.
     *
     * @return OAuthToken token
     */
    protected function getToken()
    {
        return $this->_token;
    }


    /**
     * Gets _returnJsonResponse.
     *
     * @return _returnJsonResponse
     */
    public function getReturnJsonResponse()
    {
        return $this->_returnJsonResponse;
    }

    /**
     * Sets _returnJsonResponse. Supposed to be called after the object is created.
     *
     * Set _returnJsonResponse
     */
    public function setReturnJsonResponse($value)
    {
        $this->_returnJsonResponse = $value;
    }
}
?>
