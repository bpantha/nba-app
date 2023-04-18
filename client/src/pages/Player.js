import { useState, useCallback, useEffect } from "react";
import { SeasonSelect } from '../components/SeasonSelect';
import { LazyTable } from '../components/LazyTable';
import { debounce } from 'lodash';
const config = require("../config.json");  

const Player = () => {
  const [awardWinners, setAwardWinners] = useState([]);
  const [seasons, setSeasons] = useState([2022]);

  //linter warning, not a big deal
  //use debounce function to buffer the http requests from the slider
  const handleSeasonsChange = useCallback(
    debounce((newSelectedSeason) => {
      setSeasons(newSelectedSeason);

      const fetchData = async() => {
        fetch(`http://${config.server_host}:${config.server_port}/award/${seasons}`)
        .then((res) => res.json())
        .then((resJson) => setAwardWinners(resJson));
      }
      fetchData();
    }, 50),
    [seasons]
  );

  // console.log(awardWinners);

  

  //useEffect with empty dependency array gets the API call to run initially
    useEffect(() => {
      const fetchData = async() => {
        fetch(`http://${config.server_host}:${config.server_port}/award/${seasons}`)
        .then((res) => res.json())
        .then((resJson) => setAwardWinners(resJson));
      }
      fetchData();
    }, [])

  return(
    <div>
      <SeasonSelect onSeasonsChange={handleSeasonsChange} value={seasons} setValue={setSeasons} />
      <LazyTable data={awardWinners}/>
    </div>
    
  ) 
};

export default Player;