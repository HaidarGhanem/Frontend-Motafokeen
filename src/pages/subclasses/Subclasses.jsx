import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Subclasses.css';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { FaUserEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';

const Subclasses = () => {
  const [subclassName, setSubclassName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [allClasses, setAllClasses] = useState([]);
  const [allSubclasses, setAllSubclasses] = useState([]);
  const [loading, setLoading] = useState({ classes: true, subclasses: true });
  const [error, setError] = useState({ classes: null, subclasses: null });
  const [editingSubclass, setEditingSubclass] = useState(null);
  const [editSubclassName, setEditSubclassName] = useState('');

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:3000/dashboard/classes', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch classes');

      const data = await response.json();

      if (data.success) {
        setAllClasses(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch classes');
      }
    } catch (err) {
      setError(prev => ({ ...prev, classes: err.message }));
      toast.error(err.message);
    } finally {
      setLoading(prev => ({ ...prev, classes: false }));
    }
  };

  const fetchSubclasses = async () => {
    if (!selectedClass) return;
    try {
      setLoading(prev => ({ ...prev, subclasses: true }));

      const response = await fetch('http://localhost:3000/dashboard/subclasses/all', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ class: selectedClass })
      });

      if (!response.ok) throw new Error('Failed to fetch subclasses');

      const data = await response.json();

      if (data.success) {
        setAllSubclasses(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch subclasses');
      }
    } catch (err) {
      setError(prev => ({ ...prev, subclasses: err.message }));
      toast.error(err.message);
    } finally {
      setLoading(prev => ({ ...prev, subclasses: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/dashboard/subclasses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: subclassName, class: selectedClass })
      });

      if (!response.ok) throw new Error('Failed to create subclass');

      const data = await response.json();

      if (data.success) {
        setSubclassName('');
        toast.success(data.message);
        fetchSubclasses();
      } else {
        throw new Error(data.message || 'Failed to create subclass');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/dashboard/subclasses/${editingSubclass.name}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: editSubclassName })
      });

      if (!response.ok) throw new Error('Failed to update subclass');

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setEditingSubclass(null);
        fetchSubclasses();
      } else {
        throw new Error(data.message || 'Failed to update subclass');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (subclassName) => {
    try {
      const response = await fetch('http://localhost:3000/dashboard/subclasses', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: subclassName })
      });

      if (!response.ok) throw new Error('Failed to delete subclass');

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchSubclasses();
      } else {
        throw new Error(data.message || 'Failed to delete subclass');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) fetchSubclasses();
  }, [selectedClass]);

  return (
    <div className="flex">
      <SideBar />
      <div className="mt-[120px] ml-10 w-full pr-10 flex flex-col gap-20">
        {/* Create Subclass Section */}
        <div className="bg-[#FAF9FC] p-8 rounded-xl shadow-md w-full max-w-[1200px]">
          <h2 className="text-2xl font-bold text-[#40277E] mb-2">Subclasses Management</h2>
          <p className="text-sm text-[#666] mb-6">Create and manage subclasses for classes</p>

          <div className="mb-6 flex items-center gap-5">
            <label className="form-label mb-0" style={{ minWidth: '120px' }}>Select Class:</label>
            <select
              className="form-input w-[300px]"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              required
            >
              <option value="">Select a class</option>
              {allClasses.map((classItem) => (
                <option key={classItem._id} value={classItem.name}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[auto_auto] gap-6 items-center max-w-[600px]">
              <div className="flex flex-col">
                <label className="form-label">Subclass Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Subclass name"
                  value={subclassName}
                  onChange={(e) => setSubclassName(e.target.value)}
                  required
                />
              </div>
              <div>
                <button type="submit" className="bg-[#40277E] hover:bg-[#5b3ea4] text-white px-6 py-2 rounded-lg transition-all duration-200">
                  Create Subclass
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Subclasses List Section */}
        {selectedClass && (
          <div className="bg-[#FAF9FC] p-8 rounded-xl shadow-md w-full max-w-[1200px]">
            <h2 className="text-2xl font-bold text-[#40277E] mb-2">
              Subclasses for {selectedClass}
            </h2>
            <p className="text-sm text-[#666] mb-6">View, edit, and delete subclasses</p>

            {loading.subclasses ? (
              <p>Loading subclasses...</p>
            ) : error.subclasses ? (
              <p className="text-red-600">{error.subclasses}</p>
            ) : allSubclasses.length > 0 ? (
              <div className="flex flex-col gap-4">
                {allSubclasses.map((subclass) => (
                  <div
                    key={subclass._id}
                    className="bg-white shadow-sm border border-[#E6E6E6] p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center"
                  >
                    {editingSubclass && editingSubclass._id === subclass._id ? (
                      <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-[auto_auto_auto] gap-4 w-full items-center">
                        <FaChalkboardTeacher className="text-[40px] text-[#FCC43E] md:mr-4" />
                        <input
                          type="text"
                          className="form-input"
                          value={editSubclassName}
                          onChange={(e) => setEditSubclassName(e.target.value)}
                          required
                        />
                        <div className="flex gap-2">
                          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded">
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSubclass(null)}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-center">
                        <div className="flex items-center gap-4">
                          <FaChalkboardTeacher className="text-[40px] text-[#6A46A8]" />
                          <div>
                            <p className="text-sm text-[#333]"><strong>Subclass:</strong> {subclass.name}</p>
                            <p className="text-sm text-[#333]"><strong>Class:</strong> {subclass.classId?.name || selectedClass}</p>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0">
                          <button onClick={() => {
                            setEditingSubclass(subclass);
                            setEditSubclassName(subclass.name);
                          }}>
                            <FaUserEdit className="text-[#40277E] text-xl hover:scale-110 transition cursor-pointer" />
                          </button>
                          <button onClick={() => handleDelete(subclass.name)}>
                            <MdDeleteForever className="text-[#FB7D5B] text-xl hover:scale-110 transition cursor-pointer" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No subclasses found for this class</p>
            )}
          </div>
        )}
      </div>

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
  );
};

export default Subclasses;
