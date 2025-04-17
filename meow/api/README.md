# Meow API

A banking API built with FastAPI, sqlite and TigerBeetle.

## Setup

Run everything under `cd api`

1. Install dependencies:
```bash
poetry install
```

2. Initialize TigerBeetle:
```bash
make init-tigerbeetle
```

3. Start TigerBeetle:
```bash
make start-tigerbeetle
```

4. Initialize treasury account because every entry in TigerBeetle requires double counting.
```bash
make init-treasury
```

5. Run the API:
```bash
 poetry run -- fastapi dev main.py
``` 
