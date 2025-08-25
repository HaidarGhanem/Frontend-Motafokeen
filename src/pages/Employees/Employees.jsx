import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdDeleteForever, MdClose } from 'react-icons/md';
import { FaUserEdit } from 'react-icons/fa';

const Employees = () => {
  // Create employee form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [residence, setResidence] = useState('');   // replaced from department
  const [position, setPosition] = useState('');

  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for editing employee & modal open state
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editResidence, setEditResidence] = useState('');   // replaced from editDepartment
  const [editPosition, setEditPosition] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // States for showing details modal
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch all employees
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/employees', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch employees');
      }

      const data = await response.json();
      if (data.success) {
        setAllEmployees(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch employees');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Create employee submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          email,
          residence,             // replaced from department
          position,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create employee');
      }

      const data = await response.json();
      if (data.success) {
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setEmail('');
        setResidence('');    // replaced from department
        setPosition('');
        toast.success(data.message);
        fetchEmployees();
      } else {
        toast.error(data.message || 'Failed to create employee');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred during creation');
    }
  };

  // Open edit modal and fill form
  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setEditFirstName(employee.first_name || '');
    setEditLastName(employee.last_name || '');
    setEditPhoneNumber(employee.phone_number || '');
    setEditEmail(employee.email || '');
    setEditResidence(employee.residence || '');    // replaced from department
    setEditPosition(employee.position || '');
    setIsEditModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  // Submit edit form
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/employees/${editingEmployee._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: editFirstName,
          last_name: editLastName,
          phone_number: editPhoneNumber,
          email: editEmail,
          residence: editResidence,    // replaced from department
          position: editPosition,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update employee');
      }

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setEditingEmployee(null);
        setIsEditModalOpen(false);
        fetchEmployees();
      } else {
        toast.error(data.message || 'Failed to update employee');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred during update');
    }
  };

  // Delete employee
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/employees/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete employee');
      }

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchEmployees();
      } else {
        toast.error(data.message || 'Failed to delete employee');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred during deletion');
    }
  };

  // Open details modal
  const openDetailsModal = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailsModalOpen(true);
    setIsEditModalOpen(false);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedEmployee(null);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEmployee(null);
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="mt-[120px] ml-10 w-full pr-10 flex-1">
        {/* Create Employee Form */}
        <div className="bg-[#FAF9FC] p-8 rounded-xl shadow-md mb-16">
          <h2 className="text-2xl font-bold text-[#40277E] mb-2">Create Employee Record</h2>
          <p className="text-sm text-[#666] mb-6">Fill all fields to add a new employee</p>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div>
              <label className="form-label">First Name</label>
              <input
                className="form-input"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Last Name</label>
              <input
                className="form-input"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <input
                className="form-input"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Residence</label>
              <input
                className="form-input"
                type="text"
                value={residence}
                onChange={(e) => setResidence(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Position</label>
              <input
                className="form-input"
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
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

        {/* Employees List */}
        <div className="bg-[#FAF9FC] p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-[#40277E] mb-2">Employee Control Panel</h2>
          <p className="text-sm text-[#666] mb-6">Manage, edit, or delete employee records</p>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {allEmployees?.map((item) => (
                <div
                  key={item._id}
                  className="bg-white shadow-sm border border-[#E6E6E6] p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
                  onClick={() => openDetailsModal(item)}
                >
                  <div className="text-sm text-[#333]">
                    <p>
                      <strong>First Name:</strong> {item.first_name}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {item.last_name}
                    </p>
                    <p>
                      <strong>Phone Number:</strong> {item.phone_number}
                    </p>
                    <p>
                      <strong>Email:</strong> {item.email}
                    </p>
                    <p>
                      <strong>Residence:</strong> {item.residence}
                    </p>
                    <p>
                      <strong>Position:</strong> {item.position}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(item);
                      }}
                      title="Edit Employee"
                    >
                      <FaUserEdit className="text-[#40277E] text-xl hover:scale-110 transition" />
                    </button>
                    <button onClick={(e) => handleDelete(item._id, e)} title="Delete Employee">
                      <MdDeleteForever className="text-[#FB7D5B] text-xl hover:scale-110 transition" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeDetailsModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl"
              aria-label="Close details modal"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-[#40277E] mb-6">Employee Details</h2>
            <div className="grid grid-cols-1 gap-4 text-sm text-[#333]">
              <p>
                <strong>First Name:</strong> {selectedEmployee.first_name}
              </p>
              <p>
                <strong>Last Name:</strong> {selectedEmployee.last_name}
              </p>
              <p>
                <strong>Phone Number:</strong> {selectedEmployee.phone_number}
              </p>
              <p>
                <strong>Email:</strong> {selectedEmployee.email}
              </p>
              <p>
                <strong>Residence:</strong> {selectedEmployee.residence}
              </p>
              <p>
                <strong>Position:</strong> {selectedEmployee.position}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeEditModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl"
              aria-label="Close edit modal"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-[#40277E] mb-6">Edit Employee</h2>
            <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">First Name</label>
                <input
                  className="form-input"
                  type="text"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input
                  className="form-input"
                  type="text"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
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
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Residence</label>
                <input
                  className="form-input"
                  type="text"
                  value={editResidence}
                  onChange={(e) => setEditResidence(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Position</label>
                <input
                  className="form-input"
                  type="text"
                  value={editPosition}
                  onChange={(e) => setEditPosition(e.target.value)}
                />
              </div>
              <div className="col-span-2 flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#40277E] hover:bg-[#5b3ea4] text-white px-6 py-2 rounded-lg transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default Employees;
