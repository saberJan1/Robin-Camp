import { client } from './client';
import { RatingAggregate, RatingResult, RatingSubmit } from '../types';

export const submitRating = async (title: string, rating: RatingSubmit, raterId: string) => {
    const response = await client.post<RatingResult>(`/movies/${title}/ratings`, rating, {
        headers: {
            'X-Rater-Id': raterId,
        },
    });
    return response.data;
};

export const getRating = async (title: string) => {
    const response = await client.get<RatingAggregate>(`/movies/${title}/rating`);
    return response.data;
};
