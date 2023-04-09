import { useEffect, useState } from "react";
import NbaTeamLogos from '../components/NbaTeamLogos';
const config = require("../config.json");  

const Home = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/teams`)
      .then((res) => res.json())
      .then((resJson) => setTeams(resJson));
  }, []);

  return <NbaTeamLogos teams={teams} />;
};

  export default Home;