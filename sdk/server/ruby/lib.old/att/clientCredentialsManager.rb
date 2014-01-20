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
 * Runs in a separate thread and calls get_client_model_info in order to get a client token from AT&T
 * @method run_get_client_model_info_in_thread
 */
=end
      def run_get_client_model_info_in_thread
        Thread.new do

          response = get_client_model_info
          
          if response.error?
            if Sencha::DEBUG == :all
              @agent.log.debug 'Error retrieving client model info'
            end
          else
            # Store the token info in the session for use in future API calls
            @client_model_token = response.data['access_token']
            @client_model_expires_in = response.data['expires_in']
            @client_model_refresh_token = response.data['refresh_token']
            
            if Sencha::DEBUG == :all
              puts "client_model token info:"
              @agent.log.debug "client_model_token :         #{@client_model_token}"
              @agent.log.debug "client_model_expires_in :    #{@client_model_expires_in}"
              @agent.log.debug "client_model_refresh_token : #{@client_model_refresh_token}"
            end
          end
        end
      end


=begin rdoc
/**
 * Retrieves a client token from AT&T
 * @method run_get_client_model_info
 */
=end
      def get_client_model_info
        url = "#{@base_url}/oauth/token"
        data = "grant_type=client_credentials&client_id=#{@client_id}&client_secret=#{@client_secret}&scope=#{@client_model_scope}"
        form_post(url, data);
      end


=begin rdoc
/**
 * Checks the method passed in and if a client_model_method, the client_model_token is returned, otherwise, returns nil
 * @ param method the method to check and see if it is in the defined clent_model_methods array
 * @method get_client_model_token
 */
=end
      def get_client_model_token(method)

        if @client_model_methods.include?(method)
          if Sencha::DEBUG == :all
            @agent.log.debug "client_model_token = #{@client_model_token}"
          end
          return @client_model_token
        else
           if Sencha::DEBUG == :all
            @agent.log.debug "method #{method} needs an authorization token"
           end 
          return nil
        end

      end


    end
  end
end