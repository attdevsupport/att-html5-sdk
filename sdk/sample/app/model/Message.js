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
			{ name: 'isUnread' },
			{ name: 'selected' , defaultValue: false},
			{ name: 'messageId' },
            { name: 'from' },
            { name: 'recipients' },
            {
            	name: 'timeStamp',
            	sortType: Ext.data.SortTypes.asDate
            },
            { name: 'type' },
            { name: 'typeMetaData' },
            { name: 'isIncoming' },
            { name: 'mmsContent', model: 'SampleApp.model.MessageContent' },
			{ name: 'text' }
		]
	}
});


