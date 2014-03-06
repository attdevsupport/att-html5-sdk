/**
 *
 * Model used in the IAM app.
 *
 */
Ext.define('SampleApp.model.Message', {
	extend: 'Ext.data.Model',

	config: {
		/**
         * The fields that make up this Model
         */
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
            { name: 'mmsContent' },
			{ name: 'text' }
		]
	}
});
