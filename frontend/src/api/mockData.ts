import type { Movie } from '../types';

export const MOCK_MOVIES: Movie[] = [
    {
        id: 'm_1',
        title: 'Inception',
        genre: 'Sci-Fi',
        releaseDate: '2010-07-16',
        distributor: 'Warner Bros.',
        budget: 160000000,
        mpaRating: 'PG-13',
        boxOffice: {
            revenue: {
                worldwide: 829895144,
                openingWeekendUSA: 62785337
            },
            currency: 'USD',
            source: 'Mock',
            lastUpdated: new Date().toISOString()
        }
    },
    {
        id: 'm_2',
        title: 'The Dark Knight',
        genre: 'Action',
        releaseDate: '2008-07-18',
        distributor: 'Warner Bros.',
        budget: 185000000,
        mpaRating: 'PG-13',
        boxOffice: {
            revenue: {
                worldwide: 1004558444,
                openingWeekendUSA: 158411483
            },
            currency: 'USD',
            source: 'Mock',
            lastUpdated: new Date().toISOString()
        }
    },
    {
        id: 'm_3',
        title: 'Interstellar',
        genre: 'Sci-Fi',
        releaseDate: '2014-11-07',
        distributor: 'Paramount',
        budget: 165000000,
        mpaRating: 'PG-13',
        boxOffice: {
            revenue: {
                worldwide: 677471339,
                openingWeekendUSA: 47510360
            },
            currency: 'USD',
            source: 'Mock',
            lastUpdated: new Date().toISOString()
        }
    },
    {
        id: 'm_4',
        title: 'Dune: Part Two',
        genre: 'Sci-Fi',
        releaseDate: '2024-03-01',
        distributor: 'Warner Bros.',
        budget: 190000000,
        mpaRating: 'PG-13',
        boxOffice: {
            revenue: {
                worldwide: 711844358,
                openingWeekendUSA: 82505391
            },
            currency: 'USD',
            source: 'Mock',
            lastUpdated: new Date().toISOString()
        }
    }
];
