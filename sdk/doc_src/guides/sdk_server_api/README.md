SDK Server API Protocol
=======

The SDK server uses standard RESTful requests between the client that runs on the browser and the SDK server.
Once the SDK server has received and validated the request, it will make the appropriate call to the AT&T API Platform and return the results.

The methods in the JavaScript library (att-api-client.js) call service-specific endpoints on the SDK server. The type of RESTful call and the parameters that are passed varies, depending on the API method. Examine the library source code or the SDK server source code to determine the exact format for the request or response for a particular API call.
