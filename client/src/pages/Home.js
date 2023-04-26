import { h1Style } from "./Team";

import { useState, useCallback, useEffect } from "react";
import { NbaTeamLogos } from "../components/NbaTeamLogos";
import { SeasonSelect } from "../components/SeasonSelect";
import { debounce } from "lodash";
const config = require("../config.json");

const Home = () => {
  const [teams, setTeams] = useState([]);
  const [seasons, setSeasons] = useState([2022]);

  //linter warning, not a big deal
  //use debounce function to buffer the http requests from the slider
  const handleSeasonsChange = useCallback(
    debounce((newSelectedSeason) => {
      setSeasons(newSelectedSeason);

      const fetchData = async () => {
        fetch(
          `http://${config.server_host}:${config.server_port}/teams/${newSelectedSeason}`
        )
          .then((res) => res.json())
          .then((resJson) => setTeams(resJson));
      };
      fetchData();
    }, 50),
    [seasons]
  );
  //useEffect with empty dependency array gets the API call to run initially
  useEffect(() => {
    const fetchData = async () => {
      fetch(
        `http://${config.server_host}:${config.server_port}/teams/${seasons}`
      )
        .then((res) => res.json())
        .then((resJson) => setTeams(resJson));
    };
    fetchData();
  }, []);

  return (
    <div>
      <SeasonSelect
        onSeasonsChange={handleSeasonsChange}
        value={seasons}
        setValue={setSeasons}
      />
      <NbaTeamLogos teams={teams} seasons={seasons} />;
    </div>
  );
};

export default Home;
