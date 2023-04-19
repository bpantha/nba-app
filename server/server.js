const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/authors/:type', routes.authors);
app.get('/player/:player_id', routes.player);
app.get('/player_stats/:player_id', routes.player_stats);
app.get('/best_players/', routes.best_players);
app.get('/best_seasons_bad_teams/', routes.best_seasons_bad_teams);
app.get('/game/:game_id', routes.game);
app.get('/upsets', routes.upsets);
app.get('/award/:season?', routes.award);
app.get('/awards_by_team', routes.awards_by_team);
app.get('/draft/good',routes.draft_good);
app.get('/draft/bad',routes.draft_bad);
app.get('/teamwork',routes.teamwork);
app.get('/teams/:season?',routes.teams);
app.get('/roster', routes.roster);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
