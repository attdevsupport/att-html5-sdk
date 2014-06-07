Advertising Cookbook
===

Overview
---
This guide explains the usage of the AttApiClient to obtain the ad content using the HTML5 SDK.

What do I need to start?
---

1. Include att-api-client.js as a dependency by adding the following code to your HTML:  

        <script type="text/javascript" src="att-api-client.js"></script>

Adjust the _src_ attribute value to match the site path where you store the _att_api_client.js_ file.


How do I get an ad?
---

Before you can retrieve an ad to display within your application, you must first review the available parameters found in the documentation for the Advertising API at the AT&T Developer Program website. Decide the values (if any) you wish to use for the available parameters, and then make a request for an ad by calling the SDK **getAds** method:

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


How do I display an ad?
---

Once you have received a successful response using the **getAds** method, display the ad in your application by adding the information in that response to an IMG tag or other appropriate image display method on the page where you wish to display the ad:

    <img id='ad'>

In your app, fetch an ad when the app is launched:

    AttApiClient.Advertising.getAd(
        {Category: 'movies'},
        function success(response){
            document.getElementById('ad').src = response.AdsResponse.Ads.ImageUrl.Image;
        },
        function failure(error){
            // no ad retrieved ....
        }
    );
