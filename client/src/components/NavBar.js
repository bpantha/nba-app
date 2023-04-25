import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? "h5" : "h7"}
      noWrap
      style={{
        backgroundColor: "#8B0000",
        color: "white",
        padding: "8px 16px",
        marginRight: "30px",
        fontFamily: "monospace",
        fontWeight: 700,
        letterSpacing: ".3rem",
        display: "flex",
        alignItems: "center",
      }}
    >
      {isMain && (
        <img
          src="https://1000logos.net/wp-content/uploads/2017/04/NBA-Logo.png"
          alt="NBA logo"
          style={{ marginRight: "10px", height: "50px" }}
        />
      )}
      <NavLink
        to={href}
        style={{
          color: "inherit",
          textDecoration: "none",
        }}
      >
        {text}
      </NavLink>
    </Typography>
  );
};

export default function NavBar() {
  return (
    <AppBar position="static" style={{ backgroundColor: "#8B0000" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <NavText href="/" text="NBA-APP" isMain />
          <NavText href="/teams" text="Teams" />
          <NavText href="/player" text="Players" />
          <NavText href="/games" text="Games" />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
