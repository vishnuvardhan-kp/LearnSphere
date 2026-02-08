import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login';

    // If on auth page, don't wrap with sidebar/layout shell, just return children (or a simple wrapper)
    if (isAuthPage) {
        return <div className="min-h-screen bg-gray-50">{children}</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
