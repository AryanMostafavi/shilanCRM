const express = require('express');
const bodyParser = require('body-parser');
const formRoutes = require('./routes/formRoutes');
const locationRoutes = require('./routes/locationRoutes');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();
app.use(express.json())
app.use(cors());
app.use(bodyParser.json());
app.use('/api', formRoutes);
app.use('/loc', locationRoutes);
app.use('/static' ,  express.static(path.join(__dirname,'public')))
const PORT = process.env.PORT || 5050;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
