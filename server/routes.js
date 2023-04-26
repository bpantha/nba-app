const mysql = require("mysql");
const config = require("./config.json");

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const authors = async function (req, res) {
  const name = "Jay, Sunny, Cameron, & Charlie";
  const pennKey = "bpantha, suniul, cysidron, & charros";

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === "name") {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === "pennkey") {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
    res.send(`Created by ${pennKey}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res
      .status(400)
      .send(
        `'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`
      );
  }
};

// Route 3: GET /player/:player_id
const player = async function (req, res) {
  const player_id = req.params.player_id;

  query = `SELECT *
  FROM Players
  WHERE player_id = '${player_id}'
  ORDER BY player_id
  LIMIT 1`;

  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

// Route 3: GET /teams/:season
const teams = async function (req, res) {
  const seasonsParam = req.params.season;
  let allSeasonsToggle = false;
  if (seasonsParam.length > 4) {
    allSeasonsToggle = true;
  }

  const seasonsCondition = allSeasonsToggle
    ? "TRUE"
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
};

// Route 6: GET /player_stats/:player_id
const player_stats = async function (req, res) {
  const player_name = req.params.player_name;
  const seasonsParam = req.params.season;
  let allSeasonsToggle = false;
  if (seasonsParam.length > 4) {
    allSeasonsToggle = true;
  }

  console.log(allSeasonsToggle);

  const seasonsCondition = allSeasonsToggle
    ? ""
    : seasonsParam
    ? `s.season = ${seasonsParam} AND`
    : `s.season = (SELECT MAX(season) FROM Seasons)`;

  console.log(seasonsCondition);

  query = `
  SELECT DISTINCT s.pts, s.reb, s.ast, p.country, p.college, s.season, s.gp, s.team
  FROM Players p JOIN Seasons s on p.player_id = s.player_id
  WHERE ${seasonsCondition} player_name = '${player_name}'`;

  console.log(query);

  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
  // connection.query(`;
  // // SELECT *
  // // FROM Seasons s
  // // WHERE s.player_id = '${player_id}'
  // // ORDER BY s.season ASC`, (err, data) => {
  //   if (err || data.length === 0) {
  //     console.log(err);
  //     res.json({});
  //   } else {
  //     res.json(data);
  //   }
  // }); // replace this with your implementation
};

// Route 6: GET /roster
const roster = async function (req, res) {
  const team = req.params.team;
  const seasonsParam = req.params.season;
  let allSeasonsToggle = false;
  if (seasonsParam.length > 4) {
    allSeasonsToggle = true;
  }

  const seasonsCondition = seasonsParam
    ? `s.season = ${seasonsParam}`
    : `s.season = (SELECT MAX(season) FROM Seasons)`;

  const page = req.query.page;

  const pageSize = req.query.page_size ?? 10;

  if (seasonsCondition == "TRUE") {
    if (!page) {
      connection.query(
        `
    WITH Roster AS (SELECT s.player_id, s.mp, s.gp, s.pts, s.reb, s.ast
    FROM Seasons s 
    WHERE s.team = '${team}' AND ${seasonsCondition} AND s.season_type = 'RS'),
    Career AS (SELECT p.player_id, SUM(r.gp) as gp, SUM(r.mp) as mp, AVG(r.pts) as pts, AVG(r.reb) as reb, AVG(r.ast) as ast
    FROM Players p INNER JOIN Roster r ON p.player_id = r.player_id
    GROUP BY p.player_id)
    SELECT DISTINCT p.player_name, c.gp, c.mp, c.pts, c.reb, c.ast, p.player_height, p.player_weight, p.country, p.college
    FROM Career c JOIN Players p on c.player_id = p.player_id
    ORDER BY c.mp DESC`,
        (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        }
      );
    } else {
      const offset = pageSize * (page - 1);
      if (page === 0) {
        offset = 0;
      }
      connection.query(
        `
    WITH Roster AS (SELECT s.player_id, s.mp, s.gp, s.pts, s.reb, s.ast
      FROM Seasons s 
      WHERE s.team = '${team}' AND ${seasonsCondition} AND s.season_type = 'RS'),
      Career AS (SELECT p.player_id, SUM(r.gp) as gp, SUM(r.mp) as mp, AVG(r.pts) as pts, AVG(r.reb) as reb, AVG(r.ast) as ast
      FROM Players p NATURAL JOIN Roster r
      GROUP BY p.player_id)
      SELECT DISTINCT p.player_name, c.gp, c.mp, c.pts, c.reb, c.ast, p.player_height, p.player_weight, p.country, p.college
      FROM Career c JOIN Players p on c.player_id = p.player_id
      ORDER BY c.mp DESC
      LIMIT ${pageSize} OFFSET ${offset}`,
        (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        }
      );
    }
  } else {
    connection.query(
      `
  WITH Roster AS (SELECT s.player_id, s.mp, s.gp, s.pts, s.reb, s.ast
  FROM Seasons s 
  WHERE s.team = '${team}' AND ${seasonsCondition} AND s.season_type = 'RS')
  SELECT p.player_name, r.gp, r.mp, r.pts, r.reb, r.ast, p.player_height, p.player_weight, p.country, p.college
  FROM Players p NATURAL JOIN Roster r
  ORDER BY r.mp DESC`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }
    );
  }
};

