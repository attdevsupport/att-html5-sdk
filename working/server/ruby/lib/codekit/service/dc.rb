# Licensed by AT&T under 'Software Development Kit Tools Agreement.' 2014 TERMS
# AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION:
# http://developer.att.com/sdk_agreement/ Copyright 2014 AT&T Intellectual
# Property. All rights reserved. http://developer.att.com For more information
# contact developer.support@att.com

require_relative '../model/dc'

module Att
  module Codekit
    module Service

      #@author kh455g
      class DCService < CloudService
        SERVICE_URL = "/rest/2/Devices/Info"

        def initialize(fqdn, token, opts = {})
          super(fqdn, token, opts[:client])
          @raw_response = opts[:raw_response]
        end
        
        # Obtain the device capabilities of device authenticated by code
        #
        # @param code [String] the authentication code (not required if token is already authenticated)
        #
        # @return [DCResponse] parsed api response 
        def getDeviceCapabilities
          url = "#{@fqdn}#{SERVICE_URL}"

          begin
            response = self.get(url)
          rescue RestClient::Exception => e
            raise(ServiceException, e.response || e.message, e.backtrace)
          end
          return response if @raw_response
          Model::DCResponse.createFromJson(response)
        end
        alias_method :capabilities, :getDeviceCapabilities
      end

    end
  end
end
