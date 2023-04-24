import { useState, useCallback, useEffect } from "react";
import { SeasonSelect } from '../components/SeasonSelect';
import { LazyTable } from '../components/LazyTable';
import { debounce } from 'lodash';
const config = require("../config.json");  

const Game = () => {
  // const [games, setGames] = useState([]);
  const [seasons, setSeasons] = useState([2015]);
  const [topUpsets, setTopUpsets] = useState([]);

  // const [sortBy, setSortBy] = useState('date');
  // const [team1, setTeam1] = useState('');
  // const [team2, setTeam2] = useState('');

  // use debounce function to buffer the http requests from the slider
  const handleSeasonsChange = useCallback(
    debounce((newSelectedSeason) => {
      setSeasons(newSelectedSeason);
  
      const fetchData = async () => {
        const res = await fetch(
          `http://${config.server_host}:${config.server_port}/upsets/${newSelectedSeason}`
        );
        const resJson = res ? await res.json() : null;
        setTopUpsets(resJson || []);
      };
      fetchData();
    }, 50),
    [seasons]
  );
  
  console.log("seasons", seasons);
  console.log("top upsets", topUpsets);

  // const handleSortByChange = (e) => {
  //   setSortBy(e.target.value);
  // };

  // const handleTeam1Change = (e) => {
  //   setTeam1(e.target.value);
  // };

  // const handleTeam2Change = (e) => {
  //   setTeam2(e.target.value);
  // };

  // Hello
  // Fetch the top upsets on mount
  // useEffect(() => {
  //   const fetchData = async() => {
  //     fetch(`http://${config.server_host}:${config.server_port}/upsets?${seasons}`)
  //       .then((res) => res.json())
  //       .then((resJson) => setTopUpsets(resJson));
  //   }
  //   fetchData();
  // }, []);

  // Fetch the games on mount and whenever the filters change
  // useEffect(() => {
  //   const queryParams = new URLSearchParams({
  //     seasons,
  //     sortBy,
  //     team1,
  //     team2,
  //   }).toString();

  //   const fetchData = async() => {
  //     fetch(`http://${config.server_host}:${config.server_port}/games?${queryParams}`)
  //       .then((res) => res.json())
  //       .then((resJson) => setGames(resJson));
  //   }
  //   fetchData();
  // }, [seasons, sortBy, team1, team2]);

  const h1Style = {
    marginRight: "30px",
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: ".3rem",
    textAlign: 'center',
    color: '#2E4A62'
  };

  // const topUpsetsColumns = [    { header: 'Date', accessor: 'date' },    { header: 'Team 1', accessor: 'team1' },    { header: 'Team 2', accessor: 'team2' },    { header: 'Upset Score', accessor: 'upsetScore' }  ];

  // const gamesColumns = [    { header: 'Date', accessor: 'date' },    { header: 'Team 1', accessor: 'team1' },    { header: 'Team 2', accessor: 'team2' },    { header: 'Result', accessor: 'result' },    { header: 'Score', accessor: 'score' },    { header: 'Average Elo', accessor: 'avgElo' }  ];
  if (seasons < 2016){
    return(
      <div>
        <SeasonSelect onSeasonsChange={handleSeasonsChange} value={seasons} setValue={setSeasons}/>
        <h1 style={h1Style}>Top Upsets</h1>
       
        <LazyTable data={topUpsets} seasons={seasons}/>
  
        {/* <LazyTable data={topUpsets.slice(0, 5)} columns={topUpsetsColumns} /> */}
        <div>
      {/* <h1 style={h1Style}>Games</h1> */}
      {/* <div>
        <label htmlFor="sortBy">Sort by:</label>
        <select id="sortBy" name="sortBy" value={sortBy} onChange={handleSortByChange}>
          <option value="date">Date</option>
          <option value="result">Result</option>
          <option value="score">Score</option>
          <option value="avgElo">Average Elo</option>
        </select>
      </div>
      <div>
        <label htmlFor="team1">Team 1:</label>
        <input type="text" id="team1" name="team1" value={team1} onChange={handleTeam1Change} />
      </div>
      <div>
        <label htmlFor="team2">Team 2:</label>
        <input type="text" id="team2" name="team2" value={team2} onChange={handleTeam2Change} />
      </div> */}
    </div>
  </div>)
  }
  else{
    return(
      <div>
      <SeasonSelect onSeasonsChange={handleSeasonsChange} value={seasons} setValue={setSeasons}/>
      <h1 style={h1Style}>Top Upsets</h1>;
      </div>
    );
    
  }
   
  
};

export default Game;