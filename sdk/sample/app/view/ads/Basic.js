/**
 *
 * User Interface for the ADS Basic application.
 *
 */
Ext.define('SampleApp.view.ads.Basic', {
    extend: 'Ext.Container',
    xtype: 'att-ads-basic',
    
    
    requires: [
       'Ext.form.Panel',
       'Ext.form.FieldSet',
       'SampleApp.view.Header',
       'SampleApp.view.Footer'
    ],
           
    config: {
        title: "Basic Advertising",
        scrollable: 'vertical',
        defaults: {scrollable: false}
    },

    initialize: function() {
        this.add([
            {xtype: 'att-header'},
            this.buildForm(),
            this.buildDisplayAd(),
            {xtype: 'att-footer'}
        ]);
    },
    
    /**
     * Builds the form for Feature 1: Get Ad
     */
    buildForm: function(){
        return {
            xtype : 'formpanel',
            items : [
                {
                    xtype : 'fieldset',
                    title : 'Feature 1: Get Ad',
                    instructions : 'Enter advertising specifications.',
                    defaults : {
                        labelWidth : '40%'
                    },
                    items : [{
                            xtype   : 'selectfield',
                            label   : 'Category',
                            name    : 'Category',
                            options : [ 
                                { text: 'Auto', value: 'auto' },
                                { text: 'Business', value: 'business' },
                                { text: 'Finance', value: 'finance' },
                                { text: 'Chat', value: 'chat' },
                                { text: 'Community', value: 'community' },
                                { text: 'Social', value: 'social' },
                                { text: 'Personals', value: 'personals' },
                                { text: 'Communication', value: 'communication' },
                                { text: 'Technology', value: 'technology' },
                                { text: 'Games', value: 'games' },
                                { text: 'Health', value: 'health' },
                                { text: 'Medical', value: 'medical' },
                                { text: 'Maps', value: 'maps' },
                                { text: 'Local', value: 'local' },
                                { text: 'Entertainment', value: 'entertainment' },
                                { text: 'Movies', value: 'movies' },
                                { text: 'TV', value: 'tv' },
                                { text: 'Music', value: 'music' },
                                { text: 'Photos', value: 'photos' },
                                { text: 'Video', value: 'video' },
                                { text: 'News', value: 'news' },
                                { text: 'Weather', value: 'weather' },
                                { text: 'Sports', value: 'sports' },
                                { text: 'Shopping', value: 'shopping' },
                                { text: 'Tools', value: 'tools' },
                                { text: 'Travel', value: 'travel' },
                                { text: 'Other', value: 'other' }
                            ]
                        },
                        {
                            xtype   : 'selectfield',
                            label   : 'Gender',
                            name    : 'Gender',
                            options : [
                                { text: 'Select Gender' , value: ''},
                                { text: 'Male' , value: 'M'},
                                { text: 'Female' , value: 'F'}       
                            ]
                        }, {
                            xtype   : 'textfield',
                            label   : 'Zipcode',
                            name    : 'ZipCode'
                        }, {
                            xtype   : 'textfield',
                            label   : 'Area Code',
                            name    : 'AreaCode'
                        }, {
                            xtype   : 'textfield',
                            label   : 'City',
                            name    : 'City'
                        }, {
                            xtype   : 'textfield',
                            label   : 'Country',
                            name    : 'Country'
                        }, {
                            xtype   : 'textfield',
                            label   : 'Longitude',
                            name    : 'Longitude'
                        }, {
                            xtype   : 'textfield',
                            label   : 'Latitude',
                            name    : 'Latitude'
                        }, {
                            xtype   : 'selectfield',
                            label   : 'MMA Size',
                            name    : 'mmasize',
                            allowBlank: true,
                            options: [
                                { text: 'Select', value: '' },
                                { text: '120x20 pixels', value: '120,20' },
                                { text: '168x28 pixels', value: '168,28' },
                                { text: '216x36 pixels', value: '216,36' },
                                { text: '300x250 pixels', value: '300,250' },
                                { text: '300x50 pixels', value: '300,50' },
                                { text: '320x50 pixels', value: '320,50' }
                            ]
                        }, {
                            xtype   : 'textfield',
                            label   : 'Timeout',
                            name    : 'Timeout'
                        }, {
                            xtype   : 'selectfield',
                            label   : 'AgeGroup',
                            name    : 'AgeGroup',
                            options : [
                                { text: 'Select', value: '' },
                                { text: '1-13', value: '1-13' },
                                { text: '14-25', value: '14-25' },
                                { text: '26-35', value: '26-35' },
                                { text: '36-55', value: '36-55' },
                                { text: '55-100', value: '55-100' }
                            ]
                        }, {
                            xtype   : 'selectfield',
                            label   : 'Over 18',
                            name    : 'Over18',
                            options : [
                                 { text: 'Select', value : ''},
                                 { text: 'Filter be over 18 content', value: '0' },
                                 { text: 'Deny over 18 content', value: '1' },
                                 { text: 'Only over 18 content', value: '2' },
                                 { text: 'Allow all', value: '3'}
                            ]
                        }, {
                            xtype   : 'textfield',
                            label   : 'Keywords',
                            name    : 'Keywords'
                        }, {
                            xtype   : 'checkboxfield',
                            label   : 'Is Size Required',
                            name    : 'IsSizeRequired',
                            value   : 'true'
                        }, {
                            xtype   : 'selectfield',
                            label   : 'Premium Ad',
                            name    : 'Premium',
                            options : [
                                 { text: 'Select', value: '' },
                                 { text: 'Non-Premium', value: '0' },
                                 { text: 'Premium only', value: '1' },
                                 { text: 'Both', value: '2' }
                            ]
                        }
                    ]
                },{
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'getad',
                    text    : 'Get Ad'
                }
            ]
        };
    },

    /**
     * Build the container to display the returned ad ...
     *
     */
    buildDisplayAd: function() {

        return {
            xtype   : 'container',
            name    : 'adUrl',
            cls     : 'content',
            tpl     : '<div><div class="success">Success!<p><tpl if="url">Type: {type}<br>ClickURL: {url}</div><center><br>{content}</center><tpl else>No Ads to display</tpl></p></div>'
        };        
    }

});    