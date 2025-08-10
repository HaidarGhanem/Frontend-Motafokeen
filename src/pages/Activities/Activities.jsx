import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaClipboardList, FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";

const Activities = () => {
  const [icon, setIcon] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingActivity, setEditingActivity] = useState(null);
  const [editIcon, setEditIcon] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editType, setEditType] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

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
        body: JSON.stringify({
          icon,
          title,
          content,
          type,
          startDate,
          endDate
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setIcon('');
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
    setEditIcon(activity.icon || '');
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
          icon: editIcon,
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

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <>
      <div className="flex">
        <SideBar />
        <main className="admin-main-container">
          {/* Create Activity */}
          <section className="admin-section">
            <header className="admin-section-header">
              <h1>Create Activity</h1>
              <p>Fill the form to add a new activity</p>
            </header>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Icon:</label>
                <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Content:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} />
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
              <p>View, edit, or delete activities</p>
            </header>
            {loading ? (
              <p>Loading activities...</p>
            ) : error ? (
              <p className="text-error">{error}</p>
            ) : allActivities.length > 0 ? (
              <div className="admin-list">
                {allActivities.map((activity) => (
                  <div key={activity._id} className="admin-card">
                    {editingActivity && editingActivity._id === activity._id ? (
                      <form onSubmit={handleUpdateSubmit} className="edit-form">
                        <FaClipboardList className="admin-avatar" />
                        <input type="text" value={editIcon} onChange={(e) => setEditIcon(e.target.value)} placeholder="Icon URL" />
                        <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required placeholder="Title" />
                        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="Content" />
                        <input type="text" value={editType} onChange={(e) => setEditType(e.target.value)} placeholder="Type" />
                        <input type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} />
                        <input type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} />
                        <div className="edit-actions">
                          <button type="submit" className="btn-save">Save</button>
                          <button type="button" onClick={() => setEditingActivity(null)} className="btn-cancel">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="admin-info">
                          <FaClipboardList className="admin-avatar" />
                          <div className="admin-details">
                            {activity.icon && <img src={activity.icon} alt="Activity Icon" style={{ width: '40px', height: '40px' }} />}
                            <p><strong>Title:</strong> {activity.title}</p>
                            <p><strong>Content:</strong> {activity.content || '-'}</p>
                            <p><strong>Type:</strong> {activity.type || '-'}</p>
                            <p><strong>Start:</strong> {activity.startDate ? new Date(activity.startDate).toLocaleDateString() : '-'}</p>
                            <p><strong>End:</strong> {activity.endDate ? new Date(activity.endDate).toLocaleDateString() : '-'}</p>
                            <p><strong>Members:</strong> {activity.members?.length || 0}</p>
                          </div>
                        </div>
                        <div className="admin-actions">
                          <button onClick={() => handleUpdate(activity)}><FaEdit className="icon-edit" /></button>
                          <button onClick={() => handleDelete(activity._id)}><MdDeleteForever className="icon-delete" /></button>
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
      <ToastContainer position="bottom-right" autoClose={5000} />
    </>
  );
};

export default Activities;
