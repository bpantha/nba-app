import { useState, useCallback, useEffect } from "react";
import { SeasonSelect } from "../components/SeasonSelect";
import { LazyTable } from "../components/LazyTable";
import { debounce } from "lodash";

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
  const [canSearch, setCanSearch] = useState(false);

  useEffect(() => {
    if (team1 && team2 && sort) {
      setCanSearch(true);
    } else {
      setCanSearch(false);
    }
  }, [team1, team2, sort]);

  const handleSearchClick = () => {
    fetchData();
  };

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
          setTeams(resJson);
        });
    };
    fetchTeams();
  }, [seasons]);

  const handleGameOutcomeChange = (e) => {
    setGameOutcome(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      fetch(
        `http://${config.server_host}:${config.server_port}/upsets/${seasons}`
      )
        .then((res) => res.json())
        .then((resJson) => {
          setTopUpsets(resJson);
        });
    };
    fetchData();
  }, [seasons]);

  const fetchData = async () => {
    if (team1 && team2 && sort) {
      if (team1 === team2) {
        setSearchResults([]);
      } else {
        fetch(
          `http://${config.server_host}:${config.server_port}/search_games/${seasons}/${team1}/${team2}/${gameOutcome}/${sort}/${sortOrder}`
        )
          .then((res) => res.json())
          .then((resJson) => {
            if (resJson === null) {
              setSearchResults([]);
            } else {
              setSearchResults(resJson);
            }
          });
      }
    } else {
      setSearchResults([]);
    }
  };

  const getSelectStyle = (value) => {
    const baseStyle = {
      margin: "0.5rem",
      padding: "0.5rem",
      borderRadius: "4px",
      fontSize: "1rem",
      fontFamily: "monospace",
    };

    if (value) {
      return {
        ...baseStyle,
        border: "1px solid #2E4A62",
        backgroundColor: "#f0f8ff",
      };
    } else {
      return {
        ...baseStyle,
        border: "1px solid #ff4d4d",
        backgroundColor: "#ffe6e6",
      };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      fetch(
        `http://${config.server_host}:${config.server_port}/upsets/${seasons}`
      );
    };
    fetchData();
  }, [seasons]);

  const h1Style = {
    fontSize: "3rem",
    textAlign: "center",
    margin: "2rem 0",
    background: "linear-gradient(to right, #003459, #0074D9)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: ".3rem",
    textTransform: "uppercase",
    paddingBottom: "0.3rem",
    borderBottom: "4px solid #0074D9",
  };

  const rounding = (num) => {
    return parseFloat(num.toFixed(2));
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

  const columnNameChanges = {
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

  const renamedSearchResults =
    Array.isArray(searchResults) &&
    searchResults.map((row) => {
      const renamedRow = {};
      for (const key in row) {
        if (columnNameChanges[key]) {
          renamedRow[columnNameChanges[key]] =
            typeof row[key] === "number" ? rounding(row[key]) : row[key];
        }
      }
      return renamedRow;
    });

  const topUpsetsdesiredKeys = [
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

  const topUpsetscolumnNameChanges = {
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
    if (data === null) {
      return "No Data Available";
    } else {
      return data.map((row) => {
        const aRow = {};
        for (const key in row) {
          if (
            topUpsetsdesiredKeys.includes(key) &&
            topUpsetscolumnNameChanges[key]
          ) {
            aRow[topUpsetscolumnNameChanges[key]] =
              typeof row[key] === "number" ? rounding(row[key]) : row[key];
          }
        }
        return aRow;
      });
    }
  };

  return (
    <div>
      <SeasonSelect
        onSeasonsChange={handleSeasonsChange}
        value={seasons}
        setValue={setSeasons}
        style={selectStyle}
        max={2015}
      />
      <h1 style={h1Style}>Games</h1>

      <div
        style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
      >
        <select
          onChange={(e) => handleTeamChange(e, 1)}
          style={getSelectStyle(team1)}
        >
          <option value="">Select Team 1</option>
          {teams.map((team) => (
            <option key={team.team_id} value={team.team_id}>
              {team.team_id} - {team.fran_id}{" "}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => handleTeamChange(e, 2)}
          style={getSelectStyle(team2)}
        >
          <option value="">Select Team 2</option>
          {teams.map((team) => (
            <option key={team.team_id} value={team.team_id}>
              {team.team_id} - {team.fran_id}{" "}
            </option>
          ))}
        </select>
        <select onChange={handleSortChange} style={getSelectStyle(sort)}>
          <option value="">Sort by</option>
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
        <button
          onClick={handleSearchClick}
          disabled={!canSearch}
          style={{
            ...selectStyle,
            cursor: canSearch ? "pointer" : "not-allowed",
            backgroundColor: canSearch ? "#0074D9" : "#9aa3ac",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Search
        </button>
      </div>
      <h1 style={h1Style}>Search Results</h1>
      <LazyTable
        data={renamedSearchResults}
        seasons={seasons}
        rounding={rounding}
      />
      <h1 style={h1Style}>Top Upsets In {seasons}</h1>
      <LazyTable
        data={filterAndRenameTopUpsetsColumns(topUpsets)}
        seasons={seasons}
        rounding={rounding}
      />
    </div>
  );
};
export default Game;
