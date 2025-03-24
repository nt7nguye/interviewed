# Simplexity

A simplified Perplexity-style AI search interface built with Flask and the Ell framework.

## Prerequisites

- Python 3.8+
- Poetry (https://python-poetry.org/)
- API keys (you can use your own, or we'll provide them when the interview starts):

    - A SERPAPI API key (https://serpapi.com)
    - An OpenAI API key (https://openai.com)
    
## Setup

1. Install dependencies with Poetry:
   ```bash
   poetry install
   ```

2. Copy .env.example to .env and edit the file with your API keys:
   ```
   SERPAPI_API_KEY=your_serpapi_key_here
   OPENAI_API_KEY=your_openai_key_here
   ```

3. Run the application:
   ```bash
   poetry run python app.py
   ```

4. Open your browser and navigate to http://localhost:5000

## Running Tests

```bash
poetry run python -m unittest test_app.py
```

## Project Structure

- `app.py`: Main application file containing the Flask app and core functionality
- `templates/`: Contains HTML templates
- `test_app.py`: Basic test suite
- `requirements.txt`: Project dependencies

## Known Limitations

- Basic error handling
- Simple user interface
- No caching mechanism
- Limited test coverage