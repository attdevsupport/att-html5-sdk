=begin rdoc
/**
 * @class Sencha.ServiceProvider.Att
 */
=end
module Sencha
  module ServiceProvider
    module Att

=begin rdoc
/**
 * Sends a WAP Push to a device
 *
 * @param {String} access_token The OAuth access token
 * @param {String} tel A comma separated list of the wireless numbers of the recipients
 * @param {String} message The message to send
 *
 * @method wapPush
 */
=end
      def wapPush(access_token, tel, message)

        mimeContent = Sencha::ServiceProvider::MiniMime.new

         # Note we pass -1 to the split method so that it will process trailing commas
        # http://gfxmonk.net/2011/09/04/ruby-s-split-function-makes-me-feel-special-in-a-bad-way.htm
        if tel =~ /,/
          recipients_a = tel.split(',',-1).collect{|t| "\"tel:#{t}\""}
          recipients = "["+recipients_a.join(",")+"]"  
        else
          recipients = "\"tel:#{tel}\""
        end
        
        mimeContent.add_content(
          :type => 'application/json',
          :content =>"{ address:#{recipients} }"
        )

        mimeContent.add_content(
          :type => 'text/xml',
          :content =>
            'Content-Disposition: form-data; name="PushContent"' +  "\n" +
            'Content-Type: text/vnd.wap.si' +  "\n" +
            'Content-Length: 12' +  "\n" +
            'X-Wap-Application-Id: x-wap-application:wml.ua' +  "\n" +
            '' +  "\n" +
            message

            # The below code isn't needed now since the xml string for the message
            # needs to be built in the javascript app and sent that way and thus,
            # the message param is in xml format already
            #'<?xml version ="1.0"?>' +  "\n" +
            #'<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">' +  "\n" +
            #'<si>' +  "\n" +
            #'   <indication href="' + href + '" si-id="1">' +  "\n" +
            #'     ' + message +  "\n" +
            #'   </indication>' +  "\n" +
            #'</si>'
        )

        url = "#{@base_url}/1/messages/outbox/wapPush"
        json_post_mime(url, mimeContent,  {"Authorization"  => "Bearer #{access_token}"})

      end

    end
  end
end