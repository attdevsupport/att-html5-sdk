set fromPath=%1
set toPath=%2

set fromFolder=%contextDir%\%working%\webcontent\%appName%\%app%
if NOT "%fromPath%"=="\r" (
  set fromFolder=%fromFolder%\%fromPath%
)
call copyfile "%fromFolder%" "%contextDir%\sdk\sampleCopy\%toPath%" "%3"
