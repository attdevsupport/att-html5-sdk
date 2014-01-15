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
 * @hide BF2.1 doesnt support DC     
 * Return information on a device
 * @param {String} access_token The OAuth access token
 * @param {String} tel Wireless number of the device to query
 * @method deviceInfo
 * @return {Sencha.ServiceProvider.Att.Response} response The response from the AT&T API call
 */
=end
      def deviceInfo(access_token, tel)
        json_get "#{@base_url}/1/devices/tel:#{URI.escape(tel.to_s)}/info?access_token=#{access_token}"
      end

    end
  end
end
