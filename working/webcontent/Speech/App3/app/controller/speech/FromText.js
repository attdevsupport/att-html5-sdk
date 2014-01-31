/**
 * Controller that interacts with the Basic Speech to Text application.
 */
Ext.define('SampleApp.controller.speech.FromText', {
	extend: 'Ext.app.Controller',

	requires: [
		'Att.Provider',
		'Att.ApiResults',
		'SampleApp.Config'
	],

	config: {
		provider: undefined,
		refs: {
			view: 'att-speech-fromtext',
			buttonSubmit: 'button[action=submitText]'
		},
		control: {
			'button[action=submitText]'	:	{'tap': 'onSubmitText'	},
			
		}
	},
	launch: function () {
		
	},
	onSubmitText: function () {
		//var me = this;
		//me.recorder.exportWAV(function (blob) {
		//	AttApiClient.speechToText(
		//		blob,
		//		function (response) {
		//			displayResponse(true, response);
		//		},
		//		function (error) {
		//			displayResponse(false, error);
		//		}
		//	);
		//});
		//function displayResponse(success, response) {
		//	var p = document.createElement("p");
		//	p.innerText = JSON.stringify(response);
		//	p.className = success ? "success" : "error";
		//	me.responseWindow.innerHTML = "";
		//	me.responseWindow.appendChild(p);
		//}
	},
});