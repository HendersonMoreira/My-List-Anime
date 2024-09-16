import React, { useEffect, useState, useCallback } from "react";
import './Components/style.css';
import { AnimeList } from "./Components/AnimeList";
import { AnimeAnsi } from "./Components/AnimeAnsi";
import { AddToList } from "./Components/AddToList";
import { RemoveFromList } from "./Components/RemoveFromList";
import { Pagination } from "./Components/Pagination";

function App() {
  const [search, setSearch] = useState('One Piece');
  const [animeData, setAnimeData] = useState([]);
  const [animeAnsi, setAnimeInfo] = useState();
  const [myAnimeList, setMyAnimeList] = useState(() => {
    const savedList = localStorage.getItem('myAnimeList');
    return savedList ? JSON.parse(savedList) : [];
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const addTo = (anime) => {
    const index = myAnimeList.findIndex((myanime) => myanime.mal_id === anime.mal_id);
    if (index < 0) {
      const newArray = [...myAnimeList, anime];
      setMyAnimeList(newArray);
      localStorage.setItem('myAnimeList', JSON.stringify(newArray));
    }
  };

  const removeFrom = (anime) => {
    const newArray = myAnimeList.filter((myanime) => myanime.mal_id !== anime.mal_id);
    setMyAnimeList(newArray);
    localStorage.setItem('myAnimeList', JSON.stringify(newArray));
  };

  const getData = useCallback(async (page = 0) => {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${search}&limit=20&page=${page + 1}`);
      const resData = await res.json();

      if (resData && resData.pagination) {
        setAnimeData(resData.data);
        setPageCount(resData.pagination.last_visible_page);
      } else {
        console.error("A resposta da API não contém a estrutura esperada:", resData);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  }, [search]);

  useEffect(() => {
    setCurrentPage(0); // Reseta a página atual para 0 quando a pesquisa muda
  }, [search]);

  useEffect(() => {
    getData(currentPage);
  }, [currentPage, getData]);

  useEffect(() => {
    if (currentPage === 0) {
      getData(0);
    }
  }, [search, currentPage, getData]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
      <div className="header">
        <h1>MyAnimeList</h1>
        <div className="search-box">
          <input type="search" placeholder="Search your anime"
            onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="container">
        <div className="animeInfo">
          {animeAnsi && <AnimeAnsi animeAnsi={animeAnsi} />}
        </div>
        <div className="anime-row">
          <h2 className="text-heading">Anime</h2>
          <div className="row">
            <AnimeList
              AnimeList={animeData}
              setAnimeInfo={setAnimeInfo}
              animeComponent={AddToList}
              handleList={(anime) => addTo(anime)}
            />
          </div>
          <Pagination
            pageCount={pageCount}
            onPageChange={handlePageClick}
            currentPage={currentPage} // Passa a página atual como prop
          />
          <h2 className="text-heading">My-List</h2>
          <div className="row">
            <AnimeList
              AnimeList={myAnimeList}
              setAnimeInfo={setAnimeInfo}
              animeComponent={RemoveFromList}
              handleList={(anime) => removeFrom(anime)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;