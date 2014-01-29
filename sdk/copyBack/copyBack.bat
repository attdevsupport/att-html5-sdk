@echo off
if "%1"=="" (
copybackall
) else (

  set toPath=%2

  set theFile=%3

  set fromPath=%1

  if "%fromPath%"=="\r" (
    set fromFile=%contextDir%\%working%\webcontent\%appName%\%app%\%theFile%
  ) else (
    set fromFile=%contextDir%\%working%\webcontent\%appName%\%app%\%fromPath%\%theFile%
  )

  echo _______________________________________________________________

  set toFile=%contextDir%\sdk\sample\%toPath%\%theFile%
  if not EXIST %fromFile% (
    echo CopyFrom file %fromFile% does not exist!!
  ) ELSE (
    if NOT EXIST %toFile% (
      echo CopyTo File %toFile% does not exist!!
    ) ELSE (
      echo copy /Y %fromFile% %toFile%
      copy /Y %fromFile% %toFile%
    )
  )

)