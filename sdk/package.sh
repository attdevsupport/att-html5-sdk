#Packages the SDK for release
#!/usr/bin/env bash


echo "packaging"

echo "building SDK docs"
rm -Rf ../packaged.docs
sh buildDocs.sh

echo "building Ruby docs"
cd server/ruby/
sh buildDocs.sh

echo "building PHP docs"
cd ../php/
sh buildDocs.sh

echo "building Java docs"
cd ../java/
sh buildDocs.sh

cd ../..

echo "building Java binaries"
ant -buildfile server/java/build.xml clean package-jar

echo "building SDK"
ant clean package

