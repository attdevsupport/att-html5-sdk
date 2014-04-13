Speech Cookbook
===

Overview
---
This cookbook explains how to create an instance of the AttApiClient class in your app and use it to access methods in the AT&T API Platform SDK for HTML5 for converting audio to text and text to audio.

What do I need to start?
---

1. Include att-api-client.js. Include att-api-client.js as a dependency by including it in your HTML:  

        <script type="text/javascript" src="att-api-client.js"></script>

Adjust the _src_ attribute value to match the site path where you store the _att_api_client.js_ file.


How do I convert an audio file to text?
---

1. Capture spoken voice into an audio file using your device.
2. Upload the audio file to the machine where your SDK server (php/ruby/java) is running.
3. Ensure your SDK server has read access to the audio file.
4. Execute the serverSpeechToText method providing the path to the audio file on your server. For more information about the parameters of this method, refer to AttApiClient.Speech.serverSpeechToText.

<code>

	var audioFile = "/path/to/amr-or-wav/file";

    AttApiClient.Speech.serverSpeechToText(
		{ filename: audioFile },
        function success(response){
        	console.log(response);
        },
        function fail(error){
            console.log(error);
        }
    );

</code>


How do I convert recorded audio to text?
---

1. Capture spoken voice into a JavaScript blob.
2. Execute the speechToText method providing that blob. For more information about the parameters of this method, refer to AttApiClient.Speech.speechToText.

<code>

	var audioBlob = recordUserAudio();

    AttApiClient.Speech.speechToText(
		audioBlob,
        function success(response){
        	console.log(response);
        },
        function fail(error){
            console.log(error);
        }
    );

</code>

How do I convert text to audio?
---

1. Execute the textToSpeech method providing the text to be converted. For more information about the parameters of this method, refer to AttApiClient.Speech.textToSpeech.

<code>

	var text = "Hello World!";

    AttApiClient.Speech.textToSpeech(
		text,
        function success(audioBlob){
        	playAudio(audioBlob);
        },
        function fail(error){
            console.log(error);
        }
    );

</code>

###Tip! Recording Formats and Limits
The maximum length of an audio recording that is allowed by the Speech API is 4 minutes, and the recording must be in one of the following audio formats:

- 16 bit PCM WAV, single channel, 8 kHz sampling
- 16 bit PCM WAV, single channel, 16 kHz sampling
- AMR (narrowband), 12.2 kbit/s, 8 kHz sampling
- AMR-WB (wideband) is 12.65 kbit/s, 16khz sampling
- OGG speex encoding, 8kHz sampling
- OGG speex encoding, 16kHz sampling

