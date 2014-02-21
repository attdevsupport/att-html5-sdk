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
call copyforwardSub \r standalone\common index.html
call copyforwardSub app\controller\sms app\controller\sms Basic.js
call copyforwardSub app\view\sms app\view\sms Basic.js
call copyforwardSub app standalone\sms\basic app.js

set app=App2
call copyHeaderFooter
call copyforwardSub \r standalone\common index.html
call copyforwardSub app\model app\model Vote.js
call copyforwardSub app\store app\store Votes.js
call copyforwardSub app\controller\sms app\controller\sms Voting.js
call copyforwardSub app\view\sms app\view\sms Voting.js
call copyforwardSub app standalone\sms\voting app.js

set appName=DC
set app=App1
call copyHeaderFooter
call copyforwardSub \r standalone\common index.html
call copyforwardSub app\controller\device app\controller\device Capabilities.js
call copyforwardSub app\view\device app\view\device Capabilities.js
call copyforwardSub app standalone\device\capabilities app.js

set appName=MMS
set app=App1
call copyHeaderFooter
call copyforwardSub \r standalone\common index.html
call copyforwardSub app\controller\mms app\controller\mms Basic.js
call copyforwardSub app\view\mms app\view\mms Basic.js
call copyforwardSub app standalone\mms\basic app.js

set app=App2
call copyHeaderFooter
call copyforwardSub \r standalone\common index.html
call copyforwardSub app\model app\model DeliveryInfo.js
call copyforwardSub app\store app\store DeliveryInfos.js
call copyforwardSub app\controller\mms app\controller\mms Coupon.js
call copyforwardSub app\view\mms app\view\mms Coupon.js
call copyforwardSub app standalone\mms\coupon app.js
call copyforwardSub assets\data assets\data phones.txt
call copyforwardSub assets\data assets\data message.txt
call copyforwardSub assets\data\coupons assets\data\coupons coupon.jpg

set app=App3
call copyHeaderFooter
call copyforwardSub \r standalone\common index.html
call copyforwardSub app\model app\model Image.js
call copyforwardSub app\store app\store Images.js
call copyforwardSub app\view\mms app\view\mms Gallery.js
call copyforwardSub app standalone\mms\gallery app.js
call copyforwardSub assets\data\gallery\MoMmsImages assets\data\gallery\MoMmsImages *.*
call copyforwardSub assets\data assets\data gallery.json

set appName=Payment
set app=App1
call copyHeaderFooter
call copyforwardSub \r standalone\common index.html
call copyforwardSub app\controller\payment app\controller\payment Notary.js
call copyforwardSub app\view\payment app\view\payment Notary.js
call copyforwardSub app standalone\payment\notary app.js

set app=App2
call copyHeaderFooter
call copyforwardSub \r standalone\payment\singlepay index.html
call copyforwardSub ux ux ListWindow.js
call copyforwardSub app\model app\model SinglePayTransaction.js
call copyforwardSub app\store app\store SinglePayTransactions.js
call copyforwardSub app\controller\payment app\controller\payment SinglePay.js
call copyforwardSub app\view\payment app\view\payment SinglePay.js
call copyforwardSub app standalone\payment\singlepay app.js

set app=App3
call copyHeaderFooter
call copyforwardSub \r standalone\payment\subscription index.html
call copyforwardSub \r standalone\common index.html
call copyforwardSub ux ux ListWindow.js
call copyforwardSub app\model app\model SubscriptionTransaction.js
call copyforwardSub app\store app\store SubscriptionTransactions.js
call copyforwardSub app\controller\payment app\controller\payment Subscription.js
call copyforwardSub app\view\payment app\view\payment Subscription.js
call copyforwardSub \r standalone\payment\subscription app.js

set appName=Speech
set app=App1
call copyHeaderFooter
call copyforwardSub \r standalone\speech\basic index.html
call copyforwardSub app\model app\model SpeechFile.js
call copyforwardSub app\store app\store SpeechFiles.js
call copyforwardSub app\controller\speech app\controller\speech Basic.js
call copyforwardSub app\view\speech app\view\speech Basic.js
call copyforwardSub app standalone\speech\basic app.js

set app=App2
call copyHeaderFooter
call copyforwardSub \r standalone\speech\captured index.html
call copyforwardSub app\controller\speech app\controller\speech Captured.js
call copyforwardSub app\view\speech app\view\speech Captured.js
call copyforwardSub app standalone\speech\captured app.js

set app=App3
call copyHeaderFooter
call copyforwardSub \r standalone\speech\FromText index.html
call copyforwardSub app\controller\speech app\controller\speech FromText.js
call copyforwardSub app\view\speech app\view\speech FromText.js
call copyforwardSub app standalone\speech\fromtext app.js

set appName=IMMN
set app=App1
call copyHeaderFooter
call copyforwardSub \r standalone\common index.html
call copyforwardSub app\controller\mobo app\controller\mobo Basic.js
call copyforwardSub app\view\mobo app\view\mobo Basic.js
call copyforwardSub app standalone\mobo\basic\app app.js

set app=App2
call copyHeaderFooter
call copyforwardSub \r standalone\common index.html
call copyforwardSub app\model app\model MessageHeader.js
call copyforwardSub app\store app\store MessageHeaders.js
call copyforwardSub app\controller\mim app\controller\mim Basic.js
call copyforwardSub app\view\mim app\view\mim Basic.js
call copyforwardSub app standalone\mim\basic\app app.js


REM
REM Copy server SDK components
REM

set serversource=%contextDir%\%working%\server
set servertarget=%contextDir%\sdk\server

xcopy /ey /d "%servertarget%\java\conf\*" "%serversource%\java\conf\att-api.properties"
xcopy /ey /d "%servertarget%\java\lib\*" "%serversource%\java\lib\*"
xcopy /ey /d "%servertarget%\java\resources\*" "%serversource%\java\resources\*"
xcopy /ey /d "%servertarget%\java\src\*" "%serversource%\java\src\*" 
xcopy /ey /d "%servertarget%\java\webapp\*" "%serversource%\java\webapp\*"
xcopy /y /d "%servertarget%\java\*" "%serversource%\java\*"
xcopy /y /d "%servertarget%\java\dist\*" "%serversource%\java\dist\*"
xcopy /ey /d /EXCLUDE:internal.txt "%servertarget%\php\*" "%serversource%\php\*"
xcopy /ey /d /EXCLUDE:internal.txt "%servertarget%\ruby\*" "%serversource%\ruby\*"
