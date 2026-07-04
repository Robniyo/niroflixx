import { useState } from 'react';
import { Calendar, Download } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const r = await api.get('/reports/all', { params: { date } });
      setData(r.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-h4 font-bold text-secondary-900">Attendance Reports</h1><p className="text-secondary-500 text-body-sm mt-1">View all attendance across classes</p></div>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label className="block text-sm font-medium mb-1">Select Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
          </div>
          <Button onClick={fetchReport} isLoading={loading} leftIcon={<Calendar className="w-4 h-4" />}>Load Report</Button>
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border p-4 text-center"><p className="text-h3 font-bold text-secondary-900">{data.summary.total}</p><p className="text-body-sm text-secondary-500">Total Records</p></div>
            <div className="bg-white rounded-xl border p-4 text-center"><p className="text-h3 font-bold text-success">{data.summary.present}</p><p className="text-body-sm text-secondary-500">Present</p></div>
            <div className="bg-white rounded-xl border p-4 text-center"><p className="text-h3 font-bold text-danger">{data.summary.absent}</p><p className="text-body-sm text-secondary-500">Absent</p></div>
            <div className="bg-white rounded-xl border p-4 text-center"><p className="text-h3 font-bold text-accent-600">{data.summary.late}</p><p className="text-body-sm text-secondary-500">Late</p></div>
          </div>

          {Object.keys(data.grouped).length === 0 ? (
            <div className="bg-white rounded-xl border p-8 text-center"><p className="text-secondary-500">No attendance records for this date.</p></div>
          ) : (
            Object.entries(data.grouped).map(([className, dates]: any) => (
              <div key={className} className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-lg mb-4">{className}</h3>
                {Object.entries(dates).map(([d, records]: any) => (
                  <div key={d} className="mb-4">
                    <h4 className="text-sm font-medium text-secondary-700 mb-2">{new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                    <div className="space-y-1">
                      {records.map((r: any) => (
                        <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary-50 text-sm">
                          <span>{r.user?.firstName} {r.user?.lastName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-caption font-medium ${
                            r.status === 'PRESENT' ? 'bg-success-light text-success-dark' : r.status === 'ABSENT' ? 'bg-danger-light text-danger-dark' : 'bg-accent-50 text-accent-700'
                          }`}>{r.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}