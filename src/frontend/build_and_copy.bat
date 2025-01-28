npm run build
rmdir ..\..\public
xcopy /e /i build ..\..\public
echo Build process completed.
pause
