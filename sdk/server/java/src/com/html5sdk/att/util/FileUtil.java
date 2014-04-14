package com.html5sdk.att.util;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.Part;

import org.apache.tika.mime.MimeType;
import org.apache.tika.mime.MimeTypeException;
import org.apache.tika.mime.MimeTypes;

import com.html5sdk.att.provider.FileMapper;
import com.html5sdk.att.provider.FileMapper.FileMapping;

/**
 * File Utility class
 * 
 * @class com.html5sdk.att.util.FileUtil
 */
public class FileUtil {
    /**
     * @method getFileFromResource Given a filename, creates that file from a
     *         similarly-named application resource.
     * 
     * @param filename
     * @return File
     * @throws FileNotFoundException
     * @throws IOException
     */
    public static File getFileFromResource(String filename)
            throws FileNotFoundException, IOException {
        String tempdir = System.getProperty("java.io.tmpdir");
        String filepath = tempdir + filename;
        File file = new File(filepath);
        copyResourceToFile(filename, file);
        return file;
    }

    /**
     * @method copyStreamToFile
     * @param stream
     * @param file
     * @throws FileNotFoundException
     * @throws IOException
     */
    public static void copyStreamToFile(InputStream stream, File file)
            throws FileNotFoundException, IOException {
        FileOutputStream out = new FileOutputStream(file.getAbsoluteFile());
        try {
            byte[] buffer = new byte[16 * 1024];
            int len;
            while ((len = stream.read(buffer)) != -1) {
                out.write(buffer, 0, len);
            }
        } finally {
            out.close();
        }
    }

    /**
     * @method copyResourceToFile Copies the contents of an application resource
     *         into the specified file.
     * 
     * @param resourceName
     * @param file
     * @throws FileNotFoundException
     * @throws IOException
     */
    public static void copyResourceToFile(String resourceName, File file)
            throws FileNotFoundException, IOException {
        FileMapper mapper = new FileMapper();
        FileMapping mapping = mapper.getFileForReference(file.getName());
        copyStreamToFile(mapping.stream, file);
    }

    /**
     * @method createFileFromPart Creates a new file whose contents come from an
     *         HTTP request attachment.
     * 
     * @param part
     * @throws MimeTypeException
     * @throws IOException
     */
    public static File createFileFromPart(Part part) throws MimeTypeException,
            IOException {
        // We do some work to make sure the file has the right extension, since
        // codekit relies on the extension to determine content-type.
        String contentType = part.getContentType();
        MimeTypes types = MimeTypes.getDefaultMimeTypes();
        MimeType type = types.forName(contentType);
        String extension = type.getExtension();
        if (extension.isEmpty() && contentType.equals("audio/wav")) {
            type = types.forName("audio/x-wav");
            extension = type.getExtension();
        }
        if (extension.isEmpty()) {
            throw new RuntimeException("no extension found for Content-Type '"
                    + part.getContentType() + "'");
        }
        File file = File.createTempFile("speechaudio", extension);
        FileUtil.copyStreamToFile(part.getInputStream(), file);
        return file;
    }
}
