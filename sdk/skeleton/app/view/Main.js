Ext.define("MyApp.view.Main", {
    extend: 'Ext.tab.Panel',
    requires: [
        'Ext.TitleBar',
        'Ext.Video'
    ],
    config: {
        tabBarPosition: 'bottom',
        fullscreen: true,

        items: [
            {
                title: 'Welcome',
                iconCls: 'home',

                styleHtmlContent: true,
                scrollable: true,

                items: {
                    docked: 'top',
                    xtype: 'titlebar',
                    title: 'Sencha Touch 2 AT&T SDK'
                },

                html: [
                    "<P>",
                    "This is a skeleton Sencha Touch 2 project which has been pre-configured with the ",
                    "AT&T HTML5 SDK. The appropriate include files have already been added to this application's ",
                    "main <a target='_blank' href=\"app/controller/Main.js\">controller</a>.",
                    "</P>",
                    "<P>",
                    "What you're looking at right now is the contents of <a target='_blank' href=\"app/view/Main.js\">app/view/Main.js</a> - edit that file ",
                    "and refresh to change what's rendered here.",
                    "</P>",
                    "<P>",
                    "Please ensure that you properly configure your server of choice (PHP, Java or Ruby) so that the Provider API may ",
                    "communicate with the AT&T APIs. More information about configuring your servers and your application can be found ",
                    "in the SDK documentation."
                ].join("")
            },
            {
                title: 'Get Started',
                iconCls: 'action',

                items: [
                    {
                        docked: 'top',
                        xtype: 'titlebar',
                        title: 'Getting Started'
                    },
                    {
                        xtype: 'video',
                        url: 'http://av.vimeo.com/64284/137/87347327.mp4?token=1330978144_f9b698fea38cd408d52a2393240c896c',
                        posterUrl: 'http://b.vimeocdn.com/ts/261/062/261062119_640.jpg'
                    
                    }
                ]
            }
        ]
    }
});
