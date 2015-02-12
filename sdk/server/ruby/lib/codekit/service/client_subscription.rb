# Copyright 2015 AT&T
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

require_relative '../model/notification_subscription'

module Att
  module Codekit
    module Service

      class SubscriptionNotFoundException < ServiceException; end

      #@author kh455g
      class ClientSubscriptionService < CloudService

        def initialize(fqdn, client_token, channel_id, client=nil)
          super(fqdn, client_token, client)
          @subscriptions_url = "#{fqdn}/notification/v1/channels/#{channel_id}/subscriptions"
        end
        
        def deleteNotificationSubscription(subscription_id)
          sid = CGI.escape(subscription_id)
          url = "#{@subscriptions_url}/#{sid}"
          headers = { 
            :accept => 'application/json'
          }

          begin
            self.delete(url, headers)
          rescue RestClient::Exception => e
            # the back-end web service doesn't provide any useful details on a
            # 404 response, so add our own.
            raise SubscriptionNotFoundException if e.http_code == 404
            raise(ServiceException, e.response || e.message, e.backtrace)
          end
        end
      end
    end
  end
end
