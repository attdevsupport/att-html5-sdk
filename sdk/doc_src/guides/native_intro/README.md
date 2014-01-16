#Native Applications

When you create a Sencha Touch application, it runs within the context of your device's browser. The source for your application resides on a webserver and is normally loaded into the browser and executed. This is a great way to be able to provide easy updates to users and offers you a simple development platform for your application as all that is required is knowledge of the Sencha Touch framework.

However, there are some limitations to using an HTML5 only solution, especially when you wish to access any of the native device capabilities such as access to the microphone or camera.

Another advantage to creating native applications that utilize the ATT APIs is that you can bypass the requirement of using the HTML5 SDK server back end (Java/Ruby/PHP). Since a native application has your code on the device itself, the Cross-Domain scripting restriction is no longer an obsticle - your application is capable of communicating directly with the ATT APIs.

##Prerequisites

These guides will walk you through creating a native Sencha Touch application using Eclipse and, with the help of PhoneGap, access features of your target device which will be required for some of the ATT APIs, specifically the SpeechToText API. 

The following tools are required to follow these guides :

- Sencha Touch
- Sencha Cmd
- Android SDK
- Eclipse IDE
- PhoneGap (required for SpeechToText ATT API)

##Sencha Touch


##Sencha Cmd

##Eclipse

This guide will be using PhoneGap as a foundation for creating your native application. If you are not familiar with PhoneGap, it is an open source framework which allows your HTML5/Javascript application to access features of your device which are not normally available from JavaScript.


##Phone Gap

PhoneGap is an open source framework for building cross-platform mobile apps using HTML5, Javascript and CSS. It is required to allow your Sencha Touch application to be compiled as a native app for devices and also provides access to native device APIs which are not normally available to javascript applications.

You can download PhoneGap from [the download section](http://www.phonegap.com/download) section of their website.

PhoneGap has an excellent guides for getting started using it to create native applications on different devices 

##Generate Sencha Touch App

Assuming you have Sencha Touch and Sencha Cmd downloaded and installed on your platform, open up a terminal session and change your directory to the Sencha Touch directory

    cd path/to/sencha-touch-install-directory

Generate a new Sencha Touch application. In this tutorial we will create a speech to text application to let's call the application MySpeechApp and put it in a directory called *MySpeechApp*

    sencha generate app MySpeechApp path/to/MySpeechApp

You can now cd into your new app's folder

    cd path/to/MySpeechApp

##Copy PhoneGap JavaScript library

You will need to copy the PhoneGap file **cordova-x.x.x.js** file to the root of your application directory. Note that **x.x.x** represents the current version of PhoneGap that you downloaded. In the example below we are assuming you've downloaded version 2.5.0 of PhoneGap.

    cp path/to/PhoneGap-directory/lib/android/cordova-2.5.0.js .

##Include PhoneGap Source into Your App

We now have to add the cordova library copied above into your Sencha Touch application. This is done by editing the **app.json** file which was created for your application by the **sencha generate app** command and adding the path to the cordova file:


    "js" : [
        // Add Phonegap Cordova library to my application
        {
            "path" : "cordova-2.5.0.js"
        },
        { 
            "path" : "touch/sencha-touch.js"
        },
        {
            "path" : "app.js",
            "bundle": true,
            "update" : "delta"
        }
    ],


##Setup Android SDK Tools

Before you can continue, you need to make sure that the Android SDK tools are accessible by adding them to your PATH if they are not already there. You can easily ensure that the paths exist by entering the following command

    echo $PATH

Examine the output of this command and look references to the directories **/platform-tools** and **/tools*. If they are not there you will need to include the directories in your path by modifying your profile

    vi ~/.bash_profile

and adding the following lines

    export PATH=${PATH}:path-to-android-sdk/tools
    export PATH=${PATH}:path-to-android-sdk/platform-tools

Save your profile and reload it to update your path 

    . ~/.bash_profile


##Setup New Android Project

The next step is to create an Android project in your application directory. This is where the Android SDK is used. You must now create an Android project in your application directory for use by Eclipse. This directory will contain all the necessary files required to create a native android application from Eclipse. 

    cd path/to/phonegap-directory/lib/android/bin
    ./create path-to/MySpeechApp/build/MySpeechApp/android com.example.myspeechapp MySpeechApp

And now return back to the root folder of your Sencha Touch app:

    cd path/to/MySpeechApp

You wil notice the build folder that was created by issuing the above **create** command 

    
##Edit build.xml

The build.xml file is used by Sencha cmd to bundle your application into a neat package and build it in a target directory all minimized. The following information is needed to be added to your build.xml file to properly generate your minimized application in a directory that is accessible to Eclipse.

    <target name="-after-build">
        <delete dir="${build.dir}/android/assets/www" />
        <copy todir="${build.dir}/android/assets/www">
            <fileset dir="${build.dir}/package"/>
        </copy>
    </target>

##Add Project to Eclipse

You're almost done ....

Launch Eclipse, select menu item New Project, select path-to/MySpeechApp/build/MySpeechApp/android

Click Finish

##Deploy to a device 

