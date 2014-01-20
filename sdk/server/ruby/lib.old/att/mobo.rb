=begin rdoc
/**
 * @class Sencha.ServiceProvider.Att
 */
=end
module Sencha
  module ServiceProvider
    module Att
      

     
      
      def _parseAddress(address)
        address.strip! if address.strip != nil
        ret = address
        
        patterns = {
          :tel => {:pattern => /^(\+?[1]-?)?[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/i, :prefix => "tel:" },
          :email => {:pattern => /^[a-zA-Z]\w+(.\w+)*@\w+(.[0-9a-zA-Z]+)*.[a-zA-Z]{2,4}$/i, :prefix => "" },
          :shortcode => {:pattern => /^\d{3,8}$/, :prefix => "short:"}  
        }
        
        patterns.each {|k, v| 
          ret = "#{v[:prefix]}#{address}" if v[:pattern].match(address) 
        } 
        
        return ret
      end
      
      
      def _prepareAddress(tel)
          address = tel.split(',',-1).collect{|t| _parseAddress(t)}
      end
      
      
=begin rdoc
/**
 * Sends Message on Behalf of the given user
 * MOBO (Message on behalf of) allows a user to send MMS or SMS to a list of addresses using the user account.
 * These addresses can be phone numbers, emails or even short codes.     
 *
 * @param {String} access_token The oAuth access token
 * @param {String} tel Comma separated list of Addresses of the recipients
 * @param {String} message The message body to be sent
 * @param {String} subject The subject or title for the message
 * @param {Boolean} group whether or not to send this messages as a group. By default is false meaning the message is broadcasted
 * @param {Array} files The list of files to be sent. If it is included the message will be sent as MMS.                
 * @method sendMobo
 */
=end
      def sendMobo(access_token, tel, message, subject, group, files)
        ml = message ? message.length : 0
        sl = subject ? subject.length : 0 
        payloadSize = ml + sl
        address = _prepareAddress(tel)
        url = "#{@base_url}/rest/1/MyMessages"
        
        content = {
          :Addresses => address,
          :Subject => subject,
          :Text => message,
          :Group => group
        }.to_json
         
        header = {"Authorization"  => "Bearer #{access_token}"}
        
        if  payloadSize > 160 || (files && files.length > 0)
          #MMS
          mimeContent = MiniMime.new
          mimeContent.add_content(
           :type => 'application/json',
           :content => content
          )
          
          if files
            files.each {|file|
              file_name = file
              file_mime_type =  MIME::Types.type_for(file_name).first
              file_contents = File.open(MEDIA_DIR+ '/' + file_name, 'rb') { |f| f.read }              
              mimeContent.add_content(
                :type => file_mime_type,
                :headers => {
                   'Content-Transfer-Encoding' => 'base64',
                   'Content-Disposition' => 'attachment; name="' + file_name + '"'
                },
                :content_id => '<' + file_name + '>',
                :content => Base64.encode64(file_contents)
              )
            }
          end  
          return json_post_mime(url, mimeContent, header)
        else
          #SMS
          return json_post(url, content, header)  
        end
       
        # Captures when the file is not found
        rescue Errno::ENOENT => e
          response = Response.new({:error => "File Not Found"}.to_json)
        end 
      
    end
  end
end

    