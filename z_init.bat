@echo off

IF %1.==. GOTO error

set APPNAME=%1

rem install project's dependencies -----------------------------------------------------------------------------------------------------
npm install

rem rename folder with provided name ---------------------------------------------------------------------------------------------------
cd ../
rename framway %APPNAME%
cd %APPNAME%

rem escape following files of the worktree, so they're ignored when updating the project ------------------------------------------------
git update-index --skip-worktree build/css/vendor.css
git update-index --skip-worktree build/css/vendor.css.map
git update-index --skip-worktree build/css/framway.css
git update-index --skip-worktree build/css/framway.css.map
git update-index --skip-worktree build/js/vendor.js
git update-index --skip-worktree build/js/vendor.js.map
git update-index --skip-worktree build/js/framway.js
git update-index --skip-worktree build/js/framway.js.map
git update-index --skip-worktree build/index.html
git update-index --skip-worktree webpack.config.js
git update-index --skip-worktree framway.config.js
git update-index --skip-worktree src/scss/framway.scss

rem rewrite the public path in webpack.config.js ----------------------------------------------------------------------------------------
setlocal enableextensions enabledelayedexpansion
set inputfile=webpack.config.js
set tempfile=%random%-%random%.tmp
copy /y nul %tempfile%
set line=0
for /f "delims=" %%l in (%inputfile%) do (
    set /a line+=1
    if !line!==22 (
        echo         publicPath: '/files/%APPNAME%/build/',>>%tempfile%
    ) else (
        echo %%l>>%tempfile%
    )
)
del %inputfile%
ren %tempfile% %inputfile%
endlocal

ECHO -------------
ECHO FRAMWAY READY
ECHO -------------
GOTO end

:error
  ECHO --------------------------
  ECHO Missing app name parameter
  ECHO --------------------------
GOTO end

:end
