/**
 *
 * Model used in the IAM app for MessageContent
 *
 */

Ext.define('SampleApp.model.MessageContent', {
	extend: 'Ext.data.Model',
	config: {
		/**
         * The fields that make up this Model
         */
		fields: [
			{ name: 'contentType' },
            { name: 'contentName' },
            { name: 'contentUrl' },
            { name: 'type' },
			{ name: 'content' },
			{ name: 'hasContent' }
		]
	}
});

/**
 *
 * Model used in the IAM app for Messages
 *
 */
Ext.define('SampleApp.model.Message', {
	extend: 'Ext.data.Model',

	config: {
		/**
         * The fields that make up this Model
         */
		idProperty: 'messageId',
		fields: [
			{ name: 'index' },
			{ name: 'isUnread' },
			{ name: 'selected' , defaultValue: false},
			{ name: 'messageId' },
            { name: 'from' },
            { name: 'recipients' },
            { name: 'timeStamp' },
            { name: 'type' },
            { name: 'typeMetaData' },
            { name: 'isIncoming' },
            { name: 'mmsContent', model: 'SampleApp.model.MessageContent' },
			{ name: 'text' }
		]
	}
});


