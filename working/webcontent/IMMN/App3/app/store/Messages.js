(function () {
	try {
		/**
         *
         * Store used to hold IAM Message model instances.
         *
         */
		Ext.define('SampleApp.store.Messages', {
			extend: 'Ext.data.Store',
			config: {
				autoLoad: false,
				model: 'SampleApp.model.Message'
			},
		});

	} catch (e) {
		// if we get here it is usually due to private browsing
		// turned on in iOS and local/session storage doesn't like that
	}
})();