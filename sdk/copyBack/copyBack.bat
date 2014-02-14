@echo off
cls
cd ..\..
set ContextDir=%CD%

cd sdk\copyBack

set working=working
set createMode=t

echo *  This batch file now clones the existing sample to
echo *  %contextDir%\%working%\sampleCopy
echo *  Use a compare tool to copy the changed files to the real folder
echo *  sampleCopy will not be checked in as it is in .gitIgnore 

rd /S /Q "%contextDir%\sdk\sampleCopy"
xcopy "%contextDir%\sdk\sample" "%contextDir%\sdk\sampleCopy" /E /I

set pathA=%contextDir%\%working%\webcontent\lib
set pathB=%contextDir%\sdk\sampleCopy\lib

call copyfile "%pathA%" "%pathB%" att-api-client.js
call copyfile "%pathA%" "%pathB%" recorder.js
call copyfile "%pathA%" "%pathB%" recorderWorker.js
call copyfile "%pathA%" "%pathB%" dependencies.js
call copyfile "%pathA%" "%contextDir%\sdk\sampleCopy\resources\css" att.css

call copyFile "%contextDir%\%working%\webcontent" "%contextDir%\sdk\sampleCopy\standalone" index.html

set appName=SMS
set app=App1
call copyBackSub \r standalone\common index.html
call copyBackSub app\controller\sms app\controller\sms Basic.js
call copyBackSub app\view\sms app\view\sms Basic.js
call copyBackSub app standalone\sms\basic app.js

set app=App2
call copyBackSub \r standalone\common index.html
call copyBackSub app\model app\model Vote.js
call copyBackSub app\store app\store Votes.js
call copyBackSub app\controller\sms app\controller\sms Voting.js
call copyBackSub app\view\sms app\view\sms Voting.js
call copyBackSub app standalone\sms\voting app.js

set appName=DC
set app=App1
call copyBackSub \r standalone\common index.html
call copyBackSub app\controller\device app\controller\device Capabilities.js
call copyBackSub app\view\device app\view\device Capabilities.js
call copyBackSub app standalone\device\capabilities app.js

set appName=MMS
set app=App1
call copyBackSub \r standalone\common index.html
call copyBackSub app\controller\mms app\controller\mms Basic.js
call copyBackSub app\view\mms app\view\mms Basic.js
call copyBackSub app standalone\mms\basic app.js

set app=App2
call copyBackSub \r standalone\common index.html
call copyBackSub app\model app\model DeliveryInfo.js
call copyBackSub app\store app\store DeliveryInfos.js
call copyBackSub app\controller\mms app\controller\mms Coupon.js
call copyBackSub app\view\mms app\view\mms Coupon.js
call copyBackSub app standalone\mms\coupon app.js
call copyBackSub assets\data assets\data phones.txt
call copyBackSub assets\data assets\data message.txt
call copyBackSub assets\data\coupons assets\data\coupons coupon.jpg

set app=App3
call copyBackSub \r standalone\common index.html
call copyBackSub app\model app\model Image.js
call copyBackSub app\store app\store Images.js
call copyBackSub app\view\mms app\view\mms Gallery.js
call copyBackSub app standalone\mms\gallery app.js
call copyBackSub assets\data\gallery\MoMmsImages assets\data\gallery\MoMmsImages *.*
call copyBackSub assets\data assets\data gallery.json

set appName=Payment
set app=App1
call copyBackSub \r standalone\common index.html
call copyBackSub app\controller\payment app\controller\payment Notary.js
call copyBackSub app\view\payment app\view\payment Notary.js
call copyBackSub app standalone\payment\notary app.js

set app=App2
call copyBackSub \r standalone\payment\singlepay index.html
call copyBackSub ux ux ListWindow.js
call copyBackSub app\model app\model SinglePayTransaction.js
call copyBackSub app\store app\store SinglePayTransactions.js
call copyBackSub app\controller\payment app\controller\payment SinglePay.js
call copyBackSub app\view\payment app\view\payment SinglePay.js
call copyBackSub app standalone\payment\singlepay app.js

set app=App3
call copyBackSub \r standalone\payment\subscription index.html
call copyBackSub \r standalone\common index.html
call copyBackSub ux ux ListWindow.js
call copyBackSub app\model app\model SubscriptionTransaction.js
call copyBackSub app\store app\store SubscriptionTransactions.js
call copyBackSub app\controller\payment app\controller\payment Subscription.js
call copyBackSub app\view\payment app\view\payment Subscription.js
call copyBackSub \r standalone\payment\subscription app.js

set appName=Speech
set app=App1
call copyBackSub \r standalone\speech\basic index.html
call copyBackSub app\model app\model SpeechFile.js
call copyBackSub app\store app\store SpeechFiles.js
call copyBackSub app\controller\speech app\controller\speech Basic.js
call copyBackSub app\view\speech app\view\speech Basic.js
call copyBackSub app standalone\speech\basic app.js

set app=App2
call copyBackSub \r standalone\speech\captured index.html
call copyBackSub app\controller\speech app\controller\speech Captured.js
call copyBackSub app\view\speech app\view\speech Captured.js
call copyBackSub app standalone\speech\captured app.js

set app=App3
call copyBackSub \r standalone\speech\FromText index.html
call copyBackSub app\controller\speech app\controller\speech FromText.js
call copyBackSub app\view\speech app\view\speech FromText.js
call copyBackSub app standalone\speech\fromtext app.js

set appName=IMMN
set app=App1
call copyBackSub \r standalone\common index.html
call copyBackSub app\controller\mobo app\controller\mobo Basic.js
call copyBackSub app\view\mobo app\view\mobo Basic.js
call copyBackSub app standalone\mobo\basic\app app.js

set app=App2
call copyBackSub \r standalone\common index.html
call copyBackSub app\model app\model MessageHeader.js
call copyBackSub app\store app\store MessageHeaders.js
call copyBackSub app\controller\mim app\controller\mim Basic.js
call copyBackSub app\view\mim app\view\mim Basic.js
call copyBackSub app standalone\mim\basic\app app.js

REM
REM Copy server SDK components
REM

set serversource=%contextDir%\%working%\server
set servertarget=%contextDir%\sdk\server

xcopy /ey "%serversource%\java\conf\att-api.properties" "%servertarget%\java\conf\*"
xcopy /ey "%serversource%\java\lib\*" "%servertarget%\java\lib\*"
xcopy /ey "%serversource%\java\resources\*" "%servertarget%\java\resources\*"
xcopy /ey "%serversource%\java\src\*" "%servertarget%\java\src\*"
xcopy /ey "%serversource%\java\webapp\*" "%servertarget%\java\webapp\*"
xcopy /y "%serversource%\java\*" "%servertarget%\java\*"
xcopy /y "%serversource%\java\dist\*" "%servertarget%\java\dist\*"

xcopy /ey /EXCLUDE:internal.txt "%serversource%\php\*" "%servertarget%\php\*"
xcopy /ey /EXCLUDE:internal.txt "%serversource%\ruby\*" "%servertarget%\ruby\*"

