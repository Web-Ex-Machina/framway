set name=heroFW

rem creating the component structure ---------------------------------------------------------
cd src/components
mkdir "%name%"
cd "%name%"
type NUL > "_%name%.scss"
type NUL > "%name%.js"
type NUL > sample.html
@echo off
setlocal enabledelayedexpansion
echo ^<div class="%name%"^>^</div^> >> sample.html

rem writing the call in main scss file ---------------------------------------------------------
cd ../../scss
set num = 0

for /f "tokens=*" %%a in (framway.scss) do (
if !num! lss 3 echo %%a >>output.txt
if !num! equ 3 (
  echo @import '../components/%name%/%name%';
  echo %%a
) >>output.txt
if !num! gtr 3 echo %%a >>output.txt
set /a num+=1
)

type output.txt > framway.scss
del output.txt

exit