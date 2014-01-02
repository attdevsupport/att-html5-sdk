/**
 * The MOBO view exercises the Message on behalf of API.
 * This view allows the user to send messages SMS or MMS with only text or attachments to other phone numbers, emails or even shortcodes.
 *  
 */
Ext.define('KitchenSink.view.MOBO', {
	extend: 'Ext.Container',
	xtype: 'mobo',

	requires: [ 
		'Ext.field.Text',
		'Ext.field.TextArea',
		'Ext.field.Checkbox'
	],

	config: {
	   	title: 'MOBO',

	   	layout: {
	   	  	type: 'vbox',
	   	  	align: 'center',
	   		pack: 'center'
	   	},

	   	items: [{
	   	  	xtype: 'container',
	   	  	width: '80%',
	        name: 'page',
	        hidden: true,
	   	  	items: [{
		   	  	xtype: 'fieldset',
		   	  	title: 'Feature 1: Send Message',
	   		  	defaults: {
            	 	labelWidth: 120
	   	  	  	},
	   	  		items: [{
	   	  			xtype: 'textfield',
	   	  			name: 'moboAddresses',
	   	  			label: 'Address(es)'	   	  		
	   	  		}, {
	   	  			xtype: 'textfield',
	   	  			name: 'moboSubject',
	   	  			label: 'Subject'
	   	  		}, {
	   	  			xtype: 'textareafield',
	   	  			name: 'moboMessage',
	   	  			label: 'Message',
	   	  			height: 200
	   	  		}, {
	   	  			xtype: 'checkboxfield',
	   	  			name: 'moboGroup',
	   	  			label: 'Group',
	   	  			value: true,
	   	  			checked: false
	   	  		}]
	   	  }, {
	   	  	xtype: 'button',
	   	  	text: 'Send Message',
	   	  	action: 'sendmobo'
	   	  }]
	   	}],

		control: {
			'button[action=sendmobo]': {
				tap: 'onSendMobo'
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
     * Will gather the information abour addresses, subject, message, group and attahcments and fire an event with the form data
     */
	onSendMobo: function() {
		var moboAddresses = this.down('textfield[name=moboAddresses]'),
            moboSubject = this.down('textfield[name=moboSubject]'),
            moboMessage = this.down('textareafield[name=moboMessage]'),
            moboGroup = this.down('checkboxfield[name=moboGroup]');

        this.fireEvent('apicall', this, {
            method: 'sendMobo',
            address: moboAddresses.getValue(),
            subject: moboSubject.getValue(),
            message: moboMessage.getValue(),
            group: moboGroup.isChecked(),
            files: ['sencha.jpg'],
            success: function(data) {
//                statusButton.enable();
            },
            failure: function(data) {
//                this.setSmsId(null);
//                statusButton.disable();
            },
            scope: this
        });
	}
});
