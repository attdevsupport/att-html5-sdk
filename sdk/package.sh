#Packages the SDK for release
#!/usr/bin/env bash


echo "packaging"

echo "building SDK docs"
rm -Rf ../packaged.docs
sh buildDocs.sh

echo "building samples"
cd sample/build/
sh buildSamples.sh
cd ../..

# use the 'working' directory to package the server docs

echo "building Ruby"
cd ../working/server/ruby/
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

# switch back from 'working' to 'sdk' to complete the packaging

cd ../sdk
ant clean package