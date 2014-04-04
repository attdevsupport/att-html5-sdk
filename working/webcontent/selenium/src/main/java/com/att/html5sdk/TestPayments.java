package com.att.html5sdk;

import java.io.IOException;

public class TestPayments {
	
	public void TestPayments_Main() throws InterruptedException, IOException {
		
		Payment1();
		Payment2();
	}
		
	private static void Payment1() throws InterruptedException, IOException {
		Global global = new Global();
		PaymentApp1positive PaymentApp1 = new PaymentApp1positive();
		PaymentApp1.Execute(global.Payment1Ruby,"ext-button-1");
		
	}
	
	private static void Payment2() throws InterruptedException, IOException {
		Global global = new Global();
		PaymentApp2positive PaymentApp2 = new PaymentApp2positive();
		PaymentApp2.Execute(global.Payment2Ruby,"ext-button-1");
		
		}

	public void TestPayments_1_Main() {
		// TODO Auto-generated method stub
		
	}
	}