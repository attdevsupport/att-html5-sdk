#Packages the SDK for release
#!/usr/bin/env bash


echo "packaging"

echo "building SDK docs"
rm -Rf docs
sh buildDocs.sh

echo "building samples"
cd sample/build/
sh buildSamples.sh
cd ../..

echo "building Ruby"
cd server/ruby/
sh buildDocs.sh
cd ../..

echo "building PHP"
cd server/php/
sh buildDocs.sh
cd ../..

echo "building Java"
ant -buildfile server/java/build.xml clean package

ant clean package