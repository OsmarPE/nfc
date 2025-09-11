const express = require('express');
const { NFC } = require('nfc-pcsc');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

let nfcReaders = null;
let lastCardDetected = null;
let connectedClient = null; // Para Server-Sent Events - un solo cliente

const nfc = new NFC();

nfc.on('reader', reader => {
    console.log(`${reader.reader.name} device attached`);
    nfcReaders = reader

    reader.on('card', card => {
        console.log(`${reader.reader.name} card detected`, card.uid);
        lastCardDetected = {
            uid: card.uid,
            type: card.type, 
            standard: card.standard,
            timestamp: new Date(),
            reader: reader.reader.name
        };
        console.log('Last card detected updated:', lastCardDetected);
        
        
        broadcastToClients('card_detected', lastCardDetected);
    });

    reader.on('card.off', card => {
        console.log(`${reader.reader.name} card removed`);
        const cardRemovedData = {
            uid: card.uid,
            timestamp: new Date(),
            reader: reader.reader.name
        };
        broadcastToClients('card_removed', cardRemovedData);
    });

    reader.on('error', err => {
        console.log(`${reader.reader.name} error occurred`, err);
    });

    reader.on('end', () => {
        console.log(`${reader.reader.name} device removed`);
        nfcReaders = null;
    });
});

nfc.on('error', err => {
    console.log('NFC error occurred', err);
});

app.get('/api/status', (req, res) => {
    res.json({
        status: !!nfcReaders,
        lastCard: lastCardDetected,
        timestamp: new Date()
    });
});


app.post('/api/card/write', async (req, res) => {
    const { data, sector, block } = req.body;
    
    if (nfcReaders.length === 0) {
        return res.status(400).json({ error: 'No NFC readers available' });
    }
    
    try {
        res.json({ 
            message: 'Write operation initiated',
            data: data,
            sector: sector,
            block: block
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/events', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });

    connectedClient = { res };

    res.write(`data: ${JSON.stringify({
        type: 'connected',
        readers: nfcReaders.length
    })}\n\n`);

    req.on('close', () => {
        connectedClient = null;
    });
});

function broadcastToClients(event, data) {
    const message = JSON.stringify({ type: event, data });
    console.log(message);
    
    try {
        connectedClient?.res?.write(`data: ${message}\n\n`);
    } catch (err) {
        console.log('Error sending to client:', err);
        connectedClient = null; // Limpiar cliente desconectado
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server run in http://localhost:${port}`);
    console.log('  GET  /api/status');
    console.log('  GET  /api/readers');
    console.log('  GET  /api/last-card');
    console.log('  GET  /api/cards/history');
    console.log('  POST /api/card/write');
    console.log('  GET  /api/events (Server-Sent Events)');
});

process.on('SIGINT', () => {
    console.log('Cerrando servidor...');
    process.exit(0);
});