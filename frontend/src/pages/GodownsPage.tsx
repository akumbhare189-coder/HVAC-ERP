import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { godownApi } from '../api/godowns';
import type { Godown } from '../types';

export function GodownsPage() {
  const [godowns, setGodowns] = useState<Godown[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGodown, setEditingGodown] = useState<Godown | null>(null);
  const [viewGodown, setViewGodown] = useState<Godown | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await godownApi.getAll();
      setGodowns(res.data);
    } catch (error) {
      console.error('Failed to fetch godowns:', error);
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
      if (editingGodown) {
        await godownApi.update(editingGodown.godown_id, formData);
      } else {
        await godownApi.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to save godown:', error);
    }
  };

  const openViewModal = (godown: Godown) => {
    setViewGodown(godown);
  };

  const resetForm = () => {
    setEditingGodown(null);
    setFormData({ name: '', location: '', capacity: 0 });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const filteredGodowns = godowns.filter((godown) => {
    const matchesSearch = 
      godown.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      godown.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'location', header: 'Location' },
    { 
      key: 'capacity', 
      header: 'Capacity',
      render: (item: Godown) => <span>{item.capacity} units</span>,
    },
    { 
      key: 'inventoryUnits', 
      header: 'Current Stock',
      render: (item: Godown) => (
        <Badge variant="info">{item.inventoryUnits?.length || 0} / {item.capacity}</Badge>
      ),
    },
    { 
      key: 'utilization', 
      header: 'Utilization',
      render: (item: Godown) => {
        const used = item.inventoryUnits?.length || 0;
        const percent = item.capacity > 0 ? Math.round((used / item.capacity) * 100) : 0;
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-sm font-medium">{percent}%</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Godowns / Warehouses</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage warehouse locations and capacity</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4" />
          New Godown
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 border-b dark:border-gray-700">
          <Input
            placeholder="Search godowns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        <Table
          columns={columns}
          data={filteredGodowns}
          keyExtractor={(item) => item.godown_id}
          onRowClick={openViewModal}
          emptyMessage="No godowns found"
          striped
          hoverable
        />
      </Card>

      {/* View Modal */}
      <Modal isOpen={!!viewGodown} onClose={() => setViewGodown(null)} title="Godown Details" size="lg">
        {viewGodown && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                <p className="text-gray-900 dark:text-white">{viewGodown.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</label>
                <p className="text-gray-900 dark:text-white">{viewGodown.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Capacity</label>
                <p className="text-gray-900 dark:text-white">{viewGodown.capacity} units</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Stock</label>
                <p className="text-gray-900 dark:text-white">{viewGodown.inventoryUnits?.length || 0} units</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Utilization</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ 
                      width: `${viewGodown.capacity > 0 ? Math.round(((viewGodown.inventoryUnits?.length || 0) / viewGodown.capacity) * 100) : 0}%` 
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {viewGodown.capacity > 0 
                    ? Math.round(((viewGodown.inventoryUnits?.length || 0) / viewGodown.capacity) * 100) 
                    : 0}%
                </span>
              </div>
            </div>
            {viewGodown.inventoryUnits && viewGodown.inventoryUnits.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Stored Inventory Units</h4>
                <ul className="space-y-1 max-h-60 overflow-y-auto">
                  {viewGodown.inventoryUnits.map((unit) => (
                    <li key={unit.serial_number} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span className="font-mono">{unit.serial_number}</span>
                      <Badge variant={unit.warranty_status === 'ACTIVE' ? 'success' : 'warning'}>
                        {unit.warranty_status}
                      </Badge>
                      {unit.project && (
                        <Badge variant="info">{unit.project.project_id}</Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingGodown ? 'Edit Godown' : 'New Godown'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Main Warehouse, North Facility"
            required
          />
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., 123 Industrial Ave, City, State"
            required
          />
          <Input
            label="Capacity (units)"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            placeholder="1000"
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingGodown ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}