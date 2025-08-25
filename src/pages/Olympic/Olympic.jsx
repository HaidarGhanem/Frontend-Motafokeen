import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrophy } from 'react-icons/fa';
import { FaUserEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';

const Olympic = () => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [teacher, setTeacher] = useState('');
  const [achievements, setAchievements] = useState('');
  const [skills, setSkills] = useState('');
  const [allOlympics, setAllOlympics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOlympic, setEditingOlympic] = useState(null);
  const [editName, setEditName] = useState('');
  const [editClass, setEditClass] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editLevel, setEditLevel] = useState('');
  const [editNextDate, setEditNextDate] = useState('');
  const [editTeacher, setEditTeacher] = useState('');
  const [editAchievements, setEditAchievements] = useState('');
  const [editSkills, setEditSkills] = useState('');

  const fetchOlympics = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/dashboard/olympics/all');
      if (!response.ok) throw new Error('Failed to fetch Olympic records');
      const data = await response.json();
      setAllOlympics(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOlympics();
  }, []);

  const resetForm = () => {
    setName(''); setClassName(''); setSubject('');
    setLevel(''); setNextDate(''); setTeacher('');
    setAchievements(''); setSkills('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/dashboard/olympics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, class: className, subject, level, nextdate: nextDate,
          teacher,
          achievements: achievements.split(',').map(a => a.trim()).filter(Boolean),
          skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (!response.ok) throw new Error((await response.json()).message || 'Failed to create record');
      toast.success('Olympic record created successfully!');
      resetForm();
      fetchOlympics();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdate = (olympic) => {
    setEditingOlympic(olympic);
    setEditName(olympic.name);
    setEditClass(olympic.class);
    setEditSubject(olympic.subject);
    setEditLevel(olympic.level || '');
    setEditNextDate(olympic.nextdate?.split('T')[0] || '');
    setEditTeacher(olympic.teacher || '');
    setEditAchievements(olympic.achievements?.join(', ') || '');
    setEditSkills(olympic.skills?.join(', ') || '');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/dashboard/olympics/${editingOlympic._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName, class: editClass, subject: editSubject, level: editLevel, nextdate: editNextDate,
          teacher: editTeacher,
          achievements: editAchievements.split(',').map(a => a.trim()).filter(Boolean),
          skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (!response.ok) throw new Error('Failed to update record');
      toast.success('Olympic record updated!');
      setEditingOlympic(null);
      fetchOlympics();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/dashboard/olympics/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete record');
      toast.success('Record deleted');
      fetchOlympics();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const inputClass = 'form-input rounded-xl border border-gray-300 px-3 py-2 w-full';
  const labelClass = 'form-label text-sm font-semibold text-[#535353]';
  const sectionClass = 'bg-[#FAF9FC] p-6 rounded-2xl shadow-md w-full';

  return (
    <div className="flex">
      <SideBar />
      <div className="flex flex-col gap-12 w-full px-8 mt-32 flex-1">
        {/* Create Form */}
        <section className={sectionClass}>
          <h1 className="text-3xl font-bold text-[#40277E] mb-1">Create Olympic Record</h1>
          <p className="text-sm text-[#383838] mb-6">Enter details to create a new Olympic record</p>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {[['Name', name, setName], ['Class', className, setClassName], ['Subject', subject, setSubject], 
              ['Level', level, setLevel], ['Next Date', nextDate, setNextDate], ['Teacher', teacher, setTeacher],
              ['Achievements', achievements, setAchievements], ['Skills', skills, setSkills]
            ].map(([label, value, setter], i) => (
              <div key={i}>
                <label className={labelClass}>{label}:</label>
                <input type={label === 'Next Date' ? 'date' : 'text'} value={value} onChange={(e) => setter(e.target.value)} required={['Name','Class','Subject'].includes(label)} className={inputClass} />
              </div>
            ))}
            <button type="submit" className="col-span-2 w-fit px-6 py-2 rounded-xl bg-[#40277E] text-white font-semibold hover:bg-[#321f6e]">Create Record</button>
          </form>
        </section>

        {/* Records Display */}
        <section className={sectionClass}>
          <h1 className="text-3xl font-bold text-[#40277E] mb-1">Olympics Control Panel</h1>
          <p className="text-sm text-[#383838] mb-6">Manage Olympic records - Edit or Delete</p>
          {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> :
            <div className="flex flex-col gap-4">
              {allOlympics.map((olympic) => (
                <div key={olympic._id} className="bg-white rounded-xl p-5 shadow flex flex-col gap-3">
                  {editingOlympic?._id === olympic._id ? (
                    <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-4">
                        {[['Name', editName, setEditName], ['Class', editClass, setEditClass], ['Subject', editSubject, setEditSubject],
                          ['Level', editLevel, setEditLevel], ['Next Date', editNextDate, setEditNextDate],
                          ['Teacher', editTeacher, setEditTeacher], ['Achievements', editAchievements, setEditAchievements], ['Skills', editSkills, setEditSkills]
                        ].map(([label, value, setter], i) => (
                          <div key={i}>
                            <label className={labelClass}>{label}:</label>
                            <input type={label === 'Next Date' ? 'date' : 'text'} value={value} onChange={(e) => setter(e.target.value)} required={['Name','Class','Subject'].includes(label)} className={inputClass} />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3 justify-end">
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-xl">Save</button>
                        <button onClick={() => setEditingOlympic(null)} className="px-4 py-2 bg-gray-400 text-white rounded-xl">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-start gap-4">
                        <FaTrophy className="text-[60px] text-[#303972]" />
                        <div className="text-sm text-[#383838] grid grid-cols-2 gap-x-8 gap-y-1">
                          <p><strong>Name:</strong> {olympic.name}</p>
                          <p><strong>Class:</strong> {olympic.class}</p>
                          <p><strong>Subject:</strong> {olympic.subject}</p>
                          {olympic.level && <p><strong>Level:</strong> {olympic.level}</p>}
                          {olympic.nextdate && <p><strong>Next:</strong> {new Date(olympic.nextdate).toLocaleDateString()}</p>}
                          {olympic.teacher && <p><strong>Teacher:</strong> {olympic.teacher}</p>}
                          {olympic.achievements?.length > 0 && <p><strong>Achievements:</strong> {olympic.achievements.join(', ')}</p>}
                          {olympic.skills?.length > 0 && <p><strong>Skills:</strong> {olympic.skills.join(', ')}</p>}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleUpdate(olympic)}><FaUserEdit className="text-[#303972] text-xl" /></button>
                        <button onClick={() => handleDelete(olympic._id)}><MdDeleteForever className="text-[#40277E] text-xl" /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          }
        </section>

        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    </div>
  );
};

export default Olympic;
