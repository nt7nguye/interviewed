## Debugging Overview

The server you were just using to fetch the data has some bugs! Open up the `server.py` file and look around for the bugs. The TODOs throughout the code might be a good place to start. As you discover the bugs, talk through them with your interviewer, show off your approach and try to fix them. 

To run the server locally: 
1. Run `./setup_environment.sh` (`./setup_environment.ps1` on windows) to make sure you have the right tools to bootstrap your Python environment. The script will install `uv` and run your shell again so that the environment is updated and it's ready to use.
2. Run the server via `./server.py` (`./run_server.ps1` on windows). As you make changes, the server will automatically reload. Feel free to make any changes, add logging, and use debugging tools as necessary to debug the issues. Also note that you can set the environment variable `VERBOSE_SQL_LOGGING=true` to see the SQL queries that are executed. You can do this via, e.g., `VERBOSE_SQL_LOGGING=true ./server.py`.

