@echo off
set a=%1\%3
set b=%2\%3

echo -----------------------------------------------------

if not EXIST %a% (
  echo CopyFrom file %a% does not exist!!
) ELSE (
  if NOT EXIST %b% (
    echo CopyTo File %b% does not exist!!
  ) ELSE (
      echo copy /Y %a% %b%
      copy /Y %a% %b%
  )
)
