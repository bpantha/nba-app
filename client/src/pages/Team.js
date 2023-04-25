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
  const [teamworkData, setTeamworkData] = useState([]); // New state variable for teamwork data

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
<<<<<<< HEAD
        max={[2022]}
=======
        max={2015}
>>>>>>> 4bd66aedac7e360eae05b72d02105ade2f5ce281
      />
      <h1 style={h1Style}>Teamwork</h1>
      <LazyTable data={teamworkData} seasons={seasons} />
      <h1 style={h1Style}>Awards By Team</h1>
      <LazyTable data={awardByTeam} seasons={seasons} />
    </div>
  );
};

export default Team;
