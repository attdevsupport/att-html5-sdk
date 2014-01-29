if (typeof feature === 'undefined')
{
    // Incoming call ...
    
    var messageToPlay = "http://wdev.code-api-att.com:8181/Tropo/music.mp3";
    say("Welcome to the A T and T. Call Management Services Sample Application.");

    var result20 = ask("Press a digit or Press pound to skip", {
        choices: "[1 DIGITS]",
        terminator: "#",
        timeout: 5.0,
        mode: "dtmf",
        interdigitTimeout: 5,
        onChoice: function (event) {
            say("Thank you for entering");
        },
        onBadChoice: function (event) {
            say("I am sorry, not able to get the digit");
        }
    });
    if (result20.value != "")
    {
        say (result20.value);
    }

    var result21 = ask("Press a digit to join 1337 conferencing or Press pound to skip", {
    choices: "[1 DIGITS]",
    terminator: "#",
    timeout: 5.0,
    mode: "dtmf",
    interdigitTimeout:5,
    onChoice: function (event) {
        say ("Thank you for joining conferenceing, to quit press star at any time");
        conference("1337", {
            terminator: "*",
            playTones: true,
            onChoice: function (event) {
                say("Disconnecting from conference");
                }
            });
        },
    });

    var result22 = ask("Press a digit to log the header value or Press pound to skip", {
        choices: "[1 DIGITS]",
        terminator: "#",
        timeout: 5.0,
        mode: "dtmf",
        interdigitTimeout:5,
        onChoice: function (event) {
            if (currentCall.getHeader("to")) {
                say("Logged to header value");
                log("Your header value is " + currentCall.getHeader("to"));
            }
            else {
                say("could not find to header value");
                log("Your header value was not found");
            }
        },
    });

    var result23 = ask("Press a ten digit phone number to send sms to the requested number or Press pound to skip", {
        choices: "[10 DIGITS]",
        terminator: "#",
        timeout: 120.0,
        mode: "dtmf",
        interdigitTimeout:10,
        onChoice: function (event) {
            say("Sending message to");
        },
    });

    if (result23.value != "")
    {
        say(result23.value);
        message("Message from AT&T Call Control Service Sample Application", {
            to: result23.value,
            network: "SMS"
        });
    }

    var result24 = ask("Press  ten digit phone number for which you are calling to reject this call or Press pound to skip", {
        choices: "[10 DIGITS]",
        terminator: "#",
        timeout: 120.0,
        mode: "dtmf",
        interdigitTimeout:10,
        onChoice: function (event) {
        },
    });
    if ( result24.value != "")
    {
        if (callerID == result24.value) {
            say("your calls will be rejected");
            say("Thank you, for using A T and T Call management Sample Application Demo.  Good Bye");
            reject();
        }
        else
        {
            say("number not matched for reject feature");
            say(currentCall.callerID);
            say( "you entered");
            say(result24.value);
        }
    }


    var result25 = ask("enter 10 digit phone number to transfer the call to requested number or Press pound to skip", {
        choices: "[10 DIGITS]",
        terminator: "#",
        timeout: 120.0,
        mode: "dtmf",
        interdigitTimeout:10,
        onChoice: function (event) {
        say("transfering to ");
        },
    });
    if (result25.value != "")
    {
        say(result25.value);
        transfer([result25.value, "sip:12345678912@221.122.54.86"], {
            playvalue: messageToPlay,
            terminator: "*",
            onTimeout: function (event) {
                say("Sorry, but nobody answered");
            }
        });
     }

    var result27 = ask("Press  ten digit phone number for which you are calling to wait this call or Press pound to skip", {
    choices: "[10 DIGITS]",
    terminator: "#",
    timeout: 120.0,
    mode: "dtmf",
    interdigitTimeout:10,
    onChoice: function (event) {
        },
    });
    if (result27.value != "")
    {
        var callerID = currentCall.callerID;
        if (callerID == result27.value) {
                say("your calls will be kept for three seconds wait");
            wait(3000);
        }
        else
        {
            say("number not matched for wait feature");
            say(currentCall.callerID);
            say( "you entered");
            say(result27.value);
        }
    }
    var result29 = ask("Press a digit to test the signalling or Press pound to skip", {
        choices: "[1 DIGITS]",
        terminator: "#",
        timeout: 5.0,
        mode: "dtmf",
        interdigitTimeout:5,
        onChoice: function (event) {
        say("Waiting for exit signal");
        say(messageToPlay, {
            allowSignals: "exit",
            onSignal: function (event) {
                say("Received exit signal, hence music is paused.  Enjoy the music again.");
            }
        });
        say("Waiting for stopHold signal");
        say(messageToPlay, {
        allowSignals: "stopHold",
        onSignal: function (event) {
            say("Received stop hold signal, hence music is paused. Enjoy the music again.");
            }
        });
        say("Waiting for dequeue signal");
        say(messageToPlay, {
        allowSignals: "dequeue",
        onSignal: function (event) {
            say("Received dequeue signal, hence music is stopped.");
            }
        });
        },
    });

    say("Thank you, for using A T and T. Call Management Service Sample Application Demo.  Good Bye"); 
    hangup();
}
else
{
    call (numberToDial);
    say("Welcome to the A T and T. Call Management Services Sample Application.");
    switch(feature)
    {
    case 'answer':
        say("your answered implicitly");
        break;
    case 'ask':
        var result9 = ask("Press four or five digits and Press pound when finished", {
            choices: "[4-5 DIGITS]",
            terminator: "#",
            timeout: 90.0,
            mode: "dtmf",
            interdigitTimeout: 5,
            onChoice: function (event) {
                say("Thank you for entering");
            },
            onBadChoice: function (event) {
                say("I am sorry, not able to get the four or five digits");
            }
        });
        if (result9.value != "")
        {
            say( result9.value);
        }
        break;
    case 'call':
        break;
    case 'conference':
        say ("Thank you for joining conferenceing");
        say ("1337");
        say("and to quit press star at any time");
        conference("1337", {
            terminator: "*",
            playTones: true,
            onChoice: function (event) {
                say("Disconnecting from conference");
            }
        });
        break;
    case 'getHeader':
        if (currentCall.getHeader("to")) {
            say("Logged to header value");
            log("Your header value is " + currentCall.getHeader("to"));
        }
        else {
            say("could not find to header value");
            log("Your header value was not found");
        }
        break;
    case 'hangup':
        say (" Your call will be hanged up");
        break;
    case 'log':
        if (currentCall.getHeader("to")) {
            say("Logged to header value");
            log("Your header value is " + currentCall.getHeader("to"));
        }
        else {
            say("could not find to header value");
            log("Your header value was not found");
        }
        break;
    case 'message':
          say("Sending message to");
          say(smsnumber);
          message("Message from AT&T Call Control Service Sample Application", {
                    to: smsnumber,
                    network: "SMS"
                });
          break;
    case 'reject':
        var callerID = currentCall.callerID;
        if (callerID == rejectnumber) {
            say("your calls will be rejected");
            say("Thank you, for using A T and T Call management Sample Application Demo.  Good Bye");
            reject();
        }
        else
        {
            say("present id is");
            say(currentCall.callerID);
            say("rejectnumber is ")
            say(rejectnumber);
            say("number not matched for reject feature");
        }
        break;
    case 'say':
        say ("tested saying successfully");
        break;
    case 'transfer':
        say("transfering to ");
        say(transfernumber);
        transfer([transfernumber, "sip:12345678912@221.122.54.86"], {
            playvalue: messageToPlay,
            terminator: "*",
            onTimeout: function (event) {
                say("Sorry, but nobody answered");
            }
        });
        break;
    case 'wait':
        var callerID = currentCall.callerID;
        if (callerID == waitnumber) {
            say("your calls will be kept for three seconds wait");
            wait(3000);
        }
        else{
        say(currentCall.callerID);
        say("number not matched for wait feature");
        }
        break;
    }

    var result4 = ask("Press a digit to test the signalling or Press pound to skip", {
        choices: "[1 DIGITS]",
        terminator: "#",
        timeout: 5.0,
        mode: "dtmf",
        interdigitTimeout:5,
        onChoice: function (event) {
        say("Waiting for exit signal");
        say(messageToPlay, {
            allowSignals: "exit",
            onSignal: function (event) {
                say("Received exit signal, hence music is paused.  Enjoy the music again.");
            }
        });
        say("Waiting for stopHold signal");
        say(messageToPlay, {
        allowSignals: "stopHold",
        onSignal: function (event) {
            say("Received stop hold signal, hence music is paused. Enjoy the music again.");
            }
        });
        say("Waiting for dequeue signal");
        say(messageToPlay, {
        allowSignals: "dequeue",
        onSignal: function (event) {
            say("Received dequeue signal, hence music is stopped.");
            }
        });
        },
    });

    say("Thank you, for using A T and T. Call Management Service Sample Application Demo.  Good Bye"); 
    hangup();
}
