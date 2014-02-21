/**
 *
 * Controller that interacts with the Gallery MMS application.
 */
Ext.define('SampleApp.controller.mms.Gallery', {
	extend: 'Ext.app.Controller',
    
	requires:[
        'Att.ApiResults',
        'SampleApp.Config',
	],

	config: {
		provider: undefined,
		refs: {
			imageContainer: 'container[id=imageContainer]'
		}
	},
	launch: function () {
		
		this.imageContainer = this.getImageContainer();
	}
});


alert("i wuz here");
