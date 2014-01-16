/**
 * The MIM view exercises the MIM API (My Messages). This view allows the user to enter a wireless number associated with their account and 
 * retrieve SMS and MMS message headers and contents. Only devices attached to their account can be entered. Any other number will generate an error.
 */
Ext.define('KitchenSink.view.MIM', {
	extend: 'Ext.Panel',
	xtype: 'mim',

	config: {
		/**
		 * @cfg 
		 * Number of messages to retreive from API
		 */
        headerCount: 25,
        /**
         * @cfg {string} 
         *
         * Placeholder for the indexCursor (pointer) of the start of the next set of messages to retrieve. When retrieving message headers from the ATT API,
         * the indexCursor of the next available message is also returned. This value needs to be stored and used for the starting point of the next batch of
         * messages retrieved from the ATT API.
         */
        indexCursor: 0,

	   	title: 'MIM',
   
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },

        items: [{
            xtype: 'container',
            hidden: true,
            name: 'page',
            width: '80%',
            
            items:[{
                xtype: 'fieldset',
                title: 'Get Messages Headers',
                defaults: {
                    labelWidth: 120
                },
                items: [{
                    xtype: 'textfield',
                    label: 'Header Count',
                    name: 'headerCount',
                    value: 25
                }, {
                    xtype: 'textfield',
                    label: 'Index Cursor',
                    name: 'indexCursor',
                    value: 0
                }, {
                    xtype: 'button',
                    text: 'Get Message Headers',
                    action: 'getmessageheaders'
                }]
            },{
                xtype: 'fieldset',
                title: 'Get Message Content',
                defaults: {
                    labelWidth: 120
                },
                items: [{
                    xtype: 'textfield',
                    label: 'Message Id',
                    name: 'messageId'
                }, {
                    xtype: 'textfield',
                    label: 'Message Part',
                    name: 'messagePart'
                }, {
                    xtype: 'button',
                    text: 'Get Message Content',
                    action: 'getmessagecontent'
                }]
            }, {
                xtype: 'fieldset',
                title: 'Content URL',
                items: [{
                    xtype   : 'container',
                    name    : 'contentUrl',
                    tpl     : '<tpl if="url"><a href="{url}">{url}</a></tpl>'
                }]
            }],

        }],
	   	control: {
	   		'button[action=getmessageheaders]': {
	   			tap: 'onGetMessageHeaders'
	   		},
	   		'button[action=getmessagecontent]': {
                tap: 'onGetMessageContent'
            }
	   	}
	},

	 //override
    initialize: function() {
        this.callParent();
        this.fireAction('checkauthorization', [this, null], 'afterAuthorize');
    },

    /**
     * @private
     */
    afterAuthorize: function() {
        this.down('container[name=page]').show();
    },
	
	/**
	 *
	 */
	onGetMessageHeaders: function() {
        var me = this,
            hc = me.down('textfield[name=headerCount]').getValue();

 	    this.fireEvent('apicall', this, {
            method: 'getMessageHeaders',
            headerCount: hc,
            indexCursor: this.getIndexCursor(),
            success: function(data) {
            	this.setIndexCursor(data.IndexCursor);
            	// fill message template here.
            },
            failure: function(data) {
                this.setIndexCursor(null);
//                statusButton.disable();
            },
            scope: this
        });

	},
	
    onGetMessageContent: function() {
        var me  = this,
            messageId = me.down('textfield[name=messageId]').getValue(),
            partNumber = me.down('textfield[name=messagePart]').getValue(),
            contentUrl = me.down('container[name=contentUrl]');

        if (! messageId) {
            Ext.Msg.alert('Note', 'Missing Message ID');
            return;
        }

        if (! partNumber) {
            Ext.Msg.alert('Note', 'Missing Part Number');
            return;
        }
        contentUrl.setData({
            url: "/att/content?messageId=" + messageId + "&partNumber=" + partNumber
//            name: parts[partNumber].ContentName
        });
        
        contentUrl.show();	           
    } 
});
