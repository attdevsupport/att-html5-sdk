package sampleApps;

import java.io.IOException;

public class TestPayments {
	
	public void TestPayments_Main() throws InterruptedException, IOException {
		
		Payment1();
		Payment2();
	}
		
	private static void Payment1() throws InterruptedException, IOException {
		sampleApps.Global global = new sampleApps.Global();
		sampleApp.PaymentApp1.PaymentApp1positive PaymentApp1 = new sampleApp.PaymentApp1.PaymentApp1positive();
		PaymentApp1.Execute(global.Payment1Java,"ext-button-1");
		PaymentApp1.Execute(global.Payment1Ruby,"ext-button-1");
		PaymentApp1.Execute(global.Payment1PHP,"ext-button-1");
		
	}
	
	private static void Payment2() throws InterruptedException, IOException {
		sampleApps.Global global = new sampleApps.Global();
		sampleApp.PaymentApp2.PaymentApp2positive PaymentApp2 = new sampleApp.PaymentApp2.PaymentApp2positive();
		PaymentApp2.Execute(global.Payment2Java,"ext-button-1");
		PaymentApp2.Execute(global.Payment2Ruby,"ext-button-1");
		PaymentApp2.Execute(global.Payment2PHP,"ext-button-1");
		
		}

	public void TestPayments_1_Main() {
		// TODO Auto-generated method stub
		
	}
	}