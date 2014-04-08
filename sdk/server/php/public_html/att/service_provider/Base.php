<?php
/**
 * Base class for common methods used in provider services to APIs.
 *
 * @class Base
 */
abstract class Base {

    /**
     * This method is the primary mechanism for forwarding {@link Request} objects to AT&T APIs using PHP cURL. The response from the API
     * is automatically received, parsed and returned by this method as a {@link Response} object.
     *
     * @method  makeRequest
     * 
     * @param   {string} method The http request method [GET|POST|PUT]
     * @param   {string} url Target URL of the request.
     * @param   {Request} request Request object to send to API.
     * 
     * @return  {Response} Returns a Response object
     *
     */
    public function makeRequest($method, $url, $request = null) {
        try {

            $headers    = $request->getHeaders();
            $postfields = $request->getPostfields();

            $curl = curl_init($url);
            $options = array(
                CURLOPT_HTTPHEADER      => $headers,
                CURLOPT_RETURNTRANSFER  => true,
                CURLOPT_SSL_VERIFYHOST  => ENABLE_SSL_CHECK,
                CURLOPT_SSL_VERIFYPEER  => ENABLE_SSL_CHECK,
                CURLOPT_HEADER          => true,
                CURLINFO_HEADER_OUT     => true
            );

            curl_setopt_array($curl, $options);

            if ($method === "POST" || $method === "PUT") {
                curl_setopt($curl, CURLOPT_POSTFIELDS, $postfields);
            }

            if ($method === "PUT") {
                if($postfields === '[]') {
                    curl_setopt($curl, CURLOPT_PUT, 1);
                } else {
                    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
                }
            }

            //
            // If debugging, set the options before executing the request
            //
            if (DEBUG) {
                $fp = Debug::init();
                curl_setopt($curl, CURLOPT_STDERR, $fp);
                curl_setopt($curl, CURLOPT_VERBOSE, true);
            }

            $curl_response = curl_exec($curl);
            $curl_info = curl_getinfo($curl);

            // If debugging, capture the response body after the request has been sent, but before the curl instance is closed

            if (DEBUG) {
                Debug::write("\n>>>>> [ REQUEST HEADERS AND CONTENT  ] >>>>>>>>>>>>\n");
                Debug::write("{$curl_info['request_header']}");
                if ($method == "POST") {
                    Debug::write("$postfields\n");
                }
                Debug::write(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n");
                Debug::write("\n<<<<< [ RESPONSE HEADERS AND CONTENT ] <<<<<<<<<<<<\n$curl_response\n");
                Debug::write("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
                Debug::dumpBacktrace();
                curl_close($curl);
                Debug::end();
            } else {
                curl_close($curl);
            }

            return new Response(array(
                "curl_info"     => $curl_info,
                "curl_response" => $curl_response
            ));

        } catch (Exception $e) {
            return new Response($e);
        }
    }

    /** 
     * Returns the mime type associated with the specified input file based on the system's mime type file.
     *
     * @method  getMimeType
     *
     * @param   {string} filename Name of input file
     *
     * @return  {string} The mime type of the file, based on the extension in the name.
     *
     */
    public function getMimeType($filename) {

        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        switch ($extension) {
            case 'amr': return 'audio/amr';
            case 'amb': return 'audio/amr-wb';
            case 'wav': return 'audio/x-wav';
            case 'mp3': return 'audio/mp3';
            case 'm4a': return 'audio/m4a';
            case 'mid': return 'audio/midi';
            case 'spx': return 'audio/x-speex';

            case 'jpg': return 'image/jpeg';
            case 'gif': return 'image/gif';
            case 'png': return 'image/png';

            case 'wmv': return 'video/wmv';
            case 'm4v': return 'video/m4v';
            case 'mp4': return 'video/mp4';
            case '3gp': return 'video/3gp';

            default: return 'unknown';
        }
    }

    /**
     * Encodes a file on the local file system using base64
     *
     * @method  base64Encode
     * 
     * @param   {string} filename The name of the file to encode. If no path information is provided in the filename, the path defaults to the directory of the PHP script which instantiates the Sencha_ServiceProvider_Base_Att class.
     *
     * @return  {string} The encoded file
     *
     */
    public function base64Encode($filename) {
        $docroot = $_SERVER['DOCUMENT_ROOT'];
        $filename = file_exists($docroot . '/' . $filename) ? $docroot . '/' . $filename : $filename;

        if (file_exists($filename)) {
            $file_binary = fread(fopen($filename, "r"), filesize($filename));
            return base64_encode($file_binary);
        } else {
            throw new Exception("File Not found ($filename)");
        }
    }

    /**
     * Returns the contents of a file on the local file system 
     *
     * @method  getFile
     * 
     * @param   {string} filename The name of the file to encode. If no path information is provided in the filename, the path defaults to the directory of the PHP script which instantiates the Sencha_ServiceProvider_Base_Att class.
     *
     * @return  {string} The raw file contents
     *
     */
    public function getFile($filename) {
        $docroot = $_SERVER['DOCUMENT_ROOT'];
        $filename = file_exists($docroot . '/' . $filename) ? $docroot . '/' . $filename : $filename;

        if (file_exists($filename)) {
            $file_binary = fread(fopen($filename, "r"), filesize($filename));
            return $file_binary;
        } else {
            throw new Exception("File not found. ($filename)");
        }
    }

}

?>