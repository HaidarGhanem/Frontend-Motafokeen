import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdDeleteForever } from 'react-icons/md';
import { FaUserEdit } from 'react-icons/fa';

const Employees = () => {
  // Form states for creating new employee
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for editing employee
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editPosition, setEditPosition] = useState('');

  // Modal for details
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all employees
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/dashboard/employees', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        // HTTP error status
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
      const response = await fetch('http://localhost:3000/dashboard/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          email,
          department,
          position,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create employee');
      }

      const data = await response.json();
      if (data.success) {
        // Clear form
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setEmail('');
        setDepartment('');
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

  // Start editing employee
  const handleUpdate = (item) => {
    setEditingEmployee(item);
    setEditFirstName(item.first_name || '');
    setEditLastName(item.last_name || '');
    setEditPhoneNumber(item.phone_number || '');
    setEditEmail(item.email || '');
    setEditDepartment(item.department || '');
    setEditPosition(item.position || '');
  };

  // Submit edit update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/dashboard/employees/${editingEmployee._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: editFirstName,
          last_name: editLastName,
          phone_number: editPhoneNumber,
          email: editEmail,
          department: editDepartment,
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
      const response = await fetch(`http://localhost:3000/dashboard/employees/${id}`, {
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

  // Open modal details
  const handleCardClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="mt-[120px] ml-10 w-full pr-10">
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
              <label className="form-label">Department</label>
              <input
                className="form-input"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
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
                  onClick={() => handleCardClick(item)}
                >
                  {editingEmployee && editingEmployee._id === item._id ? (
                    <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      <input
                        className="form-input"
                        type="text"
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        required
                      />
                      <input
                        className="form-input"
                        type="text"
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                        required
                      />
                      <input
                        className="form-input"
                        type="text"
                        value={editPhoneNumber}
                        onChange={(e) => setEditPhoneNumber(e.target.value)}
                      />
                      <input
                        className="form-input"
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                      <input
                        className="form-input"
                        type="text"
                        value={editDepartment}
                        onChange={(e) => setEditDepartment(e.target.value)}
                      />
                      <input
                        className="form-input"
                        type="text"
                        value={editPosition}
                        onChange={(e) => setEditPosition(e.target.value)}
                      />
                      <div className="col-span-2 flex gap-2">
                        <button
                          type="submit"
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingEmployee(null);
                          }}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="flex items-center gap-4">
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
                            <strong>Department:</strong> {item.department}
                          </p>
                          <p>
                            <strong>Position:</strong> {item.position}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdate(item);
                          }}
                        >
                          <FaUserEdit className="text-[#40277E] text-xl hover:scale-110 transition" />
                        </button>
                        <button onClick={(e) => handleDelete(item._id, e)}>
                          <MdDeleteForever className="text-[#FB7D5B] text-xl hover:scale-110 transition" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Employee Details */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-md w-11/12 md:w-1/2 lg:w-1/3 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-[#40277E] mb-4">Employee Details</h2>
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
                <strong>Department:</strong> {selectedEmployee.department}
              </p>
              <p>
                <strong>Position:</strong> {selectedEmployee.position}
              </p>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default Employees;
