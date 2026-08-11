import { FileText, Package, Warehouse, Wrench } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { EnquiryPipelineTracker } from './EnquiryPipelineTracker';
import { GodownInventoryGrid } from './GodownInventoryGrid';
import { ServiceCallDispatchQueue } from './ServiceCallDispatchQueue';

export function Dashboard() {
  const stats = [
    { title: 'Commercial Enquiries', value: '5', icon: FileText, trend: { value: 24, label: 'vs last month' }, variant: 'primary' as const },
    { title: 'Active HVAC Projects', value: '3', icon: Package, trend: { value: 12, label: 'vs last month' }, variant: 'success' as const },
    { title: 'Depot Equipment Units', value: '6', icon: Warehouse, trend: { value: -2, label: 'vs last month' }, variant: 'warning' as const },
    { title: 'Field Service Calls', value: '5', icon: Wrench, trend: { value: 15, label: 'vs last month' }, variant: 'danger' as const },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#30363d]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            HVAC Operations Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time tracking of commercial tenders, stock inventory, and technician field dispatches
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Commercial Opportunity Pipeline */}
      <div className="w-full">
        <EnquiryPipelineTracker />
      </div>

      {/* Field Service Dispatch Queue */}
      <div className="w-full">
        <ServiceCallDispatchQueue />
      </div>

      {/* Godown Inventory Stock Grid */}
      <div className="w-full">
        <GodownInventoryGrid />
      </div>
    </div>
  );
}