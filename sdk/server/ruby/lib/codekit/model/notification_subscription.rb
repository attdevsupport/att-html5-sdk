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

require 'json'
require 'immutable_struct'

module Att
  module Codekit
    module Service

      class CreatedNotificationSubscription < ImmutableStruct.new(:location, 
                                                                  :transaction_id,
                                                                  :subscription_id,
                                                                  :expires_in,
                                                                  :time_created)
        # @!attribute [r] location
        #   @return [String] location of the notification channel
        # @!attribute [r] transaction_id
        #   @return [String] debug information returned by AT&T APIs
        # @!attribute [r] subscription_id
        #   @return [String] Specifies the unique Id of the Notification
        #     subscription
        # @!attribute [r] expires_in
        #   @return [Integer] when the subscriptions expires compared to time
        #     created
        # @!attribute [r] time_created
        #   @return [Integer] epoch time the subscription was created
       
        
        # Returns if this subscription can expire
        #
        # @return [Boolean] true if the subscription can expire
        def can_expire?
          return !!self.expires_in
        end

        # Check if subscription is expired 
        #
        # @return [Boolean] true if subscription is expired, false if it's 
        #   valid.
        def expired?
          can_expire? && self.expires_in + self.time_created < Time.now.to_i
        end
        
        # Alias for transaction_id
        #
        # @return [String] debug information returned by AT&T APIs
        def system_transaction_id
          self.transaction_id
        end

        # Create a NotificationSubscription object
        #
        # @param response [RestClient::Response] restclient response object
        #
        # @return [NotificationSubscription]
        def self.from_response(response)
          time_created = Time.now.to_i

          headers = response.headers 
          location = headers[:location] 
          trans_id = headers[:x_systemTransactionId] 

          sub = JSON.parse(response)[:subscription]

          subid = sub[:subscriptionId]
          expires_in = sub[:expiresIn].to_i

          new(location, trans_id, subid, expires_in, time_created)
        end
      end

      class NotificationSubscription < ImmutableStruct.new(:events,
                                                           :callback_data,
                                                           :expires_in)
        # @!attribute [r] events
        #   @return [Array] list of events to subscribe, a nil value will
        #     default to ALL events. Acceptable values are "TEXT" and/or "MMS" 
        # @!attribute [r] callback_data
        #   @return [String] This is an optional piece of data that the DHS can
        #     pass to the Subscription and expect to be returned along with any
        #     events specific to the Subscription. cannot exceed 50 characters.
        # @!attribute [r] expires_in
        #   @return [Integer] Specify the time-to-live (seconds) for the
        #     subscription


        # Convert NotificationSubscription to json
        def to_json
          obj = {}
          obj[:events] = Array(self.events) unless self.events.nil?
          obj[:callbackData] = self.callback_data unless self.callback_data.nil?
          obj[:expiresIn] = self.expires_in.to_i unless self.expires_in.nil?
          { :subscription => obj }.to_json
        end
      end

    end
  end
end
