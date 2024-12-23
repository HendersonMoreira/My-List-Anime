import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import './Components/style.css';
import logo from './imgs/My_List_Animes.png';
import { AnimeList } from "./Components/AnimeList";
import { AnimeAnsi } from "./Components/AnimeAnsi";
import { AddToList } from "./Components/AddToList";
import { RemoveFromList } from "./Components/RemoveFromList";
import { Pagination } from "./Components/Pagination";
// import AnimeListPage from './pages/AnimeListPage'; // Certifique-se de que essas páginas existem
// import NewSeason from './pages/NewSeason';
// import Movies from './pages/Movies';
// import Popular from './pages/Popular';

function App() {
  const [search, setSearch] = useState('One Piece');
  const [searchTerm, setSearchTerm] = useState('One Piece');
  const [animeData, setAnimeData] = useState([]);
  const [animeAnsi, setAnimeInfo] = useState();
  const [myAnimeList, setMyAnimeList] = useState(() => {
    const savedList = localStorage.getItem('myAnimeList');
    return savedList ? JSON.parse(savedList) : [];
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const addTo = useCallback((anime) => {
    const index = myAnimeList.findIndex((myanime) => myanime.mal_id === anime.mal_id);
    if (index < 0) {
      const newArray = [...myAnimeList, anime];
      setMyAnimeList(newArray);
      localStorage.setItem('myAnimeList', JSON.stringify(newArray));
    }
  }, [myAnimeList]);

  const removeFrom = useCallback((anime) => {
    const newArray = myAnimeList.filter((myanime) => myanime.mal_id !== anime.mal_id);
    setMyAnimeList(newArray);
    localStorage.setItem('myAnimeList', JSON.stringify(newArray));
  }, [myAnimeList]);

  const getData = useCallback(async (page = 0) => {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${searchTerm}&limit=20&page=${page + 1}`);
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
  }, [searchTerm]);

  const handleSearchClick = () => {
    setSearchTerm(search);
    setCurrentPage(0);
    getData(0);
  }

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

  const handlePageClick = useCallback((data) => {
    setCurrentPage(data.selected);
  }, []);

  return (
    <Router>
      <div className="header">
        <img src={logo} alt="My List Animes" className="logo" />
        <div className="navbar">
          <Link to="/">Home</Link>
          <Link to="/anime-list">Anime list</Link>
          <Link to="/new-season">New Season</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/popular">Popular</Link>
        </div>
        <div className="search-box">
          <input
            type="search"
            placeholder="Search Anime..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-button" onClick={handleSearchClick}>
            <i className="bi bi-search"></i>
          </button>
        </div>
      </div>

      <Routes>
        <Route exact path="/" element={
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
                currentPage={currentPage}
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
        } />
        {/* <Route path="/anime-list" element={<AnimeListPage />} />
        <Route path="/new-season" element={<NewSeason />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/popular" element={<Popular />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
