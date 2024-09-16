import React, { useEffect, useState } from 'react';

export const AnimeList = ({ AnimeList, setAnimeInfo, animeComponent, handleList }) => {
  const AddToList = animeComponent;
  const [animeStatus, setAnimeStatus] = useState({});

  useEffect(() => {
    const saveStatus = localStorage.getItem('animeStatus');
    if (saveStatus) {
      setAnimeStatus(JSON.parse(saveStatus));
    }
  }, []);

  const updateStatus = (anime, status) => {
    const currentStatus = animeStatus[anime.mal_id];
    const newStatus = { ...animeStatus, [anime.mal_id]: status };

    if(currentStatus === status){
      delete newStatus[anime.mal_id];
    } else{
      newStatus[anime.mal_id] = status;
    }

    setAnimeStatus(newStatus);
    localStorage.setItem('animeStatus', JSON.stringify(newStatus));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'watched':
        return 'https://media.tenor.com/1WiE8ctwuIsAAAAi/anime.gif'; // Substitua pelo link do seu GIF
      case 'want_to_watch':
        return 'https://i.gifer.com/6mh.gif'; // Substitua pelo link do seu GIF
      case 'watching':
        return 'https://pa1.aminoapps.com/6909/7f3b8fe34ffc10d554707df0d29a7296fb6aa9far1-360-640_hq.gif'; // Substitua pelo link do seu GIF
      default:
        return '';
    }
  };

  return (
    <>
      {
        AnimeList ? (
          AnimeList.map((anime, index) => {
            return (
              <div className="card" key={index} onClick={() => setAnimeInfo(anime)}>
                <div className='status-buttons'>
                  <button onClick={() => updateStatus(anime, 'watched')}>Já vi</button>
                  <button onClick={() => updateStatus(anime, 'want_to_watch')}>Quero ver</button>
                  <button onClick={() => updateStatus(anime, 'watching')}>Estou vendo</button>
                </div>
                <div className='status-icon'>
                  {animeStatus[anime.mal_id] && <img src={getStatusIcon(animeStatus[anime.mal_id])} alt="status icon" />}
                </div>
                <img src={anime.images.jpg.large_image_url} alt="animeImage" />
                <div className="anime-info">
                  <h4>{anime.title}</h4>
                  <div className="overlay" onClick={() => handleList(anime)}>
                    <h4>{anime.title_english}</h4>
                    <h3>SYNOPSIS</h3>
                    <div className="synopsis">
                      <p>{anime.synopsis}</p>
                    </div>
                    <AddToList />
                  </div>
                </div>
              </div>
            );
          })
        ) : "Not Found"
      }
    </>
  );
};
