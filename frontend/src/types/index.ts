export interface BoxOffice {
    revenue: {
        worldwide: number;
        openingWeekendUSA?: number;
    };
    currency: string;
    source: string;
    lastUpdated: string;
}

export interface Movie {
    id: string;
    title: string;
    releaseDate: string;
    genre: string;
    distributor?: string;
    budget?: number;
    mpaRating?: string;
    boxOffice?: BoxOffice | null;
}

export interface MovieCreate {
    title: string;
    genre: string;
    releaseDate: string;
    distributor?: string;
    budget?: number;
    mpaRating?: string;
}

export interface RatingSubmit {
    rating: number;
}

export interface RatingResult {
    movieTitle: string;
    raterId: string;
    rating: number;
}

export interface RatingAggregate {
    average: number;
    count: number;
}

export interface MoviePage {
    items: Movie[];
    nextCursor?: string | null;
}
