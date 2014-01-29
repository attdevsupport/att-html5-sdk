echo ""
echo "----------------------------------------"
echo "- building Java JSDuck docs for SDK ----"
echo "----------------------------------------"
echo ""
jsduck \
  ./src/com/sencha/att/*.java \
  ./src/com/sencha/att/provider/*.java \
  ./src/com/sencha/att/servlet/*.java \
  ./src/com/sencha/att/util/*.java \
  ./src/com/sencha/jetty/*.java \
  -o docs \
  --title="Java Documentation for the AT&T API Platform SDK for HTML5" \
  --warnings=-all \
  --categories=./doc_src/class-categories.json \
  --welcome=./doc_src/welcome.html \
  --head-html='<style type="text/css">#header-content{ background-image: url(../assets/icon.png); padding-left: 27px; }</style>'
  
cp -R doc_src/resources/* docs/resources/