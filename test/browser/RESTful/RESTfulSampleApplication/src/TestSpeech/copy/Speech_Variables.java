package TestSpeech.copy;

import java.util.ArrayList;
import java.util.List;

public class Speech_Variables {
	
	public List<String> Context_List(){
		
		List<String> contextList = new ArrayList<String>();
		contextList.add("Generic");
		contextList.add("TV");
		contextList.add("BusinessSearch");
		contextList.add("Websearch");
		contextList.add("SMS");
		contextList.add("Voicemail");
		contextList.add("QuestionAndAnswer");
		
		return contextList;
	}
	
	public List<String> Audio_File_List(){
		List<String> audioFileList = new ArrayList<String>();
		audioFileList.add("bostonseltics.wav");
		audioFileList.add("california.amr");
		audioFileList.add("coffee.amr");
		audioFileList.add("doctors.wav");
		audioFileList.add("nospeech.wav");
		audioFileList.add("samplerate_conflict_error.wav");
		audioFileList.add("this_is_a_test.spx");
		audioFileList.add("too_many_channels_error.wav");
	
		return audioFileList;
	}
}
