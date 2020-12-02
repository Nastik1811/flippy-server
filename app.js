const express = require('express')
const config = require('config')
const pool = require('./db/index')
const PORT = config.get('port') | 5000
const pg = require('pg')

const app = express()
app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))


app.get('/', async (req, res) => {
    username = "nastik"
    email = "mail@mail.ru"
    hashedPassword = "1111"

    const candidate = await pool.query('SELECT 1 FROM users WHERE email= $1', [email])
    console.log(candidate.rowCount)

})

app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))