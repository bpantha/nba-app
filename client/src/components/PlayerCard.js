import { useState, useCallback, useEffect } from "react";
import { SeasonSelect } from "./SeasonSelect";
import { LazyTable } from "./LazyTable";
import { Box, Button, Modal } from "@mui/material";
import { debounce } from "lodash";
const config = require("../config.json");

// PlayerCard component takes in player name
export function PlayerCard({ player }) {
  const [open, setOpen] = useState(false);
  const [playerStats, setPlayerStats] = useState([]);
  const [seasons, setSeasons] = useState([2022]);

  const handleSeasonsChange = useCallback(
    debounce((newSelectedSeason) => {
      setSeasons(newSelectedSeason);

      const fetchData = async () => {
        fetch(
          `http://${config.server_host}:${config.server_port}/player_stats/${player}/${newSelectedSeason}`
        )
          .then((res) => res.json())
          .then((resJson) => setPlayerStats(resJson));
      };
      fetchData();
    }, 50),
    [seasons]
  );

  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/player_stats/${player}/${seasons}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        setPlayerStats(resJson);
      });
  }, [seasons]);

  console.log(playerStats);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (playerStats.length === 0) {
    return <div>Loading...</div>;
  }

  // if all seasons is toggled, show tabulated stats
  if (seasons) {
    if (seasons === "All Seasons") {
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
              <LazyTable data={playerStats} season={seasons} />
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
                  <h2>Team</h2>
                  <p>PPG {playerStats[0].pts}</p>
                  <p>REB {playerStats[0].reb}</p>
                  <p>AST {playerStats[0].ast}</p>
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
    }
  }
}
export default PlayerCard;
