echo ""
echo "---------------------------------"
echo "- building Ruby docs for SDK ----"
echo "---------------------------------"
echo ""
rdoc -o ../../../packaged.docs/server/ruby example
cp -R doc_src/resources/* ../../../packaged.docs/server/ruby/resources/
