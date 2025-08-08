import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.css';
import { FaUserCircle, FaUserEdit } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";

const Admins = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [position, setPosition] = useState('');
  const [activeBtn, setActiveBtn] = useState(false);
  const [newAdmin, setNewAdmin] = useState(null);
  const [allAdmins, setAllAdmins] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editPosition, setEditPosition] = useState('');

  const toggleBtn = () => {
    setActiveBtn(!activeBtn);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/dashboard/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, password, first_name: firstName, last_name: lastName, phone_number: phoneNumber, position
        })
      });

      const data = await response.json();

      if (data.success) {
        setNewAdmin(data.data);
        setName('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setPosition('');

        toast.success(data.message, {
          position: "bottom-right",
          autoClose: 5000,
        });

        toast.info(
          <div>
            <p><strong>Name:</strong> {data.data.name}</p>
            <p><strong>Role:</strong> {data.data.role}</p>
          </div>,
          {
            position: "bottom-right",
            autoClose: 8000,
          }
        );
        fetchAdmins();
      } else {
        toast.error(data.message || 'Failed to create admin', {
          position: "bottom-right",
          autoClose: 5000,
        });
      }
    } catch (err) {
      toast.error('An error occurred during admin creation', {
        position: "bottom-right",
        autoClose: 5000,
      });
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://localhost:3000/dashboard/admins/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.success) {
        setAllAdmins(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch admins');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message, {
        position: "bottom-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (admin) => {
    setEditingAdmin(admin);
    setEditName(admin.name);
    setEditPassword(admin.password);
    setEditFirstName(admin.first_name || '');
    setEditLastName(admin.last_name || '');
    setEditPhoneNumber(admin.phone_number || '');
    setEditPosition(admin.position || '');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/dashboard/admins/${editingAdmin._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          password: editPassword,
          first_name: editFirstName,
          last_name: editLastName,
          phone_number: editPhoneNumber,
          position: editPosition
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message, {
          position: "bottom-right",
          autoClose: 5000,
        });
        setEditingAdmin(null);
        fetchAdmins();
      } else {
        toast.error(data.message || 'Failed to update admin', {
          position: "bottom-right",
          autoClose: 5000,
        });
      }
    } catch (err) {
      toast.error('An error occurred during admin update', {
        position: "bottom-right",
        autoClose: 5000,
      });
    }
  };

  const handleDelete = async (adminName) => {
    try {
      const response = await fetch('http://localhost:3000/dashboard/admins', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: adminName }) // backend deletes by name
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchAdmins(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to delete admin');
      }
    } catch (err) {
      toast.error('An error occurred during admin deletion');
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <>
      <div className='flex'>
        <SideBar />
        <main className='admin-main-container'>
          {/* Create Admin Section */}
          <section className='admin-section'>
            <header className='admin-section-header'>
              <h1>Create Admin</h1>
              <p>Please Enter details to Create a New Admin</p>
            </header>

            <form className='admin-form' onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor="username">Admin's Name:</label>
                <input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor="password">Admin's Password:</label>
                <input
                  id="password"
                  type="text"
                  placeholder="****"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor="firstName">First Name:</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className='form-group'>
                <label htmlFor="lastName">Last Name:</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className='form-group'>
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                  id="phoneNumber"
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className='form-group'>
                <label htmlFor="position">Position:</label>
                <input
                  id="position"
                  type="text"
                  placeholder="Position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>

              <button type="submit" onClick={toggleBtn} className='btn-primary'>
                Create
              </button>
            </form>
          </section>

          {/* Admins Control Panel */}
          <section className='admin-section'>
            <header className='admin-section-header'>
              <h1>Admins Control Panel</h1>
              <p>Here You Can Get All Admins / Edit & Update and Delete</p>
            </header>

            {loading ? (
              <p>Loading admins...</p>
            ) : error ? (
              <p className="text-error">{error}</p>
            ) : allAdmins && allAdmins.length > 0 ? (
              <div className='admin-list'>
                {allAdmins.map((admin) => (
                  <div key={admin._id} className='admin-card'>
                    {editingAdmin && editingAdmin._id === admin._id ? (
                      <form onSubmit={handleUpdateSubmit} className='edit-form'>
                        <FaUserCircle className="admin-avatar" />

                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          required
                          placeholder="Name"
                          className='input-edit'
                        />
                        <input
                          type="text"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          required
                          placeholder="Password"
                          className='input-edit'
                        />
                        <input
                          type="text"
                          value={editFirstName}
                          onChange={(e) => setEditFirstName(e.target.value)}
                          placeholder="First Name"
                          className='input-edit'
                        />
                        <input
                          type="text"
                          value={editLastName}
                          onChange={(e) => setEditLastName(e.target.value)}
                          placeholder="Last Name"
                          className='input-edit'
                        />
                        <input
                          type="text"
                          value={editPhoneNumber}
                          onChange={(e) => setEditPhoneNumber(e.target.value)}
                          placeholder="Phone Number"
                          className='input-edit'
                        />
                        <input
                          type="text"
                          value={editPosition}
                          onChange={(e) => setEditPosition(e.target.value)}
                          placeholder="Position"
                          className='input-edit'
                        />

                        <div className='edit-actions'>
                          <button type="submit" className='btn-save'>Save</button>
                          <button type="button" onClick={() => setEditingAdmin(null)} className='btn-cancel'>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className='admin-info'>
  <FaUserCircle className="admin-avatar" />
  <div className='admin-details'>
    <div className='admin-detail-row'>
      <span className='admin-label'>Name:</span>
      <span className='admin-value'>{admin.name}</span>
    </div>
    <div className='admin-detail-row'>
      <span className='admin-label'>Password:</span>
      <span className='admin-value'>{admin.password}</span>
    </div>
    <div className='admin-detail-row'>
      <span className='admin-label'>Role:</span>
      <span className='admin-value'>{admin.role}</span>
    </div>
    <div className='admin-detail-row'>
      <span className='admin-label'>First Name:</span>
      <span className='admin-value'>{admin.first_name || '-'}</span>
    </div>
    <div className='admin-detail-row'>
      <span className='admin-label'>Last Name:</span>
      <span className='admin-value'>{admin.last_name || '-'}</span>
    </div>
    <div className='admin-detail-row'>
      <span className='admin-label'>Phone:</span>
      <span className='admin-value'>{admin.phone_number || '-'}</span>
    </div>
    <div className='admin-detail-row'>
      <span className='admin-label'>Position:</span>
      <span className='admin-value'>{admin.position || '-'}</span>
    </div>
  </div>
</div>

                        <div className='admin-actions'>
                          <button onClick={() => handleUpdate(admin)} aria-label="Edit Admin">
                            <FaUserEdit className="icon-edit" />
                          </button>
                          <button onClick={() => handleDelete(admin.name)} aria-label="Delete Admin">
                            <MdDeleteForever className="icon-delete" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No admins found</p>
            )}
          </section>
        </main>
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
    </>
  )
}

export default Admins;
