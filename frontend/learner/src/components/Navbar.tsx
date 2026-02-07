import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Trophy, User as UserIcon } from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/90">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2 rounded-lg shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              LearnSphere
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              My Courses
            </Link>
            <Link to="/browse" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Browse
            </Link>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-gray-900">{CURRENT_USER.name}</span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                <Trophy size={12} className="fill-amber-500" />
                <span>{CURRENT_USER.points} pts</span>
              </div>
            </div>
            
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center border-2 border-white shadow-md cursor-pointer hover:shadow-lg transition-all">
               <UserIcon size={20} className="text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
