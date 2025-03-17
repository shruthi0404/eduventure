import { Link } from 'wouter';
import { User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import ProgressBar from '@/components/custom/ProgressBar';

interface HeaderProps {
  title?: string;
  backLink?: string;
  backText?: string;
  showXp?: boolean;
  xp?: number;
  progress?: number;
}

const Header = ({ 
  title, 
  backLink, 
  backText = 'Back to Quest',
  showXp = false,
  xp = 0,
  progress = 0
}: HeaderProps) => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {backLink ? (
          <Link to={backLink}>
            <button className="text-primary hover:text-primary/80">
              <i className="fas fa-arrow-left mr-2"></i> {backText}
            </button>
          </Link>
        ) : (
          <div className="flex items-center">
            <h1 className="text-2xl font-gaming text-primary mr-2">EduVenture</h1>
            <div className="hidden md:block ml-6 w-72">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>
          </div>
        )}
        
        {title && (
          <h1 className="text-2xl font-gaming text-primary">{title}</h1>
        )}
        
        {showXp && (
          <div className="flex items-center">
            <span className="text-accent font-bold mr-2">{xp} XP</span>
            <ProgressBar progress={progress} width="w-32" />
          </div>
        )}
        
        {!showXp && !title && (
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-primary">
              <Settings className="h-5 w-5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="w-9 h-9 rounded-full object-cover" 
                    />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <a className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      {!backLink && (
        <div className="md:hidden container mx-auto px-4 pb-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