// Route 5: GET /best_players
const best_players = async function (req, res) {
  // const season = req.query.season;
  // const team = req.query.team;

  const seasonsParam = req.params.season;
  let allSeasonsToggle = false;
  if (seasonsParam.length > 4) {
    allSeasonsToggle = true;
  }

  const seasonsCondition = allSeasonsToggle
    ? "TRUE"
    : seasonsParam
    ? `s.season = ${seasonsParam}`
    : `s.season = (SELECT MAX(season) FROM Seasons)`;

  connection.query(
    `
    SELECT p.player_name, s.team, s.season, s.war_total, s.raptor_offense, s.raptor_defense
    FROM Seasons s join Players p on s.player_id = p.player_id
    WHERE ${seasonsCondition} and s.gp > 40 and s.season_type = 'RS'
    ORDER BY s.raptor_total DESC`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );

  //   if (!team) {
  //     if (season) {
  //     connection.query(`
  //     SELECT p.player_name, s.team, s.season, s.raptor_total, s.raptor_offense, s.raptor_defense
  //     FROM Seasons s join Players p on s.player_id = p.player_id
  //     WHERE ${seasonsCondition} and s.gp > 40 and s.season_type = 'RS'
  //     ORDER BY s.raptor_total DESC`, (err, data) => {
  //     if (err || data.length === 0) {
  //       console.log(err);
  //       res.json({});
  //     } else {
  //       res.json(data)}});
  //   } else {
  //     connection.query(`
  //     SELECT p.player_name, s.team, s.season, s.raptor_total, s.raptor_offense, s.raptor_defense
  //     FROM Seasons s join Players p on s.player_id = p.player_id
  //     WHERE s.gp > 40 and s.season_type = 'RS'
  //     ORDER BY s.raptor_total DESC`, (err, data) => {
  //     if (err || data.length === 0) {
  //       console.log(err);
  //       res.json({});
  //     } else {
  //       res.json(data)};})
  //   }
  // } else {
  //     if (!season) {
  //       connection.query(`
  //         SELECT p.player_name, s.team, s.season, s.raptor_total, s.raptor_offense, s.raptor_defense
  //         FROM Seasons s join Players p on s.player_id = p.player_id
  //         WHERE s.team = '${team}' and s.gp > 40 and s.season_type = 'RS'
  //         ORDER BY s.raptor_total DESC`, (err, data) => {
  //     if (err || data.length === 0) {
  //       console.log(err);
  //       res.json({});
  //     } else {
  //       res.json(data)}});
  //   } else {
  //       connection.query(`
  //         SELECT p.player_name, s.team, s.season, s.raptor_total, s.raptor_offense, s.raptor_defense
  //         FROM Seasons s join Players p on s.player_id = p.player_id
  //         WHERE s.team = '${team}' and s.season = '${season}' and s.gp > 40 and s.season_type = 'RS'
  //         ORDER BY s.raptor_total DESC`, (err, data) => {
  //   if (err || data.length === 0) {
  //     console.log(err);
  //     res.json({});
  //   } else {
  //     res.json(data)};})
  // }
  // }
};

