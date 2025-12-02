import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { getMovies } from '../api/movies';
import { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';
import { Navbar } from '../components/Navbar';

export const Home: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const data = await getMovies({ q: search, limit: 50 });
            setMovies(data.items);
        } catch (error) {
            console.error('Failed to fetch movies', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(fetchMovies, 500);
        return () => clearTimeout(debounce);
    }, [search]);

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <Navbar />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 neon-text">
                            Galactic Database
                        </h1>
                        <p className="text-sci-muted">Explore the cinematic universe.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-0 bg-sci-primary/20 blur-md rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <div className="relative flex items-center bg-sci-surface border border-white/10 rounded-lg overflow-hidden focus-within:border-sci-primary/50 transition-colors">
                            <Search className="w-5 h-5 text-sci-muted ml-3" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search movies..."
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-sci-muted py-2 px-3"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-sci-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}

                {!loading && movies.length === 0 && (
                    <div className="text-center py-20 text-sci-muted">
                        <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No signals detected in this sector.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
