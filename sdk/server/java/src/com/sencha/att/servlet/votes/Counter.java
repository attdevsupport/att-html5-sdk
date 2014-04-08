package com.sencha.att.servlet.votes;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@SuppressWarnings("serial")
public class Counter extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		PrintWriter writer = resp.getWriter();
		JSONObject jsonResponse = new JSONObject();

		try {

			JSONArray data = Votes.getVotes();
			jsonResponse.put("total", this.calculateTotal(data));
			jsonResponse.put("data", data);

			jsonResponse.put("success", true);
			
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		writer.write(jsonResponse.toString());
		writer.flush();
		writer.close();
		
	}

	private int calculateTotal(JSONArray votes) throws JSONException {
		int total = 0;
		int l = votes.length();

		for(int i =0; i<l; i++){
			JSONObject vote = (JSONObject) votes.get(i);
			int value = vote.getInt("votes");
			total += value;
		}
		return total;
	}	
}
