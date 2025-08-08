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

  const semesters = [
    { value: '1', label: 'الفصل الأول' },
    { value: '2', label: 'الفصل الثاني' }
  ];

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:3000/dashboard/subjects/classes');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/dashboard/subjects', {
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

  const fetchSubjects = async () => {
    try {
      let url = 'http://localhost:3000/dashboard/subjects';
      if (selectedClassFilter) {
        url += `?class=${selectedClassFilter}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setAllSubjects(data.data);
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

  const handleUpdate = (subject) => {
    setEditingSubject(subject);
    setEditName(subject.name);
    setEditSemester(subject.semester || '1');
    setEditClass(subject.classId?.name || (classes.length > 0 ? classes[0].name : ''));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/dashboard/subjects/${editingSubject._id}`, {
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
      const response = await fetch(`http://localhost:3000/dashboard/subjects/${subjectId}`, {
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
  }, [selectedClassFilter]);

  return (
    <div className='flex'>
      <SideBar />
      <div className='mt-[120px] ml-10 w-full pr-10'>
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

        <div className='bg-[#FAF9FC] p-8 rounded-xl shadow-md'>
          <h2 className='text-2xl font-bold text-[#40277E] mb-2'>Subjects Control Panel</h2>
          <p className='text-sm text-[#666] mb-6'>Manage, Edit, or Delete subjects</p>
          <div className='mb-6'>
            <label className='form-label mr-4'>Filter by Class</label>
            <select className='form-input w-[200px]' value={selectedClassFilter} onChange={(e) => setSelectedClassFilter(e.target.value)}>
              <option value=''>All Classes</option>
              {classes.map(cls => (<option key={cls._id} value={cls.name}>{cls.name}</option>))}
            </select>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className='text-red-600'>{error}</p>
          ) : (
            <div className='flex flex-col gap-4'>
              {allSubjects?.map(subject => (
                <div key={subject._id} className='bg-white border border-[#E6E6E6] p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center'>
                  {editingSubject && editingSubject._id === subject._id ? (
                    <form onSubmit={handleUpdateSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
                      <input className='form-input' type='text' value={editName} onChange={(e) => setEditName(e.target.value)} required />
                      <select className='form-input' value={editSemester} onChange={(e) => setEditSemester(e.target.value)} required>
                        {semesters.map(sem => (<option key={sem.value} value={sem.value}>{sem.label}</option>))}
                      </select>
                      <select className='form-input' value={editClass} onChange={(e) => setEditClass(e.target.value)} required>
                        {classes.map(cls => (<option key={cls._id} value={cls.name}>{cls.name}</option>))}
                      </select>
                      <div className='col-span-2 flex gap-2'>
                        <button type='submit' className='bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded'>Save</button>
                        <button type='button' onClick={() => setEditingSubject(null)} className='bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded'>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                      <div className='flex items-center gap-4'>
                        <FaBook className='text-[#6A46A8] text-3xl' />
                        <div className='text-sm text-[#333]'>
                          <p><strong>Name:</strong> {subject.name}</p>
                          <p><strong>Semester:</strong> {subject.semester}</p>
                          <p><strong>Class:</strong> {subject.classId?.name || 'N/A'}</p>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <button onClick={() => handleUpdate(subject)}><FaEdit className='text-[#40277E] text-xl hover:scale-110 transition' /></button>
                        <button onClick={() => handleDelete(subject._id)}><MdDeleteForever className='text-[#FB7D5B] text-xl hover:scale-110 transition' /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position='bottom-right' autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Subjects;
