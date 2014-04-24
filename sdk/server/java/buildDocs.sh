echo ""
echo "----------------------------------------"
echo "- building Java JSDuck docs for SDK ----"
echo "----------------------------------------"
echo ""

mkdir -p ../../../packaged.docs/docs/server/java

jsduck \
  ./src/com/html5sdk/att/*.java \
  ./src/com/html5sdk/att/provider/*.java \
  ./src/com/html5sdk/att/servlet/*.java \
  ./src/com/html5sdk/att/servlet/gallery/*.java \
  ./src/com/html5sdk/att/servlet/votes/*.java \
  ./src/com/html5sdk/att/util/*.java \
  ./src/com/html5sdk/jetty/*.java \
  -o ../../../packaged.docs/docs/server/java \
  --title="Java Documentation for the AT&T API Platform SDK for HTML5" \
  --warnings=-all \
  --categories=./doc_src/class-categories.json \
  --welcome=./doc_src/welcome.html \
  --head-html='<style type="text/css">#header-content{ background-image: url(../assets/icon.png); padding-left: 27px; }</style>'
  
cp -R doc_src/resources/* ../../../packaged.docs/docs/server/java/resources/

