export const AnimeList = ({ AnimeList, setAnimeInfo, animeComponent, handleList }) => {
  const AddToList = animeComponent;

  return (
    <>
      {
        AnimeList ? (
          AnimeList.map((anime, index) => {
            return (
              <div className="card" key={index} onClick={() => setAnimeInfo(anime)}>
                <img src={anime.images.jpg.large_image_url} alt="animeImage" />
                <div className="anime-info">
                  <h4>{anime.title}</h4>
                  <p className="episodios">episodios: {anime.episodes}</p>
                  <div className="overlay">
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
