import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notifications = () => {
  const [classes, setClasses] = useState([]);
  const [subclasses, setSubclasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // all students in all classes

  const [className, setClassName] = useState('');
  const [subclassName, setSubclassName] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectAllSubclass, setSelectAllSubclass] = useState(false);
  const [selectAllStudents, setSelectAllStudents] = useState(false);

  const API_BASE = 'https://backend-motafokeen-ajrd.onrender.com/dashboard';

  // ---------- Fetch Classes ----------
  const fetchClasses = async () => {
    try {
      const res = await fetch(`${API_BASE}/classes`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch classes');
      setClasses(data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ---------- Fetch Subclasses ----------
  const fetchSubclasses = async (className) => {
    try {
      const cls = classes.find(c => c.name === className);
      if (!cls) return setSubclasses([]);
      const res = await fetch(`${API_BASE}/subclasses/by-class/${cls._id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSubclasses(data.data);
    } catch (err) {
      toast.error(err.message);
      setSubclasses([]);
    }
  };

  // ---------- Fetch Students ----------
  const fetchStudents = async (cls, sub) => {
    try {
      const clsObj = classes.find(c => c.name === cls);
      const subObj = subclasses.find(s => s.name === sub);
      if (!clsObj || !subObj) return;
      const res = await fetch(`${API_BASE}/students?classId=${clsObj._id}&subclassId=${subObj._id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStudents(data.data || []);
    } catch (err) {
      toast.error(err.message);
      setStudents([]);
    }
  };

  // ---------- Fetch All Students ----------
  const fetchAllStudents = async () => {
    try {
      const res = await fetch(`${API_BASE}/students`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAllStudents(data.data || []);
    } catch (err) {
      toast.error(err.message);
      setAllStudents([]);
    }
  };

  // ---------- Handle Notification Send ----------
  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!title || !body) {
      toast.error('Title and body are required');
      return;
    }
    if (!selectedStudents.length) {
      toast.error('Select at least one student');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/notifications/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentIds: selectedStudents,
          title,
          body
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send notification');

      toast.success(`Notifications sent: ${data.successCount} success, ${data.failureCount} failed`);

      // Reset form
      setTitle('');
      setBody('');
      setSelectedStudents([]);
      setSelectAllSubclass(false);
      setSelectAllStudents(false);
    } catch (err) {
      toast.error(err.message || 'Error sending notification');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Handle Select All Subclass ----------
  const handleSelectAllSubclass = () => {
    setSelectAllSubclass(!selectAllSubclass);
    if (!selectAllSubclass) {
      const subclassStudentIds = students.map(s => s._id);
      setSelectedStudents(prev => [...new Set([...prev, ...subclassStudentIds])]);
    } else {
      const subclassStudentIds = students.map(s => s._id);
      setSelectedStudents(prev => prev.filter(id => !subclassStudentIds.includes(id)));
    }
  };

  // ---------- Handle Select All Students ----------
  const handleSelectAllStudents = () => {
    setSelectAllStudents(!selectAllStudents);
    if (!selectAllStudents) {
      const allStudentIds = allStudents.map(s => s._id);
      setSelectedStudents(allStudentIds);
    } else {
      setSelectedStudents([]);
    }
  };

  // ---------- Handle Individual Checkbox ----------
  const handleStudentCheckbox = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(prev => prev.filter(sid => sid !== id));
    } else {
      setSelectedStudents(prev => [...prev, id]);
    }
  };

  // ---------- Hooks ----------
  useEffect(() => fetchClasses(), []);
  useEffect(() => { if (className) fetchSubclasses(className); }, [className]);
  useEffect(() => { if (className && subclassName) fetchStudents(className, subclassName); }, [className, subclassName]);
  useEffect(() => fetchAllStudents(), []);

  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1 mt-[120px] ml-10 w-full pr-10 flex flex-col gap-10">

        <section className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-[#40277E]">Send Notification</h1>
          <span className="text-sm text-[#383838]">Send notifications to one or more students</span>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl">
          <form onSubmit={handleSendNotification} className="flex flex-col gap-6">

            {/* Class & Subclass */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[160px] flex flex-col">
                <label>Class:</label>
                <select value={className} onChange={e => setClassName(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-[160px] flex flex-col">
                <label>Subclass:</label>
                <select value={subclassName} onChange={e => setSubclassName(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select Subclass</option>
                  {subclasses.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
            </div>

            {/* Students */}
            <div className="flex flex-col gap-2">
              <label>Students:</label>
              <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={selectAllSubclass} onChange={handleSelectAllSubclass} />
                  Select All in Subclass
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={selectAllStudents} onChange={handleSelectAllStudents} />
                  Select All Students
                </label>
              </div>
              <div className="flex flex-col max-h-64 overflow-y-auto border rounded-lg px-3 py-2 gap-1">
                {students.map(s => (
                  <label key={s._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(s._id)}
                      onChange={() => handleStudentCheckbox(s._id)}
                    />
                    {s.firstName} {s.lastName} ({s.identifier})
                  </label>
                ))}
              </div>
            </div>

            {/* Notification title/body */}
            <div className="flex flex-col gap-2">
              <label>Title:</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="flex flex-col gap-2">
              <label>Body:</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" rows={4}></textarea>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className={`self-start flex items-center gap-2 px-6 py-2 rounded-lg bg-[#40277E] text-white font-semibold shadow-md hover:bg-[#6B4EFF] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? 'Sending...' : 'Send Notification'}
            </button>

          </form>
        </section>
      </main>

      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default Notifications;
