=begin rdoc
/**
 * @hide 
 * @class Sencha.ServiceProvider.Att
 */
=end
module Sencha
  module ServiceProvider
    module Att


      def getAd(access_token, udid, params)
        url = "#{@base_url}/rest/1/ads"
        query = ""
        
        if !params.nil? 
          params.each{
            |key, value|
              if (!value.nil? && !value.empty?)
                escaped = URI.escape(value.to_s, Regexp.new("[^#{URI::REGEXP::PATTERN::UNRESERVED}]", false, 'N'))
                query += (query.length() > 0 ? "&" : "?") + "#{key}=#{escaped}" unless escaped.nil?
              end
          }
          url += query
        end
        
        headers = {
          "Authorization"  => "Bearer #{access_token}",
          "User-agent" => @agent.user_agent,
          "UDID" => udid
        }
        
        json_get(url, headers)
      end

    end
  end
end