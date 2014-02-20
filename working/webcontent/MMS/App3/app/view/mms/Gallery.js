/**
 *
 * User Interface for the MMS Gallery application.
 *
 */
Ext.define('SampleApp.view.mms.Gallery', {
    extend: 'Ext.Container',
    xtype: 'att-mms-gallery',
    
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'SampleApp.view.Header',
        'SampleApp.view.Footer',
        'SampleApp.Config'
    ],
    
    config: {
        title: 'MMS Gallery',
        scrollable: 'vertical',
        defaults: {scrollable: null}
    },
    
    initialize: function() {
        var me = this;
        me.add([
            {xtype: 'att-header'},
            me.buildGallery(),
            {xtype: 'att-footer'}
        ]);
    },
    
    /**
     * Builds the UI components for Feature 1: Web gallery of MMS photos sent to short code.
     */
    buildGallery: function() {
        var me = this,
            cfg = SampleApp.Config;
    
        return {
        	xtype: 'formpanel',
        	maxWidth: 1000,
            items   : [
                {
                    xtype    : 'fieldset',
                    title: 'Web gallery',
                    instructions: {
                        title : 'MMS photos sent to short code '+ cfg.shortCode,
                        docked: 'top'
                    },
                    items : [
                        {
                        	xtype            : 'list',
                        	disableSelection: true,
                        	height: 500,
                        	maxWidth: '100%',
                            scrollable       : true,
                            itemTpl          : me.buildTpl(),
                            store            : 'Images'
                        }
                    ]
                }
            ]
        };
    },
    
    /**
     * Builds a custom Ext.XTemplate to show the gallery data.
     *
     */
    buildTpl: function() {
        var cfg = SampleApp.Config;

        return new Ext.XTemplate(
            '<div>',
            '  <img width="250px" src="' + cfg.galleryImagesFolder + '{image}"/>',
            '</div>',
            '<div><b>Sent from: </b>{address}</div>',
            '<div><b>On: </b>{date}</div>',
            '<div>{textMessage}</div>'
        );
    }
});