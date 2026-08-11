import { useState, useEffect } from 'react';
import { Plus, ArrowRight, Edit, TrendingUp, Building2, Calendar } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { enquiryApi } from '../api/enquiries';
import { customerApi } from '../api/customers';
import type { Enquiry, Customer, EnquiryStatus } from '../types';

const ENQUIRY_STATUSES: { value: EnquiryStatus; label: string; color: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' }[] = [
  { value: 'NEW', label: 'New Lead', color: 'info' },
  { value: 'QUALIFIED', label: 'Qualified', color: 'primary' },
  { value: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'warning' },
  { value: 'NEGOTIATION', label: 'Negotiation', color: 'warning' },
  { value: 'CONVERTED', label: 'Converted', color: 'success' },
  { value: 'LOST', label: 'Lost', color: 'danger' },
];

const STATUS_FLOW: EnquiryStatus[] = ['NEW', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'CONVERTED'];

export function EnquiryPipelineTracker() {
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

  const handleConvert = async (id: string) => {
    if (confirm('Convert this enquiry to a project?')) {
      try {
        await enquiryApi.convertToProject(id, {
          total_cost: 150000,
          lead_time: 30,
          advance_payment_status: 'PENDING',
          expected_delivery_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
        fetchData();
      } catch (error) {
        console.error('Failed to convert enquiry:', error);
      }
    }
  };

  const openEditModal = (enquiry: Enquiry) => {
    setEditingEnquiry(enquiry);
    setFormData({
      source: enquiry.source,
      status: enquiry.status as EnquiryStatus,
      enquiry_type: enquiry.enquiry_type,
      customer_id: enquiry.customer_id,
    });
    setIsModalOpen(true);
  };

  const openViewModal = (enquiry: Enquiry) => {
    setViewEnquiry(enquiry);
  };

  const resetForm = () => {
    setEditingEnquiry(null);
    setFormData({
      source: '',
      status: 'NEW',
      enquiry_type: '',
      customer_id: '',
    });
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

  const getNextStatus = (currentStatus: EnquiryStatus): EnquiryStatus | null => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1) {
      return STATUS_FLOW[currentIndex + 1];
    }
    return null;
  };

  const pipelineData = STATUS_FLOW.map((status) => {
    const statusEnquiries = filteredEnquiries.filter(e => e.status === status);
    const config = getStatusConfig(status);
    return { status, config, enquiries: statusEnquiries };
  });

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 pb-3 border-b border-[#30363d] gap-3">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Commercial Opportunity Pipeline
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Track HVAC procurement deals through pipeline stages</p>
        </div>
        <div>
          <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Deal Enquiry
          </Button>
        </div>
      </div>
      
      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Input
          placeholder="Filter by customer, specs, or source..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select
          label="Filter Stage"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Pipeline Stages' },
            ...ENQUIRY_STATUSES.map(s => ({ value: s.value, label: s.label })),
          ]}
          className="w-56"
        />
      </div>

      {/* Horizontal Pipeline Board */}
      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {pipelineData.map(({ status, config, enquiries: stageEnquiries }) => (
          <div key={status} className="flex-shrink-0 w-72">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 min-h-[380px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#30363d]">
                  <Badge variant={config.color}>{config.label}</Badge>
                  <span className="text-xs font-mono font-semibold text-gray-400">
                    {stageEnquiries.length}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-0.5">
                  {stageEnquiries.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-[#30363d]/60 rounded-lg">
                      <p className="text-xs text-gray-500">No active deals</p>
                    </div>
                  ) : (
                    stageEnquiries.map((enquiry) => (
                      <div
                        key={enquiry.enquiry_id}
                        className="bg-[#161b22] border border-[#30363d] hover:border-gray-500 rounded-lg p-3 shadow-sm transition-colors cursor-pointer"
                        onClick={() => openViewModal(enquiry)}
                      >
                        <span className="text-[10px] font-mono text-gray-400 bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d]">
                          {enquiry.source}
                        </span>

                        <h4 className="font-semibold text-white text-xs mt-2 truncate">
                          {enquiry.enquiry_type}
                        </h4>

                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5 truncate">
                          <Building2 className="w-3 h-3 text-gray-500 flex-shrink-0" />
                          <span className="truncate">{enquiry.customer?.name || 'Unassigned Customer'}</span>
                        </div>

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#30363d]">
                          <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            {new Date(enquiry.enquiry_date).toLocaleDateString()}
                          </span>
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openEditModal(enquiry)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            {status !== 'CONVERTED' && status !== 'LOST' && (
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => handleConvert(enquiry.enquiry_id)}
                                className="h-6 px-2 text-[11px]"
                              >
                                Convert <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {status !== 'CONVERTED' && status !== 'LOST' && (
                <div className="mt-3 pt-2 border-t border-[#30363d] text-center">
                  <span className="text-[11px] text-gray-500">
                    Next: <strong className="text-gray-300">{getNextStatus(status) ? getStatusConfig(getNextStatus(status)!).label : 'Complete'}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      <Modal isOpen={!!viewEnquiry} onClose={() => setViewEnquiry(null)} title="Enquiry Record" size="lg">
        {viewEnquiry && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-[#0d1117] p-4 rounded-lg border border-[#30363d]">
              <div>
                <label className="text-xs font-semibold text-gray-400">Lead Source</label>
                <p className="text-sm font-semibold text-white mt-0.5">{viewEnquiry.source}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400">Status Stage</label>
                <div className="mt-1">
                  <Badge variant={getStatusConfig(viewEnquiry.status).color}>
                    {getStatusConfig(viewEnquiry.status).label}
                  </Badge>
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-400">Equipment Requirement</label>
                <p className="text-sm font-medium text-gray-200 mt-0.5">{viewEnquiry.enquiry_type}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400">Client Organization</label>
                <p className="text-sm font-medium text-gray-200 mt-0.5">{viewEnquiry.customer?.name || 'Unassigned'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400">Enquiry Date</label>
                <p className="text-sm font-mono text-gray-300 mt-0.5">
                  {new Date(viewEnquiry.enquiry_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingEnquiry ? 'Edit Enquiry' : 'New Deal Enquiry'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Lead Source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="e.g., RFP Tender, Direct Commercial Account, Inbound"
            required
          />
          <Input
            label="Equipment Scope"
            value={formData.enquiry_type}
            onChange={(e) => setFormData({ ...formData, enquiry_type: e.target.value })}
            placeholder="e.g., Daikin Magnitude 500-Ton Chiller Retrofit"
            required
          />
          <Select
            label="Pipeline Stage"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as EnquiryStatus })}
            options={ENQUIRY_STATUSES.map(s => ({ value: s.value, label: s.label }))}
            required
          />
          <Select
            label="Client Account"
            value={formData.customer_id}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
            options={[
              { value: '', label: 'Select a corporate client...' },
              ...customers.map(c => ({ value: c.customer_id, label: c.name })),
            ]}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-[#30363d]">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingEnquiry ? 'Save Changes' : 'Create Enquiry'}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}