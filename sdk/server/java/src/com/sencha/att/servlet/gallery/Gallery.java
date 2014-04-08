package com.sencha.att.servlet.gallery;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

public class Gallery extends HttpServlet{

	private static final long serialVersionUID = 1L;

	public static final String GALLERY_FOLDER = "./gallery/";
	
	private static final String GALLERY_FILE_STRUCTURE = "{\"success\":true, \"galleryCount\": 0, \"galleryImages\" : [] }";
	private static final String GALLERY_JSON = GALLERY_FOLDER + "gallery.json";

	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String fileName = req.getPathInfo().replace("/", "");
		try {
			BufferedInputStream bis = new BufferedInputStream(new FileInputStream(GALLERY_FOLDER+fileName));
			OutputStream os = resp.getOutputStream();
			int nb;
			while( (nb = bis.read()) != -1 ){
				os.write(nb);
			}
			os.flush();
			os.close();
			
		}catch(FileNotFoundException fnfe){
			resp.sendError(404);
		}

	}
	
	
	
	private static FileInputStream getJsonFile() throws IOException {
		FileInputStream stream = null;
		
		File file = new File(GALLERY_JSON);

		if(!file.exists()){
			file.createNewFile();
			FileOutputStream fos = new FileOutputStream(file);
			fos.write(GALLERY_FILE_STRUCTURE.getBytes());
			fos.close();
		}

		stream = new FileInputStream(file);
		
		return stream;
	}
	
	
	
	
	public static void saveGallery(JSONObject gallery) throws IOException{
		FileOutputStream fos = new FileOutputStream(GALLERY_JSON);
		fos.write(gallery.toString().getBytes());
		fos.close();
	}
	
	
	public static JSONObject getGallery() throws IOException, JSONException{
		JSONObject gallery; 
		FileInputStream stream = getJsonFile();
		StringBuilder stringBuilder = new StringBuilder();
		BufferedReader bufferedReader = null;
		try {
		  InputStream inputStream = stream;
		  if (inputStream != null) {
		   bufferedReader = new BufferedReader(new InputStreamReader(
		inputStream));
		   char[] charBuffer = new char[128];
		   int bytesRead = -1;
		   while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
		    stringBuilder.append(charBuffer, 0, bytesRead);
		   }
		  } else {
		   stringBuilder.append("");
		  }
		} catch (IOException ex) {

		} finally {
		  if (bufferedReader != null) {
		   try {
		    bufferedReader.close();
		   } catch (IOException ex) {

		   }
		  }
		}
		
		gallery = new JSONObject(stringBuilder.toString());
		
		return gallery;
	}	

	
	public static void addGalleryImage(JSONObject galleryImage) throws IOException, JSONException{
		JSONObject gallery = getGallery();
		gallery.getJSONArray("galleryImages").put(galleryImage);
		int count = gallery.getInt("galleryCount");
		gallery.put("galleryCount", ++count);
		saveGallery(gallery);
	}
}
