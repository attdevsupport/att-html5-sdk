@echo off
set fromPath=%1
set toPath=%2

set fromFile=%contextDir%\%working%\webcontent\%appName%\%app%
if NOT "%fromPath%"=="\r" (
  set fromFile=%fromFile%\%fromPath%
)
call copyfile %fromFile% %contextDir%\sdk\sampleCopy\%toPath% %3
