Ext.define('Att.AuthorizationSheet', {
    extend: 'Ext.Container',
    xtype: 'authorizationsheet',

    config: {
        src: null,
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        style: 'background-color: #ccc;',
 
        showAnimation: {
            type: 'slideIn',
            direction: 'up'
        },
        hideAnimation: {
            type: 'slideOut',
            direction: 'down'
        },
        masked: {
            xtype: 'loadmask',
            message: 'Loading...'
        }
    },

    updateSrc: function(src) {
        var me = this,
            iframe = me.iframe;

        if (src) {
            if (iframe) {
                iframe.dom.onload = Ext.Function.bind(me.onLoad, me);
                iframe.dom.src = src;

                window.addEventListener('message', Ext.Function.bind(me.onWindowMessage, me), false);
            }
        }
    },

    onLoad: function() {
        this.iframe.setStyle('height', '100%');
        this.setMasked(false);
    },

    onWindowMessage: function(event) {
        if (event.source !== window) {
            this.fireEvent('message', event.data);
        }
    },

    hide: function() {
        if (this.iframe) {
            this.iframe.destroy();
            delete this.iframe;
        }
        this.callParent(arguments);
    },

    initialize: function() {
        var src = this.getSrc();
        this.on({
            hide: 'onHide',
            scope: this
        });

        this.callParent();
        

        this.iframe = Ext.getBody().createChild({
            tag  : 'iframe',
            style: 'position: absolute; top:0; left:0; z-index: 999; border: 0; display: block; overflow: hidden; width: 100%; height: 0;'
        });;

        if (src) {
            this.updateSrc(src);
        }
    },

    onHide: function() {
        this.destroy();
    }
});