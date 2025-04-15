import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showBottomNav?: boolean;
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  showHeader = true,
  showFooter = true,
  showBottomNav = true,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showHeader && <Header />}
      
      <main className="flex-grow pb-16 sm:pb-0">
        {title && (
          <div className="bg-primary-light py-4">
            <div className="container mx-auto px-5">
              <h1 className="text-2xl font-medium text-black-text">{title}</h1>
            </div>
          </div>
        )}
        
        <div className="container mx-auto px-5 py-4 sm:py-6 md:py-8">
          {children}
        </div>
      </main>
      
      {showFooter && <Footer />}
      
      {showBottomNav && (
        <div className="sm:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
};

export default Layout;