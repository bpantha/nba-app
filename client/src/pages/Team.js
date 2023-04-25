import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SeasonSelect } from "../components/SeasonSelect";
import { LazyTable } from "../components/LazyTable";
import { debounce } from "lodash";
const config = require("../config.json");

const Team = () => {
  const { season } = useParams();
  const [seasons, setSeasons] = useState([2015]);
  const [awardByTeam, setAwardByTeam] = useState([]);
  const [teamworkData, setTeamworkData] = useState([]);

  const handleSeasonsChange = useCallback(
    debounce((newSelectedSeason) => {
      setSeasons(newSelectedSeason);
    }, 50),
    [seasons]
  );

  useEffect(() => {
    const fetchAwardsByTeam = async () => {
      fetch(`http://${config.server_host}:${config.server_port}/awards_by_team`)
        .then((res) => res.json())
        .then((resJson) => setAwardByTeam(resJson));
    };

    fetchAwardsByTeam();
    
  }, []);

  useEffect(() => {
    const fetchTeamworkData = async () => {
      fetch(
        `http://${config.server_host}:${config.server_port}/teamwork/${seasons}`
      )
        .then((res) => res.json())
        .then((resJson) => setTeamworkData(resJson));
    };
    fetchTeamworkData();
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

  return (
    <div>
      <SeasonSelect
        onSeasonsChange={handleSeasonsChange}
        value={seasons}
        setValue={setSeasons}
        max={2015}
        style={{
          margin: "0.5rem",
          padding: "0.5rem",
          borderRadius: "4px",
          border: "1px solid #2E4A62",
          fontSize: "1rem",
          fontFamily: "monospace",
        }}
      />
      <h1 style={h1Style}>Teamwork</h1>
      <LazyTable data={teamworkData} seasons={seasons} />
      <h1 style={h1Style}>Awards By Team</h1>
      <LazyTable data={awardByTeam} seasons={seasons} />
    </div>
  );
};

export default Team;
