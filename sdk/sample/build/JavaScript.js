var attRoot = "c:\Users\geoffreys\Documents\GitHub\att-html5-sdk";
var samplesOutput = attRoot + "\packaged";
var samplesInput = attRoot + "\sdk\sampleNew";

var items = [

	{

		folder : samplesOutput + "\ADS\App1",
		copyFiles: [
			{
				file: samplesInput + "\app\controller\ads\Basic.js",
				toDir:"[folder]\app\controller\ads"
			},
			{
				file:samplesInput + "\app\view\ads\Basic.js",
				toDir:"[folder]\app\view\ads"
			},
			{
				file:samplesInput + "\standalone\ads\basic\app.js",
				toDir:"[folder]\app"
			}
		]
	
	},{
	
		folder: samplesOutput + "\CMS\App1",
		copyFiles: [
			{
				file:samplesInput + "\app\controller\cms\Basic.js",
				toDir:"[folder]\app\controller\cms"
			},
			{
				file:samplesInput + "\app\view\cms\Basic.js",
				toDir:"[folder]\app\view\cms"
			},
			{
				file:samplesInput + "\standalone\cms\basic\app.js",
				toDir:"[folder]\app"
			},
			{
				file:samplesInput + "\assets\data\cmsScripts",
				toDir:"[folder]\assets\data\cmsScripts",
			}
		]
	},{
		folder:	samplesOutput + "\SMS\App1",
		copyFiles: [{
			file: samplesInput + "\app\controller\sms\Basic.js",
			toDir: "[folder]\app\controller\sms"
		}]
	},{
	
		folder:	samplesOutput + "\SMS\App2", 

		copyFiles: [{
			file:samplesInput + "\app\model\Vote.js",
			toDir:"[folder]\app\model"
		},{
			file:samplesInput + "\app\store\Votes.js",
			toDir:"[folder]\app\store"
		},{
			file:samplesInput + "\app\controller\sms\Voting.js",
			toDir:"[folder]\app\controller\sms"
		},{
			file:samplesInput + "\app\view\sms\Voting.js",
			toDir:"[folder]\app\view\sms"
		},{
			file:samplesInput + "\standalone\sms\voting\app.js",
			toDir:"[folder]\app"
		}
		]
	},{
		folder:	samplesOutput + "\DC\App1",
		copyFiles: [
			{
				file:samplesInput + "\app\controller\device\Capabilities.js",
				toDir:"[folder]\app\controller\device"
			},
			{
				file:samplesInput + "\app\view\device\Capabilities.js",
				toDir:"[folder]\app\view\device"
			},
			{
				file:samplesInput + "\standalone\device\capabilities\app.js",
				toDir:"[folder]\app"
			}
		]
	},{
	
	
	folder:
		samplesOutput + "\TL\App1"
	,copyFiles: [
	
	{
		file:samplesInput + "\standalone\device\location\index.html",
		toDir:"[folder]",
		"-overwrite":"true"
	},
	{
		file:samplesInput + "\app\controller\device\Location.js",
		toDir:"[folder]\app\controller\device"
	},
	{
		file:samplesInput + "\app\view\device\Location.js",
		toDir:"[folder]\app\view\device"
	},
	{
		file:samplesInput + "\standalone\device\location\app.js",
		toDir:"[folder]\app"
	}
	]
},{
	folder:
		samplesOutput + "\MMS\App1"
,copyFiles: [

{
	file:samplesInput + "\app\controller\mms\Basic.js",
	toDir:"[folder]\app\controller\mms"
},
{
	file:samplesInput + "\app\view\mms\Basic.js",
	toDir:"[folder]\app\view\mms"
},
{
	file:samplesInput + "\standalone\mms\basic\app.js",
	toDir:"[folder]\app"
}
]
},
{
	"-name":"package-mms-coupon",
	"property":[
	{
		folder:
		samplesOutput + "\MMS\App2"
	},
	{
		docTitle:
		"MmsCouponApplication"
	}
	],
	"antcall":[
	{"-target":"add-common-files"},
	{"-target":"generate-docs"}
	],
	
{
	file:samplesInput + "\app\model\DeliveryInfo.js",
	toDir:"[folder]\app\model"
},
	{
		file:samplesInput + "\app\store\DeliveryInfos.js",
		toDir:"[folder]\app\store"
	},
	{
		file:samplesInput + "\app\controller\mms\Coupon.js",
		toDir:"[folder]\app\controller\mms"
	},
	{
		file:samplesInput + "\app\view\mms\Coupon.js",
		toDir:"[folder]\app\view\mms"
	},
	{
		file:samplesInput + "\standalone\mms\coupon\app.js",
		toDir:"[folder]\app"
	},
	{
		file:samplesInput + "\assets\data\phones.txt",
		toDir:"[folder]\assets\data"
	},
	{
		file:samplesInput + "\assets\data\message.txt",
		toDir:"[folder]\assets\data"
	},
	{
		file:samplesInput + "\assets\data\coupons\coupon.jpg",
		toDir:"[folder]\assets\data\coupons"
	}
]
},
{
	"-name":"package-mms-gallery",
	"property":[
	{
		folder:
		samplesOutput + "\MMS\App3"
	},
	{
		docTitle:
		"MmsGalleryApplication"
	}
	],
	"antcall":[
	{"-target":"add-common-files"},
	{"-target":"generate-docs"}
	],

	{
		file:samplesInput + "\app\model\Image.js",
		toDir:"[folder]\app\model"
	},
	{
		file:samplesInput + "\app\store\Images.js",
		toDir:"[folder]\app\store"
	},
	{
		file:samplesInput + "\app\view\mms\Gallery.js",
		toDir:"[folder]\app\view\mms"
	},
	{
		file:samplesInput + "\standalone\mms\gallery\app.js",
		toDir:"[folder]\app"
	},
	{
		toDir:"[folder]\assets\data\gallery",
		"fileset":{
			"-dir":samplesInput + "\assets\data\gallery"
		}
	},
	{
		file:samplesInput + "\assets\data\gallery.json",
		toDir:"[folder]\assets\data"
	}
]
},
{
	"-name":"package-wap-basic",
	"property":[
	{
		folder:
		samplesOutput + "\WAPPush\App1"
	},
	{
		docTitle:
		"WapBasicApplication"
	}
	],
	"antcall":[
	{"-target":"add-common-files"},
	{"-target":"generate-docs"}
	],
	
	{
		file:samplesInput + "\app\controller\wap\Basic.js",
		toDir:"[folder]\app\controller\wap"
	},
	{
		file:samplesInput + "\app\view\wap\Basic.js",
		toDir:"[folder]\app\view\wap"
	},
	{
		file:samplesInput + "\standalone\wap\basic\app.js",
		toDir:"[folder]\app"
	}
]
},
{
"-name":"package-payment-notary",
"property":[
{
	folder:
	samplesOutput + "\Payment\App1"
},
{
	docTitle:
	"NotaryApplication"
}
],
"antcall":[
{"-target":"add-common-files"},
{"-target":"generate-docs"}
],

{
	file:samplesInput + "\app\controller\payment\Notary.js",
	toDir:"[folder]\app\controller\payment"
},
{
	file:samplesInput + "\app\view\payment\Notary.js",
	toDir:"[folder]\app\view\payment"
},
{
	file:samplesInput + "\standalone\payment\notary\app.js",
	toDir:"[folder]\app"
}
]
},
{
	"-name":"package-payment-singlepay",
	"property":[
	{
		folder:
		samplesOutput + "\Payment\App2"
	},
	{
		docTitle:
		"SinglePaymentApplication"
	}
	],
	"antcall":[
	{"-target":"add-common-files"},
	{"-target":"generate-docs"}
	],
	
	{
		file:samplesInput + "\ux\ListWindow.js",
		toDir:"[folder]\ux"
	},
	{
		file:samplesInput + "\app\model\SinglePayTransaction.js",
		toDir:"[folder]\app\model"
	},
	{
		file:samplesInput + "\app\store\SinglePayTransactions.js",
		toDir:"[folder]\app\store"
	},
	{
		file:samplesInput + "\app\controller\payment\SinglePay.js",
		toDir:"[folder]\app\controller\payment"
	},
	{
		file:samplesInput + "\app\view\payment\SinglePay.js",
		toDir:"[folder]\app\view\payment"
	},
	{
		file:samplesInput + "\standalone\payment\singlepay\app.js",
		toDir:"[folder]\app"
	}
]
},
{
"-name":"package-payment-subscription",
"property":[
{
	folder:
	samplesOutput + "\Payment\App3"
},
{
	docTitle:
	"SubscriptionApplication"
}
],
"antcall":[
{"-target":"add-common-files"},
{"-target":"generate-docs"}
],

{
	file:samplesInput + "\ux\ListWindow.js",
	toDir:"[folder]\ux"
},
{
	file:samplesInput + "\app\model\SubscriptionTransaction.js",
	toDir:"[folder]\app\model"
},
{
	file:samplesInput + "\app\store\SubscriptionTransactions.js",
	toDir:"[folder]\app\store"
},
{
	file:samplesInput + "\app\controller\payment\Subscription.js",
	toDir:"[folder]\app\controller\payment"
},
{
	file:samplesInput + "\app\view\payment\Subscription.js",
	toDir:"[folder]\app\view\payment"
},
{
	file:samplesInput + "\standalone\payment\subscription\app.js",
	toDir:"[folder]\app"
}
]
},
{
	"-name":"package-speech-basic",
	"property":[
	{
		folder:
		samplesOutput + "\Speech\App1"
	},
	{
		docTitle:
		"SpeechToTextBasicApplication"
	}
	],
	"antcall":[
	{"-target":"add-common-files"},
	{"-target":"generate-docs"}
	],
	
	{
		file:samplesInput + "\app\model\SpeechFile.js",
		toDir:"[folder]\app\model"
	},
	{
		file:samplesInput + "\app\store\SpeechFiles.js",
		toDir:"[folder]\app\store"
	},
	{
		file:samplesInput + "\app\controller\speech\Basic.js",
		toDir:"[folder]\app\controller\speech"
	},
	{
		file:samplesInput + "\app\view\speech\Basic.js",
		toDir:"[folder]\app\view\speech"
	},
	{
		file:samplesInput + "\standalone\speech\basic\app.js",
		toDir:"[folder]\app"
	}
]
},
{
"-name":"package-speech-captured",
"property":[
{
	folder:
	samplesOutput + "\Speech\App2"
},
{
	docTitle:
	"SpeechToTextCapturedinBrowser"
}
],
"antcall":[
{"-target":"add-common-files"},
{"-target":"generate-docs"}
],

{
	file:samplesInput + "\standalone\speech\captured\index.html",
	toDir:"[folder]",
	"-overwrite":"true"
},
{
	file:samplesInput + "\app\controller\speech\Captured.js",
	toDir:"[folder]\app\controller\speech"
},
{
	file:samplesInput + "\app\view\speech\Captured.js",
	toDir:"[folder]\app\view\speech"
},
{
	file:samplesInput + "\standalone\speech\captured\app.js",
	toDir:"[folder]\app"
}
]
},
{
	"-name":"package-mobo-basic",
	"property":[
	{
		folder:
		samplesOutput + "\IMMN\App1"
	},
	{
		docTitle:
		"MoboBasicApplication"
	}
	],
	"antcall":[
	{"-target":"add-common-files"},
	{"-target":"generate-docs"}
	],
	
	{
		file:samplesInput + "\app\controller\mobo\Basic.js",
		toDir:"[folder]\app\controller\mobo"
	},
	{
		file:samplesInput + "\app\view\mobo\Basic.js",
		toDir:"[folder]\app\view\mobo"
	},
	{
		file:samplesInput + "\standalone\mobo\basic\app.js",
		toDir:"[folder]\app"
	}
]
},
{
"-name":"package-mim-basic",
"property":[
{
	folder:
	samplesOutput + "\IMMN\App2"
},
{
	docTitle:
	"MimBasicApplication"
}
],
"antcall":[
{"-target":"add-common-files"},
{"-target":"generate-docs"}
],

{
	file:samplesInput + "\app\model\MessageHeader.js",
	toDir:"[folder]\app\model"
},
{
	file:samplesInput + "\app\store\MessageHeaders.js",
	toDir:"[folder]\app\store"
},
{
	file:samplesInput + "\app\controller\mim\Basic.js",
	toDir:"[folder]\app\controller\mim"
},
{
	file:samplesInput + "\app\view\mim\Basic.js",
	toDir:"[folder]\app\view\mim"
},
{
	file:samplesInput + "\standalone\mim\basic\app.js",
	toDir:"[folder]\app"
}
]
},
{
	"-name":"add-common-files",
	
	{
		file:samplesInput + "\.senchasdk",
		toDir:"[folder]"
	},
	{
		file:samplesInput + "\standalone\common\index.html",
		toDir:"[folder]"
	},
	{
		file:samplesInput + "\standalone\common\app.json",
		toDir:"[folder]"
	},
	{
		file:samplesInput + "\app\Config.js",
		toDir:"[folder]\app"
	},
	{
		toDir:"[folder]\attlib",
		"fileset":{
			"-dir":samplesInput + "\attlib"
		}
	},
	{
		file:samplesInput + "\app\view\Header.js",
		toDir:"[folder]\app\view"
	},
	{
		file:samplesInput + "\app\view\Footer.js",
		toDir:"[folder]\app\view"
	}
]
},
{
"-name":"generate-docs",
"property":{
	"-name":"doc-src",
	samplesInput + "\doc_src"
},
"exec":{
	"-executable":"jsduck",
	"-dir":".",
	"arg":[
	{
		"[folder]\app"
		},
	{
		"--output=${folder}\docs"
		},
	{
		"--eg-iframe=${doc-src}\inline-eg.html"
		},
	{
		"--images=${doc-src}"
		},
	{
		"--title=${doc-title}"
		},
	{"--warnings=-all"},
	{
		"--categories=${doc-src}\class-categories.json"
		},
	{
		"--welcome=${doc-src}\welcome.html"
		},
	{
		"--tags=${doc-src}\custom-tags\beta.rb"
		}
	]
}
}
]
}
}
