import { useEffect, useState } from 'react';
import { Search, Filter, AlertCircle, Database } from 'lucide-react';
import { getMovies } from '../api/movies';
import type { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { AdminModal } from '../components/AdminModal';
import { MOCK_MOVIES } from '../api/mockData';

export const Home = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState('');
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [usingMock, setUsingMock] = useState(false);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            setError(false);
            const data = await getMovies();
            setMovies(data.items);
            setUsingMock(false);
        } catch (err) {
            console.error('Failed to fetch movies', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleUseMock = () => {
        setMovies(MOCK_MOVIES);
        setError(false);
        setUsingMock(true);
    };

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(search.toLowerCase()) ||
        movie.genre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black pb-20">
            <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

            <Hero />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-0 bg-sci-primary/20 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden transition-all group-focus-within:border-sci-primary/50 group-focus-within:bg-gray-900">
                            <Search className="w-5 h-5 text-gray-400 ml-6" />
                            <input
                                type="text"
                                placeholder="Search for movies, genres, or directors..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 py-5 px-4 text-lg"
                            />
                        </div>
                    </div>
                    <button className="flex items-center justify-center px-8 py-5 bg-gray-900/80 backdrop-blur-xl rounded-2xl text-gray-300 hover:text-white hover:bg-gray-800 font-medium transition-all shadow-2xl border border-white/10 hover:border-white/20 hover:-translate-y-0.5">
                        <Filter className="w-5 h-5 mr-2" />
                        Filter
                    </button>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-red-500/20 rounded-3xl p-12 text-center mb-12">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Connection Failed</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">We couldn't connect to the server. The backend might be offline or unreachable.</p>
                        <button
                            onClick={handleUseMock}
                            className="inline-flex items-center px-8 py-4 bg-sci-primary hover:bg-sky-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-sky-500/20"
                        >
                            <Database className="w-5 h-5 mr-2" />
                            Load Demo Data
                        </button>
                    </div>
                )}

                {/* Mock Data Indicator */}
                {usingMock && (
                    <div className="flex items-center justify-center mb-10">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold tracking-widest border border-amber-500/20 uppercase">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 animate-pulse" />
                            Demo Mode Active
                        </span>
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-32">
                        <div className="w-12 h-12 border-4 border-sci-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {filteredMovies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}

                {!loading && filteredMovies.length === 0 && !error && (
                    <div className="text-center py-32">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No movies found</h3>
                        <p className="text-gray-400">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>

            <AdminModal
                isOpen={isAdminOpen}
                onClose={() => setIsAdminOpen(false)}
                onSuccess={fetchMovies}
            />
        </div>
    );
};
