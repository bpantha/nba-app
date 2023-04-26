import React from 'react';
import { Container, Paper, Box, Grid, Typography } from '@mui/material';
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

const h1Style = {
  fontSize: "3rem",
  textAlign: "center",
  margin: "2rem 0",
  background: "linear-gradient(to right, #003459, #0074D9)", // Updated gradient colors
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontFamily: "monospace",
  letterSpacing: ".3rem",
  textTransform: "uppercase", // Added text transformation
  paddingBottom: "0.3rem", // Added padding to the bottom
  borderBottom: "4px solid #0074D9", // Added a solid bottom border
};

export function NbaTeamLogos({ teams, seasons, onTeamClick }) {
  const filteredTeams = teams.filter((team) => logos[team.team_id]);

  //if a specific season is selected, show that season's teams. otherwise show all teams
  if(seasons) {
    const seasonString = `Season: ${seasons}`;

    return (
      <Container maxWidth="100%" sx={{ padding: 10 }}>
        <Grid container spacing={1} component={Paper} sx={{ padding: 2 }}>
          <Grid item xs={12}>
            <Typography variant="h1" align="center" style={h1Style}>
              Teams
            </Typography>
          </Grid>
          {filteredTeams.map((team, index) => {
            const LogoComponent = logos[team.team_id];
            return (
              <Grid item sm={2} key={index} sx={{ padding: 2 }}>
                <Grid container alignItems="center" direction="column" spacing={1}>
                  <Grid item>
                    <Typography variant="subtitle1">{team.fran_id}</Typography>
                  </Grid>
                  <Grid item>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <button onClick={() => {
                        onTeamClick(team);
                        console.log(team);
                        }}>
                        {LogoComponent && <LogoComponent />}
                      </button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    );
  }
};

export default NbaTeamLogos;