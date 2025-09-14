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

  const [selectedActivity, setSelectedActivity] = useState(null);

  const API_URL = 'https://backend-motafokeen-ajrd.onrender.com/dashboard/activities';

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

  useEffect(() => { fetchActivities(); }, []);

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
        toast.success("تم إنشاء النشاط بنجاح");
        setTitle(''); setContent(''); setType(''); setStartDate(''); setEndDate('');
        fetchActivities();
      } else toast.error(data.message);
    } catch { toast.error('An error occurred while creating activity'); }
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
        body: JSON.stringify({ title: editTitle, content: editContent, type: editType, startDate: editStartDate, endDate: editEndDate })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("تم تعديل النشاط بنجاح");
        setEditingActivity(null);
        fetchActivities();
      } else toast.error(data.message);
    } catch { toast.error('An error occurred while updating activity'); }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success("تم حذف النشاط بنجاح");
        fetchActivities();
      } else toast.error(data.message);
    } catch { toast.error('An error occurred while deleting activity'); }
  };

  const openActivityDetails = (activity) => { setSelectedActivity(activity); };
  const closeActivityDetails = () => { setSelectedActivity(null); };

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

            <form className="admin-form grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div className="form-group flex flex-col">
                <label className="mb-1 font-medium">Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter activity title"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#40277E]" />
              </div>

              <div className="form-group flex flex-col">
                <label className="mb-1 font-medium">Type:</label>
                <select value={type} onChange={(e) => setType(e.target.value)} required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#40277E]">
                  <option value="">-- اختر النوع --</option>
                  <option value="ترفيهي">ترفيهي</option>
                  <option value="رياضي">رياضي</option>
                  <option value="ثقافي">ثقافي</option>
                  <option value="اجتماعي">اجتماعي</option>
                </select>
              </div>

              <div className="form-group flex flex-col">
                <label className="mb-1 font-medium">Start Date:</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#40277E]" />
              </div>

              <div className="form-group flex flex-col">
                <label className="mb-1 font-medium">End Date:</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#40277E]" />
              </div>

              <div className="form-group flex flex-col md:col-span-2">
                <label className="mb-1 font-medium">Content:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5}
                  placeholder="Enter activity details"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#40277E]" />
              </div>

              <div className="md:col-span-2">
                <button type="submit" className="btn-primary w-full py-2 mt-2">Create</button>
              </div>
            </form>
          </section>

          {/* Activities List */}
          <section className="admin-section">
            <header className="admin-section-header">
              <h1>Activities Control Panel</h1>
              <p>Click on an activity card to view details</p>
            </header>

            {loading ? <p>Loading activities...</p> :
              error ? <p className="text-error">{error}</p> :
                allActivities.length > 0 ? (
                  <div className="admin-list">
                    {allActivities.map((activity) => (
                      <div
  key={activity._id}
  className="admin-card bg-white rounded-2xl shadow-lg p-6 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:shadow-2xl transition-all duration-200"
  onClick={() => !editingActivity || editingActivity._id !== activity._id ? openActivityDetails(activity) : null}
>
  {editingActivity && editingActivity._id === activity._id ? (
    // EDIT FORM
    <form
      onSubmit={handleUpdateSubmit}
      className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="text"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        required
        placeholder="Title"
        className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      />
      <input
        type="text"
        value={editType}
        onChange={(e) => setEditType(e.target.value)}
        placeholder="Type"
        className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      />
      <input
        type="date"
        value={editStartDate}
        onChange={(e) => setEditStartDate(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      />
      <input
        type="date"
        value={editEndDate}
        onChange={(e) => setEditEndDate(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      />
      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        rows={3}
        placeholder="Content"
        className="border rounded-lg px-3 py-2 w-full md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      />
      <div className="col-span-2 flex gap-2 justify-end mt-2">
        <button
          type="submit"
          className="btn-save px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditingActivity(null)}
          className="btn-cancel px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  ) : (
    // DISPLAY CARD
    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
      {/* Left Section - Main Info */}
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-xl font-bold text-gray-900">{activity.title}</h3>
        <p className="text-gray-600">{activity.content || '-'}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{activity.type || '-'}</span>
          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Members: {activity.members?.length || 0}</span>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {activity.startDate ? new Date(activity.startDate).toLocaleDateString() : '-'} → {activity.endDate ? new Date(activity.endDate).toLocaleDateString() : '-'}
          </span>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex gap-3 mt-4 md:mt-0">
        <button
          onClick={(e) => { e.stopPropagation(); handleUpdate(activity); }}
          className="text-blue-600 hover:text-blue-800"
          title="Edit Activity"
        >
          <FaEdit size={22} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleDelete(activity._id); }}
          className="text-red-600 hover:text-red-800"
          title="Delete Activity"
        >
          <MdDeleteForever size={24} />
        </button>
      </div>
    </div>
  )}
</div>

                    ))}
                  </div>
                ) : <p>No activities found</p>}
          </section>
        </main>
      </div>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto relative">
            <button onClick={closeActivityDetails} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
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
                        <td className="px-4 py-2 text-sm text-gray-800">{m.students?.firstName} {m.students?.middleName} {m.students?.lastName}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">{m.students?.identifier}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">{m.phoneNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-gray-500">No members yet</p>}
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={5000} />
    </>
  );
};

export default Activities;
