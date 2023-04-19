const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const authors = async function(req, res) {
  const name = 'Jay, Sunny, Cameron, & Charlie';
  const pennKey = 'bpantha, suniul, cysidron, & charros';

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
    res.send(`Created by ${pennKey}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
  }
}

// Route 3: GET /player/:player_id
const player = async function(req, res) {
  const player_id = req.params.player_id;

  connection.query(`
  SELECT *
  FROM Players
  WHERE player_id = '${player_id}'
  ORDER BY player_id
  LIMIT 1`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 3: GET /teams/:season
const teams = async function(req, res) {
  const seasonsParam = req.params.season;
  let allSeasonsToggle = false;
  if (seasonsParam.length > 4) {
    allSeasonsToggle = true;
  }

  const seasonsCondition = allSeasonsToggle 
  ? 'TRUE'
  : seasonsParam
  ? `s.season = ${seasonsParam}`
  : `s.season = (SELECT MAX(season) FROM Seasons)`;
  
  const query = `
  SELECT DISTINCT t.team_id, t.fran_id
  FROM Teams t
  JOIN Seasons s ON t.team_id = s.team
  WHERE ${seasonsCondition}
  ORDER BY t.fran_id`;

  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


// Route 6: GET /player_stats/:player_id
const player_stats = async function(req, res) {
  const player_id = req.params.player_id;

  connection.query(`
  SELECT *
  FROM Seasons s 
  WHERE s.player_id = '${player_id}'
  ORDER BY s.season ASC`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  }); // replace this with your implementation
}

// Route 5: GET /best_players
const best_players = async function(req, res) {
  const season = req.query.season;
  const team = req.query.team;

  if (!team) {
    if (season) {
    connection.query(`
    SELECT p.player_name, s.team, s.season, s.raptor_total, s.raptor_offense, s.raptor_defense
    FROM Seasons s join Players p on s.player_id = p.player_id
    WHERE s.season = '${season}' and s.gp > 40 and s.season_type = 'RS'
    ORDER BY s.raptor_total DESC`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data)}}); 
  } else {    
    connection.query(`
    SELECT p.player_name, s.team, s.season, s.raptor_total, s.raptor_offense, s.raptor_defense
    FROM Seasons s join Players p on s.player_id = p.player_id
    WHERE s.gp > 40 and s.season_type = 'RS'
    ORDER BY s.raptor_total DESC`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data)};})
  } 
} else {
    if (!season) {
      connection.query(`
        SELECT p.player_name, s.team, s.season, s.raptor_total, s.raptor_offense, s.raptor_defense
        FROM Seasons s join Players p on s.player_id = p.player_id
        WHERE s.team = '${team}' and s.gp > 40 and s.season_type = 'RS'
        ORDER BY s.raptor_total DESC`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data)}});
  } else {  
      connection.query(`
        SELECT p.player_name, s.team, s.season, s.raptor_total, s.raptor_offense, s.raptor_defense
        FROM Seasons s join Players p on s.player_id = p.player_id
        WHERE s.team = '${team}' and s.season = '${season}' and s.gp > 40 and s.season_type = 'RS'
        ORDER BY s.raptor_total DESC`, (err, data) => {
  if (err || data.length === 0) {
    console.log(err);
    res.json({});
  } else {
    res.json(data)};})
}
} 
}


// Route 4: GET /game/:game_id
const game = async function(req, res) {
  const game_id = req.params.game_id;

  connection.query(`
  SELECT *
  FROM Games
  WHERE game_id = '${game_id}'
  ORDER BY game_id
  LIMIT 1`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  }); // replace this with your implementation
}



// Route 7: GET /upsets/:season?
const upsets = async function(req, res) {
  const season = req.query.season;

  if (!season) {

    connection.query(`
    SELECT *
    FROM Games g
    WHERE g.game_result = 'W'
    ORDER BY g.forecast ASC
    LIMIT 50`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data)}}); 
  } else {  
    connection.query(`
    SELECT *
    FROM Games g
    WHERE g.year_id = '${season}' and g.game_result = 'W'
    ORDER BY g.forecast ASC
    LIMIT 50`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data)};})
}
}
  


// Route 12: GET /award
const award = async function(req, res) {
  // const award = req.query.award;
  // const season = req.query.season;
  const seasonsParam = req.params.season;

  // Split the comma-separated list of seasons if provided, otherwise use the latest season
  const seasonsCondition = seasonsParam
  ? `a.season = ${seasonsParam}`
  : `a.season = (SELECT MAX(season) FROM Seasons)`;

  query = `
  SELECT DISTINCT a.season, a.award, p.player_name, s.team
  FROM Awards a JOIN Players p on p.player_id = a.player_id JOIN Seasons s on s.player_id=p.player_id and s.season=a.season
  WHERE ${seasonsCondition}`
  
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /awards_by_team
const awards_by_team = async function(req, res) {
  const page = req.query.page;
  
  const pageSize = (req.query.page_size ?? 10);

  if (!page) {

    connection.query(`SELECT
    Teams.fran_id,
    Seasons.season,
    COUNT(DISTINCT Awards.player_id, Awards.award) AS total_awards,
    COUNT(DISTINCT Games.game_id) AS total_wins,
    AVG(Games.elo_n) AS average_ELO
FROM
    Seasons
    JOIN Teams
        ON Seasons.team = Teams.team_id
    LEFT JOIN Awards
        ON Seasons.player_id = Awards.player_id
            AND Seasons.season = Awards.season
    LEFT JOIN Games
        ON Seasons.team = Games.team_id
            AND Seasons.season = Games.year_id
            AND Games.game_result = 'W'
WHERE year_id <=2015
GROUP BY
    Teams.fran_id,
    Seasons.season
ORDER BY total_awards DESC;`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data)}}); // replace this with your implementation
  } else {
    const offset = pageSize*(page-1);
    if (page===0) {offset = 0;}
    connection.query(`SELECT
    Teams.fran_id,
    Seasons.season,
    COUNT(DISTINCT Awards.player_id, Awards.award) AS total_awards,
    COUNT(DISTINCT Games.game_id) AS total_wins,
    AVG(Games.elo_n) AS average_ELO
FROM
    Seasons
    JOIN Teams
        ON Seasons.team = Teams.team_id
    LEFT JOIN Awards
        ON Seasons.player_id = Awards.player_id
            AND Seasons.season = Awards.season
    LEFT JOIN Games
        ON Seasons.team = Games.team_id
            AND Seasons.season = Games.year_id
            AND Games.game_result = 'W'
WHERE year_id <=2015
GROUP BY
    Teams.fran_id,
    Seasons.season
ORDER BY total_awards DESC;
      LIMIT ${pageSize} OFFSET ${offset}`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data)};}) // replace this with your implementation  
}
}

// Route 8: GET /best_seasons_bad_teams
const best_seasons_bad_teams = async function(req, res) {
  const page = req.query.page;
  
  const pageSize = (req.query.page_size ?? 10);

  if (!page) {
    

    connection.query(`
    WITH temp (season, team, peak) AS (
      select year_id, team_id, max(elo_n) as peak_elo
      from Games
      GROUP BY year_id, team_id
      HAVING peak_elo < 1500
      ORDER BY peak_elo ASC)
      SELECT p.player_name, t.season, t.team, t.peak, s.raptor_total, s.raptor_offense, s.raptor_defense
      FROM temp t JOIN Seasons s ON t.team = s.team and t.season = s.season JOIN Players p ON p.player_id = s.player_id
      WHERE s.gp > 40 and season_type = 'RS'
      ORDER BY s.raptor_total DESC;`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data)}}); 
  } else {
    
    const offset = pageSize*(page-1);
    connection.query(`
    WITH temp (season, team, peak) AS (
      select year_id, team_id, max(elo_n) as peak_elo
      from Games
      GROUP BY year_id, team_id
      HAVING peak_elo < 1500
      ORDER BY peak_elo ASC)
      SELECT p.player_name, t.season, t.team, t.peak, s.raptor_total, s.raptor_offense, s.raptor_defense
      FROM temp t JOIN Seasons s ON t.team = s.team and t.season = s.season JOIN Players p ON p.player_id = s.player_id
      WHERE s.gp > 40 and season_type = 'RS'
      ORDER BY s.raptor_total DESC;
      LIMIT ${pageSize} OFFSET ${offset}`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data)};})   
} 
}

// Route 8: GET /draft/good
const draft_good = async function(req, res) {
  const page = req.query.page;
  
  const pageSize = (req.query.page_size ?? 10);

  if (!page) {
    

    connection.query(`WITH draft (id) AS
    (SELECT p.player_id
    FROM Players p
    WHERE draft_round > 1), d2 (id, avg_raptor, total_gp) AS (
    SELECT id, avg(s.raptor_total), sum(s.gp)
    FROM draft d JOIN Seasons s ON d.id = s.player_id
    GROUP BY s.player_id
    )
    SELECT p.player_name, p.draft_year, p.draft_round, p.draft_number, p.college, d2.avg_raptor
    from d2 JOIN Players p on d2.id = p.player_id
    WHERE d2.total_gp > 100
    ORDER BY total_gp DESC;`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data)}}); 
  } else {
    
    const offset = pageSize*(page-1);
    connection.query(`WITH draft (id) AS
    (SELECT p.player_id
    FROM Players p
    WHERE draft_round > 1), d2 (id, avg_raptor, total_gp) AS (
    SELECT id, avg(s.raptor_total), sum(s.gp)
    FROM draft d JOIN Seasons s ON d.id = s.player_id
    GROUP BY s.player_id
    )
    SELECT p.player_name, p.draft_year, p.draft_round, p.draft_number, p.college, d2.avg_raptor
    from d2 JOIN Players p on d2.id = p.player_id
    WHERE d2.total_gp > 100
    ORDER BY total_gp DESC;
      LIMIT ${pageSize} OFFSET ${offset}`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data)};})   
} 
}

// Route 8: GET /draft/bad
const draft_bad = async function(req, res) {
  const page = req.query.page;
  
  const pageSize = (req.query.page_size ?? 10);

  if (!page) {
    

    connection.query(`WITH draft (id) AS
    (SELECT p.player_id
    FROM Players p
    WHERE draft_number < 5 and draft_round NOT LIKE 'Undrafted'), d2 (id, avg_raptor, total_gp) AS (
    SELECT id, avg(s.raptor_total), sum(s.gp)
    FROM draft d JOIN Seasons s ON d.id = s.player_id
    GROUP BY s.player_id
    )
SELECT p.player_name, p.draft_year, p.draft_round, p.draft_number, p.college, d2.avg_raptor
from d2 JOIN Players p on d2.id = p.player_id
WHERE d2.total_gp > 20
ORDER BY avg_raptor ASC;`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data)}}); 
  } else {
    
    const offset = pageSize*(page-1);
    connection.query(`WITH draft (id) AS
    (SELECT p.player_id
    FROM Players p
    WHERE draft_number < 5 and draft_round NOT LIKE 'Undrafted'), d2 (id, avg_raptor, total_gp) AS (
    SELECT id, avg(s.raptor_total), sum(s.gp)
    FROM draft d JOIN Seasons s ON d.id = s.player_id
    GROUP BY s.player_id
    )
    SELECT p.player_name, p.draft_year, p.draft_round, p.draft_number, p.college, d2.avg_raptor
    from d2 JOIN Players p on d2.id = p.player_id
    WHERE d2.total_gp > 20
    ORDER BY avg_raptor ASC;
    LIMIT ${pageSize} OFFSET ${offset}`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data)};})   
} 
}

//route 11: GET /teamwork
const teamwork = async function(req, res) {
  try {
    const teams = connection.query(`
      SELECT team_name, MAX(elo) AS max_elo
      FROM teams
      GROUP BY team_name
      ORDER BY max_elo DESC
    `);

    const teamNames = teams.map(team => team.team_name);

    const topPlayers = connection.query(`
      SELECT player_name, season
      FROM raptor_stats
      WHERE player_name NOT IN (
        SELECT player_name
        FROM raptor_stats
        GROUP BY player_name, season
        ORDER BY SUM(war) DESC
        LIMIT 20
      )
    `);

    const topPlayerNames = topPlayers.map(player => player.player_name);

    const filteredTeams = await connection.query(`
      SELECT *
      FROM teams
      WHERE team_name IN (${teamNames.map(() => '?').join(',')})
      AND team_name NOT IN (
        SELECT team_name
        FROM player_stats
        WHERE player_name IN (${topPlayerNames.map(() => '?').join(',')})
      )
    `, [...teamNames, ...topPlayerNames]);

    res.json(filteredTeams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  authors,
  player,
  player_stats,
  best_players,
  best_seasons_bad_teams,
  game,
  upsets,
  award,
  awards_by_team,
  draft_good,
  draft_bad,
  teamwork,
  teams
}

