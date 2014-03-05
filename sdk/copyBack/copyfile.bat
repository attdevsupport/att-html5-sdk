set a=%1\%3
set b=%2

echo -----------------------------------------------------

if not EXIST %a% (
  echo CopyFrom file %a% does not exist!!
) ELSE (
  if NOT EXIST %b%\%3 (
    if "%createMode%"=="t" ( 
       if NOT EXIST %2 (
         md %2
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