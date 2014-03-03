/**
 *
 * Model used in the MIM app.
 *
 */
Ext.define('SampleApp.model.Messages', {
	extend: 'Ext.data.Model',

	config: {
		/**
         * The fields that make up this Model
         */
		fields: [
			{ name: 'isUnread' },
			{ name: 'messageId' },
            { name: 'from' },
            { name: 'recipients' },
            { name: 'timeStamp' },
            { name: 'type' },
            { name: 'typeMetaData' },
            { name: 'isIncoming' },
            { name: 'mmsContent' }
		]
	}
});
