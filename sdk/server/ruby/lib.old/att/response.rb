module Sencha
  module ServiceProvider
    module Att

=begin rdoc
/**
 * @class Sencha.ServiceProvider.Att.Response
 *
 * This class deals with the JSON response from AT&T. It provides simple methods to
 * determine whether the response is an error and if so, it extracts the
 * error message. If the response is not an error, it assumes it is a JSON
 * object and decodes it. Here's an example of how this class is used:
 *
 *     $response = $provider.sendSms('abc123', '415-555-2425', 'Test SMS')
 *
 *     if response.error?
 *       puts "Error! " + response.error
 *     else
 *       puts "Success! " + response.data
 *     end
 *
 * @cfg {Object/String} response An http response object or a string of JSON data
 */
=end
      class Response

        # This class is initialized with a string or exception.
        def initialize(response)

          # If the debug flag is set, output the response to the console.
#          if Sencha::DEBUG == :all
#            @agent.log.debug "DEBUG #{__FILE__} line #{__LINE__}"
#            if response.respond_to?(:page)
#              @agent.log.debug "response.page.body = "
#              @agent.log.debug response.page.body
#            elsif response.respond_to?(:body)
#              @agent.log.debug "response.body = "
#              @agent.log.debug response.body
#            else
#              @agent.log.debug "response.inspect = "
#              @agent.log.debug response.inspect
#            end
#          end

          if response.is_a?(Exception)
            if response.respond_to?(:response_code) && response.response_code =~ /^40(1|3)$/
              # If the error has an HTTP status of 401 or 403, we have a permission error
              if response.respond_to?(:page)
                parse_response_error response.page.body
              else
                @error = "Unauthorized request"
              end
            elsif response.respond_to?(:page)
              # If the exception has a *page* method, we actually have some response from
              # the server we can try to decode.
              parse_response_error response.page.body
            elsif response.is_a?(Timeout::Error)
              # The request timed out...
              @error = "Request timed out"
            else
              # If none of the above, pass back a *stringified* version of the response
              @error = response.inspect
            end
          else
            # If the response is not an exception, assume it is JSON and decode it
            if response.respond_to?(:body) 
              if !response.body.empty?
                @response = JSON.parse(response.body)
              else
                @response = ''
              end
            else
              # we are just dealing with a string passed to this class so check for an error
              parsed = JSON.parse(response)
              if parsed['error']
                @error = parsed['error']
              else
                @response = parsed
              end
            end
          end
        end

=begin rdoc
/**
 * Used to see whether or not the response was an error
 * @method error?
 */
=end
        def error?
          @error ? true : false
        end

=begin rdoc
/**
 * Returns the error message
 * @method error
 */
=end
        def error
          @error
        end

=begin rdoc
/**
 * Returns the decoded data from the server (assuming there was no exception)
 * @method data
 */
=end
        def data
          @response
        end

        private

=begin rdoc
/**
 * Parses the data passed in.
 * It first tries json_decode and if it fails tries Crack::XML.parse.
 * If both fail, the original value passed in is returned.
 *
 * @param {String} $parsed
 *
 * @method parse_response_error
 * @private
 */
=end
          def parse_response_error(body)

            # Default the error to the entire body content
            @error = body

            begin
              # Try to parse the response as JSON
              parsed = JSON.parse(@error)
              @error = parsed
            rescue Exception => e
              # If parsing as JSON failed, try parsing as XML...
              begin
                parsed = Crack::XML.parse(@error)
                @error = parsed
              rescue Exception => e
                # If it is not JSON or XML, treat as a string.
              end
            end
          end

      end
    end
  end
end