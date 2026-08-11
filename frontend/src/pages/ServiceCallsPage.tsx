import { useState, useEffect } from 'react';
import { User, Plus, UserPlus } from 'lucide-react';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { serviceCallApi } from '../api/serviceCalls';
import { technicianApi } from '../api/technicians';
import { customerApi } from '../api/customers';
import type { ServiceCall, Technician, Customer, ServiceCallStatus } from '../types';

export function ServiceCallsPage() {
  const [serviceCalls, setServiceCalls] = useState<ServiceCall[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCall, setEditingCall] = useState<ServiceCall | null>(null);
  const [viewCall, setViewCall] = useState<ServiceCall | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignCall, setAssignCall] = useState<ServiceCall | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [formData, setFormData] = useState<{
    type: string;
    defect_details: string;
    status: ServiceCallStatus;
    customer_id: string;
    technician_id?: string;
  }>({
    type: '',
    defect_details: '',
    status: 'OPEN' as ServiceCallStatus,
    customer_id: '',
    technician_id: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [callsRes, techsRes, custsRes] = await Promise.all([
        serviceCallApi.getAll(),
        technicianApi.getAll(),
        customerApi.getAll(),
      ]);
      setServiceCalls(callsRes.data);
      setTechnicians(techsRes.data);
      setCustomers(custsRes.data);
    } catch (error) {
      console.error('Failed to fetch service calls:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...formData };
      if (!data.technician_id) {
        delete data.technician_id;
      }
      if (editingCall) {
        await serviceCallApi.update(editingCall.call_id, data);
      } else {
        await serviceCallApi.create(data);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to save service call:', error);
    }
  };
  const handleAssign = async (id: string) => {
    if (!selectedTechnician) return;
    try {
      await serviceCallApi.assignTechnician(id, selectedTechnician);
      setAssignModalOpen(false);
      setSelectedTechnician('');
      fetchData();
    } catch (error) {
      console.error('Failed to assign technician:', error);
    }
  };
  const openViewModal = (call: ServiceCall) => {
    setViewCall(call);
  };

  const openAssignModal = (call: ServiceCall) => {
    setAssignCall(call);
    setAssignModalOpen(true);
  };

  const resetForm = () => {
    setEditingCall(null);
    setFormData({ type: '', defect_details: '', status: 'OPEN', customer_id: '', technician_id: '' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      OPEN: 'info',
      ASSIGNED: 'warning',
      IN_PROGRESS: 'default',
      RESOLVED: 'success',
      CLOSED: 'danger',
    };
    return <Badge variant={variants[status] || 'default'}>{status.replace('_', ' ')}</Badge>;
  };

  const filteredCalls = serviceCalls.filter((call) => {
    const matchesSearch = 
      call.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.defect_details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.technician?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
    const matchesType = typeFilter === 'all' || call.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const types = [...new Set(serviceCalls.map(c => c.type))];
  const statuses: ServiceCallStatus[] = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  const columns = [
    { key: 'type', header: 'Type' },
    { 
      key: 'defect_details', 
      header: 'Defect Details',
      render: (item: ServiceCall) => (
        <div className="max-w-xs truncate" title={item.defect_details}>
          {item.defect_details}
        </div>
      ),
    },
    { 
      key: 'customer', 
      header: 'Customer',
      render: (item: ServiceCall) => (
        <div>
          <p className="font-medium">{item.customer?.name || 'N/A'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.customer?.contact_info?.phone || ''}</p>
        </div>
      ),
    },
    { 
      key: 'technician', 
      header: 'Technician',
      render: (item: ServiceCall) => (
        <div>
          {item.technician ? (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span>{item.technician.name}</span>
            </div>
          ) : (
            <span className="text-gray-400 italic">Unassigned</span>
          )}
        </div>
      ),
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (item: ServiceCall) => getStatusBadge(item.status),
    },
    { 
      key: 'date_opened', 
      header: 'Date Opened',
      render: (item: ServiceCall) => (
        <span>{new Date(item.date_opened).toLocaleDateString()}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Calls</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage service calls and technician assignments</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4" />
          New Service Call
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 border-b dark:border-gray-700">
          <Input
            placeholder="Search service calls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              ...statuses.map(s => ({ value: s, label: s.replace('_', ' ') })),
            ]}
            className="w-48"
          />
          <Select
            label="Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Types' },
              ...types.map(t => ({ value: t, label: t })),
            ]}
            className="w-48"
          />
        </div>

        <Table
          columns={columns}
          data={filteredCalls}
          keyExtractor={(item) => item.call_id}
          onRowClick={openViewModal}
          emptyMessage="No service calls found"
          striped
          hoverable
        />
      </Card>

      {/* View Modal */}
      <Modal isOpen={!!viewCall} onClose={() => setViewCall(null)} title="Service Call Details" size="lg">
        {viewCall && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                <p className="text-gray-900 dark:text-white">{viewCall.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <div>{getStatusBadge(viewCall.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Opened</label>
                <p className="text-gray-900 dark:text-white">{new Date(viewCall.date_opened).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</label>
                <p className="text-gray-900 dark:text-white">{viewCall.customer?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Technician</label>
                <p className="text-gray-900 dark:text-white">{viewCall.technician?.name || 'Unassigned'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Defect Details</label>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{viewCall.defect_details}</p>
              </div>
            </div>
            {!viewCall.technician_id && viewCall.status === 'OPEN' && (
              <Button 
                onClick={() => { openAssignModal(viewCall); setViewCall(null); }} 
                className="w-full"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Technician
              </Button>
            )}
          </div>
        )}
      </Modal>

      {/* Assign Technician Modal */}
      <Modal isOpen={assignModalOpen} onClose={() => { setAssignModalOpen(false); setAssignCall(null); setSelectedTechnician(''); }} title="Assign Technician">
        {assignCall && (
          <div className="space-y-4">
            <p>Assign a technician to <strong>{assignCall.type}</strong> for {assignCall.customer?.name}</p>
            <Select
              label="Technician"
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
              options={[
                { value: '', label: 'Select a technician' },
                ...technicians.map(t => ({ value: t.technician_id, label: `${t.name} (${t.specialization})` })),
              ]}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => { setAssignModalOpen(false); setSelectedTechnician(''); }}>
                Cancel
              </Button>
              <Button onClick={() => handleAssign(assignCall.call_id)} loading={loading}>
                Assign
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCall ? 'Edit Service Call' : 'New Service Call'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="e.g., AC Repair, Installation, Maintenance"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Defect Details</label>
            <textarea
              value={formData.defect_details}
              onChange={(e) => setFormData({ ...formData, defect_details: e.target.value })}
              placeholder="Describe the issue..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ServiceCallStatus })}
            options={statuses.map(s => ({ value: s, label: s.replace('_', ' ') }))}
            required
          />
          <Select
            label="Customer"
            value={formData.customer_id}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
            options={[
              { value: '', label: 'Select a customer' },
              ...customers.map(c => ({ value: c.customer_id, label: c.name })),
            ]}
            required
          />
          <Select
            label="Technician (Optional)"
            value={formData.technician_id}
            onChange={(e) => setFormData({ ...formData, technician_id: e.target.value })}
            options={[
              { value: '', label: 'Unassigned' },
              ...technicians.map(t => ({ value: t.technician_id, label: `${t.name} (${t.specialization})` })),
            ]}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingCall ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}