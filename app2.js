const express = require('express');
const mysql = require('mysql2');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'I live@malda7321011911',
  database: 'test',
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/crd.html', (req, res) => {
  connection.query('SELECT DISTINCT event FROM rd', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving events from database');
    } else {
      const events = results.map((result) => result.event);
      res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>techxtra registration</title>
            <style>
              table, th, td {
                border: 1px solid;
              }
            </style>
          </head>
          <body>
            <form action="/crd.html" method="post">
              <select name="event">
                ${events.map((event) => `<option value="${event}">${event}</option>`)}
              </select>
              <button type="submit">Submit</button>
            </form>
          </body>
        </html>
      `);
    }
  });
});

app.post('/crd.html', (req, res) => {
  const event = req.body.event;
  connection.query(`SELECT * FROM rd WHERE event='${event}' and played = 0`, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    } else {
      const rows = results.map((result) => `
        <tr>
          <td>${result.id}</td>
          <td><input type="text"></td>
          <td><button onclick="markID(${result.id})">Mark</button></td>
        </tr>
      `).join('');
      res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>techxtra registration</title>
            <style>
              table, th, td {
                border: 1px solid;
              }
            </style>
            <script>
              function markID(id) {
                fetch('/mark', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: id }),
                }).then(() => location.reload());
              }
            </script>
          </head>
          <body>
            <table>
              ${rows}
            </table>
          </body>
        </html>
      `);
    }
  });
});

app.post('/mark', (req, res) => {
  console.log('mark');
  const id = req.body.id;
  console.log(id)
  const update = 'UPDATE rd SET played=1 WHERE id=?';
  console.log(connection.query(update, [id]));
  connection.query(update, id, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating data in database');
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
