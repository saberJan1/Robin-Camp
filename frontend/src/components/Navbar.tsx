import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

interface NavbarProps {
    onOpenAdmin?: () => void;
}

export const Navbar = ({ onOpenAdmin }: NavbarProps) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <span className="text-2xl font-bold tracking-tighter text-white">
                            Cine<span className="text-sci-primary">Stream</span>
                        </span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <button className="text-gray-300 hover:text-white transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        {onOpenAdmin ? (
                            <button
                                onClick={onOpenAdmin}
                                className="flex items-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
                            >
                                <span className="text-sm font-medium">Sign In</span>
                            </button>
                        ) : (
                            <button className="flex items-center px-4 py-2 rounded-full bg-sci-primary hover:bg-sky-600 text-white transition-all shadow-lg shadow-sky-500/20">
                                <span className="text-sm font-medium">Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
