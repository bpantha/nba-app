import { useState, useCallback, useEffect } from "react";
import { SeasonSelect } from "../components/SeasonSelect";
import { LazyTable } from "../components/LazyTable";
import { debounce } from "lodash";
const config = require("../config.json");

const Game = () => {
  const [seasons, setSeasons] = useState([2015]);
  const [topUpsets, setTopUpsets] = useState([]);
  const [awardByTeam, setAwardByTeam] = useState([]);

  const handleSeasonsChange = useCallback(
    debounce((newSelectedSeason) => {
      setSeasons(newSelectedSeason);
    }, 50),
    [] // Remove seasons from the dependencies array
  );

  useEffect(() => {
    const fetchData = async () => {
      fetch(
        `http://${config.server_host}:${config.server_port}/upsets/${seasons}`
      )
        .then((res) => res.json())
        .then((resJson) => setTopUpsets(resJson));
    };
    fetchData();
  }, [seasons]);

  useEffect(() => {
    const fetchData = async () => {
      fetch(
        `http://${config.server_host}:${config.server_port}/awards_by_team/`
      )
        .then((res) => res.json())
        .then((resJson) => setAwardByTeam(resJson));
    };
    fetchData();
  }, []);

  const h1Style = {
    marginRight: "30px",
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: ".3rem",
    textAlign: "center",
    color: "#2E4A62",
  };

  return (
    <div>
      <SeasonSelect
        onSeasonsChange={handleSeasonsChange}
        value={seasons}
        setValue={setSeasons}
      />
      <h1 style={h1Style}>Top Upsets</h1>
      <LazyTable data={topUpsets} seasons={seasons} />
      <LazyTable data={awardByTeam} seasons={seasons} />
    </div>
  );
};

export default Game;
