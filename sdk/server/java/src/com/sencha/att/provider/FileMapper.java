package com.sencha.att.provider;

import java.io.FileNotFoundException;
import java.io.InputStream;

import javax.activation.MimetypesFileTypeMap;


/**
 *
 * FileMapper is a simple class that is used by ServiceProviderMMS to map
 * API requests to actual File references.
 *
 * The FileManager is needed to work around two realities of modern mobile web applications:
 *
 * 1) Many mobile devices do not support file uploads from the web browser.  As result, the user will need some
 * other way to specify the file they want to upload.
 *
 * 2) For the devices that do support file uploads or for desktop browsers, in the case of ajax application
 *    files are uploaded via a independent request: hidden iframe, html5 file upload, flash, etc.
 *    Once the file has been uploaded and verified back to the browser, then an ajax request
 *    is sent back to the server to initiate the actual request with the form data.
 *    In this case to send the MMS.
 *
 * See {@link com.sencha.att.provider.ServiceProviderMms} for more details.
 *
 * The default implementation will take a string and assume it's a valid file path, and will create a new
 * file reference from it.  Subclass this class and provide your own impl of getFileForReference
 *
 * @author jason
 * @class com.sencha.att.provider.FileMapper
 */
public class FileMapper {


    public class FileMapping {
        public String fileName;
        public String extension;
        public String fileType;
        public InputStream stream;

        public FileMapping(String fileName, String extension, String fileType, InputStream stream) {
            this.fileName = fileName;
            this.extension = extension;
            this.fileType = fileType;
            this.stream = stream;
        }
    }

    /**
     * Creates a valid File reference, based on the string passed.
     *
     * @param fileReference
     * @return File
     * @throws FileNotFoundException
     * @method getFileForReference
     */
    public FileMapping getFileForReference(String fileReference) throws FileNotFoundException {
    	
    	InputStream stream = this.getClass().getClassLoader().getResourceAsStream(fileReference);
    	
    	String type = new MimetypesFileTypeMap().getContentType(fileReference);
    	
    	int pos = fileReference.lastIndexOf(".");
    	String extension = fileReference.substring(pos+1);
    	
    	
    	
        return new FileMapping(fileReference, extension, type, stream);
    }



}
