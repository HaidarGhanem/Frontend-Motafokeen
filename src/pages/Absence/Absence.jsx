import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserGraduate, FaCalendarCheck, FaCalendarTimes } from 'react-icons/fa';

const Absence = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubclass, setSelectedSubclass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [absentStudents, setAbsentStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [subclasses, setSubclasses] = useState([]);
  const [filteredSubclasses, setFilteredSubclasses] = useState([]);

  const fetchOptions = async () => {
    try {
      const response = await fetch('http://localhost:3000/dashboard/students/options');
      const data = await response.json();
      if (data.success) {
        setClasses(data.data.classes);
        const allSubclasses = data.data.classes.flatMap(cls => cls.subclasses || []);
        setSubclasses(allSubclasses);
      } else {
        throw new Error(data.message || 'Failed to fetch options');
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Error fetching options: ${err.message}`);
    }
  };

  const fetchStudents = async () => {
    if (!selectedSubclass) return;
    setLoading(true);
    setError(null);
    try {
      const subclassObj = subclasses.find(s => s._id === selectedSubclass);
      const classObj = classes.find(c => c._id === selectedClass);
      if (!subclassObj || !classObj) throw new Error('Invalid class or subclass selection');

      const response = await fetch('http://localhost:3000/dashboard/absence/get-subclass-students', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ class: classObj.name, subclass: subclassObj.name })
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to fetch students');

      setAllStudents(data.data);
      setAbsentStudents([]);
    } catch (err) {
      setError(err.message);
      toast.error(`Error fetching students: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      const selectedClassObj = classes.find(c => c._id === selectedClass);
      setFilteredSubclasses(selectedClassObj?.subclasses || []);
      setSelectedSubclass('');
      setAllStudents([]);
    } else {
      setFilteredSubclasses([]);
      setSelectedSubclass('');
      setAllStudents([]);
    }
  }, [selectedClass, classes]);

  useEffect(() => {
    if (selectedSubclass) {
      fetchStudents();
    } else {
      setAllStudents([]);
    }
  }, [selectedSubclass]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass || !selectedSubclass) return toast.error('Please select both class and subclass');

    try {
      const subclassObj = subclasses.find(s => s._id === selectedSubclass);
      const classObj = classes.find(c => c._id === selectedClass);
      if (!subclassObj || !classObj) throw new Error('Invalid class or subclass selection');

      const response = await fetch('http://localhost:3000/dashboard/absence/mark-attendance', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          class: classObj.name,
          subclass: subclassObj.name,
          date,
          absentStudentIds: absentStudents,
          description
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Attendance marking failed');

      toast.success('Attendance marked successfully!');
      setSelectedClass('');
      setSelectedSubclass('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setAbsentStudents([]);
      setAllStudents([]);
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const toggleAbsence = (studentId) => {
    setAbsentStudents(prev => prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]);
  };

  return (
    <div className='flex'>
      <SideBar />
      <div className='mt-[120px] ml-10 w-full pr-10 flex-1'>
        <div className='bg-[#FAF9FC] p-8 rounded-xl shadow-md mb-16'>
          <h2 className='text-2xl font-bold text-[#40277E] mb-2'>Mark Attendance</h2>
          <p className='text-sm text-[#666] mb-6'>Select class and subclass to mark student attendance</p>
          <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div>
              <label className='form-label'>Class</label>
              <select className='form-input' value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} required>
                <option value=''>Select Class</option>
                {classes.map(cls => (<option key={cls._id} value={cls._id}>{cls.name}</option>))}
              </select>
            </div>
            <div>
              <label className='form-label'>Subclass</label>
              <select className='form-input' value={selectedSubclass} onChange={(e) => setSelectedSubclass(e.target.value)} required disabled={!selectedClass}>
                <option value=''>Select Subclass</option>
                {filteredSubclasses.map(sub => (<option key={sub._id} value={sub._id}>{sub.name}</option>))}
              </select>
            </div>
            <div>
              <label className='form-label'>Date</label>
              <input className='form-input' type='date' value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className='col-span-3'>
              <label className='form-label'>Description</label>
              <input className='form-input w-full' type='text' placeholder='Optional description' value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className='col-span-3'>
              <button type='submit' className='bg-[#40277E] hover:bg-[#5b3ea4] text-white px-6 py-2 rounded-lg transition-all duration-200'>Submit</button>
            </div>
          </form>
        </div>

        {selectedSubclass && (
          <div className='bg-[#FAF9FC] p-8 rounded-xl shadow-md'>
            <h2 className='text-2xl font-bold text-[#40277E] mb-2'>Students List</h2>
            <p className='text-sm text-[#666] mb-6'>Mark students as absent or present</p>
            {loading ? (
              <p>Loading students...</p>
            ) : error ? (
              <p className='text-red-600'>{error}</p>
            ) : allStudents.length > 0 ? (
              <div className='flex flex-col gap-4'>
                {allStudents.map((student) => (
                  <div key={student._id} className='bg-white border border-[#E6E6E6] p-4 rounded-lg flex justify-between items-center'>
                    <div className='flex items-center gap-4'>
                      <FaUserGraduate className='text-[#40277E] text-3xl' />
                      <div className='text-sm text-[#333]'>
                        <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
                        <p><strong>ID:</strong> {student.identifier}</p>
                      </div>
                    </div>
                    <button
                      type='button'
                      onClick={() => toggleAbsence(student.identifier)}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${absentStudents.includes(student.identifier) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                    >
                      {absentStudents.includes(student.identifier) ? (
                        <><FaCalendarTimes className='inline-block mr-2' /> Mark as Present</>
                      ) : (
                        <><FaCalendarCheck className='inline-block mr-2' /> Mark as Absent</>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No students found in this subclass</p>
            )}
          </div>
        )}
      </div>
      <ToastContainer position='bottom-right' autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Absence;