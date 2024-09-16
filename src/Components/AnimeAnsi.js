import React from 'react'

export const AnimeAnsi = (props) => {
    const {title,images:{jpg:{large_image_url}},source,rank,score,popularity,members,status,rating,duration,episodes}=props.animeAnsi
    return (
      <>
        <div className='anime-content'>
          <h3>{title}</h3>
          <img src={large_image_url} alt="" /><br />
          <div className="info">
                <h3>#Rank: {rank}</h3>
                <h3>#Score: {score}</h3>
                <h3>#Popularity: {popularity}</h3><hr/><br/>
                <h4>#Members: {members}</h4>
                <h4>#source: {source}</h4>
                <h4>#Duration: {duration}</h4>
                <h4>#status: {status}</h4>
                <h4>#Rating: {rating}</h4>
                <h4>Episodes: {episodes}</h4>
          </div>
        </div>
      </>
  )
}
