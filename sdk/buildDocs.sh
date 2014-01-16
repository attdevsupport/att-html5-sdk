jsduck \
  sample/attlib \
  -o docs \
  --eg-iframe=doc_src/inline-eg.html \
  --guides=doc_src/guides.json \
  --categories=doc_src/class-categories.json \
  --images=doc_src/resources/images \
  --title="AT&T API Platform SDK for HTML5" \
  --warnings=all \
  --welcome=doc_src/welcome.html \
  --head-html='<link rel="stylesheet" href="resources/css/styles.css" type="text/css">' \
  --meta-tags=doc_src/custom-tags/beta.rb

#<style type="text/css">#header-content{ background-image: url(resources/images/logo.png); padding-left: 27px; font-weight: bold;}</style>

#copy the images to output dir (maybe JSDuck can do this automatically?)
cp -R doc_src/resources/* docs/resources/
