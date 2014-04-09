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
		this.cfg = SampleApp.Config;

		me.add([
            { xtype: 'att-header' },
			{ xtype: 'fieldset',
				title: 'Web gallery',
				items: [{
					xtype: 'container',
					padding: 15,
					items: [{
						xtype: 'container',
						html: '<h2>MMS photos sent to short code <b>' + this.cfg.shortCode + '</b><h2>'
					},{
						xtype: 'container',
						cls: 'imageContainer',
						height: 500,
						items: [{
							xtype: 'dataview',
							height: 500,
							store: 'Images',
							itemTpl: me.getTemplate()
						}]
					}]
				}]
			},
            { xtype: 'att-footer' }
		]);
	},
	getTemplate: function () {

		return new Ext.XTemplate(
			'<div class="imageItem">',
			'   <img src="' + this.cfg.galleryImagesFolder + '{image}"/> ',
			'	<div>',
			'       <p><span class="lbl">Sent from</span><span class="txt">{address}</span></p>',
			'       <p><span class="lbl">Date</span><span class="txt">{date:date("g:i A M d, Y ")}</span></p>',
			'		<p><span class="lbl">Message</span><span class="txt"><span class="txt">{textMessage}</p>',
			'	</div>',
			'</div>'
		);
	}
});