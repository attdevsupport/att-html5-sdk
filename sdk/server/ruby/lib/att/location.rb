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
 * Return location info for a device
 * @param {String} access_token The OAuth access token
 * @param {Number} requested_accuracy The requested accuracy in meters
 * @param {Number} acceptable_accuracy The acceptable accuracy in meters
 * @param {String} tolerance The application's priority of response time versus accuracy (NoDelay, LowDelay, DelayTolerant)
 * @method deviceLocation
 * @return {Sencha.ServiceProvider.Att.Response} response The response from the AT&T API call
 */
=end
      def deviceLocation(access_token, requested_accuracy, acceptable_accuracy, tolerance)
        url = "#{@base_url}/2/devices/location?"
        
        
        # add requestedAccuracy if available
        if requested_accuracy != nil
          url += "&requestedAccuracy=#{URI.escape(requested_accuracy.to_s)}"
        end

        # add acceptableAccuracy if available
        if acceptable_accuracy != nil
          url += "&acceptableAccuracy=#{URI.escape(acceptable_accuracy.to_s)}"
        end

        # add tolerance if available
        if tolerance != nil
          url += "&tolerance=#{URI.escape(tolerance.to_s)}"
        end
        
        if Sencha::DEBUG == :all
          @agent.log.debug "location: #{url}"   
        end
        
        json_get(url, {"Authorization"  => "Bearer #{access_token}"})

      end

    end
  end
end
