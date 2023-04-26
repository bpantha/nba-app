import { useState, useCallback, useEffect } from "react";
import { SeasonSelectNoAllSeasons } from "./SeasonSelectNoAllSeasons";
import {
  Box,
  Button,
  Modal,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper
} from "@mui/material";
import { debounce } from "lodash";
import * as NBAIcons from 'react-nba-logos';
import React from "react";


const config = require("../config.json");

const logos = {
  'ATL': NBAIcons.ATL,
  'BRK': NBAIcons.BKN,
  'BOS': NBAIcons.BOS,
  'CHA': NBAIcons.CHA,
  'CHI': NBAIcons.CHI,
  'CLE': NBAIcons.CLE,
  'DAL': NBAIcons.DAL,
  'DEN': NBAIcons.DEN,
  'DET': NBAIcons.DET,
  'GSW': NBAIcons.GSW,
  'HOU': NBAIcons.HOU,
  'IND': NBAIcons.IND,
  'LAC': NBAIcons.LAC,
  'LAL': NBAIcons.LAL,
  'MEM': NBAIcons.MEM,
  'MIA': NBAIcons.MIA,
  'MIL': NBAIcons.MIL,
  'MIN': NBAIcons.MIN,
  'NOP': NBAIcons.NOP,
  'NYK': NBAIcons.NYK,
  'OKC': NBAIcons.OKC,
  'ORL': NBAIcons.ORL,
  'PHI': NBAIcons.PHI,
  'PHO': NBAIcons.PHX,
  'POR': NBAIcons.POR,
  'SAC': NBAIcons.SAC,
  'SAS': NBAIcons.SAS,
  'TOR': NBAIcons.TOR,
  'UTA': NBAIcons.UTA,
  'WAS': NBAIcons.WAS,
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
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

  function isNumeric(value) {
    return !isNaN(value) && isFinite(value);
  }

  function RosterTable({ data }) {
    const columns = [
      "player_name", "gp", "mp", "pts", "reb", "ast", "player_height", "player_weight", "country", "college"
    ];
  
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell>Player</TableCell>
              <TableCell>Games played</TableCell>
              <TableCell>Minutes played</TableCell>
              <TableCell>Average points</TableCell>
              <TableCell>Average rebounds</TableCell>
              <TableCell>Average assists</TableCell>
              <TableCell>Height (cm)</TableCell>
              <TableCell>Weight (kg)</TableCell>
              <TableCell>Home country</TableCell>
              <TableCell>College</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((col) => (
                  <TableCell key={`${index}-${col}`}>
                  {isNumeric(row[col]) ? parseFloat(row[col]).toFixed(1) : row[col]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  

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
    setSeasons(newSelectedSeason);
    handleFetchTeamRoster(team, newSelectedSeason);
  };
  
  const LogoComponent = logos[team.team_id];

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
      >
        <Box sx={{...style, width: 1000}}>
          <div style={{display: 'grid', gridTemplateColumns: '0.5fr 3fr 0.5fr'}}>
            {LogoComponent && React.createElement(LogoComponent)}
            <h1>{team.fran_id}</h1>
            <Button onClick={onClose}>Close</Button>
          </div>
          
          <SeasonSelectNoAllSeasons
            onSeasonsChange={handleSeasonsChange}
            value={seasons}
            setValue={setSeasons}
          />
        {teamRoster ? (
          teamRoster.length > 0 ? (
            <RosterTable data={teamRoster} />
          ) : (
            <p>No data available for the selected season.</p>
          )
        ) : (
          <p>Loading...</p>
        )}
        </Box>
      </Modal>
    </>
  );
}

export default TeamCard;
