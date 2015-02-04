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

module Att
  module Codekit
    module Service

      #@author kh455g
      class Webhooks < CloudService
        NOTIFICATION_RESOURCE = "/notification/v1/channels"

        # Create a notification channel
        #
        #
        # @return [Model::NotificationChannel] 
        def createNotificationChannel(channel_type, content_type, version=1.0)
          url = "#{@fqdn}#{NOTIFICATION_RESOURCE}"
          headers = { 
            :accept => 'application/json', 
            :content_type => "application/json",
          }
          body = self.createChannel(channel_type, content_type, version)

          begin
            r = self.post(url, body.to_json, headers)
          rescue RestClient::Exception => e
            raise(ServiceException, e.response || e.message, e.backtrace)
          end
          Model::NotificationChannel.from_response(r)
        end

        # Create a MIM notification channel
        #
        #
        # @return [Model::NotificationChannel] 
        def createMIMNotificationChannel(content_type, version=1.0)
          createNotificationChannel("MIM", content_type, version)
        end

        # Get a notification channel
        #
        #
        # @return [Model::NotificationChannel] 
        def getNotificationChannel(channel_id)
          cid = CGI.escape(channel_id)
          url = "#{@fqdn}#{NOTIFICATION_RESOURCE}/#{cid}"

          begin
            r = self.get(url)
          rescue RestClient::Exception => e
            raise(ServiceException, e.response || e.message, e.backtrace)
          end
          Model::NotificationChannel.from_response(r)
        end

        def deleteNotificationChannel(channel_id)
          cid = CGI.escape(channel_id)
          url = "#{@fqdn}#{NOTIFICATION_RESOURCE}/#{cid}"

          begin
            r = self.delete(url)
          rescue RestClient::Exception => e
            raise(ServiceException, e.response || e.message, e.backtrace)
          end
          r.headers[:x_systemTransactionId]
        end

        def createNotificationSubscription(channel_id, sub=nil)
          cid = CGI.escape(channel_id)
          url = "#{@fqdn}#{NOTIFICATION_RESOURCE}/#{cid}/subscriptions"
          headers = { 
            :accept => 'application/json', 
            :content_type => "application/json",
          }

          body = ""
          if sub
            if sub.has_key?(:subscriptions) || sub.has_key?("subscriptions")
              body = sub
            else
              body = { :subscriptions => sub }
            end
          end

          begin
            r = self.post(url, body.to_json, headers)
          rescue RestClient::Exception => e
            raise(ServiceException, e.response || e.message, e.backtrace)
          end
          r.to_str
        end

        def updateNotificationSubscription(channel_id, subscription_id, sub=nil)
          cid = CGI.escape(channel_id)
          url = "#{@fqdn}#{NOTIFICATION_RESOURCE}/#{cid}/subscriptions"
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

        def getNotificationSubscription(channel_id, subscription_id)
          cid = CGI.escape(channel_id)
          sid = CGI.escape(subscription_id)
          url = "#{@fqdn}#{NOTIFICATION_RESOURCE}/#{cid}/subscriptions/#{sid}"
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

        def deleteNotificationSubscription(channel_id, subscription_id)
          cid = CGI.escape(channel_id)
          sid = CGI.escape(subscription_id)
          url = "#{@fqdn}#{NOTIFICATION_RESOURCE}/#{cid}/subscriptions/#{sid}"
          headers = { 
            :accept => 'application/json'
          }

          begin
            self.delete(url, headers)
          rescue RestClient::Exception => e
            raise(ServiceException, e.response || e.message, e.backtrace)
          end
        end

        def self.createChannel(service, content_type, version)
          channel = { :serviceName => service }
          channel[:notificationContentType] = content_type unless content_type.nil?
          channel[:notificationVersion] = version unless version.nil?
          { :channel => channel }
        end

      end
    end
  end
end
