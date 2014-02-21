/**
 *
 * User Interface for the MMS Gallery application.
 *
 */
Ext.define('SampleApp.view.mms.Gallery', {
	extend: 'Ext.Container',
	xtype: 'att-mms-gallery',

	requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'SampleApp.view.Header',
        'SampleApp.view.Footer',
        'SampleApp.Config'
	],

	config: {
		title: 'MMS Gallery',
		scrollable: 'vertical',
	},

	initialize: function () {
		var me = this;
		me.add([
            { xtype: 'att-header' },
            { xtype: 'container', id: "imageContainer" },
            { xtype: 'att-footer' }
		]);

		//me.loadStore = function(x,y,z) {
		//	alert("load store");
		//}
	},
	buildTpl: function () {
		var cfg = SampleApp.Config;
		return new Ext.XTemplate(
			'<div style="float:left; width: 270px; height: 400px; background-color: #333333;">',
			'  <img width="250px" style="max-height:300px" src="' + cfg.galleryImagesFolder + '{image}"/>',
			'  <p><b>Sent from:</b>{address}</p>',
			'  <p><b>On:</b> {date}</p>',
			'  <p>{textMessage}</p>',
			'</div>'
		);
	}
});