// Route 4: GET /game/:game_id
const game = async function (req, res) {
  const game_id = req.params.game_id;

  connection.query(
    `
  SELECT *
  FROM Games
  WHERE game_id = '${game_id}'
  ORDER BY game_id
  LIMIT 1`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data[0]);
      }
    }
  ); // replace this with your implementation
};

// Route 7: GET /upsets/:season?
const upsets = async function (req, res) {
  // const season = req.query.season;
  const seasonsParam = req.params.season;
  let allSeasonsToggle = false;
  if (seasonsParam.length > 4) {
    allSeasonsToggle = true;
  }

  const seasonsCondition = allSeasonsToggle
    ? "TRUE"
    : seasonsParam
    ? `g.year_id = ${seasonsParam}`
    : `g.year_id = (SELECT MAX(year_id) FROM Games)`;

  connection.query(
    `
   SELECT *
    FROM Games g
    WHERE ${seasonsCondition} and g.game_result = 'W'
     ORDER BY g.forecast ASC
     LIMIT 50`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 12: GET /award
const award = async function (req, res) {
  const seasonsParam = req.params.season;
  let allSeasonsToggle = false;
  if (seasonsParam.length > 4) {
    allSeasonsToggle = true;
  }

  const seasonsCondition = allSeasonsToggle
    ? "TRUE"
    : seasonsParam
    ? `a.season = ${seasonsParam}`
    : `a.season = (SELECT MAX(season) FROM Seasons)`;

  query = `
  SELECT DISTINCT a.season, a.award, p.player_name, s.team
  FROM Awards a JOIN Players p on p.player_id = a.player_id JOIN Seasons s on s.player_id=p.player_id and s.season=a.season
  WHERE ${seasonsCondition}`;

  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /awards_by_team
// Route 7: GET /awards_by_team
const awards_by_team = async function (req, res) {
  const page = req.query.page;

  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    connection.query(
      `SELECT
        Teams.fran_id,
        Seasons.season,
        COUNT(DISTINCT Awards.player_id, Awards.award) AS total_awards,
        COUNT(DISTINCT Games.game_id) AS total_wins,
        ROUND(AVG(Games.elo_n), 2) AS average_ELO
      FROM
        Seasons
        JOIN Teams ON Seasons.team = Teams.team_id
        LEFT JOIN Awards ON Seasons.player_id = Awards.player_id AND Seasons.season = Awards.season
        LEFT JOIN Games ON Seasons.team = Games.team_id AND Seasons.season = Games.year_id AND Games.game_result = 'W'
      WHERE year_id <= 2015
      GROUP BY
        Teams.fran_id,
        Seasons.season
      ORDER BY total_awards DESC;`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }
    );
  } else {
    let offset = pageSize * (page - 1);
    if (page === 0) {
      offset = 0;
    }
    connection.query(
      `SELECT
        Teams.fran_id,
        Seasons.season,
        COUNT(DISTINCT Awards.player_id, Awards.award) AS total_awards,
        COUNT(DISTINCT Games.game_id) AS total_wins,
        ROUND(AVG(Games.elo_n), 2) AS average_ELO
      FROM
        Seasons
        JOIN Teams ON Seasons.team = Teams.team_id
        LEFT JOIN Awards ON Seasons.player_id = Awards.player_id AND Seasons.season = Awards.season
        LEFT JOIN Games ON Seasons.team = Games.team_id AND Seasons.season = Games.year_id AND Games.game_result = 'W'
      WHERE year_id <= 2015
      GROUP BY
        Teams.fran_id,
        Seasons.season
      ORDER BY total_awards DESC
      LIMIT ${pageSize} OFFSET ${offset}`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }
    );
  }
};
// const awards_by_team = async function (req, res) {
//   const page = req.query.page;

//   const pageSize = req.query.page_size ?? 10;

