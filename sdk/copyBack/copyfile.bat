set a=%1\%3
set b=%2\%3

echo -----------------------------------------------------

if not EXIST %a% (
  echo CopyFrom file %a% does not exist!!
) ELSE (
  if NOT EXIST %b% (
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
echo copy /Y %a% %b%
copy /Y %a% %b%
:End