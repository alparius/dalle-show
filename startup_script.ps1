# start backend
Start-Job -FilePath "C:\Users\text2image\Documents\text2image\dalle-show\startup_script_backend.ps1"

# start frontend
Start-Job -FilePath "C:\Users\text2image\Documents\text2image\dalle-show\startup_script_frontend.ps1"

# start browser
C:/'Program Files'/Google/Chrome/Application/chrome.exe http://localhost:3000 `
    --kiosk `
    --incognito `
    --disable-pinch `
    --overscroll-history-navigation=0