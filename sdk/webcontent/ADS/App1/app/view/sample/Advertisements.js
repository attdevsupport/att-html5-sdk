/**
 *
 * User Interface for the Advertisements (ADS) application.
 *
 */
Ext.define('SampleApp.view.sample.Advertisements', {
    extend: 'Ext.Container',
    xtype: 'att-sample-ads',

    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'SampleApp.view.Header',
        'SampleApp.view.Footer'
    ],

    config: {
        title: 'Advertisements',
        scrollable: 'vertical',
        defaults: {
            scrollable: null
        }
    },

    //override
    initialize: function () {
        var me = this;

        me.add([
            { xtype: 'att-header' },
            me.buildForm(),
            { xtype: 'att-footer' }
        ]);

    },

    /**
     * Builds the UI components for Feature 1: Get Advertisement.
     */
    buildForm: function () {
        return {
            xtype: 'formpanel',
            items: [{
            xtype: 'fieldset',
            title: 'Get Advertisement',
            defaults: {
                labelWidth: '35%'
            },
            items: [{
                xtype: 'selectfield',
                label: 'Category',
                labelWidth: 110,
                name: 'categoryPicker',
                id: 'dataCategory',
                value: 15,
                cls: 'smallerSelect',
                labelCls: 'smallerLabel',
                options: [
                    { text: 'auto', value: 'auto' },
                    { text: 'finance', value: 'finance' },
                    { text: 'games', value: 'games' },
                    { text: 'health', value: 'health' },
                    { text: 'music', value: 'music' },
                    { text: 'tv', value: 'tv' },
                    { text: 'movies', value: 'movies' },
                    { text: 'news', value: 'news' },
                    { text: 'shopping', value: 'shopping' },
                    { text: 'travel', value: 'travel' },
                    { text: 'other', value: 'other' }
                ]
            }, {
                xtype: 'selectfield',
                label: 'User-Agent',
                labelWidth: 110,
                id: 'dataUserAgent',
                name: 'userAgentPicker',
                value: 15,
                cls: 'smallerSelect',
                labelCls: 'smallerLabel',
                options: [
                    { text: 'Desktop Chrome', value: 'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36' },
                    { text: 'Android Webkit', value: 'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30' },
                    { text: 'Android chrome', value: 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19' },
                    { text: 'iPhone Safari', value: 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543 Safari/419.3' }
                ]
            }, {
                xtype: 'selectfield',
                label: 'Age Group',
                labelWidth: 110,
                id: 'dataAgeGroup',
                name: 'ageGroupPicker',
                value: 15,
                cls: 'smallerSelect',
                labelCls: 'smallerLabel',
                options: [
                    { text: '14-25', value: '14-25' },
                    { text: '26-35', value: '26-35' },
                    { text: '36-55', value: '36-55' },
                    { text: '56-100', value: '56-100' }
                ]
            }, {
                xtype: 'selectfield',
                label: 'Gender',
                labelWidth: 110,
                id: 'dataGender',
                name: 'genderPicker',
                value: 'F',
                cls: 'smallerSelect',
                labelCls: 'smallerLabel',
                options: [
                    { text: 'Female', value: 'F' },
                    { text: 'Male', value: 'M' }
                ]
            }, {
                xtype: 'button',
                id: 'btnAdShow',
                ui: 'action',
                action: 'showad',
                text: 'Get Advertisement'
            },
            {
                xtype: 'image',
                id: 'adImage',
                height: '50px'
            },
            {
                xtype: 'textfield',
                id: 'adFail',
                text: 'Hello',
                margin: '0 0 0 10'
            }]}]
        };
    }
});
