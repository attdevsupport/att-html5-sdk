	function oAuth() {
		provider.isAuthorized({
			authScope : 'TL,MOBO,MIM',
			success : function() {
				start();
			},
			failure :  function() {
				provider.authorizeApp({
					authScope: "TL,MOBO,MIM",
					success: function() {
						start();
					},
					failure : function() {
						view.setMasked(false);
						Ext.Msg.alert('Access denied', 'User denied authorization');	
					},
					scope: "TL,MOBO,MIM"
				});
			},
			scope: "TL,MOBO,MIM"
		});
		stop();
	}