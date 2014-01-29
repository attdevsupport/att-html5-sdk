package com.sencha.att.servlet.gallery;

import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.text.DateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.StringTokenizer;
import java.util.TimeZone;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.json.JSONObject;

public class GalleryListener  extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		LinkedHashMap<String, String> paramLinkedMap = new LinkedHashMap<String, String>();

		try{
			String data=null;

			InputStream is = request.getInputStream();
			ByteArrayOutputStream baos = new ByteArrayOutputStream();

			byte buf[] = new byte[1024];
			int letti;

			while ((letti = is.read(buf)) > 0)
				baos.write(buf, 0, letti);

			data = new String(baos.toByteArray());
			String senderAddress = data.split("<SenderAddress>tel:")[1].split("</SenderAddress>")[0].substring(2);
			Date d = new Date();
			DateFormat df = DateFormat.getDateInstance(DateFormat.SHORT, Locale.US);
			df.setTimeZone(TimeZone.getTimeZone("PST"));
			DateFormat tf = DateFormat.getTimeInstance(DateFormat.LONG, Locale.US);
			tf.setTimeZone(TimeZone.getTimeZone("PST"));
			String date = df.format(d) + ", " +tf.format(d);

			String[] parts = data.split("--Nokia-mm-messageHandler-BoUnDaRy");
			String[] lowerParts = parts[2].split("BASE64");
			String type = lowerParts[0].split("image/")[1].split(";")[0];
			byte[] outFile = Base64.decodeBase64(lowerParts[1]);
			int random = (int)(Math.random()*10000000);
			FileOutputStream fous = new FileOutputStream(Gallery.GALLERY_FOLDER+random+"."+type);
			fous.write(outFile);
			fous.close();
			String decodedText = "";
			if(parts.length>4) {
				String textPart = parts[3].split("BASE64")[1];
				decodedText = new String(Base64.decodeBase64(textPart));
				decodedText = decodedText.trim();
			} 
			
			StringTokenizer st = new StringTokenizer(data, "&");
			String token;
			while(st.hasMoreTokens()){
				token = st.nextToken();
				paramLinkedMap.put(URLDecoder.decode(token.substring(0, token.indexOf("=")), "UTF-8"),
						URLDecoder.decode(token.substring(token.indexOf("=")+1, token.length()), "UTF-8"));
			}

			PrintWriter outWrite = new PrintWriter(new BufferedWriter(new FileWriter(Gallery.GALLERY_FOLDER + random + "." + type + ".txt")), false);
			String toSave = senderAddress + "\n" + date + "\n" + decodedText;
			outWrite.write(toSave);
			outWrite.close();
			
			JSONObject galleryImage = new JSONObject();
			galleryImage.put("image", random+"."+type);
			galleryImage.put("date", date);
			galleryImage.put("address", senderAddress);
			galleryImage.put("textMessage", decodedText);
			
			Gallery.addGalleryImage(galleryImage);
			
			
		}catch(Exception e){
			e.printStackTrace();
		}



	}


}
