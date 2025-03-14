# Calculator app

## All functionalities required


https://user-images.githubusercontent.com/45516852/228969513-5bd58f1f-244f-4548-81df-67164b184d49.mp4


## I also found a bug in Google's calculator (2 * 1 + 1%) = 2.01 not 2.02. Although my implementaion is definitely not bug free (not handling division by zero comes to mind), I'm pretty happy to say I beat Google :D. Hopefully I can get some spare change if I report this for bug bounty.

## Techstack: React TypeScript for frontend and auth in Python backend

## Frontend under /frontend

To run locally run the commands

cd frontend
npm install
npm run dev

This would start a local Vite server. All calculator logic are contained here,
if you want to use authentication you need to start the backend as well.

Important files

+ `main.tsx` and `App.tsx` are entry point to render the components
+ `components/` store the logic of components
  + `Button.tsx` contains our custom styled Button
  + `Calculator.tsx` combines all the button with a display screen and hold all calculator React states
  + `NavBar.tsx` displays the authentication status and give option to signIn/signUp

## Backend under /backend
To run locally run the commands

// Set up venv
cd backend
python -m venv .

// Activate venv by running activate file
.venv\Scripts\Activate.ps1   (on Windows)
source .venv/bin/activate    (Linux bash)

// Start backend server with
python -m flask run

// If there are missing modules, install with 
python3 -m pip install <package_name>

// This helper command should cover all the modules to be installed
python -m pip install flask flask_sqlalchemy flask_cors

Important files
+ `app.py`: Flask server
+ `instance/`: SQLite built-in with Flask



