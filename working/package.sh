#Packages the SDK for release
#!/usr/bin/env bash


echo "packaging"

echo "building SDK docs"
rm -Rf ../packaged.docs
sh buildDocs.sh

echo "building Ruby"
cd server/ruby/
sh buildDocs.sh

echo "building PHP"
cd ../php/
#
# need to find and integrate a tool to generate PHP source
# documentation before re-enabling this.
#
# sh buildDocs.sh
#
cd ../..

echo "building Java"
ant -buildfile server/java/build.xml clean package-jar

ant clean package
