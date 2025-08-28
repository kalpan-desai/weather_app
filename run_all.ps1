# PowerShell script to start both backend and frontend servers

# Start FastAPI backend server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; .\venv\Scripts\Activate.ps1; uvicorn main:app --reload"

# Start frontend server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Frontend; npm run dev"
