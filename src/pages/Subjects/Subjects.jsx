import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBook } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';

const Subjects = () => {
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('1');
  const [className, setClassName] = useState('');
  const [newSubject, setNewSubject] = useState(null);
  const [allSubjects, setAllSubjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSemester, setEditSemester] = useState('1');
  const [editClass, setEditClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 18;

  const semesters = [
    { value: '1', label: 'الفصل الأول' },
    { value: '2', label: 'الفصل الثاني' }
  ];

  const fetchClasses = async () => {
    try {
      const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/subjects/classes');
      const data = await response.json();
      if (data.success) {
        setClasses(data.data);
        if (data.data.length > 0 && !className) {
          setClassName(data.data[0].name);
        }
      }
    } catch (err) {
      toast.error('Failed to fetch classes');
    }
  };

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/subjects');
      const data = await response.json();
      if (data.success) {
        setAllSubjects(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch subjects');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, semester, class: className })
      });
      const data = await response.json();
      if (data.success) {
        setNewSubject(data.data);
        setName('');
        setSemester('1');
        toast.success(data.message);
        fetchSubjects();
      } else {
        toast.error(data.message || 'Failed to create subject');
      }
    } catch (err) {
      toast.error('An error occurred during subject creation');
    }
  };

  const handleUpdate = (subject) => {
    setEditingSubject(subject);
    setEditName(subject.name);
    setEditSemester(subject.semester || '1');
    setEditClass(subject.classId?.name || (classes.length > 0 ? classes[0].name : ''));
  };

  const handleUpdateSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editingSubject) return;
    try {
      const response = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/subjects/${editingSubject._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, semester: editSemester, class: editClass })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setEditingSubject(null);
        fetchSubjects();
      } else {
        toast.error(data.message || 'Failed to update subject');
      }
    } catch (err) {
      toast.error('An error occurred during update');
    }
  };

  const handleDelete = async (subjectId) => {
    try {
      const response = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/subjects/${subjectId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchSubjects();
      } else {
        toast.error(data.message || 'Failed to delete subject');
      }
    } catch (err) {
      toast.error('An error occurred during deletion');
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  const filteredSubjects = (allSubjects || []).filter(subject => {
    const matchesClass = selectedClassFilter ? (subject.classId?.name === selectedClassFilter) : true;
    const matchesSemester = selectedSemesterFilter ? (String(subject.semester) === String(selectedSemesterFilter)) : true;
    return matchesClass && matchesSemester;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSubjects.length / rowsPerPage);
  const paginatedSubjects = filteredSubjects.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className='flex'>
      <SideBar />
      <div className='mt-[120px] ml-10 w-full pr-10 flex-1'>

        {/* Create Subject */}
        <div className='bg-[#FAF9FC] p-8 rounded-xl shadow-md mb-16'>
          <h2 className='text-2xl font-bold text-[#40277E] mb-2'>Create Subject</h2>
          <p className='text-sm text-[#666] mb-6'>Fill all fields to create a new subject</p>
          <form onSubmit={handleSubmit} className='grid grid-cols-3 gap-6'>
            <div>
              <label className='form-label'>Name</label>
              <input className='form-input' type='text' value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className='form-label'>Semester</label>
              <select className='form-input' value={semester} onChange={(e) => setSemester(e.target.value)} required>
                {semesters.map(sem => (<option key={sem.value} value={sem.value}>{sem.label}</option>))}
              </select>
            </div>
            <div>
              <label className='form-label'>Class</label>
              <select className='form-input' value={className} onChange={(e) => setClassName(e.target.value)} required>
                {classes.map(cls => (<option key={cls._id} value={cls.name}>{cls.name}</option>))}
              </select>
            </div>
            <div className='col-span-3'>
              <button type='submit' className='bg-[#40277E] hover:bg-[#5b3ea4] text-white px-6 py-2 rounded-lg transition-all duration-200'>
                Create
              </button>
            </div>
          </form>
        </div>

        {/* Subjects Control */}
        <div className='bg-[#FAF9FC] p-8 rounded-xl shadow-md'>
          <h2 className='text-2xl font-bold text-[#40277E] mb-2'>Subjects Control Panel</h2>
          <p className='text-sm text-[#666] mb-6'>Manage, Edit, or Delete subjects</p>

          {/* Filters */}
          <div className='mb-6 flex flex-wrap gap-6'>
            <div>
              <label className='form-label mr-4'>Filter by Class</label>
              <select className='form-input w-[200px]' value={selectedClassFilter} onChange={(e) => { setSelectedClassFilter(e.target.value); setCurrentPage(1); }}>
                <option value=''>All Classes</option>
                {classes.map(cls => (<option key={cls._id} value={cls.name}>{cls.name}</option>))}
              </select>
            </div>
            <div>
              <label className='form-label mr-4'>Filter by Semester</label>
              <select className='form-input w-[200px]' value={selectedSemesterFilter} onChange={(e) => { setSelectedSemesterFilter(e.target.value); setCurrentPage(1); }}>
                <option value=''>All Semesters</option>
                {semesters.map(sem => (<option key={sem.value} value={sem.value}>{sem.label}</option>))}
              </select>
            </div>
          </div>

          {/* Subjects Table */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className='text-red-600'>{error}</p>
          ) : (
            <div className='overflow-x-auto'>
              <div className='mb-3 text-sm text-gray-600'>Showing {paginatedSubjects.length} of {filteredSubjects.length} filtered subjects ({allSubjects?.length || 0} total)</div>
              <table className='w-full border border-gray-200 text-sm rounded-lg'>
                <thead className='bg-[#40277E] text-white'>
                  <tr>
                    <th className='p-3 text-left'>Name</th>
                    <th className='p-3 text-left'>Semester</th>
                    <th className='p-3 text-left'>Class</th>
                    <th className='p-3 text-center'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSubjects.map(subject => (
                    <tr key={subject._id} className='border-b hover:bg-gray-50 transition'>
                      {editingSubject && editingSubject._id === subject._id ? (
                        <>
                          <td className='p-3'>
                            <input className='form-input' value={editName} onChange={(e) => setEditName(e.target.value)} />
                          </td>
                          <td className='p-3'>
                            <select className='form-input' value={editSemester} onChange={(e) => setEditSemester(e.target.value)}>
                              {semesters.map(sem => (<option key={sem.value} value={sem.value}>{sem.label}</option>))}
                            </select>
                          </td>
                          <td className='p-3'>
                            <select className='form-input' value={editClass} onChange={(e) => setEditClass(e.target.value)}>
                              {classes.map(cls => (<option key={cls._id} value={cls.name}>{cls.name}</option>))}
                            </select>
                          </td>
                          <td className='p-3 flex justify-center gap-2'>
                            <button onClick={handleUpdateSubmit} className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600'>Save</button>
                            <button onClick={() => setEditingSubject(null)} className='bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500'>Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className='p-3 flex items-center gap-2'><FaBook className='text-[#6A46A8]' /> {subject.name}</td>
                          <td className='p-3'>{subject.semester}</td>
                          <td className='p-3'>{subject.classId?.name || 'N/A'}</td>
                          <td className='p-3 flex justify-center gap-4'>
                            <button onClick={() => handleUpdate(subject)}><FaEdit className='text-[#40277E] text-lg hover:scale-110 transition' /></button>
                            <button onClick={() => handleDelete(subject._id)}><MdDeleteForever className='text-[#FB7D5B] text-lg hover:scale-110 transition' /></button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className='mt-4 flex justify-center items-center gap-3'>
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className='px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50'>Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => handlePageChange(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-[#40277E] text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{i + 1}</button>
                  ))}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className='px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50'>Next</button>
                </div>
              )}

              {filteredSubjects.length === 0 && (
                <div className='mt-4 text-center text-gray-600'>No subjects match the selected filters.</div>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position='bottom-right' autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Subjects;
