// server.js
const express = require('express');
const sequelize = require('./config/db'); // Import the sequelize instance

const app = express();
const port = 3000;

app.use(express.json());

const userApi = require('./routes/userRoutes')
app.use("/api", userApi);
// Test the connection

sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

app.get('/', (req, res) => {
    res.send('Hello World!');
});
