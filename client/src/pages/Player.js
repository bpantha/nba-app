import React from "react";
// import { Bar } from "react-chartjs-2";
import { useState, useCallback, useEffect } from "react";
import { SeasonSelect } from "../components/SeasonSelect";
import { LazyTable } from "../components/LazyTable";
// import { BarChart } from "../components/BarChart";
import { debounce } from "lodash";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";
// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const config = require("../config.json");

const Player = () => {
  const [awardWinners, setAwardWinners] = useState([]);
  const [bestPlayers, setBestPlayers] = useState([]);
  const [seasons, setSeasons] = useState([2022]);

  const handleSeasonsChange = useCallback(
    debounce((newSelectedSeason) => {
      setSeasons(newSelectedSeason);

      const fetchData = async () => {
        fetch(
          `http://${config.server_host}:${config.server_port}/award/${seasons}`
        )
          .then((res) => res.json())
          .then((resJson) => setAwardWinners(resJson));
      };
      fetchData();
      const fetchData2 = async () => {
        fetch(
          `http://${config.server_host}:${config.server_port}/best_players/${seasons}`
        )
          .then((res) => res.json())
          .then((resJson) => setBestPlayers(resJson));
      };
      fetchData2();
    }, 50),
    [seasons]
  );
  //useEffect with empty dependency array gets the API call to run initially
  useEffect(() => {
    const fetchData = async () => {
      fetch(
        `http://${config.server_host}:${config.server_port}/award/${seasons}`
      )
        .then((res) => res.json())
        .then((resJson) => setAwardWinners(resJson));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData2 = async () => {
      fetch(
        `http://${config.server_host}:${config.server_port}/best_players/${seasons}`
      )
        .then((res) => res.json())
        .then((resJson) => setBestPlayers(resJson));
    };
    fetchData2();
  }, []);

  const filteredData = bestPlayers.map(({ player_name, war_total }) => ({
    player_name,
    war_total,
  }));

  const firstTenEntries = filteredData.slice(0, 10);

  const h1Style = {
    marginRight: "30px",
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: ".3rem",
    textAlign: "center",
    color: "#2E4A62",
  };
  const labels = firstTenEntries.map((item) => item.player_name);
  const values = firstTenEntries.map((item) => item.war_total);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Bar Graph",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: values,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <div>
      <SeasonSelect
        onSeasonsChange={handleSeasonsChange}
        value={seasons}
        setValue={setSeasons}
      />
      <h1 style={h1Style}>Award Winners in {seasons}</h1>
      <LazyTable data={awardWinners} seasons={seasons} />
      <h1 style={h1Style}>Best Players in {seasons}</h1>
      <LazyTable data={bestPlayers} seasons={seasons} />
    </div>
  );
};

export default Player;
