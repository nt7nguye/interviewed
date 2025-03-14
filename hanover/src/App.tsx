import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SearchInterface from './components/SearchInterface';
import SearchResults from './components/SearchResults';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SearchInterface />} />
                <Route path="/search/:query" element={<SearchResults />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
