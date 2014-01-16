/**
 * The Speech view exercises the speechToText API Call.
 */
Ext.define('MyApp.view.Main', {
    extend : 'Ext.Container',
    xtype  : 'speech-view',
    
    requires : [
        'Ext.form.Panel',
        'Ext.Toolbar',
        'Ext.form.FieldSet',
        'Ext.field.Select'
    ],
    
    config : {

        items : [
            /**
             * Toolbar to display a nice title
             */     
            {
                xtype  : 'toolbar',
                title  : 'Speech Example',
                docked : 'top'
            },
            /**
             * The form panel we use to get the user selected file.
             */
            {
                xtype  : 'formpanel',
                scrollable : false,
                items  : [
                    {
                        xtype : 'fieldset',
                        title: 'Audio File',
                        items : [
                            {
                                xtype: 'selectfield',
                                label: 'Choose File',
                                name : 'file',
                                options: [
                                    {text: 'Bananas.wav',  value: 'Bananas.wav'},
                                    {text: 'Starbucks.wav',  value: 'Starbucks.wav'}
                                ]
                            } 
                        ] 
                    }
                ]
            },
            /**
             * Button to submit the speech to text 
             */
            {
                xtype  : 'button',
                action : 'speechtotext',
                text   : 'Speech to Text'
            }
        ]
        
    }
        
});

