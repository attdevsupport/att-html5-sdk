import jxl.demo.Write;
import jxl.write.WritableWorkbook;




public class TestRun {

	/**
	 * @param args
	 */
	
	public static String filename;
	private static WritableWorkbook workbook;
	
	
	public static void main(String[] args) {
		
		
		
		   filename = "c:\\excel_today.xls";
		    try {
		    	System.out.println("LINE35");
		    	//jxl.demo.Write writeA = new jxl.demo.Write("c:\\excel_todayA.xls");
		    	
		    	//writeA.write();
		    	
		        Write w = new Write(filename);
		        System.out.println("LINE41");
		        w.write();
		    	System.out.println("LINE42");
		    	//Write writeA = new Write("c:\\excel_todayA.xls");
		    	//writeA.write();
		    	
		    	
		    	//workbook = Workbook.createWorkbook(new File(filename), ws);
		    	
		    	
		        //WritableSheet s2 = workbook.createSheet("Number Formats", 0);
		        //WritableSheet s3 = workbook.createSheet("Date Formats", 1);
		        //WritableSheet s1 = workbook.createSheet("Label Formats", 2);
		        //WritableSheet s4 = workbook.createSheet("Borders", 3);
		        //WritableSheet s5 = workbook.createSheet("Labels", 4);
		        //WritableSheet s6 = workbook.createSheet("Formulas", 5);
		        //WritableSheet s7 = workbook.createSheet("Images", 6);
		        //    WritableSheet s8 = workbook.createSheet
		        //      ("'Illegal chars in name !*%^?': which exceeds max name length",7);

		        // Modify the colour palette to bright red for the lime colour
		        //workbook.setColourRGB(Colour.LIME, 0xff, 0, 0);

		        // Add a named range to the workbook
		        //workbook.addNameArea("namedrange", s4, 1, 11, 5, 14);
		        //workbook.addNameArea("validation_range", s1, 4, 65, 9, 65);
		        //workbook.addNameArea("formulavalue", s6, 1, 45, 1, 45);

		        // Add a print area to the "Labels" sheet
		        //s5.getSettings().setPrintArea(4,4,15,35);

		        //writeLabelFormatSheet(s1);
		        //writeNumberFormatSheet(s2);
		        //writeDateFormatSheet(s3);
		        //writeBordersSheet(s4);
		        //writeLabelsSheet(s5);
		        //writeFormulaSheet(s6);
		        //writeImageSheet(s7);

		        //workbook.write();
		        //workbook.close();
		    	
		    	
		        workbook.write();
		        workbook.close();
		    } catch (Exception e) {
		    	
		    } finally {
		    	
		    }
		
		

	}

}
