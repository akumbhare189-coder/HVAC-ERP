import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { inventoryApi } from '../api/inventory';
import { godownApi } from '../api/godowns';
import { projectApi } from '../api/projects';
import type { InventoryUnit, Godown, Project, WarrantyStatus } from '../types';

const WARRANTY_STATUSES: { value: WarrantyStatus; label: string; color: 'default' | 'success' | 'warning' | 'danger' | 'info' }[] = [
  { value: 'ACTIVE', label: 'Active', color: 'success' },
  { value: 'EXPIRED', label: 'Expired', color: 'danger' },
  { value: 'VOID', label: 'Void', color: 'default' },
  { value: 'PENDING', label: 'Pending', color: 'warning' },
];

export function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryUnit[]>([]);
  const [godowns, setGodowns] = useState<Godown[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [godownFilter, setGodownFilter] = useState<string>('all');
  const [warrantyFilter, setWarrantyFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<InventoryUnit | null>(null);
  const [viewUnit, setViewUnit] = useState<InventoryUnit | null>(null);
  const [formData, setFormData] = useState({
    serial_number: '',
    current_location: '',
    warranty_status: 'ACTIVE' as WarrantyStatus,
    installation_date: '',
    godown_id: '',
    project_id: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inventoryRes, godownsRes, projectsRes] = await Promise.all([
        inventoryApi.getAll(),
        godownApi.getAll(),
        projectApi.getAll(),
      ]);
      setInventory(inventoryRes.data);
      setGodowns(godownsRes.data);
      setProjects(projectsRes.data);
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
      if (editingUnit) {
        await inventoryApi.update(editingUnit.serial_number, formData);
      } else {
        await inventoryApi.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to save inventory unit:', error);
    }
  };

  const openViewModal = (unit: InventoryUnit) => {
    setViewUnit(unit);
  };

  const resetForm = () => {
    setEditingUnit(null);
    setFormData({ serial_number: '', current_location: '', warranty_status: 'ACTIVE', installation_date: '', godown_id: '', project_id: '' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const filteredInventory = inventory.filter((unit) => {
    const matchesSearch = 
      unit.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.current_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.godown?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.project?.enquiry?.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGodown = godownFilter === 'all' || unit.godown_id === godownFilter;
    const matchesWarranty = warrantyFilter === 'all' || unit.warranty_status === warrantyFilter;
    return matchesSearch && matchesGodown && matchesWarranty;
  });

  const getWarrantyConfig = (status: string) => {
    return WARRANTY_STATUSES.find(s => s.value === status) || { value: status, label: status, color: 'default' };
  };

  const columns = [
    { key: 'serial_number', header: 'Serial Number', className: 'font-mono font-medium' },
    { 
      key: 'current_location', 
      header: 'Location',
      render: (item: InventoryUnit) => item.current_location,
    },
    { 
      key: 'warranty_status', 
      header: 'Warranty',
      render: (item: InventoryUnit) => (
        <Badge variant={getWarrantyConfig(item.warranty_status).color}>
          {getWarrantyConfig(item.warranty_status).label}
        </Badge>
      ),
    },
    { 
      key: 'godown', 
      header: 'Godown',
      render: (item: InventoryUnit) => item.godown?.name || 'N/A',
    },
    { 
      key: 'project', 
      header: 'Project',
      render: (item: InventoryUnit) => item.project 
        ? `${item.project.project_id} (${item.project.enquiry?.customer?.name || 'No customer'})`
        : <span className="text-gray-400 dark:text-gray-500">Unassigned</span>,
    },
    { 
      key: 'installation_date', 
      header: 'Installation Date',
      render: (item: InventoryUnit) => item.installation_date 
        ? new Date(item.installation_date).toLocaleDateString()
        : <span className="text-gray-400 dark:text-gray-500">Not installed</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Units</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage individual inventory units</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4" />
          Add Unit
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 border-b dark:border-gray-700">
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            label="Godown"
            value={godownFilter}
            onChange={(e) => setGodownFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Godowns' },
              ...godowns.map(g => ({ value: g.godown_id, label: g.name })),
            ]}
            className="w-56"
          />
          <Select
            label="Warranty"
            value={warrantyFilter}
            onChange={(e) => setWarrantyFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Warranties' },
              ...WARRANTY_STATUSES.map(s => ({ value: s.value, label: s.label })),
            ]}
            className="w-48"
          />
        </div>

        <Table
          columns={columns}
          data={filteredInventory}
          keyExtractor={(item) => item.serial_number}
          onRowClick={openViewModal}
          emptyMessage="No inventory units found"
          striped
          hoverable
        />
      </Card>

      {/* View Modal */}
      <Modal isOpen={!!viewUnit} onClose={() => setViewUnit(null)} title="Inventory Unit Details" size="lg">
        {viewUnit && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Serial Number</label>
                <p className="text-gray-900 dark:text-white font-mono">{viewUnit.serial_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Location</label>
                <p className="text-gray-900 dark:text-white">{viewUnit.current_location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Warranty Status</label>
                <Badge variant={getWarrantyConfig(viewUnit.warranty_status).color}>
                  {getWarrantyConfig(viewUnit.warranty_status).label}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Godown</label>
                <p className="text-gray-900 dark:text-white">{viewUnit.godown?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Installation Date</label>
                <p className="text-gray-900 dark:text-white">
                  {viewUnit.installation_date ? new Date(viewUnit.installation_date).toLocaleDateString() : 'Not installed'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Project</label>
                <p className="text-gray-900 dark:text-white">
                  {viewUnit.project 
                    ? `${viewUnit.project.project_id} - ${viewUnit.project.enquiry?.customer?.name || 'No customer'}`
                    : 'Unassigned'}
                </p>
              </div>
            </div>
            {viewUnit.godown && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Godown Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Location: </span>
                    <span className="text-gray-900 dark:text-white">{viewUnit.godown.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Capacity: </span>
                    <span className="text-gray-900 dark:text-white">{viewUnit.godown.capacity} units</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUnit ? 'Edit Inventory Unit' : 'Add Inventory Unit'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Serial Number"
            value={formData.serial_number}
            onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
            placeholder="e.g., HVAC-2024-001"
            required
            disabled={!!editingUnit}
          />
          <Input
            label="Current Location"
            value={formData.current_location}
            onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
            placeholder="e.g., Shelf A-3, Bay 2"
            required
          />
          <Select
            label="Warranty Status"
            value={formData.warranty_status}
            onChange={(e) => setFormData({ ...formData, warranty_status: e.target.value as WarrantyStatus })}
            options={WARRANTY_STATUSES.map(s => ({ value: s.value, label: s.label }))}
            required
          />
          <Input
            label="Installation Date"
            type="date"
            value={formData.installation_date}
            onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })}
          />
          <Select
            label="Godown"
            value={formData.godown_id}
            onChange={(e) => setFormData({ ...formData, godown_id: e.target.value })}
            options={[
              { value: '', label: 'Select a godown' },
              ...godowns.map(g => ({ value: g.godown_id, label: `${g.name} (${g.location})` })),
            ]}
            required
          />
          <Select
            label="Project (Optional)"
            value={formData.project_id}
            onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
            options={[
              { value: '', label: 'Unassigned' },
              ...projects.map(p => ({ value: p.project_id, label: `${p.project_id} - ${p.enquiry?.customer?.name || 'No customer'}` })),
            ]}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingUnit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}