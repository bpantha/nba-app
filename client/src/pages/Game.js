import { useState, useCallback, useEffect } from "react";
import { SeasonSelect } from "../components/SeasonSelect";
import { LazyTable } from "../components/LazyTable";
import { debounce } from "lodash";
const config = require("../config.json");

const Game = () => {
  const [seasons, setSeasons] = useState(2015);
  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [sort, setSort] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [searchResults, setSearchResults] = useState([]);
  const [topUpsets, setTopUpsets] = useState([]);
  const [gameOutcome, setGameOutcome] = useState("all");


  const handleSeasonsChange = useCallback(
    debounce((newSelectedSeason) => {
      console.log("Selected season:", newSelectedSeason);
      setSeasons(parseInt(newSelectedSeason, 10));
      if (newSelectedSeason > 2015){
        setSeasons(2015);
      }
    }, 50),
    []
  );
  
  

  const handleGameOutcomeChange = (e) => {
    setGameOutcome(e.target.value);
  };
  

  // Fetch teams based on the selected season
  useEffect(() => {
    const fetchData = async () => {
      fetch(`http://${config.server_host}:${config.server_port}/upsets/${seasons}`)
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
          `http://${config.server_host}:${config.server_port}/search_games/${seasons}/${team1}/${team2}/${sort}/${sortOrder}/${gameOutcome}`
        )
          .then((res) => res.json())
          .then((resJson) => setSearchResults(resJson));
      }
    };
    fetchData();
  }, [seasons, team1, team2, sort, sortOrder, gameOutcome]);  

  // Fetch top upsets
  useEffect(() => {
    const fetchData = async () => {
      fetch(`http://${config.server_host}:${config.server_port}/upsets/${seasons}`)
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

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div>
      <h1 style={{
        fontSize: "3rem",
        textAlign: "center",
        margin: "2rem 0",
        background: "linear-gradient(to right, #0074D9, #7FDBFF)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>Games</h1>
      <SeasonSelect
        onSeasonsChange={handleSeasonsChange}
        value={seasons}
        setValue={setSeasons}
      />
      <select onChange={(e) => handleTeamChange(e, 1)}>
        <option value="">Select Team 1</option>
        {teams.map((team) => (
          <option key={team.team_id} value={team.team_id}>
            {team.fran_id}
          </option>
        ))}
      </select>
      <select onChange={(e) => handleTeamChange(e, 2)}>
        <option value="">Select Team 2</option>
        {teams.map((team) => (
          <option key={team.team_id} value={team.team_id}>
            {team.fran_id}
          </option>
        ))}
      </select>
      <select onChange={handleSortChange}>
        <option value="">Sort by</option>
        {/* Add sort options here */}
      </select>
      <select onChange={handleSortOrderChange}>
        <option value="ascending">Ascending</option>
        <option value="descending">Descending</option>
      </select>
      <select onChange={handleGameOutcomeChange}>
        <option value="all">All</option>
        <option value="wins">Wins</option>
        <option value="losses">Losses</option>
      </select>
      <h1 style={h1Style}>Search Results</h1>
      <LazyTable data={searchResults} seasons={seasons} />
      <h1 style={h1Style}>Top Upsets</h1>
     
      <LazyTable data={topUpsets} seasons={seasons} />
    </div>
  );

};
export default Game;
