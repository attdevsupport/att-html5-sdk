echo ""
echo "----------------------------------------"
echo "- building Ruby server docs for SDK ----"
echo "----------------------------------------"
echo ""
mkdir --parent ../../../packaged.docs/server/ruby
yardoc \
  --verbose \
  --no-private \
  --title "AT&T HTML5 SDK (Ruby Server)" \
  -o ../../../packaged.docs/server/ruby \
  att/*.rb \
  att/services/*.rb

