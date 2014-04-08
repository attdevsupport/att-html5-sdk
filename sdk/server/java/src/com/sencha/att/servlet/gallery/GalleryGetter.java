package com.sencha.att.servlet.gallery;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

public class GalleryGetter extends HttpServlet {

	private static final long serialVersionUID = 1L;

	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		JSONObject jsonResponse = new JSONObject();
		PrintWriter writer = resp.getWriter();
		try {
			 jsonResponse = Gallery.getGallery();
		} catch (JSONException e) {
			e.printStackTrace();
		}

		writer.write(jsonResponse.toString());
		writer.flush();
		writer.close();		
		
	}
}
