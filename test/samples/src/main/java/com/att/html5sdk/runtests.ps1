Add-Type -AssemblyName System.Web

$ProjectDir = "C:\Users\brucew\BlackFlag2\SDK\2.2.1\SampleAppAuto\HTML5\sampleApps"

remove-item "C:\HTML5 SampleApps.txt"
java.exe -jar "$ProjectDir\HTML5.jar"

$results = get-content "C:\HTML5 SampleApps.txt" -raw
$regexStr  = '(?s)'               # single-line regex mode (dots match newlines)
$regexStr += '\r\n'               # match newline
$regexStr += '(PASSED|FAILED)'    # capture pass/fail
$regexStr += '\s*'                # allow spaces after the pass/fail
$regexStr += '\r\n'               # match newline
$regexStr += '[^*]+'              # skip everything that isn't an asterix (ie, the timestamp)
$regexStr += '\*{5}'              # match five asterixes
$regexStr += '\s'                 # match the space between asterix and test name
$regexStr += '([^:]+)'            # capture the test name
$regexStr += ':'                  # match the trailing colon after the test name
$regexStr += '\s*'                # allow spaces after the trailing colon
$regexStr += '\r\n'               # match newline
$regexStr += '(.*?)'              # capture test failure details
$regexStr += '(\z|'               # match end of file, or ...
$regexStr += '\r\n'               # if not EOF, match newline
$regexStr += '(?:PASSED|FAILED))' # if not EOF, match pass/fail
$regex = [regex] $regexStr

$pass = 0
$fail = 0
$failString = ""
$searchPosition = 0

while ($TRUE)
{
  $match = $regex.Match($results, $searchPosition)
  
  if (-not $match.Success) { break; }
  
  $testPassed = $match.Groups[1].Value
  $test = $match.Groups[2].Value
  $testDetail = [System.Web.HttpUtility]::HtmlEncode($match.Groups[3].Value).Trim()
  $searchPosition = $match.Index + 1
  if ($testPassed -eq 'PASSED')
  {
    $pass = $pass + 1
  }
  else
  {
    $fail = $fail + 1
    $failString = $failString + "<div id='fail-$fail'>FAIL: $test<div id='fail-detail'><pre>$testDetail</pre></div></div>"
  }
}
if ($fail -eq 0)
{
  $failString = "<div style='color:light-green'>All tests passed.</div>"
}

$encodedResults = [System.Web.HttpUtility]::HtmlEncode($results)

$mail = New-Object Net.Mail.MailMessage
try {
  $mail.From = "iss.web.service.test2@gmail.com"
  $mail.To.Add("brucew@isoftstone.com")
  $mail.To.Add("jaisonw@isoftstone.com")
  $mail.To.Add("silpal@isoftstone.com")
  $mail.To.Add("yanab@isoftstone.com")
  $mail.Subject = "Pass:$pass Fail:$fail - HTML5 Sample Applications Daily Regression Test Results"
  $mail.IsBodyHtml = $TRUE
  
  $style = "<style type='text/css'>"
  $style += "div, h2 {border-radius:15px;padding:5px;}"
  $style += "div#failures {background-color:#dddddd;}"
  $style += "div#failures h2 {background-color:#bbbbbb;}"
  $style += "div#failures div {background-color:#ffdddd;border-radius:5px;margin:2px;}"
  $style += "div#failures div div {margin-left:10px;}"
  $style += "</style>"
  
  $mail.Body = "<html><head>$style</head>"
  $mail.Body += "<body><h1>HTML5 Sample Applications Daily Regression Test Results</h1>"
  $mail.Body += "<div id='content'><div id='failures'><h2>Failure Summary</h2>$failString</div>"
  $mail.Body += "<h2>Detailed Test Results</h2><div id='results'><pre>$encodedResults</pre></div></div></body></html>"
  $SMTPClient = New-Object Net.Mail.SmtpClient("smtp.gmail.com", 587)
  try {
    $SMTPClient.EnableSsl = $true
    $SMTPClient.Credentials = New-Object System.Net.NetworkCredential("iss.web.service.test2@gmail.com", 'i44VUc0hmG5tK5gfL!@9');
    $SMTPClient.Send($mail)
  }
  finally {
    $SMTPClient.Dispose()
  }
}
finally {
  $mail.Dispose()
}
exit 0
