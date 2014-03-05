set a=%2\%3
set b=%1

echo -----------------------------------------------------

if not EXIST %a% (
  echo CopyFrom file %a% does not exist!!
) ELSE (
  if NOT EXIST %b%\%3 (
    if "%createMode%"=="t" ( 
       if NOT EXIST %1 (
         md %1
       )
       goto copyFile
     ) else ( 
        echo CopyTo File %b% does not exist!!
        goto End
     )

  ) 
)
:copyFile
echo xcopy %a% %b% /Y %4%
xcopy %a% %b% /Y %4%
:End