Place your SSL certificate files in this folder.

If you generate separate public and private keys (for example, by using http://www.selfsignedcertificate.com), you can combine them into one pkcs12 file using the following command:

  openssl pkcs12 -export -inkey test.key -in test.cert -out test.pkcs12

You can then generate a .keystore file usable by the SDK Java server, using the following command:

  keytool -importkeystore -srckeystore test.pkcs12 -srcstoretype PKCS12 -destkeystore .keystsore
