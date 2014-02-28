# Samples Test Suite
This test suite exercises the sample applications that ship with this SDK.

## Getting Started
This test harness uses Selenium to exercise the web-based sample apps. To compile and run it, please first [install Maven](http://maven.apache.org/download.cgi). You can then build the tests using:

    mvn package

You can run the tests by first starting one of the SDK servers, then running:

    mvn exec:java
	
You can also run tests on your own server by executing the following:
	
	mvn exec:java -Dexec.args="http://myURL.com:4567/"
	
	This must be done in an actual command prompt and not done from Windows Powershell. 
	The url MUST be structured as follows: (http[s]://<host>[:<port>][/]) for example https://testportal.att.com:1234/ 
	
## Test Architecture
This test suite is implemented in Java. It runs a series of test cases, each of which will use Selenium to open a Chrome browser, navigate to the web page for one of the sample apps, and exercise that sample app.

Note that one of the SDK-provided servers must be running so the sample apps can be accessed.

The entry-point for the suite is implemented in the 'App' class. This class delegates to a series of sample-specific classes in order to run the tests for each of those samples. For example, it will call into the 'TestSpeech' class to run all the speech-related test cases.

Individual test cases are implemented as methods that use the [Selenium library](http://docs.seleniumhq.org/) to start, drive, and stop the Chrome browser.

## Shared Code
Code shared across test cases is implemented in the 'Global' and 'Log' classes.

Please note that these classes contain legacy code that will be removed once all sample apps are integrated into this test suite. This legacy code is clearly marked, but caution should still be used when browsing and interpreting this code.

## Logging
Common logging is provided by the log4j library. The 'Log' class provides a simple wrapper to obtain a Logger object, as follows:

    Logger log = Log.getLogger();

The log then provides methods to send output at various severity levels:

    log.info("the test did something inoccuous");
    log.warn("something happened you might want to know about");
    log.error("whoops, something broke");

All log output is appended to the file 'html5sdk.log'.
