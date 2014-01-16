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
 * Get Message Headers
 *
 * @param {String} access_token The OAuth access token
 * @param {Number} headerCount how many headers will be returned
 * @param {String} indexCursor cursor pointer to retrieve message headers      
 *
 * @method getMessageHeaders
 */
=end  
      def getMessageHeaders(access_token, headerCount, indexCursor) 
      
        url = "#{@base_url}/rest/1/MyMessages?HeaderCount=#{headerCount}"
        
        if !indexCursor.nil?
          url+= "&IndexCursor=#{indexCursor}"
        end
        
        json_get(url, {"Authorization"  => "Bearer #{access_token}"})
     
      end
 
      
      
      #private internal use for /att/content endpoint
      def getMessageContents(access_token, messageId, messagePart)
        
        url = "#{@base_url}/rest/1/MyMessages/#{messageId}/#{messagePart}"
        
        @agent.get(url, [], nil, {"Authorization"  => "Bearer #{access_token}"})
          
      end
      
          
    end
  end
end    