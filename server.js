const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'votes.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read/write votes
const getVotes = () => {
    if (!fs.existsSync(DATA_FILE)) {
        const initialVotes = {
            'Candidate A': 0,
            'Candidate B': 0,
            'Candidate C': 0
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialVotes, null, 2));
        return initialVotes;
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

const saveVotes = (votes) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(votes, null, 2));
};

// API Endpoints
app.get('/api/votes', (req, res) => {
    try {
        const votes = getVotes();
        res.json(votes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load votes' });
    }
});

app.post('/api/votes', (req, res) => {
    const { candidate } = req.body;
    try {
        const votes = getVotes();
        if (votes.hasOwnProperty(candidate)) {
            votes[candidate]++;
            saveVotes(votes);
            res.json({ success: true, votes });
        } else {
            res.status(400).json({ error: 'Invalid candidate' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to save vote' });
    }
});

app.post('/api/reset', (req, res) => {
    try {
        const resetVotes = {
            'Candidate A': 0,
            'Candidate B': 0,
            'Candidate C': 0
        };
        saveVotes(resetVotes);
        res.json({ success: true, votes: resetVotes });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset votes' });
    }
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});

