require 'sinatra'
require 'yaml'

$server_root = File.dirname(__FILE__)
$site_root = File.dirname(__FILE__) + '/../../client'
$config = YAML.load_file(File.join($server_root, 'app.properties'))

configure do
  set :port, ARGV[0] || 4567
end

set :public_folder, $site_root

get '/' do
  File.read(File.join($site_root, 'index.html'))
end
