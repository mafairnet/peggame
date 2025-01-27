//Peg Game NodeJS APP
const sqlite3 = require('sqlite3').verbose();
const dbPath = '/opt/peggame/database.db';
const db = new sqlite3.Database(dbPath);

const http = require("http");
const fs = require('fs');
const url = require('url');

const host = '0.0.0.0';
const port = 8000;

const initDatabase = `
CREATE TABLE IF NOT EXISTS game_results (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  result TEXT NOT NULL,
  score TEXT NOT NULL,
  result_date DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;


async function initializeTables() {
  try {
    // Insert data into the users table
    await db.run(initDatabase);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}


async function insertResult(username, result, score) {
  try {
    // Insert data into the users table
    await db.run("INSERT INTO game_results (username, result, score) VALUES (?, ?, ?)", [username, result, score]);
    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

function getDataFromDatabase(callback) {
  const query = 'SELECT * FROM game_results ORDER BY id DESC'; // Replace with your table name
  db.all(query, [], (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

const requestListener = function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins (you can specify a domain instead of '*' if needed)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
  
    if (req.url === '/') {
        console.log("Let the games begin!");
        res.writeHead(200, { 'content-type': 'text/html' });
        fs.createReadStream('/opt/peggame/game.html').pipe(res);
    }
    
    if (req.url.startsWith('/insert')) {
        const queryObject = url.parse(req.url, true).query;
        console.log('Received parameters:', queryObject.username);
        let message;
        if(queryObject.username != null &&  queryObject.result != null && queryObject.score != null){
            insertResult(queryObject.username, queryObject.result, queryObject.score);
            res.writeHead(200, { 'content-type': 'application/json' });
            message = JSON.stringify({ success: "Inserted"});
        }else{
            res.writeHead(500, { 'Content-Type': 'application/json' });
            message = JSON.stringify({ error: 'Internal Server Error' });
        }
        res.end(message);
    }

    if (req.url === '/results') {
        getDataFromDatabase((err, data) => {
            if (err) {
                console.error('Error querying the database:', err.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                let message = JSON.stringify({ error: 'Internal Server Error' });
                res.end(message);
                return;
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                let message = JSON.stringify(data) 
                console.log(message);
                res.end(message);
                return;
            }
        });
    }

    if(req.url != '/' && !req.url.startsWith('/insert') && req.url != '/results'){
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Not Found');
        res.end();
    }

};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    initializeTables();
    console.log(`Server is running on http://${host}:${port}`);
});
