import { ReactNode } from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  backLink?: string;
  backText?: string;
  showXp?: boolean;
  xp?: number;
  progress?: number;
}

const MainLayout = ({
  children,
  title,
  backLink,
  backText = 'Back to Quest',
  showXp = false,
  xp = 0,
  progress = 0
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-light">
      <Header 
        title={title}
        backLink={backLink}
        backText={backText}
        showXp={showXp}
        xp={xp}
        progress={progress}
      />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
