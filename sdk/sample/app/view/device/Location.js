/**
 *
 * User Interface for the Terminal Location (TL) application.
 *
 */
Ext.define('SampleApp.view.device.Location', {
    extend: 'Ext.Container',
    xtype: 'att-device-tl',
   
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.field.Radio',
        'SampleApp.view.Header',
        'SampleApp.view.Footer',
        'SampleApp.Config',
        'Ext.Map'
    ],
   
    config: {
        title: 'Device Location',
        layout: 'card'
    },
    
    _mapMarker: null,
    
    //override
    initialize: function() {
        var me = this;
        
        me.add([{
            itemId: 'locationForm',
            scrollable: 'vertical',
            defaults: {scrollable: false},
            items:[
                {xtype: 'att-header'},
                me.buildLocationForm(),
                {xtype: 'att-footer'}
            ]
        },{
            itemId: 'mapContainer',
            defaults: {scrollable: false},
            layout : 'fit',
            items:[
              {
                  xtype : 'toolbar',
                  docked: 'bottom',
                  items : [
                    { 
                        xtype  : 'button',
                        action : 'showform',
                        ui     : 'back',
                        text   : 'done'
                    }
                  ]
              },{
                  xtype: 'map'
              }
            ]

        }]);
    },
    
    /**
     * Builds the UI components for Feature 1: Map of Device Location.
     */
    buildLocationForm: function() {
        return {
            xtype   : 'formpanel',
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Feature 1: Map of Device Location',
                    defaults : {
                        labelWidth : '40%'
                    },
                    items : [
                        {
                            xtype    : 'fieldset',
                            title    : 'Requested Accuracy',
                            defaults : {
                                xtype : 'radiofield',
                                labelWidth : '80%'
                            },
                            items   : [
                                {
                                    name    : 'requestedAccuracy',
                                    value   : 150,
                                    label   : '150m'
                                },
                                {
                                    name    : 'requestedAccuracy',
                                    value   : 1000,
                                    checked : true,
                                    label   : '1,000m'
                                },
                                {
                                    name    : 'requestedAccuracy',
                                    value   : 10000,
                                    label   : '10,000m'
                                }
                            ]
                        },
                        {
                            xtype    : 'fieldset',
                            title    : 'Acceptable Accuracy',
                            defaults : {
                                xtype : 'radiofield',
                                labelWidth : '80%'
                            },
                            items   : [
                                {
                                    name    : 'acceptableAccuracy',
                                    value   : 150,
                                    label   : '150m'
                                },
                                {
                                    name    : 'acceptableAccuracy',
                                    value   : 1000,
                                    label   : '1,000m'
                                },
                                {
                                    name    : 'acceptableAccuracy',
                                    value   : 10000,
                                    checked : true,
                                    label   : '10,000m'
                                }
                            ]
                        },
                        {
                            xtype    : 'fieldset',
                            title    : 'Delay Tolerance',
                            defaults : {
                                xtype : 'radiofield',
                                labelWidth : '80%'
                            },
                            items   : [
                                {
                                    name    : 'delayTolerance',
                                    value   : 'NoDelay',
                                    label   : 'No Delay'
                                },
                                {
                                    name    : 'delayTolerance',
                                    value   : 'LowDelay',
                                    checked : true,
                                    label   : 'Low Delay'
                                },
                                {
                                    name    : 'delayTolerance',
                                    value   : 'DelayTolerant',
                                    label   : 'Delay Tolerant'
                                }
                            ]
                        },{
                            xtype   : 'button',
                            ui      : 'action',
                            action  : 'showlocation',
                            text    : 'Get Phone Location'
                        }
                    ]
                }
                
            ]
        };
    },
    
    
    /**
     * Sets the location on the map component and creates the marker to display it.
     * @param location {Object} Geo reference point composed as:
     *  @param location.latitude {Number} latitude
     *  @param location.longitude {Number} longitude
     */
    setMapLocation: function(location) {
        var me = this,
            map = me.down('map').getMap(),
            position = new google.maps.LatLng(location.latitude, location.longitude);
        
        if (!me._mapMarker) {
            me._mapMarker = new google.maps.Marker({
                position: position,
                map: map
            });
        }else{
            me._mapMarker.setPosition(position);
        }
        
        map.setCenter(position);
    }        
});