cd ..
del Distributions.exe
del Distributions_Linux_MacOS.zip
call neu.cmd build --release
cd desktop-app
"C:\Program Files (x86)\NSIS\makensis.exe" Launcher.nsi
move Distributions.exe ..
cd ..
move .\dist\Distributions-release.zip Distributions_Linux_MacOS.zip
rmdir /S /Q dist
cd desktop-app