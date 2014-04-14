echo ""
echo "---------------------------------------"
echo "- building PHP server docs for SDK ----"
echo "---------------------------------------"
echo ""

mkdir --parents ../../../packaged.docs/server/php

jsduck \
  public_html/att/service_provider/*.php \
  -o ../../../packaged.docs/server/php \
  --warnings=-all \
  --eg-iframe=doc_src/inline-eg.html \
  --guides=doc_src/guides.json \
  --categories=doc_src/class-categories.json \
  --images=doc_src/resources/images \
  --title="AT&T API Platform SDK for HTML5 - PHP Server" \
  --head-html="<link rel=\"stylesheet\" href=\"resources/css/styles.css\" type=\"text/css\">"

