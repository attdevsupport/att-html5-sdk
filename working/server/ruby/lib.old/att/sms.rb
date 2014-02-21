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
 * Sends an SMS to a recipient
 *
 * @param {String} access_token The OAuth access token
 * @param {String} tel The wireless numbers of the recipient(s). Can contain comma separated list for multiple recipients.
 * @param {String} message The text of the message to send
 *
 * @method sendSms
 */
=end
      def sendSms(access_token, tel, message)

        url = "#{@base_url}/rest/sms/2/messaging/outbox"

        # Note we pass -1 to the split method so that it will process trailing commas
        # http://gfxmonk.net/2011/09/04/ruby-s-split-function-makes-me-feel-special-in-a-bad-way.htm
        if tel =~ /,/
          address = tel.split(',',-1).collect{|t| "tel:#{t}"}
        else
          address = "tel:#{tel}"
        end

        json_post(url, {
          :Address => address,
          :Message => message
        }.to_json, {"Authorization"  => "Bearer #{access_token}"})
      end


=begin rdoc
/**
 * Check the status of a sent SMS
 *
 * @param {String} access_token The OAuth access token
 * @param {String} sms_id The unique SMS ID as retrieved from the response of the sendSms method
 *
 * @method smsStatus
 */
=end
      def smsStatus(access_token, sms_id)
        json_get("#{@base_url}/rest/sms/2/messaging/outbox/#{URI.escape(sms_id)}",{"Authorization"  => "Bearer #{access_token}"})
      end

=begin rdoc
/**
 * Retrieves a list of SMSes sent to the application's short code
 *
 * @param {String} access_token The OAuth access token
 * @param registrationId The registrationId to receive messages from.
 * @method receiveSms
 */
=end
      def receiveSms(access_token, registrationId)
        json_get("#{@base_url}/rest/sms/2/messaging/inbox?RegistrationID=#{registrationId}", {"Authorization"  => "Bearer #{access_token}"})
      end

    end
  end
end
