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
				model: 'SampleApp.model.Message',
				listeners: {
					load: function (store, records, successful, operation, eOpts) {
						store.each(function (record, index) {
							var mmsContent = record.get('mmsContent');
							if (mmsContent != null) {
								mmsContent.forEach(function (contentItem, contentIndex) {
									contentItem.hasContent = (typeof contentItem.content != "undefined");
									contentItem.partNum = contentIndex;
									switch (contentItem.type) {
										case "SMIL":
										case "TEXT":
											contentItem.isTextType = true;
											break;
										case "IMAGE":
										default:
											contentItem.isTextType = false;
											break;
									}
								});
								record.set("msContent", mmsContent);
							}
						},
						  store
						);
					}
				}
			}
		});

	} catch (e) {
		// if we get here it is usually due to private browsing
		// turned on in iOS and local/session storage doesn't like that
	}
})();