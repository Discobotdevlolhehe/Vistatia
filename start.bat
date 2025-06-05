@echo off
cd backend
echo Installing backend dependencies...
npm install
echo Starting backend server...
start cmd /k "node index.js"
cd ..

cd frontend
echo Installing frontend dependencies...
npm install
echo Starting frontend dev server...
start cmd /k "npm run dev"
cd ..
