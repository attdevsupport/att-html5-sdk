package com.sencha.att.util;


import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 *
 * @class com.sencha.att.util.XMLUtils
 *
 */
public class XMLUtils {

    /**
     * Given an XML string, return the textContent of all of the tags that match tagName as a list.
     * @param xmlStr
     * @param tagName
     * @method getValuesForNode
     * @static
     */
    public static List<String> getValuesForNode(String xmlStr, String tagName) {

        List<String> values = new ArrayList<String>();
         try {

                DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
                DocumentBuilder docBuilder = docBuilderFactory.newDocumentBuilder();

                InputStream is = new ByteArrayInputStream(xmlStr.getBytes("UTF-8"));

                Document doc = docBuilder.parse(is);

                doc.getDocumentElement().normalize();


                NodeList nodes = doc.getElementsByTagName(tagName);
                int nodeCount = nodes.getLength();

                for(int i=0; i<nodeCount; i++){
                    Node node = nodes.item(i);
                    values.add(node.getTextContent());
                }


            }catch (Exception e) {
                e.printStackTrace();
            }

            return values;

    }

}



