	function basicSpeechTests() {
 //Function that wraps all of the tests. Slows the tests for throttling purposes.
        function slowTest(name, code) {
                test(name, function() {
                        slowFn(function() {
                                start();
                                code();
                        });
                        stop();
                })
        }

        //Function inside the slowTest function that allows manipulation of the throttling time.
        function slowFn(code) {
                setTimeout(code, 200);
        }

		//Tests utilizing speech API
			slowTest("English Basic Test - Hello Michael!", function() {
						
				var jsonObj = {
					ClientApp: 'TestApp1'
						}
			AttApiClient.setServerPath("http://localhost:4567")			
			AttApiClient.textToSpeech(
				 'Hello Michael!',
				 function(response) {
					//response.start();
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: ") 	
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " );	
				}
			);
			stop();
		});
        
        slowTest("English Basic Test - Paragraph of Text", function() {

			AttApiClient.setServerPath("http://localhost:4567")			
			AttApiClient.textToSpeech("Hello! Welcome to the AT&T Text To Speech (TTS) Test. This test will check to see if the SDK is able to handle large amounts of text. All of what you are hearing has been converted from text, sent to the server via the API and converted into speech. We are now going to end this test. Thank you for listening. Good-Bye!",
				 function(response) {
					//response.start();
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: ") 	
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " );	
				}
			);
			stop();
		});
        
                slowTest("Spanish Basic Test - Hola Miguel", function() {

			AttApiClient.setServerPath("http://localhost:4567")			
			AttApiClient.textToSpeech("Hola Miguel!",
				 function(response) {
					//response.start();
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: ") 	
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " );	
				}
			);
			stop();
		});
        
                slowTest("Spanish Basic Test - Paragraph of Text", function() {

			AttApiClient.setServerPath("http://localhost:4567")			
			AttApiClient.textToSpeech("Hola! Bienvenidos al texto de AT & T a voz (TTS) de prueba. Esta prueba será comprobar si el SDK es capaz de manejar grandes cantidades de texto. Todo lo que está escuchando se ha convertido a partir de texto, se envía al servidor a través de la API y se convierte en discurso. Ahora vamos a terminar esta prueba. Gracias por escuchar. Good-Bye!",
				 function(response) {
					//response.start();
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: ") 	
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " );	
				}
			);
			stop();
		});
	}
