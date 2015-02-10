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

      #@author kh455g
      class UserSubscriptionService < CloudService

        def initialize(fqdn, consent_token, channel_id, client=nil)
          super(fqdn, consent_token, client)
          @subscriptions_url = "#{fqdn}/notification/v1/channels/#{channel_id}/subscriptions"
        end
        
        def createNotificationSubscription(sub=nil)
          headers = { 
            :accept => 'application/json', 
            :content_type => "application/json",
          }

          body = ""
          if sub
            if sub.has_key?(:subscription) || sub.has_key?("subscription")
              body = sub
            else
              body = { :subscription => sub }
            end
          end

          begin
            r = self.post(@subscriptions_url, body.to_json, headers)
          rescue RestClient::Exception => e
            raise(ServiceException, e.response || e.message, e.backtrace)
          end
          r.to_str
        end
        
        def updateNotificationSubscription(subscription_id, sub=nil)
          sid = CGI.escape(subscription_id)
          url = "#{@subscriptions_url}/#{sid}"
          headers = { 
              :accept => 'application/json', 
              :content_type => "application/json",
            }
          body = ""
          if sub
            if sub.has_key?(:subscription) || sub.has_key?("subscription")
              body = sub
            else
              body = { :subscription => sub }
            end
          end

          begin
            r = self.put(url, body.to_json, headers)
          rescue RestClient::Exception => e
            raise(ServiceException, e.response || e.message, e.backtrace)
          end
          r.to_str
        end

        def getNotificationSubscription(subscription_id)
          sid = CGI.escape(subscription_id)
          url = "#{@subscriptions_url}/#{sid}"
          headers = { 
            :accept => 'application/json'
          }

          begin
            r = self.get(url, headers)
          rescue RestClient::Exception => e
            raise(ServiceException, e.response || e.message, e.backtrace)
          end
          r.to_str
        end
      end
    end
  end
end
