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
			{ name: 'isTextType' },
            { name: 'contentName' },
            { name: 'contentUrl' },
            { name: 'type' },
			{ name: 'content' },
			{ name: 'hasContent' }
		]
	}
});
