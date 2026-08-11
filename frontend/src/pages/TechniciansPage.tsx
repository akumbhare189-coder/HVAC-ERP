import { useState, useEffect } from 'react';
import { Plus, HardHat, Phone, UserCheck } from 'lucide-react';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { technicianApi } from '../api/technicians';
import type { Technician } from '../types';

export function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);
  const [viewTechnician, setViewTechnician] = useState<Technician | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    specialization: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await technicianApi.getAll();
      setTechnicians(res.data);
    } catch (error) {
      console.error('Failed to fetch technicians:', error);
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
      if (editingTechnician) {
        await technicianApi.update(editingTechnician.technician_id, formData);
      } else {
        await technicianApi.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to save technician:', error);
    }
  };

  const openViewModal = (technician: Technician) => {
    setViewTechnician(technician);
  };

  const resetForm = () => {
    setEditingTechnician(null);
    setFormData({ name: '', phone_number: '', specialization: '' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const filteredTechnicians = technicians.filter((technician) => {
    const matchesSearch = 
      technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.phone_number.includes(searchTerm);
    const matchesSpec = specializationFilter === 'all' || technician.specialization === specializationFilter;
    return matchesSearch && matchesSpec;
  });

  const specializations = [...new Set(technicians.map(t => t.specialization))];

  const columns = [
    { 
      key: 'name', 
      header: 'Technician Name',
      render: (item: Technician) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-cyan-400 font-bold text-xs">
            <UserCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="font-bold text-white text-xs font-display block">{item.name}</span>
            <span className="text-[11px] text-slate-400 font-mono">ID: {item.technician_id.substring(0, 8)}</span>
          </div>
        </div>
      )
    },
    { 
      key: 'specialization', 
      header: 'Specialization & Certifications',
      render: (item: Technician) => (
        <span className="text-xs font-semibold text-cyan-300 font-sans">{item.specialization}</span>
      )
    },
    { 
      key: 'phone_number', 
      header: 'Direct Phone',
      render: (item: Technician) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-200 font-mono">
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span>{item.phone_number}</span>
        </div>
      )
    },
    { 
      key: 'serviceCalls_count', 
      header: 'Assigned Dispatches',
      render: (item: Technician) => (
        <Badge variant="info">{item.serviceCalls?.length || 0} Tickets</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight flex items-center gap-2.5">
            <HardHat className="w-7 h-7 text-cyan-400" />
            Certified HVAC Master Engineers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Manage licensed field technicians, specializations, and dispatch assignments</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Master Technician
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-4 border-b border-slate-800">
          <Input
            placeholder="Search by engineer name, specialization or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            label="Specialization"
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Specializations' },
              ...specializations.map(s => ({ value: s, label: s })),
            ]}
            className="w-64"
          />
        </div>

        <Table
          columns={columns}
          data={filteredTechnicians}
          keyExtractor={(item) => item.technician_id}
          onRowClick={openViewModal}
          emptyMessage="No technicians match your search criteria"
          striped
          hoverable
        />
      </Card>

      {/* View Modal */}
      <Modal isOpen={!!viewTechnician} onClose={() => setViewTechnician(null)} title="Engineer Credentials & Profile" size="lg">
        {viewTechnician && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Technician Name</label>
                <p className="text-lg font-bold text-white font-display mt-0.5">{viewTechnician.name}</p>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Specialization & Certifications</label>
                <p className="text-sm font-semibold text-cyan-300 font-sans mt-0.5">{viewTechnician.specialization}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Phone</label>
                <p className="text-sm font-mono text-slate-200 mt-0.5">{viewTechnician.phone_number}</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/60 rounded-2xl">
              <h4 className="text-xs font-semibold text-slate-400 uppercase">Active Field Dispatches</h4>
              <p className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">{viewTechnician.serviceCalls?.length || 0}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTechnician ? 'Edit Engineer Record' : 'New Master Technician'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Technician Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Marcus Vance, Master Specialist"
            required
          />
          <Input
            label="Phone Number"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            placeholder="+1 (555) 000-0000"
            required
          />
          <Input
            label="Specialization & Certifications"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            placeholder="e.g., Centrifugal Chillers & Magnetic Bearings (EPA Universal)"
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingTechnician ? 'Update Record' : 'Create Technician'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}