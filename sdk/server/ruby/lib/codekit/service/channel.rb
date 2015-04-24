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

require_relative '../model/notification_channel'

module Att
  module Codekit
    module Service

      #@author kh455g
      class ChannelService < CloudService
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
          body = ChannelService.createChannel(channel_type, content_type, version)

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
            # handle both of these cases: e.response is nil, or
            # e.response is just whitespace (seen in practice).
            error_text = e.response
            error_text = e.message if error_text.to_s.strip.empty?
            raise(ServiceException, error_text, e.backtrace)
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
