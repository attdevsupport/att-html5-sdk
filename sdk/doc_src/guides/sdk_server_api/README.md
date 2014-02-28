SDK Server API Protocol
=======

The SDK server uses standard REST requests between the client running on the browser and the SDK server.
Once the SDK server has received and validated the request it will make the appropriate API call to AT&T and return the results.

The service methods in the JavaScript library (att-api-client.js) call service-specific endpoints on the SDK server. The type of REST call and parameters passed varies depending on the service being called. In general you will have to examine the library source code or the SDK server source code to determine the exact request/response wire format for a particular service call.
