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
 * Return information on a device
 * @param {String} access_token The OAuth access token
 * @method deviceInfo
 * @return {Sencha.ServiceProvider.Att.Response} response The response from the AT&T API call
 */
=end
      def deviceInfo(access_token)
        json_get("#{@base_url}/rest/2/Devices/Info", {"Authorization" => "Bearer #{access_token}"})
      end

    end
  end
end
