import { useState, useEffect } from 'react';
import { User, AlertCircle, CheckCircle, MapPin, Wrench, RefreshCw, ShieldAlert } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { serviceCallApi } from '../api/serviceCalls';
import { technicianApi } from '../api/technicians';
import type { ServiceCall, Technician, ServiceCallStatus } from '../types';

const statusOrder: ServiceCallStatus[] = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const getStatusColor = (status: ServiceCallStatus) => {
  const colors: Record<ServiceCallStatus, string> = {
    OPEN: 'bg-blue-950/50 text-blue-400 border-blue-800/50',
    ASSIGNED: 'bg-amber-950/50 text-amber-400 border-amber-800/50',
    IN_PROGRESS: 'bg-purple-950/50 text-purple-400 border-purple-800/50',
    RESOLVED: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50',
    CLOSED: 'bg-[#21262d] text-gray-400 border-[#30363d]',
  };
  return colors[status];
};

const getStatusIcon = (status: ServiceCallStatus) => {
  switch (status) {
    case 'OPEN': return <AlertCircle className="w-3.5 h-3.5" />;
    case 'ASSIGNED': return <User className="w-3.5 h-3.5" />;
    case 'IN_PROGRESS': return <Wrench className="w-3.5 h-3.5" />;
    case 'RESOLVED': return <CheckCircle className="w-3.5 h-3.5" />;
    case 'CLOSED': return <CheckCircle className="w-3.5 h-3.5" />;
  }
};

export function ServiceCallDispatchQueue() {
  const [serviceCalls, setServiceCalls] = useState<ServiceCall[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedCall, setDraggedCall] = useState<ServiceCall | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [callsRes, techsRes] = await Promise.all([
        serviceCallApi.getAll(),
        technicianApi.getAll(),
      ]);
      setServiceCalls(callsRes.data);
      setTechnicians(techsRes.data);
    } catch (error) {
      console.error('Failed to fetch dispatch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDragStart = (e: React.DragEvent, call: ServiceCall) => {
    setDraggedCall(call);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: ServiceCallStatus) => {
    e.preventDefault();
    if (!draggedCall || draggedCall.status === newStatus) {
      setDraggedCall(null);
      return;
    }

    try {
      await serviceCallApi.update(draggedCall.call_id, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Failed to update service call status:', error);
    } finally {
      setDraggedCall(null);
    }
  };

  const handleAssignTechnician = async (callId: string, technicianId: string) => {
    try {
      await serviceCallApi.assignTechnician(callId, technicianId);
      fetchData();
    } catch (error) {
      console.error('Failed to assign technician:', error);
    }
  };

  const callsByStatus = statusOrder.reduce((acc, status) => {
    acc[status] = serviceCalls.filter(call => call.status === status);
    return acc;
  }, {} as Record<ServiceCallStatus, ServiceCall[]>);

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4 p-2">
          <div className="h-5 bg-[#21262d] rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {statusOrder.map((_, idx) => (
              <div key={idx} className="h-64 bg-[#0d1117] rounded-lg border border-[#30363d]"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 pb-3 border-b border-[#30363d] gap-3">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-400" />
            Field Dispatch Queue
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Drag & drop service tickets across technician workflow stages
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Sync Queue
        </Button>
      </div>

      {/* Spacious 5-column grid */}
      <div className="flex md:grid md:grid-cols-5 gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {statusOrder.map((status) => (
          <div
            key={status}
            className="flex-shrink-0 w-72 md:w-auto bg-[#0d1117] rounded-lg p-3 border border-[#30363d] min-h-[380px] flex flex-col justify-between"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div>
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#30363d]">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded border ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                  {status.replace('_', ' ')}
                </span>
                <span className="text-xs font-mono font-semibold text-gray-400">
                  {callsByStatus[status]?.length || 0}
                </span>
              </div>

              {/* Ticket Cards */}
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-0.5">
                {callsByStatus[status]?.map((call) => (
                  <div
                    key={call.call_id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, call)}
                    className="bg-[#161b22] border border-[#30363d] hover:border-gray-500 rounded-lg p-3 shadow-sm transition-colors cursor-grab active:cursor-grabbing"
                  >
                    <div className="space-y-1.5">
                      <p className="font-semibold text-white text-xs tracking-tight">
                        {call.type}
                      </p>
                      <p className="text-xs text-gray-300 leading-normal line-clamp-2">
                        {call.defect_details}
                      </p>
                      
                      <div className="space-y-1 mt-2 pt-2 border-t border-[#30363d] text-[11px]">
                        {call.customer && (
                          <div className="flex items-center gap-1.5 text-gray-300 truncate">
                            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{call.customer.name}</span>
                          </div>
                        )}
                        {call.technician ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-medium truncate">
                            <User className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{call.technician.name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-400">
                            <ShieldAlert className="w-3 h-3 flex-shrink-0" />
                            <span>Unassigned Technician</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {status === 'OPEN' && technicians.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-[#30363d]">
                        <select
                          onChange={(e) => handleAssignTechnician(call.call_id, e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-[#30363d] rounded bg-[#0d1117] text-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                          defaultValue=""
                        >
                          <option value="">+ Assign Technician...</option>
                          {technicians.map((tech) => (
                            <option key={tech.technician_id} value={tech.technician_id}>
                              {tech.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
                {(!callsByStatus[status] || callsByStatus[status].length === 0) && (
                  <div className="text-center py-10 border border-dashed border-[#30363d]/60 rounded-lg">
                    <p className="text-xs text-gray-500">No calls in stage</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}