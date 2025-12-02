import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const Navbar: React.FC = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-sci-primary/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="p-2 rounded-full bg-sci-primary/10 group-hover:bg-sci-primary/20 transition-colors">
                            <Zap className="w-6 h-6 text-sci-primary animate-pulse-slow" />
                        </div>
                        <span className="text-xl font-bold tracking-wider text-white neon-text">
                            NEXUS<span className="text-sci-primary">DB</span>
                        </span>
                    </Link>

                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-sci-muted hover:text-sci-primary transition-colors text-sm uppercase tracking-widest">
                            Movies
                        </Link>
                        <Link to="/movie/new" className="px-4 py-2 rounded bg-sci-primary/10 border border-sci-primary/50 text-sci-primary hover:bg-sci-primary/20 hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all duration-300 text-sm uppercase tracking-widest">
                            Add Movie
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
