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
       * Create a new CMS session 
       * @param host
       * @param accessToken
       * @param params
       * @return
       * @throws ApiRequestException
       */
=end      
      def cmsCreateSession(access_token, params)
        url = "#{@base_url}/rest/1/Sessions"
        
        headers = {
          "Authorization"  => "Bearer #{access_token}"
        }
        
        json_post(url, params.to_json, headers)
      end


=begin rdoc
      /**
       * Send a signal to the given CMS sessionId  
       * @param host
       * @param accessToken
       * @param sessionId
       * @param signal
       * @return
       * @throws ApiRequestException
       * @throws JSONException
       */
=end      
      def cmsSendSignal(access_token, sessionId, signal)
        url = "#{@base_url}/rest/1/Sessions/#{sessionId}/Signals"
        params = {
          :signal => signal
        }.to_json
        
        headers = {
          "Authorization"  => "Bearer #{access_token}"
        }
        
        json_post(url, params, headers)
        
      end
    end
  end
end