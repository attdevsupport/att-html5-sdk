package com.sencha.att.servlet;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;

import com.sencha.att.provider.ClientCredentialsManager;
import com.sencha.att.provider.FileMapper;
import com.sencha.att.provider.FileMapper.FileMapping;


/**
 * @class com.sencha.att.servlet.ClientCredentialsServletBase
 * 
 * Provides common properties and methods for derived servlets
 * that need to use client credential auth. 
 */
abstract class ClientCredentialsServletBase extends HttpServlet {

  protected ClientCredentialsManager credentialsManager;
  
  /*
   * @see HttpServlet#HttpServlet()
   */
  public ClientCredentialsServletBase() {
    super();
  }

  /**
   * @method init
   */
  public void init() throws ServletException {

    this.credentialsManager  = SharedCredentials.getInstance();
  }

  /**
   * @method getFileFromResource
   * Given a filename, creates that file from a similarly-named
   * application resource.
   * 
   * @param filename
   * @return File
   * @throws FileNotFoundException
   * @throws IOException
   */
  protected File getFileFromResource(String filename) throws FileNotFoundException, IOException
  {
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
  protected void copyStreamToFile(InputStream stream, File file) throws FileNotFoundException, IOException
  {
    FileOutputStream out = new FileOutputStream(file.getAbsoluteFile());
    try {
      byte[] buffer = new byte[16 * 1024];
      int len;
      while ((len = stream.read(buffer)) != -1) {
        out.write(buffer, 0, len);
      }
    }
    finally {
      out.close();
    }
  }
  
  /**
   * @method copyResourceToFile
   * Copies the contents of an application resource
   * into the specified file.
   * 
   * @param resourceName
   * @param file
   * @throws FileNotFoundException
   * @throws IOException
   */
  protected void copyResourceToFile(String resourceName, File file) throws FileNotFoundException, IOException
  {
    FileMapper mapper = new FileMapper();
    FileMapping mapping = mapper.getFileForReference(file.getName());
    copyStreamToFile(mapping.stream, file);
  }
  
  /**
   * @method getMergedXArgs
   * we'll accept both xarg and xargs input, and merge
   * them if necessary.
   */
  protected String getMergedXArgs(HttpServletRequest request) throws UnsupportedEncodingException
  {
    String xarg = request.getParameter("xarg");
    String xargs = request.getParameter("xargs");
    
    if ((xarg != null) && (xargs != null)) {
      xarg = URLEncoder.encode(URLDecoder.decode(xarg, "UTF-8") + "," + URLDecoder.decode(xargs, "UTF-8"), "UTF-8");
    }
    else if (xarg == null) {
      xarg = xargs;
    }
    return xarg;
  }
}