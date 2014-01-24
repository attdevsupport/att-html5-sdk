package RESTfulSampleApps.sampleApp;

import java.awt.AWTException;
import java.io.IOException;


//Main entry point of testing framework
public class Main {

	//runs the test sweep in this main method based on application
	public static void main(String[] args) throws InterruptedException, AWTException, IOException {
			

			/*TL.Tl();
			WAP.Wap();
			IMMN.Immn(); 
			CMS.Cms();*/
			//MIM.Mim();
			//Speech.Speech();
			/*MMS.Mms(); 
			SMS.Sms();
			Notary.Notary(); */
			Payment.Payments();  //BETA - Due to problems with authorization flow, cannot execute test cases consecutively without hiccups.
//			        			 //will work on the issues in future release.
			

	}

}
