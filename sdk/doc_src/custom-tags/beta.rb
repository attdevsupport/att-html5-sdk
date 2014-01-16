  require "jsduck/meta_tag"

  class BetaTag < JsDuck::MetaTag
    def initialize
      # This defines the name of the @tag
      @name = "beta"
      @key = :beta
      @signature = {:long => "beta", :short => "BETA"}
      @boolean = true
    end
  end