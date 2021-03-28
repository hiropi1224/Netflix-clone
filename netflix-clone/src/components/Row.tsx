import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import axios from '../axios';
import './Row.scss';

type Props = {
    title: string;
    fetchUrl: string;
    isLargeRow?: boolean;
};

type Movie = {
    id: string;
    name: string;
    title: string;
    original_name: string;
    poster_path: string;
    backdrop_path: string;
};

//trailerのoption
type Option = {
    height: string;
    width: string;
    playerVars: {
        autoplay: 0 | 1 | undefined;
    };
};

const base_url = "https://image.tmdb.org/t/p/original";

export const Row = ( { title, fetchUrl, isLargeRow }: Props ) => {
    const [ movies, setMovie ] = useState<Movie[]>( [] );
    const [ trailerUrl, setTrailerUrl ] = useState<string | null>( "" );

    useEffect( () => {
        async function fetchData() {
            const request = await axios.get( fetchUrl );
            setMovie( request.data.results );
            return request;
        }
        fetchData();
    }, [ fetchUrl ] );

    const opts: Option = {
        height: "390",
        width: "640",
        playerVars: {
            autoplay: 1,
        }
    };

    const handleClick = async ( movie: Movie ) => {
        if ( trailerUrl ) {
            setTrailerUrl( "" );
        } else {
            let trailerUrl = await axios.get(
                `/movie/${movie.id}/videos?api_key=3011154045a0b35f9b2b7ccf1bf76889`
            );
            setTrailerUrl( trailerUrl.data.results[ 0 ]?.key );
        }
    };
    return (
        <div className="Row">
            <h2>{title}</h2>
            <div className="Row-posters">
                {movies.map( ( movie, i ) => (
                    <img
                        key={movie.id}
                        className={`Row-poster ${isLargeRow && "Row-poster-large"}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path
                            }`}
                        alt={movie.name}
                        onClick={() => handleClick( movie )}
                    />
                ) )}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
};