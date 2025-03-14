import { useState } from 'react';
import './SearchInterface.css';
import { useNavigate } from 'react-router-dom';

const SearchInterface = () => {
    const [query, setQuery] = useState('');

    const suggestions = [
        'crypto tycoon extradited',
        "deepseek's new open source ai model",
        "eu's common charging mandate in effect",
        'microsofts $100b agi definition',
        'baltic undersea cables cut again',
        'kessler syndrome warning',
        'openai proposes public benefit corporation',
        'china approves tibet mega dam',
    ];

    const navigate = useNavigate();
    const handleSubmit = () => {
        navigate(`/search/${query}`);
    };

    return (
        <div className="container">
            <p className="main-title">What do you want to know?</p>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Ask anything..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && query !== '') {
                            handleSubmit();
                        }
                    }}
                />
                <div className="controls">
                    <button className="focus-btn">
                        <span className="icon">≡</span>Focus
                    </button>
                    <button className="attach-btn">
                        <span className="icon">+</span>Attach
                    </button>

                    <div className="right-controls">
                        <div className="pro-toggle">
                            <label className="switch">
                                <input type="checkbox" />
                                <span className="slider"></span>
                            </label>
                            <span>Pro</span>
                        </div>
                        <button
                            className={`submit-btn ${query ? 'active' : ''}`}
                            onClick={handleSubmit}
                        >
                            →
                        </button>
                    </div>
                </div>
                {query !== '' && (
                    <div className="suggestions">
                        {suggestions.map((suggestion, index) => (
                            <div key={index} className="suggestion-item">
                                <span>{suggestion}</span>
                                <span className="arrow">↗</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchInterface;
