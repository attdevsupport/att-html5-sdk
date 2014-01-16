Speech Cookbook
===

Overview
---
This guide explains the usage of the Att.Provider for converting audio recordings to text using the AT&T HTML5 SDK Platform.

What do I need to start?
---
- Include Att.Provider by declaring it as a required on your class definition  

<code>
    Ext.define('MyApp.MyController', {
        extend  : 'Ext.Controller',
        requires: [
            'Att.Provider'
            //more dependencies here ... 
        ],

        //...
    });
</code>

- Create an instance of Att.Provider

<code>    
    var provider = Ext.create('Att.Provider');
</code>


How do I convert an audio file to text?
---

- Capture spoken voice into an audio file using your device.
- Upload the audio file to the machine where your SDK server (php/ruby/java) is running.
- Ensure your SDK server has read access to the audio file.
- Execute the speechToText method providing the path to the audio file on your server. For more information about the parameters refer to the Att.Provider.speechToText documentation.

<code>

	var audioFile = "/path/to/amr-or-wav/file";

    provider.speechToText({
        fileName: audioFile,
        streamed: true,
        success: function(response){
        	console.log(response);
        },
        failure: function(error){
            console.log(error);
        }
    });      

</code>

###Tip! Know your limits.

The API currently only accepts native device recordings (AMR format) or WAV. The maximum playback length of the audio file is 4 minutes.

