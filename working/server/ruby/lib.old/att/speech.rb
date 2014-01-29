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
      
 *  {boolean} chunked true to send the file as stream
 *  {String} context  the context where the speech is going to be parsed.
 *  {Map} xargs the value pair for xargs parameters      
 *
 * @method speechToText
 */
=end            
      def speechToText(access_token, file_name, file_content_type, chunked, context, xargs)
        begin
          req = ""
          file_mime_type = file_content_type
#          MIME::Types.type_for(file_name)[0]
          file_contents = File.open(MEDIA_DIR + '/' + file_name, 'rb') { |f| f.read }

          url = "#{@base_url}/rest/2/SpeechToText"

          if Sencha::DEBUG == :all
            @agent.log.debug "POST to #{url} file #{file_name} with mime #{file_mime_type} chunked: #{chunked}"
          end
                    
          headers = {
            "Authorization"  => "Bearer #{access_token}",
            "Accept" => "application/json",
            "Content-Type" => file_mime_type.to_s().downcase
          }
          
          if(context)
            headers.merge!({"X-SpeechContext" => context})
          end  
          
          if !xargs.nil? 
            xargs_str = ""
            size = xargs.size
            l = 0;
            xargs.each{
              |key, value|
              if(!value.nil? && !value.empty?)
                xargs_str +="#{key}=#{URI.escape(value.to_s)}"
                if(l<size-1)
                  xargs_str += ","
                end  
              end
              ++l
            }
            
            if(xargs_str.length > 0)
              headers.merge!({"X-Args" => xargs_str})
            end  
            
          end

          if(chunked) 
            headers.merge!({
              "Connection" => "Keep-Alive",
              "Transfer-Encoding" => "chunked"  
            });
            
#            file_contents.scan(/.{1,512}/).each {  |chunk|
#              req += "#{chunk.size.to_s(16)}\r\n#{chunk}\r\n"
#            }
#            
#            
#            Response.new @agent.agent.fetch(url, 'POST', headers, [req], Mechanize::Page.new)
#          else
          end
          
          req = file_contents  
          Response.new @agent.post(url, req, headers)
          
          
        # Captures when the file is not found
        rescue Errno::ENOENT => e
          response = Response.new({:error => "File Not Found"}.to_json)
        end
      end

    end
  end
end
