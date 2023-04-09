import React from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
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


export function NbaTeamLogos ({ teams, seasons }) {

  const filteredTeams = teams.filter((team) => logos[team.team_id]);
  if(seasons) {
    const seasonString = `season(s): ${seasons[0]}-${seasons[1]}`;
    return (
      <Container maxWidth="sm" sx={{
        padding: 10
      }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Teams from {seasonString}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeams.map((team, index) => {
                const LogoComponent = logos[team.team_id];
                return (
                  <TableRow hover key={index} sx={{
                  padding: 100
                }}>
                    <TableCell>
                      {team.fran_id}                     
                      <Box>
                        {LogoComponent && <LogoComponent />}
                      </Box>
                    </TableCell>
  
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    )
  } else {
    return (
      <Container maxWidth="sm" sx={{
        padding: 10
      }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Teams</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeams.map((team, index) => {
                const LogoComponent = logos[team.team_id];
                return (
                  <TableRow hover key={index} sx={{
                  padding: 100
                }}>
                    <TableCell>
                      {team.fran_id}                     
                      <Box>
                        {LogoComponent && <LogoComponent />}
                      </Box>
                    </TableCell>
  
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }
};

export default NbaTeamLogos;