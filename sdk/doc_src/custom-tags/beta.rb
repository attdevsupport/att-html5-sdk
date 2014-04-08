  require "jsduck/tag/boolean_tag"

  class BetaTag < JsDuck::Tag::BooleanTag
    def initialize
      # This defines the name of the @tag
      @pattern = "beta"
      @signature = {:long => "beta", :short => "BETA"}
      super
    end
  end