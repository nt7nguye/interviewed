import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Search endpoint
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        const response = await fetch(
            `https://serpapi.com/search?engine=google&q=${query}&api_key=${process.env.SERP_API_KEY}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        const data = await response.json();
        res.json(data['organic_results'] || []);
    } catch (error) {
        console.error('Search API error:', error);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

// Error handling middleware
app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Something went wrong!' });
    }
);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
