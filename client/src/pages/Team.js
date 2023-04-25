import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SeasonSelect } from "../components/SeasonSelect";
import { LazyTable } from "../components/LazyTable";
import { debounce } from "lodash";
const config = require("../config.json");

const Team = () => {
  const { season } = useParams();
  const [seasons, setSeasons] = useState([2022]);
  const [awardByTeam, setAwardByTeam] = useState([]);
  const [teamworkData, setTeamworkData] = useState([]); // New state variable for teamwork data

  const handleSeasonsChange = useCallback(
    debounce((newSelectedSeason) => {
      setSeasons(newSelectedSeason);
    }, 50),
    [seasons]
  );

  useEffect(() => {
    const fetchAwardsByTeam = async () => {
      fetch(
        `http://${config.server_host}:${config.server_port}/awards_by_team`
      )
        .then((res) => res.json())
        .then((resJson) => setAwardByTeam(resJson));
    };

    fetchAwardsByTeam();
    
  }, []);

  useEffect(() => {
    const fetchTeamworkData = async () => {
      fetch(
        `http://${config.server_host}:${config.server_port}/teamwork/${season}`
      )
        .then((res) => res.json())
        .then((resJson) => setTeamworkData(resJson));
    };
    fetchTeamworkData();
  }, [season]);

  const h1Style = {
    marginRight: "30px",
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: ".3rem",
    textAlign: "center",
    color: "#2E4A62",
  };

  //console.log(season);

  return (
    <div>
      <SeasonSelect
        onSeasonsChange={handleSeasonsChange}
        value={seasons}
        setValue={setSeasons}
        max={[2022]}
      />
      <h1 style={h1Style}>Awards By Team</h1>
      <LazyTable data={awardByTeam} seasons={seasons} />
      <h1 style={h1Style}>Teamwork</h1> {/* New header for teamwork data */}
      <LazyTable data={teamworkData} seasons={seasons} /> {/* New LazyTable for teamwork data */}
    </div>
  );
};

export default Team;
