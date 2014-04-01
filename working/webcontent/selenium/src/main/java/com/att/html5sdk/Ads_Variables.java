package com.att.html5sdk;

import java.util.ArrayList;
import java.util.List;

public class Ads_Variables {
	
	public List<String> Category_List(){
		
		List<String> categoryList = new ArrayList<String>();
		categoryList.add("auto");
		categoryList.add("finance");
		categoryList.add("games");
		categoryList.add("health");
		categoryList.add("music");
		categoryList.add("tv");
		categoryList.add("movies");
		categoryList.add("news");
		categoryList.add("shopping");
		categoryList.add("travel");
		categoryList.add("other");
		
		return categoryList;
	}
	
	public List<String> UserAgentList(){
		List<String> userAgentList = new ArrayList<String>();
		userAgentList.add("Desktop Chrome");
		userAgentList.add("Android Webkit");
		userAgentList.add("Android chrome");
		userAgentList.add("iPhone Safari");
		
		return userAgentList;
	}
	
	public List<String> AgeGroupList(){
		List<String> ageGroupList = new ArrayList<String>();
		ageGroupList.add("14-25");
		ageGroupList.add("26-35");
		ageGroupList.add("36-55");
		ageGroupList.add("56-100");

		return ageGroupList;
	}
	
	public List<String> GenderList(){
		List<String> genderList = new ArrayList<String>();
		genderList.add("Male");
		genderList.add("Female");

		return genderList;
	}
	

}
