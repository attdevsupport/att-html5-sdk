@echo off
cd ..\..
set contextDir="%CD%"
cd sdk\copyBack
set working=working

IF "%1"=="/c" (
 set createMode=t
) ELSE (
 set createMode=f
)

set pathA=%contextDir%\%working%\webcontent\lib
set pathB=%contextDir%\sdk\sample\lib

call copyfile %pathA%\js %pathB% att-api-client.js
call copyfile %pathA%\js %pathB% recorder.js
call copyfile %pathA%\js %pathB% recorderWorker.js
call copyfile %pathA%\css %contextDir%\sdk\sample\resources\css att.css

call copyFile %contextDir%\%working%\webcontent %contextDir%\sdk\sample\standalone index.html

set appName=CMS
set app=App1
call copyBack \r standalone\common index.html
call copyBack app\controller\cms app\controller\cms Basic.js
call copyBack app\view\cms app\view\cms Basic.js
rem: call copyBack app standalone\cms\basic app.js assets\data\cmsScripts assets\data\cmsScripts *.*

set appName=SMS
set app=App1
call copyBack \r standalone\common index.html
call copyBack app\controller\sms app\controller\sms Basic.js
call copyBack app\view\sms app\view\sms Basic.js
call copyBack app standalone\sms\basic app.js

set app=App2
call copyBack \r standalone\common index.html
call copyBack app\model app\model Vote.js
call copyBack app\store app\store Votes.js
call copyBack app\controller\sms app\controller\sms Voting.js
call copyBack app\view\sms app\view\sms Voting.js
call copyBack app standalone\sms\voting app.js

set appName=DC
set app=App1
call copyBack \r standalone\common index.html
call copyBack app\controller\device app\controller\device Capabilities.js
call copyBack app\view\device app\view\device Capabilities.js
call copyBack app standalone\device\capabilities ap.js

set appName=TL
set app=App1
call copyBack \r standalone\device\location index.html
call copyBack app\controller\device app\controller\device Location.js
call copyBack app\view\device app\view\device Location.js
call copyBack app standalone\device\location app.js

set appName=MMS
set app=App1
call copyBack \r standalone\common index.html
call copyBack app\controller\mms app\controller\mms Basic.js
call copyBack app\view\mms app\view\mms Basic.js
call copyBack app standalone\mms\basic app.js

set app=App2
call copyBack \r standalone\common index.html
call copyBack app\model app\model DeliveryInfo.js
call copyBack app\store app\store DeliveryInfos.js
call copyBack app\controller\mms app\controller\mms Coupon.js
call copyBack app\view\mms app\view\mms Coupon.js
call copyBack app standalone\mms\coupon app.js
call copyBack assets\data assets\data phones.txt
call copyBack assets\data assets\data message.txt
call copyBack assets\data\coupons assets\data\coupons coupon.jpg

set app=App3
call copyBack \r standalone\common index.html
call copyBack app\model app\model Image.js
call copyBack app\store app\store Images.js
call copyBack app\view\mms app\view\mms Gallery.js
call copyBack app standalone\mms\gallery app.js
rem: call copyBack assets\data\gallery \assets\data\gallery *.*
call copyBack assets\data assets\data gallery.json

set appName=WAPPush
set app=App1
call copyBack \r standalone\common index.html
call copyBack app\controller\wap app\controller\wap Basic.js
call copyBack app\view\wap app\view\wap Basic.js
call copyBack app standalone\wap\basic app.js

set appName=Payment
set app=App1
call copyBack \r standalone\common index.html
call copyBack app\controller\payment app\controller\payment Notary.js
call copyBack app\view\payment app\view\payment Notary.js
call copyBack app standalone\payment\notary app.js

set app=App2
call copyBack \r standalone\common index.html
call copyBack ux ux ListWindow.js
call copyBack app\model app\model SinglePayTransaction.js
call copyBack app\store app\store SinglePayTransactions.js
call copyBack app\controller\payment app\controller\payment SinglePay.js
call copyBack app\view\payment app\view\payment SinglePay.js
call copyBack app standalone\payment\singlepay app.js

set app=App3
call copyBack \r standalone\common index.html
call copyBack ux ux\ListWindow.js
call copyBack app\model app\model SubscriptionTransaction.js
call copyBack app\store app\store SubscriptionTransactions.js
call copyBack app\controller\payment app\controller\payment Subscription.js
call copyBack app\view\payment app\view\payment Subscription.js
call copyBack app standalone\payment\subscription app.js

set appName=Speech
set app=App1
call copyBack \r standalone\speech\basic index.html
call copyBack app\model app\model SpeechFile.js
call copyBack app\store app\store SpeechFiles.js
call copyBack app\controller\speech app\controller\speech Basic.js
call copyBack app\view\speech app\view\speech Basic.js
call copyBack app standalone\speech\basic app.js

set app=App2
call copyBack \r standalone\speech\captured index.html
call copyBack app\controller\speech app\controller\speech Captured.js
call copyBack app\view\speech app\view\speech Captured.js
call copyBack app standalone\speech\captured app.js

set app=App3
call copyBack \r standalone\speech\FromText index.html
call copyBack app\controller\speech app\controller\speech FromText.js
call copyBack app\view\speech app\view\speech FromText.js
call copyBack app standalone\speech\FromText app.js

set appName=IMMN
set app=App1
call copyBack \r standalone\common index.html
call copyBack app\controller\mobo app\controller\mobo Basic.js
call copyBack app\view\mobo app\view\mobo Basic.js
call copyBack app standalone\mobo\basic app.js

set app=App2
call copyBack \r standalone\common index.html
call copyBack app\model app\model MessageHeader.js
call copyBack app\store app\store MessageHeaders.js
call copyBack app\controller\mim app\controller\mim Basic.js
call copyBack app\view\mim app\view\mim Basic.js
call copyBack app standalone\mim\basic app.js

REM
REM Copy server SDK components
REM

set serversource=%contextDir%\%working%\server
set servertarget=%contextDir%\sdk\server

xcopy /ey %serversource%\java\conf\att-api.properties %servertarget%\java\conf\*
xcopy /ey %serversource%\java\lib\* %servertarget%\java\lib\*
xcopy /ey %serversource%\java\resources\* %servertarget%\java\resources\*
xcopy /ey %serversource%\java\src\* %servertarget%\java\src\*
xcopy /ey %serversource%\java\webapp\* %servertarget%\java\webapp\*
xcopy /y %serversource%\java\dist\* %servertarget%\java\dist\*
xcopy /y %serversource%\java\* %servertarget%\java\*

xcopy /ey %serversource%\php\* %servertarget%\php\*
xcopy /ey %serversource%\ruby\* %servertarget%\ruby\*
