set a=%2\%3
set b=%1\%3


echo -----------------------------------------------------

if not EXIST %a% (
  echo CopyFrom file %a% does not exist!!
) ELSE (
  if NOT EXIST %b% (
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
echo copy /Y "%a%" "%b%"
copy /Y "%a%" "%b%"
:End