@echo off
cls
cd ..\..
set ContextDir=%CD%

cd sdk\copyBack

set working=working
set createMode=t

set pathA=%contextDir%\%working%\webcontent\lib
set pathB=%contextDir%\sdk\sampleCopy\lib

call copyFileForward "%pathA%" "%pathB%" att-api-client.js /d
call copyFileForward "%pathA%" "%pathB%" recorder.js /d
call copyFileForward "%pathA%" "%pathB%" recorderWorker.js /d
call copyFileForward "%pathA%" "%pathB%" dependencies.js /d
call copyFileForward "%pathA%" "%contextDir%\sdk\sampleCopy\resources\css" att.css /d

call copyFileForward "%contextDir%\%working%\webcontent" "%contextDir%\sdk\sampleCopy\standalone" index.html /d

set appName=SMS
set app=App1
call copyHeaderFooter
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\controller\sms app\controller\sms Basic.js
call copyForwardSub app\view\sms app\view\sms Basic.js
call copyForwardSub app standalone\sms\basic app.js

set app=App2
call copyHeaderFooter
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\model app\model Vote.js
call copyForwardSub app\store app\store Votes.js
call copyForwardSub app\controller\sms app\controller\sms Voting.js
call copyForwardSub app\view\sms app\view\sms Voting.js
call copyForwardSub app standalone\sms\voting app.js

set appName=DC
set app=App1
call copyHeaderFooter
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\controller\device app\controller\device Capabilities.js
call copyForwardSub app\view\device app\view\device Capabilities.js
call copyForwardSub app standalone\device\capabilities app.js

set appName=MMS
set app=App1
call copyHeaderFooter
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\controller\mms app\controller\mms Basic.js
call copyForwardSub app\view\mms app\view\mms Basic.js
call copyForwardSub app standalone\mms\basic app.js

set app=App2
call copyHeaderFooter
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\model app\model DeliveryInfo.js
call copyForwardSub app\store app\store DeliveryInfos.js
call copyForwardSub app\controller\mms app\controller\mms Coupon.js
call copyForwardSub app\view\mms app\view\mms Coupon.js
call copyForwardSub app standalone\mms\coupon app.js
call copyForwardSub assets\data assets\data phones.txt
call copyForwardSub assets\data assets\data message.txt
call copyForwardSub assets\data\coupons assets\data\coupons coupon.jpg

set app=App3
call copyHeaderFooter
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\model app\model Image.js
call copyForwardSub app\store app\store Images.js
call copyForwardSub app\view\mms app\view\mms Gallery.js
call copyForwardSub app standalone\mms\gallery app.js
call copyForwardSub assets\data\gallery\MoMmsImages assets\data\gallery\MoMmsImages *.*
call copyForwardSub assets\data assets\data gallery.json

set appName=Payment
set app=App1
call copyHeaderFooter
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\controller\payment app\controller\payment Notary.js
call copyForwardSub app\view\payment app\view\payment Notary.js
call copyForwardSub app standalone\payment\notary app.js

set app=App2
call copyHeaderFooter
call copyForwardSub \r standalone\payment\singlepay index.html
call copyForwardSub ux ux ListWindow.js
call copyForwardSub app\model app\model SinglePayTransaction.js
call copyForwardSub app\store app\store SinglePayTransactions.js
call copyForwardSub app\controller\payment app\controller\payment SinglePay.js
call copyForwardSub app\view\payment app\view\payment SinglePay.js
call copyForwardSub app standalone\payment\singlepay app.js

set app=App3
call copyHeaderFooter
call copyForwardSub \r standalone\payment\subscription index.html
call copyForwardSub \r standalone\common index.html
call copyForwardSub ux ux ListWindow.js
call copyForwardSub app\model app\model SubscriptionTransaction.js
call copyForwardSub app\store app\store SubscriptionTransactions.js
call copyForwardSub app\controller\payment app\controller\payment Subscription.js
call copyForwardSub app\view\payment app\view\payment Subscription.js
call copyForwardSub \r standalone\payment\subscription app.js

set appName=Speech
set app=App1
call copyHeaderFooter
call copyForwardSub \r standalone\speech\basic index.html
call copyForwardSub app\model app\model SpeechFile.js
call copyForwardSub app\store app\store SpeechFiles.js
call copyForwardSub app\controller\speech app\controller\speech Basic.js
call copyForwardSub app\view\speech app\view\speech Basic.js
call copyForwardSub app standalone\speech\basic app.js

set app=App2
call copyHeaderFooter
call copyForwardSub \r standalone\speech\captured index.html
call copyForwardSub app\controller\speech app\controller\speech Captured.js
call copyForwardSub app\view\speech app\view\speech Captured.js
call copyForwardSub app standalone\speech\captured app.js

set app=App3
call copyHeaderFooter
call copyForwardSub \r standalone\speech\FromText index.html
call copyForwardSub app\controller\speech app\controller\speech FromText.js
call copyForwardSub app\view\speech app\view\speech FromText.js
call copyForwardSub app standalone\speech\fromtext app.js

set appName=IMMN
set app=App1
call copyHeaderFooter
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\controller\mobo app\controller\mobo Basic.js
call copyForwardSub app\view\mobo app\view\mobo Basic.js
call copyForwardSub app standalone\mobo app.js

set app=App2
call copyHeaderFooter
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\model app\model MessageHeader.js
call copyForwardSub app\store app\store MessageHeaders.js
call copyForwardSub app\controller\mim app\controller\mim Basic.js
call copyForwardSub app\view\mim app\view\mim Basic.js
call copyForwardSub app standalone\mim app.js

set app=App3
call copyHeaderFooter
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\model app\model Message.js
call copyForwardSub app\store app\store Messages.js
call copyForwardSub app\controller\iam app\controller\iam IamExample.js
call copyForwardSub app\view\iam app\view\iam IamExample.js
call copyForwardSub app standalone\iam app.js


