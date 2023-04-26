import { useState, useCallback, useEffect } from 'react';
import { NbaTeamLogos } from '../components/NbaTeamLogos';
import { SeasonSelect } from '../components/SeasonSelect';
import { TeamCard } from '../components/TeamCard';
import { debounce } from 'lodash';
const config = require('../config.json');

const Home = () => {
  const [teams, setTeams] = useState([]);
  const [seasons, setSeasons] = useState([2022]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTeam(null);
  }


  const handleSeasonsChange = useCallback(
    debounce((newSelectedSeason) => {
      setSeasons(newSelectedSeason);

      const fetchData = async () => {
        fetch(
          `http://${config.server_host}:${config.server_port}/teams/${newSelectedSeason}`
        )
          .then((res) => res.json())
          .then((resJson) => setTeams(resJson));
      };
      fetchData();
    }, 50),
    [seasons]
  );

  useEffect(() => {
    const fetchData = async () => {
      fetch(
        `http://${config.server_host}:${config.server_port}/teams/${seasons}`
      )
        .then((res) => res.json())
        .then((resJson) => setTeams(resJson));
    };
    fetchData();
  }, []);

  return (
    <div>
      <SeasonSelect
        onSeasonsChange={handleSeasonsChange}
        value={seasons}
        setValue={setSeasons}
      />
      <NbaTeamLogos 
      teams={teams} 
      seasons={seasons} 
      onTeamClick={handleTeamClick}
       />

      {selectedTeam && (
        <TeamCard 
        team={selectedTeam} 
        seasons={seasons} 
        setSeasons={setSeasons} 
        open={modalOpen} 
        onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Home;
