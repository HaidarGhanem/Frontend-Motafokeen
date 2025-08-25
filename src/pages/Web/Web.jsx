import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Web.css';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";
import { FiImage } from "react-icons/fi";
import { FaGlobe } from "react-icons/fa";

const Web = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [writer, setWriter] = useState('');
  const [allWebs, setAllWebs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingWeb, setEditingWeb] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editWriter, setEditWriter] = useState('');
  const [editImage, setEditImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 30 * 1024 * 1024) {
        toast.error('Image size should be less than 30MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      setImage(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 30 * 1024 * 1024) {
        toast.error('Image size should be less than 30MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      setEditImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('writer', writer || 'الإدارة المدرسية');
    
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/web', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create web post');
      }

      toast.success(data.message || 'Web post created successfully');
      resetForm();
      fetchWebs();
    } catch (err) {
      console.error('Create error:', err);
      toast.error(err.message || 'Failed to create web post');
    }
  };

  const fetchWebs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/web');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setAllWebs(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch web posts');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to load web posts');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (web) => {
    setEditingWeb(web);
    setEditTitle(web.title);
    setEditContent(web.content);
    setEditWriter(web.writer);
    setEditImage(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', editTitle);
    formData.append('content', editContent);
    formData.append('writer', editWriter || 'الإدارة المدرسية');
    
    if (editImage) {
      formData.append('image', editImage);
    }

    try {
      const response = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/web/${editingWeb._id}`, {
        method: 'PUT',
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update web post');
      }

      toast.success(data.message || 'Web post updated successfully');
      setEditingWeb(null);
      fetchWebs();
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.message || 'Failed to update web post');
    }
  };

  const handleDelete = async (webId) => {
    try {
      const response = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/web/${webId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete web post');
      }

      toast.success(data.message || 'Web post deleted successfully');
      fetchWebs();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.message || 'Failed to delete web post');
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setWriter('');
    setImage(null);
  };

  useEffect(() => {
    fetchWebs();
  }, []);

  return (
        <div className="flex min-h-screen bg-gray-50">
            <SideBar />
            
            <div className="mainmainPost flex-1 p-8 ml-64">
                {/* Create Web Post Section */}
                <div className="mb-12  rounded-lg shadow p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-[#40277E]">Create Web Post</h1>
                        <p className="text-gray-600">Create a new web post with optional image</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Title:</label>
                                <input
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    type="text"
                                    placeholder="Web post title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Content:</label>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-[150px]"
                                    placeholder="Web post content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Writer:</label>
                                <input
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    type="text"
                                    placeholder="Web post writer (default: الإدارة المدرسية)"
                                    value={writer}
                                    onChange={(e) => setWriter(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Image:</label>
                                <label className="flex items-center justify-between p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <FiImage className="mr-2 text-gray-500" />
                                        <span className={image ? "text-gray-800" : "text-gray-500"}>
                                            {image ? image.name : 'Choose an image (optional)'}
                                        </span>
                                    </div>
                                    <span className="text-sm text-[#40277E]">Browse</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="px-6 py-2 bg-[#40277E] text-white rounded hover:bg-orange-600 transition-colors font-medium"
                        >
                            Create Web Post
                        </button>
                    </form>
                </div>

                {/* Web Posts Control Panel */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-[#40277E]">Web Posts Control Panel</h1>
                        <p className="text-gray-600">Manage all web posts</p>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <p className="text-gray-500">Loading web posts...</p>
                        </div>
                    ) : error ? (
                        <p className="text-red-500 py-4">{error}</p>
                    ) : allWebs.length > 0 ? (
                        <div className="space-y-6">
                            {allWebs.map((web) => (
                                <div key={web._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                    {editingWeb && editingWeb._id === web._id ? (
                                        <form onSubmit={handleUpdateSubmit} className="p-6">
                                            <div className="flex items-start gap-6">
                                                <div className="flex-shrink-0">
                                                    <FaGlobe className="text-5xl text-indigo-600 mt-1" />
                                                </div>
                                                <div className="flex-1 space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-gray-700">Title</label>
                                                            <input
                                                                className="w-full p-2 border border-gray-300 rounded"
                                                                type="text"
                                                                value={editTitle}
                                                                onChange={(e) => setEditTitle(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-gray-700">Writer</label>
                                                            <input
                                                                className="w-full p-2 border border-gray-300 rounded"
                                                                type="text"
                                                                value={editWriter}
                                                                onChange={(e) => setEditWriter(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-gray-700">Content</label>
                                                        <textarea
                                                            className="w-full p-2 border border-gray-300 rounded min-h-[100px]"
                                                            value={editContent}
                                                            onChange={(e) => setEditContent(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-gray-700">Image</label>
                                                        <label className="flex items-center justify-between p-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                                                            <div className="flex items-center">
                                                                <FiImage className="mr-2 text-gray-500" />
                                                                <span className={editImage ? "text-gray-800" : "text-gray-500"}>
                                                                    {editImage ? editImage.name : 'Change image (optional)'}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm text-orange-500">Browse</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleEditImageChange}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-3 mt-4">
                                                <button 
                                                    type="button" 
                                                    onClick={() => setEditingWeb(null)}
                                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    type="submit"
                                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="p-6">
                                            <div className="flex items-start gap-6">
                                                <div className="flex-shrink-0">
                                                    <FaGlobe className="text-5xl text-indigo-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-800">{web.title}</h3>
                                                            <p className="text-sm text-gray-500 mt-1">By: {web.writer}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => handleUpdate(web)}
                                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                                                            >
                                                                <FaEdit size={18} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(web._id)}
                                                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-full"
                                                            >
                                                                <MdDeleteForever size={20} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="mt-3 text-gray-700 whitespace-pre-line">{web.content}</p>
                                                    {web.image && (
                                                        <div className="mt-4">
                                                            <img 
                                                                src={`https://backend-motafokeen-ajrd.onrender.com/api/web/${web._id}/image`} 
                                                                alt="Web" 
                                                                className="max-w-full h-auto max-h-60 rounded-lg"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="mt-4 text-xs text-gray-400">
                                                        {new Date(web.createdAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center py-8">
                            <p className="text-gray-500">No web posts found</p>
                        </div>
                    )}
                </div>
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
    )
};

export default Web;