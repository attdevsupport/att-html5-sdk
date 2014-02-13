@echo off
cls
cd ..\..
set contextDir=%CD%
cd sdk\copyBack
set working=working
set createMode=t

rd /S /Q %contextDir%\sdk\sampleCopy
xcopy %contextDir%\sdk\sample %contextDir%\sdk\sampleCopy /E /I

set pathA=%contextDir%\%working%\webcontent\lib
set pathB=%contextDir%\sdk\sampleCopy\lib

call copyFileForward %pathA% %pathB% att-api-client.js
call copyFileForward %pathA% %pathB% recorder.js
call copyFileForward %pathA% %pathB% recorderWorker.js
call copyFileForward %pathA% %pathB% dependencies.js
call copyFileForward %pathA% %contextDir%\sdk\sampleCopy\resources\css att.css

call copyFileForward %contextDir%\%working%\webcontent %contextDir%\sdk\sampleCopy\standalone index.html

REM: set appName=CMS
REM: set app=App1
REM: call copyForwardSub \r standalone\common index.html
REM: call copyForwardSub app\controller\cms app\controller\cms Basic.js
REM: call copyForwardSub app\view\cms app\view\cms Basic.js
REM: call copyForwardSub app standalone\cms\basic app.js 
REM: call copyForwardSub assets\data\cmsScripts assets\data\cmsScripts *.*

REM: set appName=SMS
REM: set app=App1
REM: call copyForwardSub \r standalone\common index.html
REM: call copyForwardSub app\controller\sms app\controller\sms Basic.js
REM: call copyForwardSub app\view\sms app\view\sms Basic.js
REM: call copyForwardSub app standalone\sms\basic app.js

REM: set app=App2
REM: call copyForwardSub \r standalone\common index.html
REM: call copyForwardSub app\model app\model Vote.js
REM: call copyForwardSub app\store app\store Votes.js
REM: call copyForwardSub app\controller\sms app\controller\sms Voting.js
REM: call copyForwardSub app\view\sms app\view\sms Voting.js
REM: call copyForwardSub app standalone\sms\voting app.js

REM: set appName=DC
REM: set app=App1
REM: call copyForwardSub \r standalone\common index.html
REM: call copyForwardSub app\controller\device app\controller\device Capabilities.js
REM: call copyForwardSub app\view\device app\view\device Capabilities.js
REM: call copyForwardSub app standalone\device\capabilities ap.js

REM: set appName=TL
REM: set app=App1
REM: call copyForwardSub \r standalone\device\location index.html
REM: call copyForwardSub app\controller\device app\controller\device Location.js
REM: call copyForwardSub app\view\device app\view\device Location.js
REM: call copyForwardSub app standalone\device\location app.js

set appName=MMS
set app=App1
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\controller\mms app\controller\mms Basic.js
call copyForwardSub app\view\mms app\view\mms Basic.js
call copyForwardSub app standalone\mms\basic app.js

set app=App2
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
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\model app\model Image.js
call copyForwardSub app\store app\store Images.js
call copyForwardSub app\view\mms app\view\mms Gallery.js
call copyForwardSub app standalone\mms\gallery app.js
call copyForwardSub assets\data\gallery\MoMmsImages assets\data\gallery\MoMmsImages *.*
call copyForwardSub assets\data assets\data gallery.json

REM: set appName=WAPPush
REM: set app=App1
REM: call copyForwardSub \r standalone\common index.html
REM: call copyForwardSub app\controller\wap app\controller\wap Basic.js
REM: call copyForwardSub app\view\wap app\view\wap Basic.js
REM: call copyForwardSub app standalone\wap\basic app.js

set appName=Payment
set app=App1
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\controller\payment app\controller\payment Notary.js
call copyForwardSub app\view\payment app\view\payment Notary.js
call copyForwardSub app standalone\payment\notary app.js

set app=App2
call copyForwardSub \r standalone\payment\singlepay index.html
call copyForwardSub ux ux ListWindow.js
call copyForwardSub app\model app\model SinglePayTransaction.js
call copyForwardSub app\store app\store SinglePayTransactions.js
call copyForwardSub app\controller\payment app\controller\payment SinglePay.js
call copyForwardSub app\view\payment app\view\payment SinglePay.js
call copyForwardSub app standalone\payment\singlepay app.js

set app=App3
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
call copyForwardSub \r standalone\speech\basic index.html
call copyForwardSub app\model app\model SpeechFile.js
call copyForwardSub app\store app\store SpeechFiles.js
call copyForwardSub app\controller\speech app\controller\speech Basic.js
call copyForwardSub app\view\speech app\view\speech Basic.js
call copyForwardSub app standalone\speech\basic app.js

set app=App2
call copyForwardSub \r standalone\speech\captured index.html
call copyForwardSub app\controller\speech app\controller\speech Captured.js
call copyForwardSub app\view\speech app\view\speech Captured.js
call copyForwardSub app standalone\speech\captured app.js

set app=App3
call copyForwardSub \r standalone\speech\FromText index.html
call copyForwardSub app\controller\speech app\controller\speech FromText.js
call copyForwardSub app\view\speech app\view\speech FromText.js
call copyForwardSub app standalone\speech\fromtext app.js

set appName=IMMN
set app=App1
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\controller\mobo app\controller\mobo Basic.js
call copyForwardSub app\view\mobo app\view\mobo Basic.js
call copyForwardSub app standalone\mobo\basic\app app.js

set app=App2
call copyForwardSub \r standalone\common index.html
call copyForwardSub app\model app\model MessageHeader.js
call copyForwardSub app\store app\store MessageHeaders.js
call copyForwardSub app\controller\mim app\controller\mim Basic.js
call copyForwardSub app\view\mim app\view\mim Basic.js
call copyForwardSub \r standalone\mim\basic app.js


REM
REM Copy server SDK components
REM

set serversource=%contextDir%\%working%\server
set servertarget=%contextDir%\sdk\server

xcopy /ey %servertarget%\java\conf\* %serversource%\java\conf\att-api.properties
xcopy /ey %servertarget%\java\lib\* %serversource%\java\lib\*
xcopy /ey %servertarget%\java\resources\* %serversource%\java\resources\*
xcopy /ey %servertarget%\java\src\* %serversource%\java\src\*
xcopy /ey %servertarget%\java\webapp\* %serversource%\java\webapp\*
xcopy /y %servertarget%\java\* %serversource%\java\*
xcopy /y %servertarget%\java\dist\* %serversource%\java\dist\*
xcopy /ey %servertarget%\php\* %serversource%\php\*
xcopy /ey %servertarget%\ruby\* %serversource%\ruby\*
