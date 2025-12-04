import { client } from './client';
import type { Movie, MovieCreate, MoviePage } from '../types';

export const getMovies = async (params?: Record<string, any>) => {
    const response = await client.get<MoviePage>('/movies', { params });
    return response.data;
};

export const createMovie = async (movie: MovieCreate) => {
    const response = await client.post<Movie>('/movies', movie);
    return response.data;
};
