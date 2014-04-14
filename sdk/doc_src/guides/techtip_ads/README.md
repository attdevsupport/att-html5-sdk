ADS Cookbook
===

Overview
---
This guide explains the usage of the AttApiClient to obtain the Ad content using the AT&T HTML5 SDK Platform.

What do I need to start?
---

1. Include att-api-client.js. Include att-api-client.js as a dependency by including it in your HTML:  

        <script type="text/javascript" src="att-api-client.js"></script>

Adjust the _src_ attribute value to match the site path where you store the _att_api_client.js_ file.


How do I get an Ad ?
---

Getting an ad to display within your application is quite simple. Review the available parameters found in the documentation for this API at the AT&T website. Decide the values (if any) you wish for the parameters and then make a request for an ad by calling the SDK **getAds** method.

        AttApiClient.Advertising.getAd({
                Category: 'Autos',
                Country: 'US'
            },
            getAdSucceeded,
            getAdFailed
        );

        function getAdSucceeded(response) {

        }

        function getAdFailed(response) {

        }


How do I display an Ad ?
---

Once you have received a successful response, displaying the ad in your application is quite simply a matter of applying the information in the response to an IMG tag (or other appropriate image display) that resides on the page in which you wish to display the ad:

    <img id='ad'>

In your application, fetch an ad once the application is launched:

    AttApiClient.Advertising.getAd(
        {Category: 'movies'},
        function success(response){
            document.getElementById('ad').src = response.AdsResponse.Ads.ImageUrl.Image;
        },
        function failure(error){
            // no ad retrieved ....
        }
    );
