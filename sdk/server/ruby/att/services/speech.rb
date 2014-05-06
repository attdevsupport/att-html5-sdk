class Html5SdkApp < Sinatra::Base

  # @!group Speech

  # @private
  def process_speech_request
    content_type :json # set response type

    begin
      file_data = request.POST['speechaudio']
      if file_data
        return json_error(400, "speechaudio was a String where file data was expected") if file_data.is_a? String
        filename = save_attachment_as_file(file_data)
      elsif request.GET['filename']
        basename = URI.decode request.GET['filename']
        filename = File.join(Html5SdkApp::MEDIA_DIR, basename)
      else
        return json_error(400, "'speechaudio' POST form parameter or 'filename' querystring parameter required")
      end

      opts = { :chunked => !!request.GET['chunked'] }
      opts = querystring_to_options(request, [:xarg, :xargs, :context, :subcontext, :language], opts)
      
      speech = Service::SpeechService.new($config['apiHost'], $client_token, :raw_response => true)
      yield(speech, filename, opts)
    ensure
      if file_data
        FileUtils.remove filename
      end
    end
  end

  # @method post_att_speech_v3_speechtotext
  # @overload post '/att/speech/v3/speechToText'
  #   @param filename [querystring parameter] The name of an audio file on the SDK server containing speech to be converted.
  #   @param speechaudio [binary attachment] Audio speech data to be converted.
  #   @param chunked [querystring parameter] (optional)
  #   @param xargs [querystring parameter] (optional)
  #   @param context [querystring parameter] (optional)
  #   @param subcontext [querystring parameter] (optional)
  #   @param language [querystring parameter] (optional)
  #   @return [JSON]
  #
  #   Returns the text equivalent of the supplied speech, along with some statistics
  #   of the conversion.
  #
  #   While both parameters 'filename' and 'speechaudio' are optional, one of
  #   them must be specified.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/speech/docs for more details of the parameters and their allowed values.
  #
  post '/att/speech/v3/speechToText' do
    process_speech_request { |speech,file,opts| speech.toText(file, opts) }
  end

  # @method post_att_speech_v3_speechtotextcustom
  # @overload post '/att/speech/v3/speechToTextCustom'
  #   @param filename [querystring parameter] The name of an audio file on the SDK server containing speech to be converted.
  #   @param speechaudio [binary attachment] Audio speech data to be converted.
  #   @param chunked [querystring parameter] (optional)
  #   @param xargs [querystring parameter] (optional)
  #   @param context [querystring parameter] (optional)
  #   @param subcontext [querystring parameter] (optional)
  #   @param language [querystring parameter] (optional)
  #   @return [JSON]
  #
  #   Returns the text equivalent of the supplied speech, along with some statistics
  #   of the conversion.
  #
  #   This endpoint uses a custom dictionary and grammar for the speech
  #   conversion. In this implementation, the custom dictionary and data
  #   are hard-coded on the SDK server.
  #
  #   While both parameters 'filename' and 'speechaudio' are optional, one of
  #   them must be specified.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/speech/docs for more details of the parameters and their allowed values.
  #
  post '/att/speech/v3/speechToTextCustom' do
    dictionary = File.join(Html5SdkApp::MEDIA_DIR, $config['defaultDictionaryFile'])
    grammar = File.join(Html5SdkApp::MEDIA_DIR, $config['defaultGrammarFile'])
    process_speech_request { |speech, filename, opts| speech.toText(filename, dictionary, grammar, opts) }
  end

  # @method post_att_speech_v3_texttospeech
  # @overload post '/att/speech/v3/textToSpeech'
  #   @param text [querystring parameter] The text to be converted.
  #   @param contentType [querystring parameter] (optional)
  #   @param contentLanguage [querystring parameter] (optional)
  #   @param accept [querystring parameter] (optional) The desired audio mime type.
  #   @param xargs [querystring parameter] (optional)
  #   @return [binary audio data]
  #
  #   Converts english text to speech audio.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/speech/docs for more details of the parameters and their allowed values.
  #
  post '/att/speech/v3/textToSpeech' do
    text = request.GET['text']
    if text.nil? || text.empty?
      return json_error(400, "non-empty 'text' querystring parameter required")
    end
    text = URI.decode text
    opts = querystring_to_options(request, [:type, :language, :accept, :xarg, :xargs])
    tts = Service::TTSService.new($config['apiHost'], $client_token)
    response = tts.toSpeech(text, opts)
    content_type response.type
    response.data
  end
end
