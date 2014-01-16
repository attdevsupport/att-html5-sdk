SDK Server API Protocol
=======

The SDK server uses Sencha Direct to broker requests between the client running on the browser and the SDK server.
Once the SDK server has received and validated the request it will make the appropriate API call to AT&T and return the results.
This document describes the HTTP protocol used by Sencha Direct.
For complete documentation on Sencha Direct please visit the [Sencha Direct website](http://www.sencha.com/products/extjs/extdirect).

Understanding the internals of the SDK server protocol is not required to use the SDK itself, but this document is provided for advanced users who need to extend or modify the behavior of the server SDK itself. This guide could also be used as a starting point for building other JavaScript clients that do not rely on Att.Provider or the JavaScript Library for Sencha Direct.

Overview
---

Sencha Direct exposes an HTTP based API. It accepts JSON formatted data from HTTP POST requests.  Any HTTP client can make requests of the server that can generate the expected JSON format and understand the JSON response.

Here is a typical request to the SDK server:


    Request URL:http://localhost/att/direct_router
    Request Method:POST
    Status Code:200 OK
    X-Requested-With:XMLHttpRequest

    Request Payload
    {
        "action":"ServiceProvider",
        "method":"sendSms",
        "data":["XXXXXXXX","Sencha Test SMS"],
        "type":"rpc",
        "tid":2
    }


Which generates a response:

    {
        "result": {
            "ResourceReference": {
                "ResourceURL":"...."
            },
            "Id":"SMSa9b4d90baadf6f7b"
        },
        "action":"ServiceProvider",
        "method":"sendSms",
        "tid":2,
        "type":"rpc"
    }


URL Structure
---

The API makes HTTP posts to the same URL endpoint:

    http://host/att/direct_router

- **host** is your server where the SDK has been deployed.
- **/att/** is the default path and can be configured when the application itself is deployed.  See the server setup guides for more details.
- **/direct_router** is the standard URL that each application server is configured to respond to.

Request Payload
---
The JSON data for the request:

    {
        "action":"ServiceProvider",
        "method":"sendSms",
        "data":["XXXXXXXX","Sencha Test SMS"],
        "type":"rpc",
        "tid":2
    }

- In the case of the SDK, the **action** will always be ServiceProvider
- The **method** will be the method name we are calling on the server.
    - There is a one-to-one mapping between the Att.Provider function name and the name of the function on the server.
- **data** is a JSON array of parameters to pass to the target function.
- **type** is the type of the request; in the case of the SDK server this will always be "rpc".
- **tid** is the sequence number of the request, it increments with each new request and can be used by the client to keep track of requests and responses in an async environment.  The server will echo back the tid that it is given.



Response
---
The HTTP Post will return a JSON response.

    {
        "result": {
            "ResourceReference": {
                "ResourceURL":"...."
            },
            "Id":"SMSa9b4d90baadf6f7b"
        },
        "action":"ServiceProvider",
        "method":"sendSms",
        "tid":2,
        "type":"rpc"
    }

- Each API method returns a **response** key, which is the result of the API call.  In most cases this is a direct copy of the AT&T API JSON response.

<code>action</code>, <code>method</code>, <code>tid</code>, and <code>type</code> from the request are also copied into the response.



