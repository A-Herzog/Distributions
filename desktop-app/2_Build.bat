cd ..
del Distributions.exe
call neu.cmd build --release
cd desktop-app
"C:\Program Files (x86)\NSIS\makensis.exe" Launcher.nsi
move Distributions.exe ..
cd ..
rmdir /S /Q dist