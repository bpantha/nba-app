import { useState, useCallback, useEffect } from "react";
import { SeasonSelectNoAllSeasons } from "./SeasonSelectNoAllSeasons";
import { LazyTable } from "./LazyTable";
import {
  Box,
  Button,
  Modal,
} from "@mui/material";
import { NbaTeamLogos } from "../components/NbaTeamLogos";
import { debounce } from "lodash";
const config = require("../config.json");

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'white',
    border: '2px solid #000',
    borderRadius: '16px',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    overflow: 'auto',
    height: '100%'
    
  };

export function TeamCard({ team, seasons, setSeasons, open, onClose }) {

  const [teamRoster, setTeamRoster] = useState(null);

  const handleFetchTeamRoster = useCallback(
    debounce((team, seasons) => {
      const fetchData = async () => {
        fetch(
          `http://${config.server_host}:${config.server_port}/roster/${team.team_id}/${seasons}`
        )
          .then((res) => res.json())
          .then((resJson) => setTeamRoster(resJson));
      };
      fetchData();
    }, 50),
    [team]
  );

  useEffect(() => {
    if (open) {
      handleFetchTeamRoster(team, seasons);
    }
  }, [team, open, seasons, handleFetchTeamRoster]);

  const handleSeasonsChange = (newSelectedSeason) => {
    console.log(newSelectedSeason);
    setSeasons(newSelectedSeason);
    handleFetchTeamRoster(team, newSelectedSeason);
  };

  const columns = teamRoster?.[0] ? Object.keys(teamRoster[0]) : [];
  
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
      >
        <Box sx={{...style, width: 400}}>
        <div style={{display: 'flex', alignItems: 'flex-end'}}>
            <h1>{team.fran_id}</h1>
            <Button onClick={onClose}>Close</Button>

        </div>
          
          <SeasonSelectNoAllSeasons
            onSeasonsChange={handleSeasonsChange}
            value={seasons}
            setValue={setSeasons}
          />
          {teamRoster && (
            <LazyTable
              columns={columns}
              data={teamRoster}
              // Add any other required props for LazyTable
            />
          )}
        </Box>
      </Modal>
    </>
  );
}

export default TeamCard;
