(function () {

	try {
		/**
         *
         * Store used to hold IAM Message attachments
         *
         */

		Ext.define('SampleApp.store.Attachments', {
			extend: 'Ext.data.Store',
			config: {
				autoLoad: false,
				model: 'SampleApp.model.MessageContent'
			}

		});
	} catch (e) {
		// if we get here it is usually due to private browsing
		// turned on in iOS and local/session storage doesn't like that
	}
}());