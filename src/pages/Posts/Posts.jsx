import SideBar from '../../components/SideBar/SideBar'
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Posts.css'
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";
import { FiImage } from "react-icons/fi";
import { FaBlog } from "react-icons/fa";

const Posts = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [writer, setWriter] = useState('');
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editWriter, setEditWriter] = useState('');
    const [editImage, setEditImage] = useState(null);

    const resetForm = () => {
        setTitle('');
        setContent('');
        setWriter('');
        setImage(null);
        const imageInput = document.getElementById('image');
        if (imageInput) imageInput.value = '';
    };

    const resetEditForm = () => {
        setEditingPost(null);
        setEditTitle('');
        setEditContent('');
        setEditWriter('');
        setEditImage(null);
        const editImageInput = document.getElementById('edit-image');
        if (editImageInput) editImageInput.value = '';
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleEditImageChange = (e) => {
        if (e.target.files[0]) {
            setEditImage(e.target.files[0]);
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
            const response = await fetch('http://localhost:3000/dashboard/posts', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create post');
            }

            const data = await response.json();
            
            toast.success(data.message);
            resetForm();
            fetchPosts();
        } catch (err) {
            console.error('Create error:', err);
            toast.error(err.message || 'Failed to create post');
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:3000/dashboard/posts/', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
        
            if (data.success) {
                setAllPosts(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch posts');
            }
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (post) => {
        setEditingPost(post);
        setEditTitle(post.title);
        setEditContent(post.content);
        setEditWriter(post.writer);
        setEditImage(null);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('content', editContent);
        formData.append('writer', editWriter);
        
        if (editImage) {
            formData.append('image', editImage);
        }

        try {
            const response = await fetch(`http://localhost:3000/dashboard/posts/${editingPost._id}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update post');
            }

            const data = await response.json();
            
            toast.success(data.message);
            resetEditForm();
            fetchPosts();
        } catch (err) {
            console.error('Update error:', err);
            toast.error(err.message || 'Failed to update post');
        }
    };

    const handleDelete = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/dashboard/posts/${postId}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
        
            if (data.success) {
                toast.success(data.message);
                fetchPosts();
            } else {
                toast.error(data.message || 'Failed to delete post');
            }
        } catch (err) {
            toast.error('An error occurred during post deletion');
            console.error('Delete error:', err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <SideBar />
            
            <div className="mainmainPost flex-1 p-8 ml-64">
                {/* Create Post Section */}
                <div className="mb-12 shadow p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-[#40277E]">Create Post</h1>
                        <p className="text-gray-600">Create a new blog post with optional image</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Title:</label>
                                <input
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    id="title"
                                    type="text"
                                    placeholder="Post title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Content:</label>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-[150px]"
                                    id="content"
                                    placeholder="Post content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Writer:</label>
                                <input
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    id="writer"
                                    type="text"
                                    placeholder="Post writer (default: الإدارة المدرسية)"
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
                                        id="image"
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
                            Create Post
                        </button>
                    </form>
                </div>

                {/* Posts Control Panel */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-[#40277E]">Posts Control Panel</h1>
                        <p className="text-gray-600">Manage all blog posts</p>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <p className="text-gray-500">Loading posts...</p>
                        </div>
                    ) : error ? (
                        <p className="text-red-500 py-4">{error}</p>
                    ) : allPosts && allPosts.length > 0 ? (
                        <div className="space-y-6">
                            {allPosts.map((post) => (
                                <div key={post._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                    {editingPost && editingPost._id === post._id ? (
                                        <form onSubmit={handleUpdateSubmit} className="p-6">
                                            <div className="flex items-start gap-6">
                                                <div className="flex-shrink-0">
                                                    <FaBlog className="text-5xl text-indigo-600 mt-1" />
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
                                                                id="edit-image"
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
                                                    onClick={resetEditForm}
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
                                                    <FaBlog className="text-5xl text-indigo-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                                                            <p className="text-sm text-gray-500 mt-1">By: {post.writer}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => handleUpdate(post)}
                                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                                                            >
                                                                <FaEdit size={18} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(post._id)}
                                                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-full"
                                                            >
                                                                <MdDeleteForever size={20} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="mt-3 text-gray-700 whitespace-pre-line">{post.content}</p>
                                                    {post.image && (
                                                        <div className="mt-4">
                                                            <img 
                                                                src={`http://localhost:3000/dashboard/posts/${post._id}/image`} 
                                                                alt="Post" 
                                                                className="max-w-full h-auto max-h-60 rounded-lg"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="mt-4 text-xs text-gray-400">
                                                        {new Date(post.createdAt).toLocaleString()}
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
                            <p className="text-gray-500">No posts found</p>
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
}

export default Posts;