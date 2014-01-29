echo ""
echo "----------------------------------------"
echo "- building Ruby JSDuck docs for SDK ----"
echo "----------------------------------------"
echo ""
jsduck \
  ./example/*.rb \
  ./lib/*.rb \
  ./lib/att/*.rb \
  -o docs \
  --title="Ruby Documentation for the AT&T API Platform SDK for HTML5" \
  --warnings=-all \
  --welcome=./doc_src/welcome.html \
  --head-html='<style type="text/css">#header-content{ background-image: url(../assets/icon.png); padding-left: 27px; }</style>'
  
  cp -R doc_src/resources/* docs/resources/