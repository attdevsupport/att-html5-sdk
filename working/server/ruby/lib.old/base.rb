=begin rdoc
/**
 * @class Sencha.ServiceProvider.Base
 */
=end
require 'json'
require 'crack'
require 'mechanize'
require 'json'
require File.dirname(__FILE__) + '/mini_mime'

require File.dirname(__FILE__) + '/att/base'

module Sencha
  module ServiceProvider
    class Base

=begin rdoc
/**
 * This is a Factory method which instantiates a Sencha ServiceProvider subclass
 * depending on the 'provider' config option.
 *
 * @param {Object} config
 * @param {String} config.provider The provider to use when instantiating a Sencah ServiceProvider subclass.  Currently only 'att' is a valid provider.
 * @method init
 */
=end
      def self.init(config)
        raise ArgumentError, "provider must be set" unless provider = config[:provider]

        Sencha::ServiceProvider.const_get(config[:provider].to_s.capitalize)::Base.new(config)
      end
    end
  end
end