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
 * Given a scope, returns the corresponding AT&T OAuth URL
 *
 * @param {String} scope a comma separated list of services that the app requires access for
 *
 * @method oauthUrl
 */
=end
      def oauthUrl(scope)
        puts "*********** oauthUrl *****************"
        if scope.is_a?(Array)
          # scope will be an array when called by the direct router
          scope = scope[0]
        end
        "#{@base_url}/oauth/authorize?scope=#{scope}&client_id=#{@client_id}&redirect_uri=#{@local_server}/att/callback?scopes=#{scope}"
      end

=begin rdoc
/**
 * Retrieves an access token from AT&T once the user has authorized the application and returned with an auth code
 *
 * @param {String} code The code
 *
 * @method getToken
 */
=end
      def getToken(code)
        url = "#{@base_url}/oauth/access_token"
        data = "grant_type=authorization_code&client_id=#{@client_id}&client_secret=#{@client_secret}&code=#{code}"
        form_post(url, data);
      end

=begin rdoc
/**
 * Refreshes an expired AT&T access_token.
 *
 * @param {String} refresh_token The token from a previous OAuth session to be refreshed
 *
 * @method refreshToken
 */
=end
      def refreshToken(refresh_token)
        url = "#{@base_url}/oauth/access_token"
        data = "grant_type=refresh_token&client_id=#{@client_id}&client_secret=#{@client_secret}&refresh_token=#{refresh_token}"
        form_post(url, data);
      end

    end
  end
end