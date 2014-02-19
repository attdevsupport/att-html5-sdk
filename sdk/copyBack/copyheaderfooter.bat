set fromFolder=%contextDir%\%working%\webcontent\%appName%\%app%\app\view

call copyfile "%fromFolder%" "%contextDir%\sdk\sampleCopy\app\view" Header.js /d
call copyfile "%fromFolder%" "%contextDir%\sdk\sampleCopy\app\view" Footer.js /d

call copyfile "%contextDir%\sdk\sampleCopy\app\view" "%fromFolder%" Header.js /d
call copyfile "%contextDir%\sdk\sampleCopy\app\view" "%fromFolder%" Footer.js /d