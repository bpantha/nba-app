import { useState, useCallback, useEffect } from "react";
import { SeasonSelect } from "../components/SeasonSelect";
import { LazyTable } from "../components/LazyTable";
import { debounce, sortBy } from "lodash";
const config = require("../config.json");

const Game = () => {
  const selectStyle = {
    margin: "0.5rem",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #2E4A62",
    fontSize: "1rem",
    fontFamily: "monospace",
  };

  const [seasons, setSeasons] = useState([2015]);
  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [sort, setSort] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [searchResults, setSearchResults] = useState([]);
  const [topUpsets, setTopUpsets] = useState([]);
  const [gameOutcome, setGameOutcome] = useState("ALL");

  const handleSeasonsChange = useCallback(
    debounce((newSelectedSeason) => {
      setSeasons(newSelectedSeason);
    }, 50),
    []
  );

  useEffect(() => {
    const fetchTeams = async () => {
      fetch(
        `http://${config.server_host}:${config.server_port}/teams/${seasons}`
      )
        .then((res) => res.json())
        .then((resJson) => {
          console.log("Teams data:", resJson);
          setTeams(resJson);
        });
    };
    fetchTeams();
  }, [seasons]);

  const handleGameOutcomeChange = (e) => {
    setGameOutcome(e.target.value);
  };

  // Fetch teams based on the selected season
  useEffect(() => {
    const fetchData = async () => {
      fetch(
        `http://${config.server_host}:${config.server_port}/upsets/${seasons}`
      )
        .then((res) => res.json())
        .then((resJson) => {
          console.log("Top Upsets data:", resJson);
          setTopUpsets(resJson);
        });
    };
    fetchData();
  }, [seasons]);

  useEffect(() => {
    const fetchData = async () => {
      if (team1 && team2 && sort) {
        if (team1 === team2) {
          setSearchResults([]); // Clear the search results if both teams are the same
        } else {
          fetch(
            `http://${config.server_host}:${config.server_port}/search_games/${seasons}/${team1}/${team2}/${gameOutcome}/${sort}/${sortOrder}`
          )
            .then((res) => res.json())
            .then((resJson) => setSearchResults(resJson));
        }
      } else {
        setSearchResults([]); // Clear the search results if the conditions are not met
      }
    };
    fetchData();
  }, [seasons, team1, team2, gameOutcome, sort, sortOrder]);

  // Fetch top upsets
  useEffect(() => {
    const fetchData = async () => {
      fetch(
        `http://${config.server_host}:${config.server_port}/upsets/${seasons}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error ${res.status}`);
          }
          return res.json();
        })
        .then((resJson) => {
          console.log("Top Upsets data:", resJson);
          setTopUpsets(resJson);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    fetchData();
  }, [seasons]);

  const h1Style = {
    fontSize: "3rem",
    textAlign: "center",
    margin: "2rem 0",
    background: "linear-gradient(to right, #003459, #0074D9)", // Updated gradient colors
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: ".3rem",
    textTransform: "uppercase", // Added text transformation
    paddingBottom: "0.3rem", // Added padding to the bottom
    borderBottom: "4px solid #0074D9", // Added a solid bottom border
  };

  const handleTeamChange = (e, teamIndex) => {
    if (teamIndex === 1) {
      setTeam1(e.target.value);
    } else {
      setTeam2(e.target.value);
    }
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  // searchResults
  // topUpsets
  const keysToKeep = [
    "year_id",
    "date_game",
    "is_playoffs",
    "team_id",
    "fran_id",
    "pts",
    "elo_i",
    "elo_n",
    "win_equiv",
    "opp_id",
    "opp_pts",
    "opp_elo_i",
    "opp_elo_n",
    "game_location",
    "game_result",
    "forecast",
    "total_pts",
    "pts_diff",
    "avg_elo",
    "elo_diff",
  ];

  const columnMapping = {
    year_id: "Year",
    date_game: "Game Date",
    is_playoffs: "Is Playoffs",
    fran_id: "Team",
    pts: "Points",
    elo_i: "Elo Initial",
    elo_n: "Elo New",
    win_equiv: "Win Equiv",
    opp_id: "Opponent ID",
    opp_pts: "Opponent Points",
    opp_elo_i: "Opponent Elo Initial",
    opp_elo_n: "Opponent Elo New",
    game_location: "Game Location",
    game_result: "Game Result",
    forecast: "Forecast",
    total_pts: "Total Points",
    pts_diff: "Points Difference",
    avg_elo: "Average Elo",
    elo_diff: "Elo Difference",
  };

  const renamedSearchResults = searchResults.map((row) => {
    const renamedRow = {};
    for (const key in row) {
      if (columnMapping[key]) {
        renamedRow[columnMapping[key]] = row[key];
      }
    }
    return renamedRow;
  });

  const topUpsetsKeysToKeep = [
    "year_id",
    "date_game",
    "is_playoffs",
    "fran_id",
    "pts",
    "elo_i",
    "elo_n",
    "win_equiv",
    "opp_id",
    "opp_pts",
    "opp_elo_i",
    "opp_elo_n",
    "game_location",
    "game_result",
    "forecast",
  ];

  const topUpsetsColumnMapping = {
    year_id: "Year",
    date_game: "Game Date",
    is_playoffs: "Is Playoffs",
    fran_id: "Franchise ID",
    pts: "Points",
    elo_i: "Elo Initial",
    elo_n: "Elo New",
    win_equiv: "Win Equiv",
    opp_id: "Opponent ID",
    opp_pts: "Opponent Points",
    opp_elo_i: "Opponent Elo Initial",
    opp_elo_n: "Opponent Elo New",
    game_location: "Game Location",
    game_result: "Game Result",
    forecast: "Forecast",
  };

  const filterAndRenameTopUpsetsColumns = (data) => {
    return data.map((row) => {
      const newRow = {};
      for (const key in row) {
        if (topUpsetsKeysToKeep.includes(key) && topUpsetsColumnMapping[key]) {
          newRow[topUpsetsColumnMapping[key]] = row[key];
        }
      }
      return newRow;
    });
  };

  const renamedTopUpsets = filterAndRenameTopUpsetsColumns(topUpsets);

  const filteredResults = searchResults.map((result) => {
    return Object.keys(result)
      .filter((key) => keysToKeep.includes(key))
      .reduce((acc, key) => {
        acc[key] = result[key];
        return acc;
      }, {});
  });

  console.log(filteredResults);

  return (
    <div>
      <h1 style={h1Style}>Games</h1>
      <div
        style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
      >
        <SeasonSelect
          onSeasonsChange={handleSeasonsChange}
          value={seasons}
          setValue={setSeasons}
          style={selectStyle}
          max={2015}
        />
        <select onChange={(e) => handleTeamChange(e, 1)} style={selectStyle}>
          <option value="">Select Team 1</option>
          {teams.map((team) => (
            <option key={team.team_id} value={team.team_id}>
              {team.team_id} - {team.fran_id}{" "}
              {/* Display team ID alongside franchise ID */}
            </option>
          ))}
        </select>
        <select onChange={(e) => handleTeamChange(e, 2)} style={selectStyle}>
          <option value="">Select Team 2</option>
          {teams.map((team) => (
            <option key={team.team_id} value={team.team_id}>
              {team.team_id} - {team.fran_id}{" "}
              {/* Display team ID alongside franchise ID */}
            </option>
          ))}
        </select>

        <select onChange={handleSortChange} style={selectStyle}>
          <option value="">Sort by</option>
          {/* Add sort options here */}
          <option value="total_pts">Total Points</option>
          <option value="avg_elo">Average Elo</option>
          <option value="forecast">Forecast</option>
        </select>

        <select onChange={handleSortOrderChange} style={selectStyle}>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
        <select onChange={handleGameOutcomeChange} style={selectStyle}>
          <option value="ALL">All</option>
          <option value="W">Wins</option>
          <option value="L">Losses</option>
        </select>
      </div>
      <h1 style={h1Style}>Search Results</h1>
      <LazyTable data={renamedSearchResults} seasons={seasons} />
      <h1 style={h1Style}>Top Upsets By Season</h1>
      <LazyTable data={renamedTopUpsets} seasons={seasons} />
    </div>
  );
};
export default Game;
