package com.att.html5sdk;

import java.util.ArrayList;
import java.util.List;

public class Speech_Variables {

    public List<String> Context_List() {

        List<String> contextList = new ArrayList<String>();
        contextList.add("Generic");
        contextList.add("TV");
        contextList.add("Business Search");
        contextList.add("Web Search");
        contextList.add("SMS");
        contextList.add("Voicemail");
        contextList.add("Question and Answer");

        return contextList;
    }

    public List<String> Audio_File_List() {
        List<String> audioFileList = new ArrayList<String>();
        audioFileList.add("Bananas.wav");
        audioFileList.add("Bananas.amr");
        audioFileList.add("Starbucks.wav");
        audioFileList.add("Starbucks.amr");
        audioFileList.add("Test/8khz AMR");
        audioFileList.add("Test/8khz SPX");
        audioFileList.add("Test/8khz WAV");
        audioFileList.add("Test/16khz AMR");

        return audioFileList;
    }
}
