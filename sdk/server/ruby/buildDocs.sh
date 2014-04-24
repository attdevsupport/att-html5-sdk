echo ""
echo "----------------------------------------"
echo "- building Ruby server docs for SDK ----"
echo "----------------------------------------"
echo ""

mkdir -p ../../../packaged.docs/docs/server/ruby

yardoc \
  --verbose \
  --no-private \
  --title "AT&T HTML5 SDK (Ruby Server)" \
  -o ../../../packaged.docs/docs/server/ruby \
  att/*.rb \
  att/services/*.rb

