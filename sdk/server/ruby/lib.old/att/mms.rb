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
 * Sends an MMS to a recipient
 *
 * MMS allows for the delivery of different file types please see the developer documentation for an updated list:
 *  https://developer.att.com/docs
 *
 * @param {String} access_token The oAuth access token
 * @param {String} tel Comma separated list of wireless numbers of the recipients
 * @param {String} file_name The name of the file, eg logo.jpg
 * @param {String} subject The subject line for the MMS
 * @param {String} priority Can be "Default", "Low", "Normal" or "High"
 *
 * @method sendMms
 */
=end
      def sendMms(access_token, tel, file_name, subject, priority)

        begin

          file_mime_type =  MIME::Types.type_for(file_name).first
          file_contents = File.open(MEDIA_DIR + '/' + file_name, 'rb') { |f| f.read }

          # Note we pass -1 to the split method so that it will process trailing commas.
          # http://gfxmonk.net/2011/09/04/ruby-s-split-function-makes-me-feel-special-in-a-bad-way.htm
          if tel =~ /,/
            address = tel.split(',',-1).collect{|t| "tel:#{t}"}
          else
            address = "tel:#{tel}"
          end

          _sendMms(access_token, address, file_mime_type, file_name, file_contents, subject, priority)

        # Captures when the file is not found
        rescue Errno::ENOENT => e
          response = Response.new({:error => "File Not Found"}.to_json)
        end
      end

=begin rdoc
/*
 * Sends an MMS to a recipient
 *
 *  {String} access_token The oAuth access token
 *  {String} address The wireless number of the recipient in the format of "tel:nnnnnnnnnn".  If more than one, an array in the format of ["tel:nnnnnnnnnn","tel:nnnnnnnnn",...].
 *  {String} file_mime_type The MIME type of the content, eg: image/jpg
 *  {String} file_name The name of the file, eg logo.jpg
 *  {Binary} file_contents The contents of the file. Will be converted to Base64
 *  {String} priority Can be "Default", "Low", "Normal" or "High"
 *  {String} subject The subject line for the MMS
 *
 * @method _sendMms
 * @private
 */
=end
      def _sendMms(access_token, address, file_mime_type, file_name, file_contents, subject, priority)
        mimeContent = MiniMime.new
        mimeContent.add_content(
          :type => 'application/json',
          :content => {
            :Address => address,
            :Subject => subject,
            :Priority => priority
           }.to_json
        )

        mimeContent.add_content(
          :type => file_mime_type.to_s + ";name="+ file_name,
          :headers => {
             'Content-Transfer-Encoding' => 'base64',
             'Content-Disposition' => 'attachment; filename="' + file_name + '"'
          },
          :content_id => '<' + file_name + '>',
          :content => Base64.encode64(file_contents)
        )

        url = "#{@base_url}/rest/mms/2/messaging/outbox"
        
        json_post_mime(url, mimeContent, {"Authorization"  => "Bearer #{access_token}"})
      end

=begin rdoc
/**
 * Queries the status of a sent MMS
 *
 * @param {String} access_token The oAuth access token
 * @param {String} mms_id The ID of the MMS as received in the returned data when sending an MMS
 *
 * @method mmsStatus
 */
=end
      def mmsStatus(access_token, mms_id)
        json_get("#{@base_url}/rest/mms/2/messaging/outbox/#{URI.escape(mms_id)}", {"Authorization"  => "Bearer #{access_token}"})
      end

    end
  end
end



