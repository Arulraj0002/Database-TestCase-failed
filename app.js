const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'cricketTeam.db')
db = null
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

// getting all the players
app.get('/players/', async (request, response) => {
  const query = `SELECT * FROM cricket_team;`
  const playerArray = await db.all(query)
  response.send(playerArray)
})

// getting particular player
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
    SELECT
      player_name, jersey_number, role
    FROM
      cricket_team
    WHERE
      player_id = ${playerId};`
  const player = await db.get(getPlayerQuery)
  response.send(player)
})

// inserting new player
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerId, playerName, jerseyNumber, role} = playerDetails
  const addPlayerQuery = `INSERT INTO cricket_team (player_name, jersey_number, role)
  VALUES
  (
    '${playerName}', ${jerseyNumber}, '${role}'
  );`
  const dbResponse = await db.run(addPlayerQuery)
  const newPlayerId = dbResponse.lastID

  response.send('Player Added to Team')
})

// updating
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerQuery = `
    UPDATE cricket_team SET player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}' WHERE player_id=${playerId};`
  const updatedDatabase = await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const deletePlayerQuery = `
    DELETE FROM cricket_team WHERE player_id = ${playerId};`
  const playerArray = await db.run(deletePlayerQuery)
  response.send('Player Removed')
})

module.exports = app
