import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Plus, Building2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { customerApi } from '../api/customers';
import type { Customer } from '../types';

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    type: string;
    contact_info: { phone: string; email: string; address: string };
  }>({
    name: '',
    type: '',
    contact_info: { phone: '', email: '', address: '' },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await customerApi.getAll();
      setCustomers(res.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
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
      if (editingCustomer) {
        await customerApi.update(editingCustomer.customer_id, formData);
      } else {
        await customerApi.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to save customer:', error);
    }
  };

  const openViewModal = (customer: Customer) => {
    setViewCustomer(customer);
  };

  const resetForm = () => {
    setEditingCustomer(null);
    setFormData({ name: '', type: '', contact_info: { phone: '', email: '', address: '' } });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.contact_info?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.contact_info?.phone?.includes(searchTerm));
    const matchesType = typeFilter === 'all' || customer.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const types = [...new Set(customers.map(c => c.type))];

  const columns = [
    { 
      key: 'name', 
      header: 'Client Organization',
      render: (item: Customer) => (
        <div>
          <span className="font-bold text-white text-sm font-display block">{item.name}</span>
          <span className="text-[11px] text-slate-400 font-mono">ID: {item.customer_id.substring(0, 8)}</span>
        </div>
      )
    },
    { 
      key: 'type', 
      header: 'Industry Sector',
      render: (item: Customer) => (
        <Badge variant="primary">{item.type}</Badge>
      )
    },
    { 
      key: 'contact_info', 
      header: 'Contact Details',
      render: (item: Customer) => (
        <div className="space-y-1 text-xs">
          {item.contact_info?.email && (
            <div className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span>{item.contact_info.email}</span>
            </div>
          )}
          {item.contact_info?.phone && (
            <div className="flex items-center gap-1.5 text-slate-300 font-mono">
              <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{item.contact_info.phone}</span>
            </div>
          )}
          {item.contact_info?.address && (
            <div className="flex items-center gap-1.5 text-slate-400 truncate max-w-xs">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span className="truncate">{item.contact_info.address}</span>
            </div>
          )}
        </div>
      ),
    },
    { 
      key: 'enquiries_count', 
      header: 'Active Deals',
      render: (item: Customer) => (
        <Badge variant="info">{item.enquiries?.length || 0} Enquiries</Badge>
      ),
    },
    { 
      key: 'service_calls_count', 
      header: 'Dispatch Calls',
      render: (item: Customer) => (
        <Badge variant="warning">{item.serviceCalls?.length || 0} Tickets</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-cyan-400" />
            Client Accounts Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Manage enterprise client relationships, contact profiles, and operational history</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Client Account
        </Button>
      </div>

      <Card>
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-4 border-b border-slate-800">
          <Input
            placeholder="Search by client name, email, phone or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            label="Industry Filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Industry Sectors' },
              ...types.map(t => ({ value: t, label: t })),
            ]}
            className="w-56"
          />
        </div>

        <Table
          columns={columns}
          data={filteredCustomers}
          keyExtractor={(item) => item.customer_id}
          onRowClick={openViewModal}
          emptyMessage="No client accounts match your search"
          striped
          hoverable
        />
      </Card>

      {/* View Modal */}
      <Modal isOpen={!!viewCustomer} onClose={() => setViewCustomer(null)} title="Corporate Client Profile" size="lg">
        {viewCustomer && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Client Organization</label>
                <p className="text-lg font-bold text-white font-display mt-0.5">{viewCustomer.name}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Industry Sector</label>
                <p className="text-sm font-semibold text-cyan-300 mt-0.5">{viewCustomer.type}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Direct Phone</label>
                <p className="text-sm font-mono text-slate-200 mt-0.5">{viewCustomer.contact_info?.phone || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Facilities Address</label>
                <p className="text-sm text-slate-300 mt-0.5">{viewCustomer.contact_info?.address || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Primary Contact Email</label>
                <p className="text-sm font-mono text-cyan-300 mt-0.5">{viewCustomer.contact_info?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/60 rounded-2xl">
                <p className="text-xs font-semibold text-slate-400 uppercase">Active Commercial Deals</p>
                <p className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">{viewCustomer.enquiries?.length || 0}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-800/60 rounded-2xl">
                <p className="text-xs font-semibold text-slate-400 uppercase">Field Service Tickets</p>
                <p className="text-2xl font-extrabold text-amber-400 font-mono mt-1">{viewCustomer.serviceCalls?.length || 0}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCustomer ? 'Edit Corporate Account' : 'New Client Account'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Organization Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Pfizer BioTech Research Campus"
            required
          />
          <Input
            label="Industry Sector"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="e.g., Pharmaceutical, Commercial High-Rise, Healthcare"
            required
          />
          <Input
            label="Contact Email"
            value={formData.contact_info.email}
            onChange={(e) => setFormData({ ...formData, contact_info: { ...formData.contact_info, email: e.target.value } })}
            type="email"
            placeholder="facilities@company.com"
          />
          <Input
            label="Phone Number"
            value={formData.contact_info.phone}
            onChange={(e) => setFormData({ ...formData, contact_info: { ...formData.contact_info, phone: e.target.value } })}
            placeholder="+1 (555) 000-0000"
          />
          <Input
            label="Facility Street Address"
            value={formData.contact_info.address}
            onChange={(e) => setFormData({ ...formData, contact_info: { ...formData.contact_info, address: e.target.value } })}
            placeholder="100 Enterprise Way, City, State"
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingCustomer ? 'Update Account' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}