//   if (!page) {
//     connection.query(
//       `SELECT
//     Teams.fran_id,
//     Seasons.season,
//     COUNT(DISTINCT Awards.player_id, Awards.award) AS total_awards,
//     COUNT(DISTINCT Games.game_id) AS total_wins,
//     AVG(Games.elo_n) AS average_ELO
// FROM
//     Seasons
//     JOIN Teams
//         ON Seasons.team = Teams.team_id
//     LEFT JOIN Awards
//         ON Seasons.player_id = Awards.player_id
//             AND Seasons.season = Awards.season
//     LEFT JOIN Games
//         ON Seasons.team = Games.team_id
//             AND Seasons.season = Games.year_id
//             AND Games.game_result = 'W'
// WHERE year_id <=2015
// GROUP BY
//     Teams.fran_id,
//     Seasons.season
// ORDER BY total_awards DESC;`,
//       (err, data) => {
//         if (err || data.length === 0) {
//           console.log(err);
//           res.json({});
//         } else {
//           res.json(data);
//         }
//       }
//     ); // replace this with your implementation
//   } else {
//     const offset = pageSize * (page - 1);
//     if (page === 0) {
//       offset = 0;
//     }
//     connection.query(
//       `SELECT
//     Teams.fran_id,
//     Seasons.season,
//     COUNT(DISTINCT Awards.player_id, Awards.award) AS total_awards,
//     COUNT(DISTINCT Games.game_id) AS total_wins,
//     AVG(Games.elo_n) AS average_ELO
// FROM
//     Seasons
//     JOIN Teams
//         ON Seasons.team = Teams.team_id
//     LEFT JOIN Awards
//         ON Seasons.player_id = Awards.player_id
//             AND Seasons.season = Awards.season
//     LEFT JOIN Games
//         ON Seasons.team = Games.team_id
//             AND Seasons.season = Games.year_id
//             AND Games.game_result = 'W'
// WHERE year_id <=2015
// GROUP BY
//     Teams.fran_id,
//     Seasons.season
// ORDER BY total_awards DESC;
//       LIMIT ${pageSize} OFFSET ${offset}`,
//       (err, data) => {
//         if (err || data.length === 0) {
//           console.log(err);
//           res.json({});
//         } else {
//           res.json(data);
//         }
//       }
//     ); // replace this with your implementation
//   }
// };

// Route 8: GET /best_seasons_bad_teams
const best_seasons_bad_teams = async function (req, res) {
  const page = req.query.page;

  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    connection.query(
      `
    WITH temp (season, team, peak) AS (
      select year_id, team_id, max(elo_n) as peak_elo
      from Games
      GROUP BY year_id, team_id
      HAVING peak_elo < 1500
      ORDER BY peak_elo ASC)
      SELECT p.player_name, t.season, t.team, t.peak, s.raptor_total, s.raptor_offense, s.raptor_defense
      FROM temp t JOIN Seasons s ON t.team = s.team and t.season = s.season JOIN Players p ON p.player_id = s.player_id
      WHERE s.gp > 40 and season_type = 'RS'
      ORDER BY s.raptor_total DESC;`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }
    );
  } else {
    const offset = pageSize * (page - 1);
    connection.query(
      `
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
      LIMIT ${pageSize} OFFSET ${offset}`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }
    );
  }
};

// Route 8: GET /draft/good
const draft_good = async function (req, res) {
  const page = req.query.page;

  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    connection.query(
      `WITH draft (id) AS
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
    ORDER BY total_gp DESC;`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }
    );
  } else {
    const offset = pageSize * (page - 1);
    connection.query(
      `WITH draft (id) AS
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
      LIMIT ${pageSize} OFFSET ${offset}`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }
    );
  }
};

// Route 8: GET /draft/bad
const draft_bad = async function (req, res) {
  const page = req.query.page;

  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    connection.query(
      `WITH draft (id) AS
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
ORDER BY avg_raptor ASC;`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }
    );
  } else {
    const offset = pageSize * (page - 1);
    connection.query(
      `WITH draft (id) AS
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
    LIMIT ${pageSize} OFFSET ${offset}`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }
    );
  }
};

