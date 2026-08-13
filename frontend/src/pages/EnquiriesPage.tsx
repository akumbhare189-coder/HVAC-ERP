import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { enquiryApi } from '../api/enquiries';
import { customerApi } from '../api/customers';
import type { Enquiry, Customer, EnquiryStatus } from '../types';
import { formatCurrencyINR, formatDate } from '../utils/formatters';

const ENQUIRY_STATUSES: { value: EnquiryStatus; label: string; color: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' }[] = [
  { value: 'NEW', label: 'New', color: 'info' },
  { value: 'QUALIFIED', label: 'Qualified', color: 'primary' },
  { value: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'warning' },
  { value: 'NEGOTIATION', label: 'Negotiation', color: 'warning' },
  { value: 'CONVERTED', label: 'Converted', color: 'success' },
  { value: 'LOST', label: 'Lost', color: 'danger' },
];

export function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);
  const [viewEnquiry, setViewEnquiry] = useState<Enquiry | null>(null);
  const [formData, setFormData] = useState({
    source: '',
    status: 'NEW' as EnquiryStatus,
    enquiry_type: '',
    customer_id: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enquiriesRes, customersRes] = await Promise.all([
        enquiryApi.getAll(),
        customerApi.getAll(),
      ]);
      setEnquiries(enquiriesRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
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
      if (editingEnquiry) {
        await enquiryApi.update(editingEnquiry.enquiry_id, formData);
      } else {
        await enquiryApi.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to save enquiry:', error);
    }
  };

  const openViewModal = (enquiry: Enquiry) => {
    setViewEnquiry(enquiry);
  };

  const resetForm = () => {
    setEditingEnquiry(null);
    setFormData({ source: '', status: 'NEW', enquiry_type: '', customer_id: '' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch = 
      enquiry.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.enquiry_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    return ENQUIRY_STATUSES.find(s => s.value === status) || { value: status, label: status, color: 'default' };
  };

  const columns = [
    { key: 'source', header: 'Source' },
    { key: 'enquiry_type', header: 'Type' },
    { 
      key: 'status', 
      header: 'Status',
      render: (item: Enquiry) => (
        <Badge variant={getStatusConfig(item.status).color}>
          {getStatusConfig(item.status).label}
        </Badge>
      ),
    },
    { 
      key: 'customer', 
      header: 'Customer',
      render: (item: Enquiry) => item.customer?.name || 'Unassigned',
    },
    { 
      key: 'enquiry_date', 
      header: 'Date',
      render: (item: Enquiry) => formatDate(item.enquiry_date),
    },
    { 
      key: 'projects', 
      header: 'Projects',
      render: (item: Enquiry) => (
        <Badge variant="info">{item.projects?.length || 0}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enquiries</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage customer enquiries</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4" />
          New Enquiry
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 border-b dark:border-gray-700">
          <Input
            placeholder="Search enquiries..."
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
              ...ENQUIRY_STATUSES.map(s => ({ value: s.value, label: s.label })),
            ]}
            className="w-48"
          />
        </div>

        <Table
          columns={columns}
          data={filteredEnquiries}
          keyExtractor={(item) => item.enquiry_id}
          onRowClick={openViewModal}
          emptyMessage="No enquiries found"
          striped
          hoverable
        />
      </Card>

      {/* View Modal */}
      <Modal isOpen={!!viewEnquiry} onClose={() => setViewEnquiry(null)} title="Enquiry Details" size="lg">
        {viewEnquiry && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</label>
                <p className="text-gray-900 dark:text-white">{viewEnquiry.source}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                <p className="text-gray-900 dark:text-white">{viewEnquiry.enquiry_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <Badge variant={getStatusConfig(viewEnquiry.status).color}>
                  {getStatusConfig(viewEnquiry.status).label}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</label>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(viewEnquiry.enquiry_date)}
                </p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</label>
                <p className="text-gray-900 dark:text-white">
                  {viewEnquiry.customer?.name || 'Not assigned'}
                </p>
              </div>
            </div>
            {viewEnquiry.projects && viewEnquiry.projects.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Projects</h4>
                <ul className="space-y-2">
                  {viewEnquiry.projects.map((project) => (
                    <li key={project.project_id} className="text-sm text-gray-700 dark:text-gray-300">
                      {project.project_id} - {formatCurrencyINR(project.total_cost)} - {project.advance_payment_status}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingEnquiry ? 'Edit Enquiry' : 'New Enquiry'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="e.g., Website, Referral, Cold Call"
            required
          />
          <Input
            label="Enquiry Type"
            value={formData.enquiry_type}
            onChange={(e) => setFormData({ ...formData, enquiry_type: e.target.value })}
            placeholder="e.g., Residential, Commercial, Industrial"
            required
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as EnquiryStatus })}
            options={ENQUIRY_STATUSES.map(s => ({ value: s.value, label: s.label }))}
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
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingEnquiry ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}