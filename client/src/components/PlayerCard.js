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
  Tooltip,
} from "recharts";
import { debounce } from "lodash";
const config = require("../config.json");

// PlayerCard component takes in player name

export function PlayerCard({ player }) {
  const [open, setOpen] = useState(false);
  const [playerStats, setPlayerStats] = useState([]);
  const [seasons, setSeasons] = useState([2022]);


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
    }, 50),
    [player]
  );

  useEffect(() => {
    if (open) {
      handleFetchPlayerStats(seasons);
    }
  }, [player, open, seasons, handleFetchPlayerStats]);

  const handleClickOpen = () => {
    setOpen(true);
    setSeasons([2022]);
  };

  const handleClose = () => {
    setOpen(false);
    setSeasons([2022]);
  };

  const handleSeasonsChange = (newSelectedSeason) => {
    setSeasons(newSelectedSeason);
    handleFetchPlayerStats(newSelectedSeason);
  };

  // if all seasons is toggled, show tabulated stats
  if (seasons.includes("All Seasons") & (playerStats.length > 0)) {
    // in addtion to showing tabulated stats, lets show average career stats as well
    function calculateAveragePlayerStats(stats) {
      let totalPts = 0;
      let totalReb = 0;
      let totalAst = 0;
      let totalGp = 0;
      const numSeasons = stats.length;

      for (const season of stats) {
        totalPts += season.pts;
        totalReb += season.reb;
        totalAst += season.ast;
        totalGp += season.gp;
      }

      return {
        ppg: parseFloat(totalPts / numSeasons).toFixed(1),
        reb: parseFloat(totalReb / numSeasons).toFixed(1),
        ast: parseFloat(totalAst / numSeasons).toFixed(1),
        gp: parseFloat(totalGp / numSeasons).toFixed(1),
      };
    }
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
              height: "100%",
              width: 600,
              overflow: "auto",
            }}
          >
            <SeasonSelect
              onSeasonsChange={handleSeasonsChange}
              value={seasons}
              setValue={setSeasons}
            />
            <h3
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              Career Averages
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p>PPG: {calculateAveragePlayerStats(playerStats).ppg}</p>
              <p>REB: {calculateAveragePlayerStats(playerStats).reb}</p>
              <p>AST: {calculateAveragePlayerStats(playerStats).ast}</p>
              <p>GP: {calculateAveragePlayerStats(playerStats).gp}</p>
            </div>
            <LazyTable data={playerStats} seasons={seasons} />
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
                <p>College: {playerStats[0].college}</p>
                <p>Country: {playerStats[0].country}</p>
                <p>Games Played: {playerStats[0].gp}</p>
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
