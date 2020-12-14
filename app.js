const express = require('express')
const config = require('config')
const bodyParser = require('body-parser');

const PORT = config.get('port') | 5000

const app = express()
app.use(express.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/cards', require('./routes/card.routes'))
app.use('/api/collections', require('./routes/collection.routes'))

app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))