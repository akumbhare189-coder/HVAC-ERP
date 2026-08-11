import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CustomersPage } from './pages/CustomersPage';
import { EnquiriesPage } from './pages/EnquiriesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { GodownsPage } from './pages/GodownsPage';
import { InventoryPage } from './pages/InventoryPage';
import { TechniciansPage } from './pages/TechniciansPage';
import { ServiceCallsPage } from './pages/ServiceCallsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/enquiries" element={<EnquiriesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/godowns" element={<GodownsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/technicians" element={<TechniciansPage />} />
          <Route path="/service-calls" element={<ServiceCallsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;