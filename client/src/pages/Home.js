import { useEffect, useState } from "react";
import { NbaTeamLogos } from '../components/NbaTeamLogos';
import { SeasonSelect } from '../components/SeasonSelect';
const config = require("../config.json");  

const Home = () => {
  const [teams, setTeams] = useState([]);
  const [seasons, setSeasons] = useState([2022,2022]);

  const handleSeasonsChange = (newSelectedSeasons) => {
    console.log(newSelectedSeasons);
    setSeasons(newSelectedSeasons);
  }

  useEffect(() => {
    const fetchData = async() => {
      fetch(`http://${config.server_host}:${config.server_port}/teams/${seasons}`)
      .then((res) => res.json())
      .then((resJson) => setTeams(resJson));
    }
    fetchData();
  }, [seasons]);

  

  return(
    <div>
      <SeasonSelect onSeasonsChange={handleSeasonsChange} />
      <NbaTeamLogos teams={teams} seasons={seasons} />;

    </div>
    
  ) 
};

  export default Home;