import { useState, useCallback, useEffect } from "react";
import { SeasonSelect } from '../components/SeasonSelect';
import { LazyTable } from '../components/LazyTable';
import { debounce } from 'lodash';
const config = require("../config.json");

const Game = () => {
  const [games, setGames] = useState([]);
  const [seasons, setSeasons] = useState([2015]);
  const [topUpsets, setTopUpsets] = useState([]);

  const handleSeasonsChange = useCallback(
    debounce((newSelectedSeason) => {
      setSeasons(newSelectedSeason);
  
      if (newSelectedSeason <= 2015) {
        const fetchData = async () => {
          const res = await fetch(
            `http://${config.server_host}:${config.server_port}/upsets/${newSelectedSeason}`
          );
          const resJson = res ? await res.json() : null;
          setTopUpsets(resJson || []);
        };
        fetchData();
      } else {
        setTopUpsets([]);
      }
    }, 50),
    [seasons]
  );

  useEffect(() => {
    const queryParams = new URLSearchParams({
      seasons,
    }).toString();

    const fetchData = async () => {
      fetch(`http://${config.server_host}:${config.server_port}/games?${queryParams}`)
        .then((res) => res.json())
        .then((resJson) => setGames(resJson));
    };
    fetchData();
  }, [seasons]);

  const h1Style = {
    marginRight: "30px",
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: ".3rem",
    textAlign: 'center',
    color: '#2E4A62'
  };

  return (
    <div>
      <SeasonSelect onSeasonsChange={handleSeasonsChange} value={seasons} setValue={setSeasons} />
      <h1 style={h1Style}>Top Upsets</h1>
      <LazyTable data={topUpsets} seasons={seasons} />
  
      <h1 style={h1Style}>Games</h1>
      <LazyTable data={games} />
    </div>
  );
};

export default Game;
