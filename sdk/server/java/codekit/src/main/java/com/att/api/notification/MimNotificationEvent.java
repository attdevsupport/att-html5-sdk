package com.att.api.notification;

import org.json.JSONException;
import org.json.JSONObject;

public class MimNotificationEvent {
	private String messageId;
	private String event;
	private String conversationTID;
	private Boolean isFavorite;
	private Boolean isUnread;
	private String eventType;
	private String text;
	private String isTextTruncated;
	
	public MimNotificationEvent () {
	}

	public static MimNotificationEvent valueOf(JSONObject jobj) throws JSONException {
		
		MimNotificationEvent returnObj = new MimNotificationEvent();
        
    	returnObj.setMessageId(jobj.getString("messageId"));
    	returnObj.setEvent(jobj.getString("event"));
    	returnObj.setConversationTID(jobj.getString("conversationThreadId"));
    	returnObj.setIsFavorite(jobj.getBoolean("isFavorite"));
    	returnObj.setIsUnread(jobj.getBoolean("isUnread"));
    	returnObj.setEventType(jobj.getString("eventType"));

        return returnObj;
	}

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	public String getEvent() {
		return event;
	}

	public void setEvent(String event) {
		this.event = event;
	}

	public String getConversationTID() {
		return conversationTID;
	}

	public void setConversationTID(String conversationTID) {
		this.conversationTID = conversationTID;
	}

	public Boolean getIsFavorite() {
		return isFavorite;
	}

	public void setIsFavorite(Boolean isFavorite) {
		this.isFavorite = isFavorite;
	}

	public Boolean getIsUnread() {
		return isUnread;
	}

	public void setIsUnread(Boolean isUnread) {
		this.isUnread = isUnread;
	}

	public String getEventType() {
		return eventType;
	}

	public void setEventType(String eventType) {
		this.eventType = eventType;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	/**
	 * @return the isTextTruncated
	 */
	public String getIsTextTruncated() {
		return isTextTruncated;
	}

	/**
	 * @param isTextTruncated the isTextTruncated to set
	 */
	public void setIsTextTruncated(String isTextTruncated) {
		this.isTextTruncated = isTextTruncated;
	}
}
