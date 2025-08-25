import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever, MdClose } from "react-icons/md";

const Activities = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingActivity, setEditingActivity] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editType, setEditType] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  // For modal details
  const [selectedActivity, setSelectedActivity] = useState(null);

  const API_URL = 'http://localhost:3000/dashboard/activities';

  const fetchActivities = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        setAllActivities(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch activities');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, type, startDate, endDate })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setTitle('');
        setContent('');
        setType('');
        setStartDate('');
        setEndDate('');
        fetchActivities();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('An error occurred while creating activity');
    }
  };

  const handleUpdate = (activity) => {
    setEditingActivity(activity);
    setEditTitle(activity.title);
    setEditContent(activity.content || '');
    setEditType(activity.type || '');
    setEditStartDate(activity.startDate ? activity.startDate.split('T')[0] : '');
    setEditEndDate(activity.endDate ? activity.endDate.split('T')[0] : '');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/${editingActivity._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          type: editType,
          startDate: editStartDate,
          endDate: editEndDate
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setEditingActivity(null);
        fetchActivities();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('An error occurred while updating activity');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchActivities();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('An error occurred while deleting activity');
    }
  };

  const openActivityDetails = (activity) => {
    setSelectedActivity(activity);
  };

  const closeActivityDetails = () => {
    setSelectedActivity(null);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <>
      <div className="flex">
        <SideBar />
        <main className="admin-main-container flex-1">
          {/* Create Activity */}
          <section className="admin-section">
            <header className="admin-section-header">
              <h1>Create Activity</h1>
              <p>Fill the form to add a new activity</p>
            </header>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Content:</label>
                <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Type:</label>
                <input type="text" value={type} onChange={(e) => setType(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Start Date:</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>End Date:</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary">Create</button>
            </form>
          </section>

          {/* Activities List */}
          <section className="admin-section">
            <header className="admin-section-header">
              <h1>Activities Control Panel</h1>
              <p>Click on an activity card to view details</p>
            </header>
            {loading ? (
              <p>Loading activities...</p>
            ) : error ? (
              <p className="text-error">{error}</p>
            ) : allActivities.length > 0 ? (
              <div className="admin-list">
                {allActivities.map((activity) => (
                  <div 
                    key={activity._id} 
                    className="admin-card shadow-md rounded-lg p-4 bg-white mb-4 cursor-pointer hover:shadow-lg transition"
                    onClick={() => openActivityDetails(activity)}
                  >
                    {editingActivity && editingActivity._id === activity._id ? (
                      <form onSubmit={handleUpdateSubmit} className="grid grid-cols-2 gap-4">
                        <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required placeholder="Title" />
                        <input type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="Content" />
                        <input type="text" value={editType} onChange={(e) => setEditType(e.target.value)} placeholder="Type" />
                        <input type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} />
                        <input type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} />
                        <div className="col-span-2 flex gap-2">
                          <button type="submit" className="btn-save">Save</button>
                          <button type="button" onClick={() => setEditingActivity(null)} className="btn-cancel">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <p><strong>Title:</strong> {activity.title}</p>
                          <p><strong>Content:</strong> {activity.content || '-'}</p>
                          <p><strong>Type:</strong> {activity.type || '-'}</p>
                          <p><strong>Start:</strong> {activity.startDate ? new Date(activity.startDate).toLocaleDateString() : '-'}</p>
                          <p><strong>End:</strong> {activity.endDate ? new Date(activity.endDate).toLocaleDateString() : '-'}</p>
                          <p><strong>Members:</strong> {activity.members?.length || 0}</p>
                        </div>

                        <div className="flex gap-3 mt-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleUpdate(activity); }} 
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit size={20} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(activity._id); }} 
                            className="text-red-600 hover:text-red-800"
                          >
                            <MdDeleteForever size={22} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No activities found</p>
            )}
          </section>
        </main>
      </div>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeActivityDetails}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <MdClose size={28} />
            </button>

            <h2 className="text-2xl font-bold text-[#40277E] mb-6">Activity Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
              <div><strong>Title:</strong><p>{selectedActivity.title}</p></div>
              <div><strong>Content:</strong><p>{selectedActivity.content || '-'}</p></div>
              <div><strong>Type:</strong><p>{selectedActivity.type || '-'}</p></div>
              <div><strong>Start Date:</strong><p>{selectedActivity.startDate ? new Date(selectedActivity.startDate).toLocaleDateString() : '-'}</p></div>
              <div><strong>End Date:</strong><p>{selectedActivity.endDate ? new Date(selectedActivity.endDate).toLocaleDateString() : '-'}</p></div>
              <div><strong>Total Members:</strong><p>{selectedActivity.members?.length || 0}</p></div>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">Members</h3>
{selectedActivity.members?.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Name</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Identifier</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Phone</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {selectedActivity.members.map((m, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="px-4 py-2 text-sm text-gray-800">
              {m.students?.firstName} {m.students?.middleName} {m.students?.lastName}
            </td>
            <td className="px-4 py-2 text-sm text-gray-800">
              {m.students?.identifier}
            </td>
            <td className="px-4 py-2 text-sm text-gray-800">
              {m.phoneNumber}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p className="text-gray-500">No members yet</p>
)}

          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={5000} />
    </>
  );
};

export default Activities;
