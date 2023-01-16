Set-Location C:\Users\text2image\Documents\text2image\dalle-show\backend

python app.py *>> "..\logs\logs-$(Get-Date -UFormat "%Y-%m-%d").txt"

# Start-Transcript -Append -Path "..\logs\logs-$(Get-Date -UFormat "%Y-%m-%d").txt"
# python app.py
# Stop-Transcript
