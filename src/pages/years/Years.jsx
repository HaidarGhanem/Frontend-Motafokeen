import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Year.css';
import { FaCalendarAlt, FaUserEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { IoPower } from 'react-icons/io5';
import { IoPowerOutline } from 'react-icons/io5';

const Years = () => {
  const [year, setYear] = useState('');
  const [database, setDatabase] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allYears, setAllYears] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingYear, setEditingYear] = useState(null);
  const [editYear, setEditYear] = useState('');
  const [editDatabase, setEditDatabase] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  const fetchYears = async () => {
    try {
      const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/years/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        setAllYears(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch academic years');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchYears(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, database, startDate, endDate })
      });
      const data = await response.json();
      if (data.success) {
        setYear('');
        setDatabase('');
        setStartDate('');
        setEndDate('');
        toast.success(data.message);
        fetchYears();
      } else {
        toast.error(data.message || 'Failed to create academic year');
      }
    } catch (err) {
      toast.error('An error occurred during creation');
    }
  };

  const handleUpdate = (item) => {
    setEditingYear(item);
    setEditYear(item.year);
    setEditDatabase(item.database);
    setEditStartDate(item.startDate.split('T')[0]);
    setEditEndDate(item.endDate.split('T')[0]);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/years/${editingYear.year}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: editYear,
          database: editDatabase,
          startDate: editStartDate,
          endDate: editEndDate
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setEditingYear(null);
        fetchYears();
      } else {
        toast.error(data.message || 'Failed to update academic year');
      }
    } catch (err) {
      toast.error('An error occurred during update');
    }
  };

  const handleDelete = async (year) => {
    try {
      const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/years', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchYears();
      } else {
        toast.error(data.message || 'Failed to delete academic year');
      }
    } catch (err) {
      toast.error('An error occurred during deletion');
    }
  };

  const handleActivate = async (year) => {
    try {
      const response = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/years/active/${year}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchYears();
      } else {
        toast.error(data.message || 'Failed to activate year');
      }
    } catch (err) {
      toast.error('An error occurred during activation');
    }
  };

  const handleDeactivate = async (year) => {
    try {
      const response = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/years/deactivate/${year}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchYears();
      } else {
        toast.error(data.message || 'Failed to deactivate year');
      }
    } catch (err) {
      toast.error('An error occurred during deactivation');
    }
  };

  return (
    <div className='flex'>
      <SideBar />
      <div className='mt-[120px] ml-10 w-full pr-10 flex-1'>
        {/* Create Year Form */}
        <div className='bg-[#FAF9FC] p-8 rounded-xl shadow-md mb-16'>
          <h2 className='text-2xl font-bold text-[#40277E] mb-2'>Create Academic Year</h2>
          <p className='text-sm text-[#666] mb-6'>Fill all fields to add a new academic year</p>
          <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-6'>
            <div>
              <label className='form-label'>Year</label>
              <input className='form-input' type='text' value={year} onChange={(e) => setYear(e.target.value)} required />
            </div>
            <div>
              <label className='form-label'>Database</label>
              <input className='form-input' type='text' value={database} onChange={(e) => setDatabase(e.target.value)} required />
            </div>
            <div>
              <label className='form-label'>Start Date</label>
              <input className='form-input' type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div>
              <label className='form-label'>End Date</label>
              <input className='form-input' type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
            <div className='col-span-2'>
              <button type='submit' className='bg-[#40277E] hover:bg-[#5b3ea4] text-white px-6 py-2 rounded-lg transition-all duration-200'>
                Create
              </button>
            </div>
          </form>
        </div>

        {/* Years List */}
        <div className='bg-[#FAF9FC] p-8 rounded-xl shadow-md'>
          <h2 className='text-2xl font-bold text-[#40277E] mb-2'>Academic Years Control Panel</h2>
          <p className='text-sm text-[#666] mb-6'>Manage, Edit, Activate/Deactivate, or Delete records</p>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className='text-red-600'>{error}</p>
          ) : (
            <div className='flex flex-col gap-4'>
              {allYears?.map((item) => (
                <div key={item._id} className='bg-white shadow-sm border border-[#E6E6E6] p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center'>
                  {editingYear && editingYear._id === item._id ? (
                    <form onSubmit={handleUpdateSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
                      <input className='form-input' type='text' value={editYear} onChange={(e) => setEditYear(e.target.value)} required />
                      <input className='form-input' type='text' value={editDatabase} onChange={(e) => setEditDatabase(e.target.value)} required />
                      <input className='form-input' type='date' value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} required />
                      <input className='form-input' type='date' value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} required />
                      <div className='col-span-2 flex gap-2'>
                        <button type='submit' className='bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded'>Save</button>
                        <button type='button' onClick={() => setEditingYear(null)} className='bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded'>Cancel</button>
                      </div>
                    </form>
                  ) : (
              <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                      <div className='flex items-center gap-4'>
                        <FaCalendarAlt className='text-[#6A46A8] text-3xl' />
                        <div className='grid grid-cols-2 gap-x-4 text-sm text-[#333]'>
                          <p><strong>Year:</strong> {item.year}</p>
                          <p><strong>DB:</strong> {item.database}</p>
                          <p><strong>Start:</strong> {new Date(item.startDate).toLocaleDateString()}</p>
                          <p><strong>End:</strong> {new Date(item.endDate).toLocaleDateString()}</p>
                          <p><strong>Status:</strong> {item.active ? 'Active' : 'Inactive'}</p>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <button onClick={() => handleUpdate(item)}><FaUserEdit className='text-[#40277E] text-xl hover:scale-110 transition' /></button>
                        <button onClick={() => handleDelete(item.year)}><MdDeleteForever className='text-[#FB7D5B] text-xl hover:scale-110 transition' /></button>
                        {item.active ? (
                          <button onClick={() => handleDeactivate(item._id)}><IoPower className='text-green-500 text-xl hover:scale-110 transition' /></button>
                        ) : (
                          <button onClick={() => handleActivate(item._id)}><IoPowerOutline className='text-gray-500 text-xl hover:scale-110 transition' /></button>
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

      <ToastContainer position='bottom-right' autoClose={5000} />
    </div>
  );
};
 
export default Years;