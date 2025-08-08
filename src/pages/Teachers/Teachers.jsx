import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Teachers.css';
import { FaUserEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { IoPower, IoPowerOutline } from 'react-icons/io5';

const Teachers = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationality, setNationality] = useState('');
  const [city, setCity] = useState('');
  const [certification, setCertification] = useState('');
  const [availability, setAvailability] = useState('');
  const [salary, setSalary] = useState('');
  const [daysOff, setDaysOff] = useState('');
  const [allTeachers, setAllTeachers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editNationality, setEditNationality] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editCertification, setEditCertification] = useState('');
  const [editAvailability, setEditAvailability] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [editDaysOff, setEditDaysOff] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:3000/dashboard/teachers/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        setAllTeachers(data.data);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch teachers');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/dashboard/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          subject,
          phone_number: phoneNumber,
          nationality,
          city,
          certification,
          availability: Number(availability),
          salary: Number(salary),
          days_off: Number(daysOff)
        })
      });
      const data = await response.json();
      if (data.success) {
        setName('');
        setSubject('');
        setPhoneNumber('');
        setNationality('');
        setCity('');
        setCertification('');
        setAvailability('');
        setSalary('');
        setDaysOff('');
        toast.success(data.message);
        fetchTeachers();
      } else {
        toast.error(data.message || 'Failed to create teacher');
      }
    } catch {
      toast.error('An error occurred during creation');
    }
  };

  const handleUpdate = (item) => {
    setEditingTeacher(item);
    setEditName(item.name);
    setEditSubject(item.subject);
    setEditPhoneNumber(item.phone_number);
    setEditNationality(item.nationality);
    setEditCity(item.city);
    setEditCertification(item.certification);
    setEditAvailability(String(item.availability));
    setEditSalary(String(item.salary));
    setEditDaysOff(String(item.days_off));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/dashboard/teachers/${editingTeacher._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          subject: editSubject,
          phone_number: editPhoneNumber,
          nationality: editNationality,
          city: editCity,
          certification: editCertification,
          availability: Number(editAvailability),
          salary: Number(editSalary),
          days_off: Number(editDaysOff)
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setEditingTeacher(null);
        fetchTeachers();
      } else {
        toast.error(data.message || 'Failed to update teacher');
      }
    } catch {
      toast.error('An error occurred during update');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://localhost:3000/dashboard/teachers/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchTeachers();
      } else {
        toast.error(data.message || 'Failed to delete teacher');
      }
    } catch {
      toast.error('An error occurred during deletion');
    }
  };

  const handleActivate = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://localhost:3000/dashboard/teachers/active/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchTeachers();
      } else {
        toast.error(data.message || 'Failed to activate teacher');
      }
    } catch {
      toast.error('An error occurred during activation');
    }
  };

  const handleDeactivate = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://localhost:3000/dashboard/teachers/deactivate/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchTeachers();
      } else {
        toast.error(data.message || 'Failed to deactivate teacher');
      }
    } catch {
      toast.error('An error occurred during deactivation');
    }
  };

  const handleCardClick = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  return (
    <div className='flex'>
      <SideBar />
      <div className='mt-[120px] ml-10 w-full pr-10'>
        {/* Create Teacher Form */}
        <div className='bg-[#FAF9FC] p-8 rounded-xl shadow-md mb-16'>
          <h2 className='text-2xl font-bold text-[#40277E] mb-2'>Create Teacher</h2>
          <p className='text-sm text-[#666] mb-6'>Fill all fields to add a new teacher</p>
          <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-6'>
            <div>
              <label className='form-label'>Name</label>
              <input className='form-input' type='text' value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className='form-label'>Subject</label>
              <input className='form-input' type='text' value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div>
              <label className='form-label'>Phone Number</label>
              <input className='form-input' type='text' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <div>
              <label className='form-label'>Nationality</label>
              <input className='form-input' type='text' value={nationality} onChange={(e) => setNationality(e.target.value)} />
            </div>
            <div>
              <label className='form-label'>City</label>
              <input className='form-input' type='text' value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <label className='form-label'>Certification</label>
              <input className='form-input' type='text' value={certification} onChange={(e) => setCertification(e.target.value)} />
            </div>
            <div>
              <label className='form-label'>Availability</label>
              <input className='form-input' type='number' value={availability} onChange={(e) => setAvailability(e.target.value)} />
            </div>
            <div>
              <label className='form-label'>Salary</label>
              <input className='form-input' type='number' value={salary} onChange={(e) => setSalary(e.target.value)} />
            </div>
            <div>
              <label className='form-label'>Days Off</label>
              <input className='form-input' type='number' value={daysOff} onChange={(e) => setDaysOff(e.target.value)} />
            </div>
            <div className='col-span-2'>
              <button type='submit' className='bg-[#40277E] hover:bg-[#5b3ea4] text-white px-6 py-2 rounded-lg transition-all duration-200'>
                Create
              </button>
            </div>
          </form>
        </div>

        {/* Teachers List */}
        <div className='bg-[#FAF9FC] p-8 rounded-xl shadow-md'>
          <h2 className='text-2xl font-bold text-[#40277E] mb-2'>Teachers Control Panel</h2>
          <p className='text-sm text-[#666] mb-6'>Manage, Edit, Activate/Deactivate, or Delete records</p>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className='text-red-600'>{error}</p>
          ) : (
            <div className='flex flex-col gap-4'>
              {allTeachers?.map((item) => (
                <div
                  key={item._id}
                  className='bg-white shadow-sm border border-[#E6E6E6] p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer'
                  onClick={() => handleCardClick(item)}
                >
                  {editingTeacher && editingTeacher._id === item._id ? (
                    <form onSubmit={handleUpdateSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
                      <input className='form-input' type='text' value={editName} onChange={(e) => setEditName(e.target.value)} required />
                      <input className='form-input' type='text' value={editSubject} onChange={(e) => setEditSubject(e.target.value)} required />
                      <input className='form-input' type='text' value={editPhoneNumber} onChange={(e) => setEditPhoneNumber(e.target.value)} />
                      <input className='form-input' type='text' value={editNationality} onChange={(e) => setEditNationality(e.target.value)} />
                      <input className='form-input' type='text' value={editCity} onChange={(e) => setEditCity(e.target.value)} />
                      <input className='form-input' type='text' value={editCertification} onChange={(e) => setEditCertification(e.target.value)} />
                      <input className='form-input' type='number' value={editAvailability} onChange={(e) => setEditAvailability(e.target.value)} />
                      <input className='form-input' type='number' value={editSalary} onChange={(e) => setEditSalary(e.target.value)} />
                      <input className='form-input' type='number' value={editDaysOff} onChange={(e) => setEditDaysOff(e.target.value)} />
                      <div className='col-span-2 flex gap-2'>
                        <button type='submit' className='bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded'>Save</button>
                        <button type='button' onClick={(e) => { e.stopPropagation(); setEditingTeacher(null); }} className='bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded'>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center'>
                      <div className='flex items-center gap-4'>
                        <div className='text-sm text-[#333]'>
                          <p><strong>Name:</strong> {item.name}</p>
                          <p><strong>Subject:</strong> {item.subject}</p>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <button onClick={(e) => { e.stopPropagation(); handleUpdate(item); }}>
                          <FaUserEdit className='text-[#40277E] text-xl hover:scale-110 transition' />
                        </button>
                        <button onClick={(e) => handleDelete(item._id, e)}>
                          <MdDeleteForever className='text-[#FB7D5B] text-xl hover:scale-110 transition' />
                        </button>
                        {item.availability === 1 ? (
                          <button onClick={(e) => handleDeactivate(item._id, e)}>
                            <IoPower className='text-green-500 text-xl hover:scale-110 transition' />
                          </button>
                        ) : (
                          <button onClick={(e) => handleActivate(item._id, e)}>
                            <IoPowerOutline className='text-gray-500 text-xl hover:scale-110 transition' />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedTeacher && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white p-8 rounded-xl shadow-md w-11/12 md:w-1/2 lg:w-1/3 relative'>
            <button onClick={closeModal} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl'>&times;</button>
            <h2 className='text-2xl font-bold text-[#40277E] mb-4'>Teacher Details</h2>
            <div className='grid grid-cols-1 gap-4 text-sm text-[#333]'>
              <p><strong>Name:</strong> {selectedTeacher.name}</p>
              <p><strong>Subject:</strong> {selectedTeacher.subject}</p>
              <p><strong>Phone Number:</strong> {selectedTeacher.phone_number}</p>
              <p><strong>Nationality:</strong> {selectedTeacher.nationality}</p>
              <p><strong>City:</strong> {selectedTeacher.city}</p>
              <p><strong>Certification:</strong> {selectedTeacher.certification}</p>
              <p><strong>Availability:</strong> {selectedTeacher.availability === 1 ? 'Available' : 'Not Available'}</p>
              <p><strong>Salary:</strong> {selectedTeacher.salary}</p>
              <p><strong>Days Off:</strong> {selectedTeacher.days_off}</p>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position='bottom-right' autoClose={5000} />
    </div>
  );
};

export default Teachers;
