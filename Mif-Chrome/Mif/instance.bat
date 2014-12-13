@echo off
setlocal enabledelayedexpansion
SET name=%1
SET name=%name:"=%
SET /a wordcount=0
call :getWordCount %1
SET /a wordcount=wordcount+1

@echo on
FOR /f tokens^=%wordcount% %%x in ('tasklist ^| findstr %1') DO (
	IF NOT %2 == %%x (
 		taskkill /PID %%x
	)
)

goto :eof

:getWordCount
@echo off
set str=%~1
for /f "tokens=1* delims= " %%f in ("%str%") do (
	rem if the item exist
    if not "%%f" == "" SET /a wordcount=wordcount+1
    rem if next item exist
    if not "%%g" == "" call :getWordCount "%%g"
)
goto :eof
endlocal