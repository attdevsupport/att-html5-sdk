(function () {
	try {
		/**
         *
         * Store used to hold MIM Message Headers model instances.
         *
         */
		Ext.define('SampleApp.store.Messages', {
			extend: 'Ext.data.Store',
			requires: ['Ext.data.proxy.LocalStorage'],
			config: {
				fields: ['isUnread', 'messageId', 'from', 'recipients', 'timeStamp', 'type', 'typeMetaData', 'isIncoming', 'mmsContent'],
				autoLoad: true,
				data: [{
					"messageId": "WU124",
					"from": { "value": "+12065551212" },
					"recipients": [{
						"value": "+14255551212"
					}, {
						"value": "someone@att.com"
					}, {
						"value": "+14255551111"
					}, {
						"value": "someoneElse@att.com"
					}],
					"timeStamp": "2012-01-14T12:00:00",
					"isUnread": false,
					"type": "MMS",
					"typeMetaData": {
						"subject": "This is an MMS message with parts"
					},
					"isIncoming": false,
					"mmsContent": [{
						"contentType": "text/plain",
						"contentName": "part1.txt",
						"contentUrl": "/myMessages/v2/messages/0",
						"type": "TEXT"
					}, {
						"contentType": "image/jpeg",
						"contentName": "sunset.jpg",
						"contentUrl": "/myMessages/v2/messages/1",
						"type": "IMAGE"
					}]
				},
				{
					"messageId": "WU3124",
					"from": { "value": "+12065551212" },
					"recipients": [{
						"value": "+14255551212"
					}, {
						"value": "someone@att.com"
					}],
					"timeStamp": "2012-01-14T12:00:00",
					"isUnread": true,
					"type": "MMS",
					"typeMetaData": {
						"subject": "This is an MMS message with parts"
					},
					"isIncoming": false,
					"mmsContent": [{
						"contentType": "text/plain",
						"contentName": "part1.txt",
						"contentUrl": "/myMessages/v2/messages/0",
						"type": "TEXT"
					}, {
						"contentType": "image/jpeg",
						"contentName": "sunset.jpg",
						"contentUrl": "/myMessages/v2/messages/1",
						"type": "IMAGE"
					}, {
						"contentType": "image/jpeg",
						"contentName": "yadda.jpg",
						"contentUrl": "/myMessages/v2/messages/1",
						"type": "IMAGE"
					}]
				}]
			},
		});

	} catch (e) {
		// if we get here it is usually due to private browsing
		// turned on in iOS and local/session storage doesn't like that
	}
})();