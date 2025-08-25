import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Classes.css';
import { FaChalkboard } from 'react-icons/fa';
import { FaUserEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';

const Classes = () => {
  const [name, setName] = useState('');
  const [newClass, setNewClass] = useState(null);
  const [allClasses, setAllClasses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchClasses = async () => {
    try {
      const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/classes/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        setAllClasses(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch classes');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (data.success) {
        setNewClass(data.data);
        setName('');
        toast.success(data.message);
        fetchClasses();
      } else {
        toast.error(data.message || 'Failed to create class');
      }
    } catch {
      toast.error('An error occurred during class creation');
    }
  };

  const handleUpdate = (classItem) => {
    setEditingClass(classItem);
    setEditName(classItem.name);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://backend-motafokeen-ajrd.onrender.com/classes/${editingClass.name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setEditingClass(null);
        fetchClasses();
      } else {
        toast.error(data.message || 'Failed to update class');
      }
    } catch {
      toast.error('An error occurred during class update');
    }
  };

  const handleDelete = async (className) => {
    try {
      const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/classes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: className }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchClasses();
      } else {
        toast.error(data.message || 'Failed to delete class');
      }
    } catch {
      toast.error('An error occurred during class deletion');
    }
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="mt-[120px] ml-10 w-full pr-10 flex-1">
        {/* Create Class Section */}
        <div className="bg-[#FAF9FC] p-8 rounded-xl shadow-md mb-16 max-w-lg">
          <h2 className="text-2xl font-bold text-[#40277E] mb-2">Create Class</h2>
          <p className="text-sm text-[#666] mb-6">Please enter class name to create a new class</p>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <div>
              <label className="form-label" htmlFor="name">Class Name</label>
              <input
                id="name"
                className="form-input"
                type="text"
                placeholder="e.g. Grade 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-[#40277E] hover:bg-[#5b3ea4] text-white px-6 py-2 rounded-lg transition-all duration-200"
              >
                Create
              </button>
            </div>
          </form>
        </div>

        {/* Classes Control Panel */}
        <div className="bg-[#FAF9FC] p-8 rounded-xl shadow-md max-w-5xl">
          <h2 className="text-2xl font-bold text-[#40277E] mb-2">Classes Control Panel</h2>
          <p className="text-sm text-[#666] mb-6">Manage, Edit, or Delete classes</p>

          {loading ? (
            <p>Loading classes...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : allClasses && allClasses.length > 0 ? (
            <div className="flex flex-col gap-4">
              {allClasses.map((classItem) => (
                <div
                  key={classItem._id}
                  className="bg-white shadow-sm border border-[#E6E6E6] p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  {editingClass && editingClass._id === classItem._id ? (
                    <form
                      onSubmit={handleUpdateSubmit}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
                    >
                      <input
                        className="form-input"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                      <div className="flex gap-2 md:justify-end">
                        <button
                          type="submit"
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingClass(null)}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <FaChalkboard className="text-[#6A46A8] text-3xl" />
                        <p className="text-sm text-[#333]">
                          <strong>Class Name:</strong> {classItem.name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdate(classItem)}>
                          <FaUserEdit className="text-[#40277E] text-xl hover:scale-110 transition cursor-pointer" />
                        </button>
                        <button onClick={() => handleDelete(classItem.name)}>
                          <MdDeleteForever className="text-[#FB7D5B] text-xl hover:scale-110 transition cursor-pointer" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No classes found</p>
          )}
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Classes;
