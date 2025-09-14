import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrophy, FaUserEdit } from 'react-icons/fa';
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

  const inputClass = 'form-input rounded-xl border border-gray-300 px-3 py-2 w-full';
  const labelClass = 'form-label text-sm font-semibold text-[#535353]';
  const sectionClass = 'bg-[#FAF9FC] p-6 rounded-2xl shadow-md w-full';

  // Fetch Olympics
  const fetchOlympics = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/olympics/all');
      if (!res.ok) throw new Error('Failed to fetch Olympic records');
      const data = await res.json();
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
    setName('');
    setClassName('');
    setSubject('');
    setLevel('');
    setNextDate('');
    setTeacher('');
    setAchievements('');
    setSkills('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/olympics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          class: className,
          subject,
          level,
          nextdate: nextDate,
          teacher,
          achievements: achievements.split(',').map(a => a.trim()).filter(Boolean),
          skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to create record');
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
      const res = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/olympics/${editingOlympic._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          class: editClass,
          subject: editSubject,
          level: editLevel,
          nextdate: editNextDate,
          teacher: editTeacher,
          achievements: editAchievements.split(',').map(a => a.trim()).filter(Boolean),
          skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error('Failed to update record');
      toast.success('Olympic record updated!');
      setEditingOlympic(null);
      fetchOlympics();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/olympics/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete record');
      toast.success('Record deleted');
      fetchOlympics();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="flex flex-col gap-12 w-full px-8 mt-32 flex-1">
        {/* Create Form */}
        <section className={sectionClass}>
          <h1 className="text-3xl font-bold text-[#40277E] mb-1">Create Olympic Record</h1>
          <p className="text-sm text-[#383838] mb-6">Enter details to create a new Olympic record</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {[
              ['Name', name, setName, true],
              ['Class', className, setClassName, true],
              ['Subject', subject, setSubject, true],
              ['Level', level, setLevel, false],
              ['Next Date', nextDate, setNextDate, false, 'date'],
              ['Teacher', teacher, setTeacher, false],
            ].map(([label, value, setter, required, type], i) => (
              <div key={i}>
                <label className={labelClass}>{label}:</label>
                <input
                  type={type || 'text'}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  required={required}
                  className={inputClass}
                />
              </div>
            ))}

            {/* Achievements */}
            <div className="col-span-2">
              <label className={labelClass}>Achievements:</label>
              <textarea
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                rows={3}
                placeholder="Separate achievements with commas"
                className={inputClass + ' resize-none'}
              />
            </div>

            {/* Skills */}
            <div className="col-span-2">
              <label className={labelClass}>Skills:</label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows={3}
                placeholder="Separate skills with commas"
                className={inputClass + ' resize-none'}
              />
            </div>

            <button
              type="submit"
              className="col-span-2 w-fit px-6 py-2 rounded-xl bg-[#40277E] text-white font-semibold hover:bg-[#321f6e]"
            >
              Create Record
            </button>
          </form>
        </section>

        {/* Records Display */}
        <section className={sectionClass}>
          <h1 className="text-3xl font-bold text-[#40277E] mb-2">Olympics Control Panel</h1>
          <p className="text-sm text-[#383838] mb-6">Manage Olympic records - Edit or Delete</p>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allOlympics.map((olympic) => (
                <div
                  key={olympic._id}
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-200"
                >
                  {editingOlympic?._id === olympic._id ? (
                    // EDIT FORM
                    <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          ['Name', editName, setEditName],
                          ['Class', editClass, setEditClass],
                          ['Subject', editSubject, setEditSubject],
                          ['Level', editLevel, setEditLevel],
                          ['Next Date', editNextDate, setEditNextDate, 'date'],
                          ['Teacher', editTeacher, setEditTeacher],
                        ].map(([label, value, setter, type], i) => (
                          <div key={i}>
                            <label className={labelClass}>{label}:</label>
                            <input
                              type={type || 'text'}
                              value={value}
                              onChange={(e) => setter(e.target.value)}
                              required={['Name','Class','Subject'].includes(label)}
                              className={inputClass}
                            />
                          </div>
                        ))}

                        {/* Achievements */}
                        <div className="col-span-2">
                          <label className={labelClass}>Achievements:</label>
                          <textarea
                            value={editAchievements}
                            onChange={(e) => setEditAchievements(e.target.value)}
                            rows={3}
                            placeholder="Separate achievements with commas"
                            className={inputClass + ' resize-none'}
                          />
                        </div>

                        {/* Skills */}
                        <div className="col-span-2">
                          <label className={labelClass}>Skills:</label>
                          <textarea
                            value={editSkills}
                            onChange={(e) => setEditSkills(e.target.value)}
                            rows={3}
                            placeholder="Separate skills with commas"
                            className={inputClass + ' resize-none'}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-2">
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all">
                          Save
                        </button>
                        <button type="button" onClick={() => setEditingOlympic(null)} className="px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-all">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // DISPLAY CARD
                    <>
                      <div className="mb-4">
                        <h2 className="text-xl font-bold text-[#40277E] mb-1">{olympic.name}</h2>
                        <p className="text-sm text-gray-600"><strong>Class:</strong> {olympic.class}</p>
                        <p className="text-sm text-gray-600"><strong>Subject:</strong> {olympic.subject}</p>
                        {olympic.level && <p className="text-sm text-gray-600"><strong>Level:</strong> {olympic.level}</p>}
                        {olympic.nextdate && <p className="text-sm text-gray-600"><strong>Next Date:</strong> {new Date(olympic.nextdate).toLocaleDateString()}</p>}
                        {olympic.teacher && <p className="text-sm text-gray-600"><strong>Teacher:</strong> {olympic.teacher}</p>}
                      </div>

                      {olympic.achievements?.length > 0 && (
                        <div className="mb-3">
                          <h3 className="text-sm font-semibold text-gray-700 mb-1">Achievements:</h3>
                          <div className="flex flex-wrap gap-2">
                            {olympic.achievements.map((a, i) => (
                              <span key={i} className="bg-[#E8E6F3] text-[#40277E] text-xs px-3 py-1 rounded-full break-words">{a}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {olympic.skills?.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-700 mb-1">Skills:</h3>
                          <div className="flex flex-wrap gap-2">
                            {olympic.skills.map((s, i) => (
                              <span key={i} className="bg-[#FFF4E5] text-[#BF5F00] text-xs px-3 py-1 rounded-full break-words">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-3 mt-2">
                        <button onClick={() => handleUpdate(olympic)} className="p-2 bg-[#E0E0FF] hover:bg-[#CFCFFF] rounded-xl transition-all">
                          <FaUserEdit className="text-[#303972] text-lg" />
                        </button>
                        <button onClick={() => handleDelete(olympic._id)} className="p-2 bg-[#FFEAEA] hover:bg-[#FFCECE] rounded-xl transition-all">
                          <MdDeleteForever className="text-[#BF0000] text-lg" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default Olympic;
