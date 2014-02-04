schtasks /create /sc HOURLY /mo 3 /tn SampleAppTests /tr "powershell C:\Users\brucew\BlackFlag2\SDK\2.2.1\SampleAppAuto\HTML5\sampleApps\runtests.ps1" /f
