def process_speech_request
  content_type :json # set response type

  begin
    file_data = request.POST['speechaudio']
    if file_data
      return json_error(400, "speechaudio was a String where file data was expected") if file_data.is_a? String
      filename = save_attachment_as_file(file_data)
    elsif request.GET['filename']
      basename = URI.decode request.GET['filename']
      filename = File.join(MEDIA_DIR, basename)
    else
      return json_error(400, "'speechaudio' POST form parameter or 'filename' querystring parameter required")
    end

    opts = { :chunked => !!request.GET['chunked'] }
    opts = querystring_to_options(request, [:xarg, :xargs, :context, :subcontext], opts)
    
    speech = Service::SpeechService.new($config['apiHost'], $client_token, :raw_response => true)
    yield(speech, filename, opts)
  ensure
    if file_data
      FileUtils.remove filename
    end
  end
end

post '/att/speech/v3/speechToText' do
  process_speech_request { |speech,file,opts| speech.toText(file, opts) }
end

post '/att/speech/v3/speechToTextCustom' do
  dictionary = File.join(MEDIA_DIR, $config['defaultDictionaryFile'])
  grammar = File.join(MEDIA_DIR, $config['defaultGrammarFile'])
  process_speech_request { |speech, filename, opts| speech.toText(filename, dictionary, grammar, opts) }
end

post '/att/speech/v3/textToSpeech' do
  text = request.GET['text']
  if text.nil? || text.empty?
    return json_error(400, "non-empty 'text' querystring parameter required")
  end
  text = URI.decode text
  opts = querystring_to_options(request, [:xarg, :xargs, :accept])
  tts = Service::TTSService.new($config['apiHost'], $client_token)
  response = tts.toSpeech(text, opts)
  content_type response.type
  response.data
end
