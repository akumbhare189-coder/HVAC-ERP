import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Package, 
  Warehouse, 
  Wrench, 
  HardHat,
  Menu,
  X,
  Wind,
  Search,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { Input } from './Input';
import { Modal } from './Modal';
import { formatDate } from '../utils/formatters';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, desc: 'Overview, stats, and real-time command center' },
  { name: 'Customers', href: '/customers', icon: Users, desc: 'Manage enterprise client accounts and contact profiles' },
  { name: 'Enquiries', href: '/enquiries', icon: FileText, desc: 'Track sales deals, RFP tenders, and stage proposals' },
  { name: 'Projects', href: '/projects', icon: Package, desc: 'Monitor active HVAC installation and retrofit projects' },
  { name: 'Godowns', href: '/godowns', icon: Warehouse, desc: 'Regional warehouse locations and capacity tracking' },
  { name: 'Inventory', href: '/inventory', icon: Package, desc: 'Serialized equipment stock, warranties, and locations' },
  { name: 'Technicians', href: '/technicians', icon: HardHat, desc: 'Master engineers, specializations, and availability' },
  { name: 'Service Calls', href: '/service-calls', icon: Wrench, desc: 'Field repair tickets and technician dispatch queue' },
];

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const currentRouteName = navigation.find(
    n => location.pathname === n.href || (n.href !== '/' && location.pathname.startsWith(n.href))
  )?.name || 'Dashboard';

  const filteredNav = navigation.filter(n => 
    n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectRoute = (href: string) => {
    navigate(href);
    setSearchModalOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans antialiased">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Primary Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#161b22] border-r border-[#30363d] transform transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-[#30363d]">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] text-blue-400">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white">
                  HVAC ERP
                </h1>
                <p className="text-[10px] text-gray-400">Enterprise Operations</p>
              </div>
            </div>
            <button
              className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#21262d]"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className="px-3 mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </div>
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group
                  ${isActive
                    ? 'bg-[#21262d] text-white border border-[#30363d]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]/60 border border-transparent'
                  }
                `}
              >
                <div className="flex items-center">
                  <item.icon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-gray-500 transition-opacity" />
              </NavLink>
            ))}
          </nav>

          {/* Footer Status */}
          <div className="p-4 border-t border-[#30363d] flex items-center justify-between text-xs text-gray-400">
            <span className="font-mono text-[11px]">v1.0.0</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
              ● All Systems Normal
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#161b22]/95 backdrop-blur border-b border-[#30363d]">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262d]"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <h2 className="text-base font-semibold text-white">
                {currentRouteName}
              </h2>
            </div>

            {/* Clean Header Right - Quick Search Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-gray-300 hover:border-gray-500 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <span>Search pages...</span>
              </button>

              <div className="hidden sm:block text-xs text-gray-400 font-mono">
                {formatDate(new Date())}
              </div>
            </div>
          </div>
        </header>

        {/* Page Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Navigation Finder Modal */}
      <Modal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} title="Search Pages" size="md">
        <div className="space-y-4">
          <Input
            placeholder="Type page name (e.g., Customers, Projects, Inventory, Service Calls)..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredNav.map((item) => (
              <div
                key={item.href}
                onClick={() => handleSelectRoute(item.href)}
                className="p-3 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] rounded-lg cursor-pointer flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#21262d] text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-blue-300">{item.name}</h4>
                    <p className="text-[11px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
              </div>
            ))}
            {filteredNav.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">No matching pages found.</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}