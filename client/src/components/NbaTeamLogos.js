import React from 'react';
import { Box, Container } from '@mui/material';
import * as NBAIcons from 'react-nba-logos';

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

const NbaTeamLogos = ({ teams }) => {
  const filteredTeams = teams.filter((team) => logos[team.team_id]);

  return (
    <Container maxWidth="md">
      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {filteredTeams.map((team, index) => {
          const LogoComponent = logos[team.team_id];
          return (
            <Box m={2} p={2} key={index}>
              <h2>{team.fran_id}</h2>
              {LogoComponent && <LogoComponent />}
            </Box>
          );
        })}
      </Box>
    </Container>
  );
};

export default NbaTeamLogos;