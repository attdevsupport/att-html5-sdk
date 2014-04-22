mkdir ..\..\..\packaged.docs
mkdir ..\..\..\packaged.docs\docs
mkdir ..\..\..\packaged.docs\docs\php
jsduck ^
  public_html/att/service_provider/*.php^
  -o ../../../packaged.docs/docs/php ^
  --eg-iframe=doc_src/inline-eg.html ^
  --guides=doc_src/guides.json ^
  --categories=doc_src/class-categories.json ^
  --images=doc_src/resources/images ^
  --title="AT&T API Platform SDK for HTML5 - PHP Server" ^
  --warnings=all ^
  --head-html="<link rel=\"stylesheet\" href=\"resources/css/styles.css\" type=\"text/css\">" 
