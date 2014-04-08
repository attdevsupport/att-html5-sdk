Speech Cookbook
===

Overview
---
This cookbook explains how to create an instance of the Att.Provider class in your app and use it to access methods in the AT&T API Platform SDK for HTML5 for converting audio recordings to text.

What do I need to start?
---

1. **Include Att.Provider as a dependency by declaring it in the "requires" section of your class definition.**  


        Ext.define('MyApp.MyController', {
            extend  : 'Ext.Controller',
            requires: [
                'Att.Provider'
                //more dependencies here as required ...
            ],

            //...
        });

2. **Create an instance of the Att.Provider class**

        var provider = Ext.create('Att.Provider');


How do I convert an audio file to text?
---

1. Capture spoken voice into an audio file using your device.
2. Upload the audio file to the machine where your SDK server (php/ruby/java) is running.
3. Ensure your SDK server has read access to the audio file.
4. Execute the speechToText method providing the path to the audio file on your server. For more information about the parameters of this method, refer to Att.Provider.speechToText.

<code>

	var audioFile = "/path/to/amr-or-wav/file";

    provider.speechToText({
        fileName: audioFile,
        fileContentType : 'audio/x-wav',
        streamed: true,
        context: 'Generic',
        success: function(response){
        	console.log(response);
        },
        failure: function(error){
            console.log(error);
        }
    });      

</code>

###Tip! Recording Formats and Limits
The maximum length of an audio recording that is allowed by the Speech API is 4 minutes, and the recording must be in one of the following audio formats:

- 16 bit PCM WAV, single channel, 8 kHz sampling
- 16 bit PCM WAV, single channel, 16 kHz sampling
- AMR (narrowband), 12.2 kbit/s, 8 kHz sampling
- AMR-WB (wideband) is 12.65 kbit/s, 16khz sampling
- OGG speex encoding, 8kHz sampling
- OGG speex encoding, 16kHz sampling

