/**
 * Sample App Configuration 
 * @class SampleApp.Config
 * @singleton
 */
Ext.define('SampleApp.Config', {
    singleton: true,


    /**
     * apiBasePath is used as the root path to make the SenchProvider api calls
     * so this path can be blank, relative, or absolute.
     */
    apiBasePath   : '/att',

    /**
     * url of where to get the json data
     */
    imageDataUri      : '/att/mms/gallerygetter',

    /**
     * gallery images folder uri
     */
    galleryImagesFolder    : '/att/mms/gallery/',

    /**
     * coupon folder, relative to where the app is installed
     */
    couponImagesBaseUri   : 'assets/data/coupons/',

    /**
     * short code or Registration ID used on Sample Apps
     */
    shortCode         : '44629062',
    
    /**
     * short code or Registration ID used on Sample app to receive messages from on the second button
     */
    anotherShortCode  : '44629062',

    defaultPhoneNbr   : '',
    headerCount       : 1,
    alertTitle        : 'Message',
    errorTitle        : 'ERROR',
    successTitle      : 'SUCCESS',
    invalidPhoneMsg   : 'Phone number is not valid.  Please re-enter. <br/>Example: 1XXXXXXXXXX, XXX-XXX-XXXX, XXXXXXXXXX',
    defaultMessage    : 'Simple message to myself.',
    maxTotalFileSize  : 1000 * 1024
});
