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
      console.log("Selected season:", newSelectedSeason);
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
        fetch(
          `http://${config.server_host}:${config.server_port}/search_games/${seasons}/${team1}/${team2}/${gameOutcome}/${sort}/${sortOrder}`
        )
          .then((res) => res.json())
          .then((resJson) => setSearchResults(resJson));
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
    marginRight: "30px",
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: ".3rem",
    textAlign: "center",
    color: "#2E4A62",
  };

  const handleTeamChange = (e, teamIndex) => {
    if (teamIndex === 1) {
      setTeam1(e.target.value);
    } else {
      setTeam2(e.target.value);
    }
  };

  console.log(team1);
  console.log(team2);

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  // searchResults
  // topUpsets
  const keysToKeep = ["year_id"];

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
      <h1
        style={{
          fontSize: "3rem",
          textAlign: "center",
          margin: "2rem 0",
          background: "linear-gradient(to right, #0074D9, #7FDBFF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Games
      </h1>
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
      <LazyTable data={filteredResults} seasons={seasons} />
      <h1 style={h1Style}>Top Upsets</h1>
      <LazyTable data={topUpsets} seasons={seasons} />
    </div>
  );
};
export default Game;
