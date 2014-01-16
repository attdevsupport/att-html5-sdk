=begin rdoc
/**
 * @class Sencha.ServiceProvider.Att
 */
=end
module Sencha
  module ServiceProvider
    module Att

=begin rdoc
/*
 * Request to Speech to text functionality
 *
 *  {String} access_token The oAuth access token
 *  {String} file_name The file name used to convert to text.
    {boolean} streamed true to send the file as stream  
 *
 * @method speechToText
 */
=end            
      def speechToText(access_token, file_name, streamed)
        begin

        #mime type for wav returns audio/x-wav and it is not supported by ATT api          
        #file_mime_type =  MIME::Types.type_for(file_name)
          
          ext = File.extname(file_name).sub!(".", "")
          file_mime_type = "audio/#{ext}"
          file_contents = File.open(MEDIA_DIR + '/' + file_name, 'rb') { |f| f.read }

          url = "#{@base_url}/rest/1/SpeechToText"
          
          headers = {
            "Authorization"  => "Bearer #{access_token}",
            "Accept" => "application/json",
            "Content-Type" => file_mime_type
          }

          if(streamed) 
            headers.merge!({
              "Connection" => "Keep-Alive",
              "Transfer-Encoding" => "chunked"  
            });
          end
          
          puts "POST to #{url} file #{file_name} with mime #{file_mime_type}"
          
          Response.new @agent.post(url, file_contents, headers)
          
          
        # Captures when the file is not found
        rescue Errno::ENOENT => e
          response = Response.new({:error => "File Not Found"}.to_json)
        end
      end

    end
  end
end
