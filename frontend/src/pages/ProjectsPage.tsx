import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { projectApi } from '../api/projects';
import { enquiryApi } from '../api/enquiries';
import type { Project, Enquiry } from '../types';

const PAYMENT_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'warning' as const },
  { value: 'PARTIAL', label: 'Partial', color: 'info' as const },
  { value: 'FULL', label: 'Full', color: 'success' as const },
  { value: 'OVERDUE', label: 'Overdue', color: 'danger' as const },
];

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    total_cost: 0,
    lead_time: 0,
    advance_payment_status: 'PENDING',
    expected_delivery_date: '',
    enquiry_id: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, enquiriesRes] = await Promise.all([
        projectApi.getAll(),
        enquiryApi.getAll(),
      ]);
      setProjects(projectsRes.data);
      setEnquiries(enquiriesRes.data);
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
      const data = {
        ...formData,
        total_cost: Number(formData.total_cost),
        lead_time: Number(formData.lead_time),
        expected_delivery_date: new Date(formData.expected_delivery_date).toISOString(),
      };
      if (editingProject) {
        await projectApi.update(editingProject.project_id, data);
      } else {
        await projectApi.create(data);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const openViewModal = (project: Project) => {
    setViewProject(project);
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({ total_cost: 0, lead_time: 0, advance_payment_status: 'PENDING', expected_delivery_date: '', enquiry_id: '' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.project_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.enquiry?.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.enquiry?.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment = paymentFilter === 'all' || project.advance_payment_status === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  const getPaymentConfig = (status: string) => {
    return PAYMENT_STATUSES.find(s => s.value === status) || { value: status, label: status, color: 'default' as const };
  };

  const columns = [
    { key: 'project_id', header: 'Project ID', className: 'font-mono font-medium' },
    { 
      key: 'enquiry', 
      header: 'Enquiry',
      render: (item: Project) => item.enquiry?.source || 'N/A',
    },
    { 
      key: 'customer', 
      header: 'Customer',
      render: (item: Project) => item.enquiry?.customer?.name || 'N/A',
    },
    { 
      key: 'total_cost', 
      header: 'Total Cost',
      render: (item: Project) => <span className="font-medium">${item.total_cost.toLocaleString()}</span>,
    },
    { 
      key: 'lead_time', 
      header: 'Lead Time (days)',
      render: (item: Project) => <span>{item.lead_time}</span>,
    },
    { 
      key: 'advance_payment_status', 
      header: 'Payment Status',
      render: (item: Project) => (
        <Badge variant={getPaymentConfig(item.advance_payment_status).color}>
          {getPaymentConfig(item.advance_payment_status).label}
        </Badge>
      ),
    },
    { 
      key: 'expected_delivery_date', 
      header: 'Expected Delivery',
      render: (item: Project) => new Date(item.expected_delivery_date).toLocaleDateString(),
    },
    { 
      key: 'inventoryUnits', 
      header: 'Units',
      render: (item: Project) => <Badge variant="info">{item.inventoryUnits?.length || 0}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects / Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage projects and orders</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 border-b dark:border-gray-700">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            label="Payment Status"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              ...PAYMENT_STATUSES.map(s => ({ value: s.value, label: s.label })),
            ]}
            className="w-48"
          />
        </div>

        <Table
          columns={columns}
          data={filteredProjects}
          keyExtractor={(item) => item.project_id}
          onRowClick={openViewModal}
          emptyMessage="No projects found"
          striped
          hoverable
        />
      </Card>

      {/* View Modal */}
      <Modal isOpen={!!viewProject} onClose={() => setViewProject(null)} title="Project Details" size="lg">
        {viewProject && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Project ID</label>
                <p className="text-gray-900 dark:text-white font-mono">{viewProject.project_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Enquiry</label>
                <p className="text-gray-900 dark:text-white">{viewProject.enquiry?.source || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</label>
                <p className="text-gray-900 dark:text-white">{viewProject.enquiry?.customer?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cost</label>
                <p className="text-gray-900 dark:text-white font-medium">${viewProject.total_cost.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Lead Time</label>
                <p className="text-gray-900 dark:text-white">{viewProject.lead_time} days</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Status</label>
                <Badge variant={getPaymentConfig(viewProject.advance_payment_status).color}>
                  {getPaymentConfig(viewProject.advance_payment_status).label}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Expected Delivery</label>
                <p className="text-gray-900 dark:text-white">{new Date(viewProject.expected_delivery_date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Inventory Units</label>
                <Badge variant="info">{viewProject.inventoryUnits?.length || 0}</Badge>
              </div>
            </div>
            {viewProject.inventoryUnits && viewProject.inventoryUnits.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Assigned Inventory Units</h4>
                <ul className="space-y-1">
                  {viewProject.inventoryUnits.map((unit) => (
                    <li key={unit.serial_number} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span className="font-mono">{unit.serial_number}</span>
                      <Badge variant={unit.warranty_status === 'ACTIVE' ? 'success' : 'warning'}>
                        {unit.warranty_status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProject ? 'Edit Project' : 'New Project'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Enquiry"
            value={formData.enquiry_id}
            onChange={(e) => setFormData({ ...formData, enquiry_id: e.target.value })}
            options={[
              { value: '', label: 'Select an enquiry' },
              ...enquiries.filter(e => e.status === 'CONVERTED').map(e => ({ 
                value: e.enquiry_id, 
                label: `${e.source} - ${e.customer?.name || 'No customer'}` 
              })),
            ]}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Total Cost"
              type="number"
              step="0.01"
              value={formData.total_cost}
              onChange={(e) => setFormData({ ...formData, total_cost: Number(e.target.value) })}
              placeholder="0.00"
              required
            />
            <Input
              label="Lead Time (days)"
              type="number"
              value={formData.lead_time}
              onChange={(e) => setFormData({ ...formData, lead_time: Number(e.target.value) })}
              placeholder="30"
              required
            />
          </div>
          <Select
            label="Advance Payment Status"
            value={formData.advance_payment_status}
            onChange={(e) => setFormData({ ...formData, advance_payment_status: e.target.value })}
            options={PAYMENT_STATUSES.map(s => ({ value: s.value, label: s.label }))}
            required
          />
          <Input
            label="Expected Delivery Date"
            type="date"
            value={formData.expected_delivery_date}
            onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingProject ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}