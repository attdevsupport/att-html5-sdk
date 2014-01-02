=begin rdoc
/**
 * @class Sencha.ServiceProvider.MiniMime
 * This class includes methods to produce Mime content strings for multipart data.
 */
=end
module Sencha
  module ServiceProvider

    class MiniMime

      def initialize
=begin rdoc
/**
 * Creates a unique boundary used to separate each part of the MIME multipart message
 * @property {String} split
 */
=end
        @split = "----=_Part_0_#{((rand*10000000) + 10000000).to_i}.#{((Time.new.to_f) * 1000).to_i}"
=begin rdoc
/**
 * The array of the parts that will be sent in the message.  Use #content to implode the parts into a valid format needed for a MIME multipart message.
 * @property {String[]} contents
 */
=end
        @contents = []
      end

=begin rdoc
/**
 * Adds content to the contents array.  Use the #content method to implode the array when posting the mime.
 * @param {Object} config
 * @param {String} config.type The value for the Content-Type header
 * @param {String} config.content_id The value for the Content-ID header
 * @param {String[]} config.headers An array of any additional headers to add
 *
 * @method add_content
 */
=end
      def add_content(configs)
        result = "Content-Type: #{configs[:type]}"
        # Set the Content-ID header
        if @contents.length == 0 && !configs[:content_id]
          result += "\nContent-ID: <part0@sencha.com>"
          result += "\nContent-Disposition: form-data; name=\"root-fields\""
        else
          content_id = configs[:content_id]
          content_id = "<part#{@contents.length + 1}@sencha.com>" unless content_id
          result += "\nContent-ID: #{content_id}"
        end
        if configs[:headers]
          for k,v in configs[:headers]
            result += "\n#{k}: #{v}"
          end
        end
        result += "\n\n#{configs[:content]}"
        result += "\n" unless configs[:content][-1] == "\n"
        @contents << result
      end

=begin rdoc
/**
 *
 * Returns a string that will be used as the Content-Type for a MIME multipart message
 * @method header
 */
=end
      def header
        'multipart/form-data; type="application/json"; start="<part0@sencha.com>"; boundary="' + @split + '"'
      end

=begin rdoc
/**
 *
 * Returns the content, correctly formated for a MIME multipart message, by imploding the contents array using #split that produces a unique boundary for each part.
 * @method content
 */
=end
      def content
        "--#{@split}\n" + @contents.join("--#{@split}\n") + "--#{@split}--\n"
      end

    end

  end
end