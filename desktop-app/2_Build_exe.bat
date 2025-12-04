cd ..
del Distributions.exe

call neu.cmd build --release --embed-resources

move .\dist\Distributions\Distributions-win_x64.exe Distributions.exe
rmdir /S /Q dist
cd desktop-app