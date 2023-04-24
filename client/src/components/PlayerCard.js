import { useState, useCallback, useEffect } from "react";
import { SeasonSelect } from "./SeasonSelect";
import { LazyTable } from "./LazyTable";
import { Box, Button, Modal } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";
import { debounce } from "lodash";
const config = require("../config.json");

// PlayerCard component takes in player name
export function PlayerCard({ player }) {
  const [open, setOpen] = useState(false);
  const [playerStats, setPlayerStats] = useState([]);
  const [seasons, setSeasons] = useState([2022]);
  console.log(seasons);
  console.log(playerStats);

  const handleFetchPlayerStats = useCallback(
    debounce((seasons) => {
      const fetchData = async () => {
        fetch(
          `http://${config.server_host}:${config.server_port}/player_stats/${player}/${seasons}`
        )
          .then((res) => res.json())
          .then((resJson) => setPlayerStats(resJson));
          
      };
      fetchData();
    }, 20),
    [player]
  );


  const handleSeasonsChange = (newSelectedSeason) => {
    setSeasons(newSelectedSeason);
    handleFetchPlayerStats(newSelectedSeason);
  };

  useEffect(() => {
    if (open) {
      handleFetchPlayerStats(seasons);
    }
  }, [player, open, seasons, handleFetchPlayerStats]);

  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/player_stats/${player}/${seasons}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        setPlayerStats(resJson);
      });

  }, [seasons]);


  const handleClickOpen = () => {
    setOpen(true);
    setSeasons([2022]);
  };

  const handleClose = () => {
    setOpen(false);
    setSeasons([2022]);
  };


  // const chartData = [
  //   { name: "PTS", value: playerStats.pts },
  //   { name: "AST", value: playerStats.ast },
  //   { name: "REB", value: playerStats.reb },
  // ];

  // if all seasons is toggled, show tabulated stats
  if (seasons === "All Seasons") {
    return (
      <>

  function calculateAveragePlayerStats(stats) {

    let totalPts = 0;
    let totalReb = 0;
    let totalAst = 0;
    let totalGp = 0;
    let totalMp = 0;
    const numSeasons = stats.length;
  
    for (const season of stats) {
      console.log(season);
      totalPts += season.pts;
      totalReb += season.reb;
      totalAst += season.ast;
      totalGp += season.gp;
      totalMp += season.mp;
    }

    return {
      ppg: parseFloat((totalPts / numSeasons).toFixed(1)),
      reb: parseFloat((totalReb / numSeasons).toFixed(1)),
      ast: parseFloat((totalAst / numSeasons).toFixed(1)),
      gp: parseFloat((totalGp / numSeasons).toFixed(1)),
      mp: parseFloat((totalMp / numSeasons).toFixed(1))
    };
  } 

  if (playerStats.length === 0) {
    return <div>Loading...</div>;
  }

  // if all seasons is toggled, show tabulated stats
  if (seasons) {
    if (seasons === "All Seasons") {

      const averageStats = playerStats.length > 0 ? calculateAveragePlayerStats(playerStats) : null;
      return (
        <>

        <Button onClick={handleClickOpen}>{player}</Button>
        <Modal
          open={open}
          onClose={handleClose}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            p={3}
            style={{
              background: "white",
              borderRadius: "16px",
              border: "2px solid #000",
              width: 600,
            }}
          >
            <SeasonSelect
              onSeasonsChange={handleSeasonsChange}
              value={seasons}
              setValue={setSeasons}
            />

            <LazyTable data={playerStats} seasons={seasons} />
              {playerStats.length > 0 ? (
                <>
                  <h1>{player}</h1>
                  <h2>Team</h2>
                  {/* Render the average stats */}
                  {averageStats && (
                    <>
                      <p>PPG {averageStats.ppg}</p>
                      <p>REB {averageStats.reb}</p>
                      <p>AST {averageStats.ast}</p>
                    </>
                  )}
                  <p>College {playerStats[0].college}</p>
                  <p>Country {playerStats[0].country}</p>
                  <p>Games Played {playerStats[0].gp}</p>
                  <p>Mins Played {playerStats[0].mp}</p>
                </>
              ) : (
                <p>No Player Data</p>
              )}
            <Button
              onClick={handleClose}
              style={{ left: "50%", transform: "translateX(-50%)" }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </>
    );
  } else {
    // otherwise show stats only for single season in non tabulated form
    return (
      <>
        <Button onClick={handleClickOpen}>{player}</Button>
        <Modal
          open={open}
          onClose={handleClose}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            p={3}
      );
    } else {
      // otherwise show stats only for single season in non tabulated form
      return (
        <>
          <Button onClick={handleClickOpen}>{player}</Button>
          <Modal
            open={open}
            onClose={handleClose}
            style={{
              background: "white",
              borderRadius: "16px",
              border: "2px solid #000",
              width: 600,
            }}
          >
            <SeasonSelect
              onSeasonsChange={handleSeasonsChange}
              value={seasons}
              setValue={setSeasons}
            />
            {playerStats.length > 0 ? (
              <>
                <h1>{player}</h1>
                {/* fill in the stats with playerSatats state variable*/}
                <h2>
                  <p>{playerStats[0].team}</p>
                </h2>
                {/* <p>PPG {playerStats[0].pts}</p>
                <p>REB {playerStats[0].reb}</p>
                <p>AST {playerStats[0].ast}</p> */}
                <p style={{ display: "flex", justifyContent: "center" }}>
                  College: {playerStats[0].college}
                </p>
                <p style={{ display: "flex", justifyContent: "center" }}>
                  Country: {playerStats[0].country}
                </p>
                <p style={{ display: "flex", justifyContent: "center" }}>
                  Games Played: {playerStats[0].gp}
                </p>
                <ResponsiveContainer
                  height={250}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <BarChart
                    data={[
                      { name: "PTS", value: playerStats[0].pts },
                      { name: "AST", value: playerStats[0].ast },
                      { name: "REB", value: playerStats[0].reb },
                    ]}
                    layout="vertical"
                    margin={{ right: 30 }}
                  >
                    <XAxis type="number" datKey="value" domain={[0, 50]} />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="value" stroke="#8884d8" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </>
            ) : (
              <>
                <p>No Player Data</p>
              </>
            )}
            <Button
              onClick={handleClose}
              style={{ left: "50%", transform: "translateX(-50%)" }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </>
    );
  }
}
export default PlayerCard;
