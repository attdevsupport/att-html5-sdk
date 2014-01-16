#!/bin/bash

echo ""
echo "----------------------------------------"
echo "- building CMS App1 docs  --------------"
echo "----------------------------------------"
echo ""
jsduck \
../builds/samples/apps/CMS/App1/app \
-o ../builds/samples/apps/CMS/App1/docs \
--eg-iframe=../doc_src/inline-eg.html \
--images=../doc_src \
--title="CMS App1 - Basic CMS Service Application" \
--warnings=-all \
--guides=../doc_src/guides.json \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb

echo ""
echo "----------------------------------------"
echo "- building SMS App1 docs  --------------"
echo "----------------------------------------"
echo ""
jsduck \
../builds/samples/apps/SMS/App1/app \
-o ../builds/samples/apps/SMS/App1/docs \
--eg-iframe=../doc_src/inline-eg.html \
--images=../doc_src \
--title="SMS App1 - Basic SMS Service Application" \
--warnings=-all \
--guides=../doc_src/guides.json \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb


echo ""
echo "----------------------------------------"
echo "- building SMS App2 docs  --------------"
echo "----------------------------------------"
echo ""
jsduck \
../builds/samples/apps/SMS/App2/app \
-o ../builds/samples/apps/SMS/App2/docs \
--eg-iframe=../doc_src/inline-eg.html \
--images=../doc_src \
--title="SMS App2 - SMS Voting Application" \
--warnings=-all \
--guides=../doc_src/guides.json \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb


echo ""
echo "----------------------------------------"
echo "- building MMS App1 docs  --------------"
echo "----------------------------------------"
echo ""
jsduck \
../builds/samples/apps/MMS/App1/app \
-o ../builds/samples/apps/MMS/App1/docs \
--eg-iframe=../doc_src/inline-eg.html \
--images=../doc_src \
--title="MMS App1 - Basic MMS Service Application" \
--warnings=-all \
--guides=../doc_src/guides.json \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb


echo ""
echo "----------------------------------------"
echo "- building MMS App2 docs  --------------"
echo "----------------------------------------"
echo ""
jsduck \
../builds/samples/apps/MMS/App2/app \
-o ../builds/samples/apps/MMS/App2/docs \
--eg-iframe=../doc_src/inline-eg.html \
--images=../doc_src \
--title="MMS App2 - MMS Coupon Application" \
--warnings=-all \
--guides=../doc_src/guides.json \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb


echo ""
echo "----------------------------------------"
echo "- building MMS App3 docs  --------------"
echo "----------------------------------------"
echo ""
jsduck \
../builds/samples/apps/MMS/App3/app \
-o ../builds/samples/apps/MMS/App3/docs \
--eg-iframe=../doc_src/inline-eg.html \
--images=../doc_src \
--title="MMS App3 - MMS Gallery Application" \
--warnings=-all \
--guides=../doc_src/guides.json \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb


echo ""
echo "----------------------------------------"
echo "- building WAPPush App1 docs  ----------"
echo "----------------------------------------"
echo ""
jsduck \
../builds/samples/apps/WAPPush/App1/app \
-o ../builds/samples/apps/WAPPush/App1/docs \
--eg-iframe=../doc_src/inline-eg.html \
--images=../doc_src \
--title="WAPPush App1 - Basic WAP Push Service Application" \
--warnings=-all \
--guides=../doc_src/guides.json \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb


echo ""
echo "----------------------------------------"
echo "- building TL App1 docs  ---------------"
echo "----------------------------------------"
echo ""
jsduck \
../builds/samples/apps/TL/App1/app \
-o ../builds/samples/apps/TL/App1/docs \
--eg-iframe=../doc_src/inline-eg.html \
--images=../doc_src \
--title="TL App1 - Map of Device Location Application" \
--warnings=-all \
--guides=../doc_src/guides.json \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb



echo ""
echo "----------------------------------------"
echo "- building Payment App1 docs  ----------"
echo "----------------------------------------"
echo ""
jsduck \
../builds/samples/apps/Payment/App1/app \
-o ../builds/samples/apps/Payment/App1/docs \
--eg-iframe=../doc_src/inline-eg.html \
--images=../doc_src \
--title="Payment App1 - Notary Application" \
--warnings=-all \
--guides=../doc_src/guides.json \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb


echo ""
echo "----------------------------------------"
echo "- building Payment App2 docs  ----------"
echo "----------------------------------------"
echo ""
jsduck \
../builds/samples/apps/Payment/App2/app \
-o ../builds/samples/apps/Payment/App2/docs \
--eg-iframe=../doc_src/inline-eg.html \
--images=../doc_src \
--title="Payment App2 - Single Pay Application" \
--warnings=-all \
--guides=../doc_src/guides.json \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb


echo ""
echo "----------------------------------------"
echo "- building Payment App3 docs  ----------"
echo "----------------------------------------"
echo ""
jsduck \
../builds/samples/apps/Payment/App3/app \
-o ../builds/samples/apps/Payment/App3/docs \
--eg-iframe=../doc_src/inline-eg.html \
--images=../doc_src \
--title="Payment App3 - Subscription Application" \
--warnings=-all \
--guides=../doc_src/guides.json \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb


echo ""
echo "----------------------------------------"
echo "- building MOBO App1 docs  ----------"
echo "----------------------------------------"
echo ""
jsduck \
../builds/samples/apps/MOBO/App1/app \
-o ../builds/samples/apps/MOBO/App1/docs \
--eg-iframe=../doc_src/inline-eg.html \
--images=../doc_src \
--title="MOBO App1 - Generic Message on Behalf of" \
--warnings=-all \
--guides=../doc_src/guides.json \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb


echo ""
echo "----------------------------------------"
echo "- building Speech App1 docs  ----------"
echo "----------------------------------------"
echo ""
jsduck \
../builds/samples/apps/Speech/App1/app \
-o ../builds/samples/apps/Speech/App1/docs \
--eg-iframe=../doc_src/inline-eg.html \
--images=../doc_src \
--title="Speech To Text App1 - Speech to Text Generic App" \
--warnings=-all \
--guides=../doc_src/guides.json \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb


echo ""
echo "----------------------------------------"
echo "- building MIM App1 docs  ----------"
echo "----------------------------------------"
echo ""
jsduck \
../builds/samples/apps/MIM/App1/app \
-o ../builds/samples/apps/MIM/App1/docs \
--eg-iframe=../doc_src/inline-eg.html \
--images=../doc_src \
--title="MIM App1 - My Messages Generic App" \
--warnings=-all \
--guides=../doc_src/guides.json \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb


echo ""
echo "----------------------------------------"
echo "- building SAMPLE APP GUIDES docs ------"
echo "----------------------------------------"
echo ""
jsduck \
-o ../builds/samples/docs \
--eg-iframe=../doc_src/inline-eg.html \
--guides=../doc_src/guides.json \
--images=../doc_src \
--title="Sample Applications" \
--warnings=-all \
--welcome=../doc_src/welcome.html \
--meta-tags=../doc_src/custom-tags/beta.rb


echo "----------------------------------------"
echo "EXITING JSDUCK WORK"
echo "----------------------------------------"
exit
