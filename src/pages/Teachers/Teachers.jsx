import { useEffect, useState } from 'react';
import SideBar from '../../components/SideBar/SideBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Teachers.css';
import { FaUserEdit } from 'react-icons/fa';
import { MdDeleteForever, MdClose } from 'react-icons/md';
import { IoPower, IoPowerOutline } from 'react-icons/io5';

const Teachers = () => {
  // Create form states
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationality, setNationality] = useState('');
  const [city, setCity] = useState('');
  const [certification, setCertification] = useState('');
  const [availability, setAvailability] = useState('');
  const [salary, setSalary] = useState('');
  const [daysOff, setDaysOff] = useState('');

  // Teachers list and loading/error
  const [allTeachers, setAllTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit modal and form states
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

  // Details modal state
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Fetch teachers list
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/dashboard/teachers/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
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

  // Create new teacher submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/dashboard/teachers', {
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
          days_off: Number(daysOff),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        // Reset create form
        setName('');
        setSubject('');
        setPhoneNumber('');
        setNationality('');
        setCity('');
        setCertification('');
        setAvailability('');
        setSalary('');
        setDaysOff('');
        fetchTeachers();
      } else {
        toast.error(data.message || 'Failed to create teacher');
      }
    } catch {
      toast.error('An error occurred during creation');
    }
  };

  // Open edit modal & fill form
  const handleEditOpen = (teacher) => {
    setEditingTeacher(teacher);
    setEditName(teacher.name);
    setEditSubject(teacher.subject);
    setEditPhoneNumber(teacher.phone_number || '');
    setEditNationality(teacher.nationality || 'عربي سوري');
    setEditCity(teacher.city || '');
    setEditCertification(teacher.certification || '');
    setEditAvailability(String(teacher.availability || ''));
    setEditSalary(String(teacher.salary || ''));
    setEditDaysOff(String(teacher.days_off || ''));
  };

  // Open details modal
  const openTeacherDetails = (teacher) => {
    if (!editingTeacher || editingTeacher._id !== teacher._id) {
      setSelectedTeacher(teacher);
    }
  };

  // Close details modal
  const closeTeacherDetails = () => {
    setSelectedTeacher(null);
  };

  // Update teacher submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/dashboard/teachers/${editingTeacher._id}`, {
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
          days_off: Number(editDaysOff),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Teacher updated successfully');
        setEditingTeacher(null);
        fetchTeachers();
      } else {
        toast.error(data.message || 'Failed to update teacher');
      }
    } catch {
      toast.error('An error occurred during update');
    }
  };

  // Delete teacher
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:3000/dashboard/teachers/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
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

  // Activate/Deactivate handlers
  const handleActivate = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:3000/dashboard/teachers/active/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
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
      const res = await fetch(`http://localhost:3000/dashboard/teachers/deactivate/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
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

  return (
    <div className="flex">
      <SideBar />
      <div className="mt-[120px] ml-10 w-full pr-10 flex-1">
        {/* Create Teacher Form */}
        <div className="bg-[#FAF9FC] p-8 rounded-xl shadow-md mb-16">
          <h2 className="text-2xl font-bold text-[#40277E] mb-2">Create Teacher</h2>
          <p className="text-sm text-[#666] mb-6">Fill all fields to add a new teacher</p>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div>
              <label className="form-label">Name</label>
              <input className="form-input" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">Subject</label>
              <input className="form-input" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Nationality</label>
              <input className="form-input" type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} />
            </div>
            <div>
              <label className="form-label">City</label>
              <input className="form-input" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Certification</label>
              <input className="form-input" type="text" value={certification} onChange={(e) => setCertification(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Availability</label>
              <input className="form-input" type="number" value={availability} onChange={(e) => setAvailability(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Salary</label>
              <input className="form-input" type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Days Off</label>
              <input className="form-input" type="number" value={daysOff} onChange={(e) => setDaysOff(e.target.value)} />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-[#40277E] hover:bg-[#5b3ea4] text-white px-6 py-2 rounded-lg transition-all duration-200"
              >
                Create
              </button>
            </div>
          </form>
        </div>

        {/* Teachers List */}
        <div className="bg-[#FAF9FC] p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-[#40277E] mb-2">Teachers Control Panel</h2>
          <p className="text-sm text-[#666] mb-6">Manage, Edit, Activate/Deactivate, or Delete records</p>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {allTeachers.map((item) => (
                <div
                  key={item._id}
                  className="bg-white shadow-sm border border-[#E6E6E6] p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
                  onClick={() => openTeacherDetails(item)}
                >
                  <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-[#333]">
                        <p>
                          <strong>Name:</strong> {item.name}
                        </p>
                        <p>
                          <strong>Subject:</strong> {item.subject}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditOpen(item);
                        }}
                        title="Edit Teacher"
                      >
                        <FaUserEdit className="text-[#40277E] text-xl hover:scale-110 transition" />
                      </button>
                      <button onClick={(e) => handleDelete(item._id, e)} title="Delete Teacher">
                        <MdDeleteForever className="text-[#FB7D5B] text-xl hover:scale-110 transition" />
                      </button>
                      {item.availability === 1 ? (
                        <button onClick={(e) => handleDeactivate(item._id, e)} title="Deactivate Teacher">
                          <IoPower className="text-green-500 text-xl hover:scale-110 transition" />
                        </button>
                      ) : (
                        <button onClick={(e) => handleActivate(item._id, e)} title="Activate Teacher">
                          <IoPowerOutline className="text-gray-500 text-xl hover:scale-110 transition" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Teacher Details Modal */}
      {selectedTeacher && !editingTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeTeacherDetails}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              aria-label="Close teacher details"
            >
              <MdClose size={28} />
            </button>

            <h2 className="text-2xl font-bold text-[#40277E] mb-6">Teacher Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
              <div>
                <strong>Name:</strong>
                <p>{selectedTeacher.name}</p>
              </div>
              <div>
                <strong>Subject:</strong>
                <p>{selectedTeacher.subject}</p>
              </div>
              <div>
                <strong>Phone Number:</strong>
                <p>{selectedTeacher.phone_number || '-'}</p>
              </div>
              <div>
                <strong>Nationality:</strong>
                <p>{selectedTeacher.nationality || '-'}</p>
              </div>
              <div>
                <strong>City:</strong>
                <p>{selectedTeacher.city || '-'}</p>
              </div>
              <div>
                <strong>Certification:</strong>
                <p>{selectedTeacher.certification || '-'}</p>
              </div>
              <div>
                <strong>Availability:</strong>
                <p>{selectedTeacher.availability !== undefined ? selectedTeacher.availability : '-'}</p>
              </div>
              <div>
                <strong>Salary:</strong>
                <p>{selectedTeacher.salary !== undefined ? selectedTeacher.salary : '-'}</p>
              </div>
              <div>
                <strong>Days Off:</strong>
                <p>{selectedTeacher.days_off !== undefined ? selectedTeacher.days_off : '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingTeacher(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              aria-label="Close edit teacher"
            >
              <MdClose size={28} />
            </button>

            <h2 className="text-2xl font-bold text-[#40277E] mb-6">Edit Teacher</h2>

            <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Name</label>
                <input
                  className="form-input"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Subject</label>
                <input
                  className="form-input"
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <input
                  className="form-input"
                  type="text"
                  value={editPhoneNumber}
                  onChange={(e) => setEditPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Nationality</label>
                <input
                  className="form-input"
                  type="text"
                  value={editNationality}
                  onChange={(e) => setEditNationality(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">City</label>
                <input
                  className="form-input"
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Certification</label>
                <input
                  className="form-input"
                  type="text"
                  value={editCertification}
                  onChange={(e) => setEditCertification(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Availability</label>
                <input
                  className="form-input"
                  type="number"
                  value={editAvailability}
                  onChange={(e) => setEditAvailability(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Salary</label>
                <input
                  className="form-input"
                  type="number"
                  value={editSalary}
                  onChange={(e) => setEditSalary(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Days Off</label>
                <input
                  className="form-input"
                  type="number"
                  value={editDaysOff}
                  onChange={(e) => setEditDaysOff(e.target.value)}
                />
              </div>
              <div className="col-span-2 flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#40277E] hover:bg-[#5b3ea4] text-white px-6 py-2 rounded-lg transition-all duration-200"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Teachers;
