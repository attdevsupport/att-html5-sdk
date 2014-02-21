set fromFolder=%contextDir%\%working%\webcontent\%appName%\%app%\app

call copyfile "%fromFolder%\view" "%contextDir%\sdk\sampleCopy\app\view" Header.js /d
call copyfile "%fromFolder%\view" "%contextDir%\sdk\sampleCopy\app\view" Footer.js /d

call copyfile "%contextDir%\sdk\sampleCopy\app\view" "%fromFolder%\view" Header.js /d
call copyfile "%contextDir%\sdk\sampleCopy\app\view" "%fromFolder%\view" Footer.js /d


call copyfile "%fromFolder%" "%contextDir%\sdk\sampleCopy\app" Config.js /d
call copyfile "%contextDir%\sdk\sampleCopy\app" "%fromFolder%" Config.js /d
