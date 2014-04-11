pushd att
start "HTML5 SDK Ruby HTTP Server" ruby app.rb
start "HTML5 SDK Ruby HTTPS Server" ruby listener.rb
popd