//route 11: GET /teamwork
const teamwork = async function (req, res) {
  const seasonsParam = req.params.season;
  let allSeasonsToggle = false;
  if (seasonsParam.length > 4) {
    allSeasonsToggle = true;
  }

  const seasonsCondition = allSeasonsToggle
    ? "TRUE"
    : seasonsParam
    ? `r.season = ${seasonsParam}`
    : `r.season = (SELECT MAX(season) FROM Seasons)`;

  const query = `
  WITH eligible_players  (player_id, season) AS (
    SELECT distinct s.player_id, s.season FROM Seasons s WHERE s.mp>1500 AND s.season_type = 'RS'),
ranks (player_id, team, season, ranking_year, ranking_team) AS (SELECT s.player_id, s.team, s.season,
        rank()  OVER (PARTITION BY s.season ORDER BY s.raptor_total DESC) as ranking_year,
        rank()  OVER (PARTITION BY s.season, s.team ORDER BY s.raptor_total DESC) as ranking_team
FROM eligible_players e JOIN Seasons s on e.player_id = s.player_id and e.season = s.season and s.season_type = 'RS'
ORDER BY season),
top_teams (team, season) as (SELECT distinct s.team, s.season
FROM ranks r join Seasons s ON r.player_id = s.player_id AND r.season = s.season and s.season_type = 'RS'
WHERE r.ranking_year <=20),
eligible_teams (team,season, max_elo) AS (SELECT s.team, s.season, MAX(elo_n) AS max_elo
FROM Games g
          JOIN Seasons s on s.team = g.team_id AND s.season = g.year_id and s.season_type = 'RS'
WHERE NOT EXISTS (SELECT DISTINCT * FROM top_teams t WHERE t.team = s.team AND t.season = s.season)
GROUP BY team, season
ORDER BY max_elo DESC)
SELECT t.team,t.season, max_elo, player_name as best_player, ranking_year as best_player_ranking
from eligible_teams t join ranks r on t.team = r.team and t.season = r.season
join Players p ON p.player_id = r.player_id
where r.ranking_team = 1 and ${seasonsCondition}
order by max_elo DESC`;

  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

// Route 5: GET /search_games
const search_games = async function (req, res) {
  const seasonsParam = req.params.season;
  let allSeasonsToggle = false;
  if (seasonsParam.length > 4) {
    allSeasonsToggle = true;
  }

  const seasonsCondition = allSeasonsToggle
    ? "TRUE"
    : seasonsParam
    ? `g.year_id = ${seasonsParam}`
    : `g.year_id = (SELECT MAX(year_id) FROM Games)`;

  const team1Param = req.params.team1;
  let allTeam1sToggle = false;
  if (team1Param == "ALL") {
    allTeam1sToggle = true;
  }

  const team1Condition = allTeam1sToggle
    ? "TRUE"
    : `g.team_id = '${team1Param}'`;

  const team2Param = req.params.team2;
  let allTeam2sToggle = false;
  if (team2Param == "ALL") {
    allTeam2sToggle = true;
  }

  const team2Condition = allTeam2sToggle
    ? "TRUE"
    : `g.opp_id = '${team2Param}'`;

  const resultsParam = req.params.result;
  let allResultsToggle = false;
  if (resultsParam == "ALL") {
    allResultsToggle = true;
  }

  const resultCondition = allResultsToggle
    ? "TRUE"
    : `g.game_result = '${resultsParam}'`;

  const sortParam = req.params.sort;
  const sortOrder = req.params.sortOrder;

  connection.query(
    `SELECT g.*, pts+opp_pts as total_pts, pts-opp_pts as pts_diff, (elo_i+opp_elo_i)/2 as avg_elo, elo_i-opp_elo_i as elo_diff
    FROM Games g
    WHERE ${seasonsCondition} and ${team1Condition} and ${team2Condition} and ${resultCondition}
    ORDER BY ${sortParam} ${sortOrder}`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

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
  teams,
  roster,
  search_games,
};
