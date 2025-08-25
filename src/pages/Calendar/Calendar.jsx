import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Calendar.css';
import { FaCalendarAlt } from 'react-icons/fa';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const Calendar = () => {
    const [classes, setClasses] = useState([]);
    const [subclasses, setSubclasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubclass, setSelectedSubclass] = useState('');
    const [day, setDay] = useState('');
    const [items, setItems] = useState([{ subject: '', teacher: '', startTime: '', endTime: '' }]);
    const [allSchedules, setAllSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [editDay, setEditDay] = useState('');
    const [editItems, setEditItems] = useState([{ subject: '', teacher: '', startTime: '', endTime: '' }]);
    const [filterDay, setFilterDay] = useState('');
    const [filterSubject, setFilterSubject] = useState('');

    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

    const fetchClasses = async () => {
        try {
            const response = await fetch('http://localhost:3000/dashboard/classes');
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch classes');
            
            if (data.success) {
                setClasses(data.data);
                if (data.data.length > 0) {
                    setSelectedClass(data.data[0].name);
                }
            }
        } catch (err) {
            toast.error(err.message || 'Failed to fetch classes', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const fetchSubclasses = async () => {
        if (!selectedClass) return;
        try {
            const response = await fetch('http://localhost:3000/dashboard/subclasses/all', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ class: selectedClass })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch subclasses');
            
            if (data.success) {
                setSubclasses(data.data);
                if (data.data.length > 0) {
                    setSelectedSubclass(data.data[0].name);
                } else {
                    setSelectedSubclass('');
                }
            }
        } catch (err) {
            toast.error(err.message || 'Failed to fetch subclasses', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const fetchSchedules = async () => {
        if (!selectedClass || !selectedSubclass) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/dashboard/schedule/subclass', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    class: selectedClass,
                    subclass: selectedSubclass 
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch schedules');
            
            if (data.success) {
                if (data.data && data.data.schedules) {
                    setAllSchedules(data.data.schedules);
                } else {
                    setAllSchedules([]);
                }
            }
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'Failed to fetch schedules', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
        }
    };

    const addItem = () => {
        setItems([...items, { subject: '', teacher: '', startTime: '', endTime: '' }]);
    };

    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!day || items.length === 0 || items.some(item => !item.subject || !item.teacher || !item.startTime || !item.endTime)) {
            toast.error('Please fill all fields and add at least one valid schedule item', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/dashboard/schedule/day', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    class: selectedClass,
                    subclass: selectedSubclass,
                    day,
                    items
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create schedule');
            
            if (data.success) {
                toast.success(data.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                
                setDay('');
                setItems([{ subject: '', teacher: '', startTime: '', endTime: '' }]);
                fetchSchedules();
            }
        } catch (err) {
            toast.error(err.message || 'Failed to create schedule', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleUpdate = (schedule) => {
        setEditingSchedule(schedule);
        setEditDay(schedule.day);
        setEditItems([...schedule.items]);
    };

    const addEditItem = () => {
        setEditItems([...editItems, { subject: '', teacher: '', startTime: '', endTime: '' }]);
    };

    const removeEditItem = (index) => {
        const newItems = [...editItems];
        newItems.splice(index, 1);
        setEditItems(newItems);
    };

    const handleEditItemChange = (index, field, value) => {
        const newItems = [...editItems];
        newItems[index][field] = value;
        setEditItems(newItems);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/dashboard/schedule/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    class: selectedClass,
                    subclass: selectedSubclass,
                    day: editDay,
                    items: editItems
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update schedule');
            
            if (data.success) {
                toast.success(data.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setEditingSchedule(null);
                fetchSchedules();
            }
        } catch (err) {
            toast.error(err.message || 'Failed to update schedule', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleDelete = async (dayToDelete) => {
        try {
            // First get the subclassId
            const classResponse = await fetch('http://localhost:3000/dashboard/classes');
            const classData = await classResponse.json();
            if (!classResponse.ok) throw new Error(classData.message || 'Failed to fetch class');
            
            const classInfo = classData.data.find(c => c.name === selectedClass);
            if (!classInfo) throw new Error('Class not found');
            
            const subclassResponse = await fetch('http://localhost:3000/dashboard/subclasses/all', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ class: selectedClass })
            });
            
            const subclassData = await subclassResponse.json();
            if (!subclassResponse.ok) throw new Error(subclassData.message || 'Failed to fetch subclasses');
            
            const subclassInfo = subclassData.data.find(s => s.name === selectedSubclass);
            if (!subclassInfo) throw new Error('Subclass not found');
            
            // Now delete the day schedule
            const response = await fetch(`http://localhost:3000/dashboard/schedule/${subclassInfo._id}/day/${dayToDelete}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to delete schedule');
            
            if (data.success) {
                toast.success('Day schedule deleted successfully', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                fetchSchedules();
            }
        } catch (err) {
            toast.error(err.message || 'Failed to delete schedule', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const filteredSchedules = allSchedules.filter(schedule => {
        const matchesDay = filterDay ? schedule.day.includes(filterDay) : true;
        const matchesSubject = filterSubject ? 
            schedule.items.some(item => item.subject.toLowerCase().includes(filterSubject.toLowerCase())) : true;
        return matchesDay && matchesSubject;
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchSubclasses();
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedClass && selectedSubclass) {
            fetchSchedules();
        }
    }, [selectedClass, selectedSubclass]);

    return (
        <div className='flex'>
            <SideBar />
            <div className="mainCalendar bg-gray-50 flex-1 ml-5 mt-[100px]">
                <div className="p-8">
                    {/* Create Schedule Section */}
                    <div className="mb-12 bg-white rounded-lg shadow p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-[#40277E]">Create Schedule</h1>
                            <p className="text-gray-600">Please select class, subclass, day and add schedule items</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Class Select */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium">Class:</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                    >
                                        {classes.map(cls => (
                                            <option key={cls._id} value={cls.name}>{cls.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subclass Select */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium">Subclass:</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
                                        value={selectedSubclass}
                                        onChange={(e) => setSelectedSubclass(e.target.value)}
                                        disabled={!selectedClass || subclasses.length === 0}
                                    >
                                        {subclasses.length > 0 ? (
                                            subclasses.map(sub => (
                                                <option key={sub._id} value={sub.name}>{sub.name}</option>
                                            ))
                                        ) : (
                                            <option value="">No subclasses available</option>
                                        )}
                                    </select>
                                </div>

                                {/* Day Select */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium">Day:</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
                                        value={day}
                                        onChange={(e) => setDay(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a day</option>
                                        {days.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Schedule Items */}
                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-600">Subject</label>
                                            <input
                                                className="w-full p-2 border border-gray-300 rounded"
                                                type="text"
                                                placeholder="Subject"
                                                value={item.subject}
                                                onChange={(e) => handleItemChange(index, 'subject', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-600">Teacher</label>
                                            <input
                                                className="w-full p-2 border border-gray-300 rounded"
                                                type="text"
                                                placeholder="Teacher"
                                                value={item.teacher}
                                                onChange={(e) => handleItemChange(index, 'teacher', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-600">Start Time</label>
                                            <input
                                                className="w-full p-2 border border-gray-300 rounded"
                                                type="time"
                                                value={item.startTime}
                                                onChange={(e) => handleItemChange(index, 'startTime', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-600">End Time</label>
                                            <input
                                                className="w-full p-2 border border-gray-300 rounded"
                                                type="time"
                                                value={item.endTime}
                                                onChange={(e) => handleItemChange(index, 'endTime', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    Add Item
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#40277E] text-white rounded hover:bg-orange-600 transition-colors"
                                >
                                    Create Schedule
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Schedules Control Panel */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-[#40277E]">Schedules Control Panel</h1>
                            <p className="text-gray-600">Here You Can View, Edit and Delete Schedules</p>
                            
                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium">Filter by Day:</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
                                        value={filterDay}
                                        onChange={(e) => setFilterDay(e.target.value)}
                                    >
                                        <option value="">All Days</option>
                                        {days.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium">Filter by Subject:</label>
                                    <input
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
                                        type="text"
                                        placeholder="Subject name"
                                        value={filterSubject}
                                        onChange={(e) => setFilterSubject(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <p className="text-gray-500">Loading schedules...</p>
                            </div>
                        ) : error ? (
                            <p className="text-red-500 py-4">{error}</p>
                        ) : filteredSchedules.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredSchedules.map((schedule) => (
                                            schedule.items.map((item, itemIndex) => (
                                                <tr key={`${schedule.day}-${itemIndex}`} className="hover:bg-gray-50">
                                                    {itemIndex === 0 && (
                                                        <td rowSpan={schedule.items.length} className="px-6 py-4 whitespace-nowrap align-top">
                                                            <span className="font-medium">{schedule.day}</span>
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.subject}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.teacher}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.startTime} - {item.endTime}
                                                    </td>
                                                    {itemIndex === 0 && (
                                                        <td rowSpan={schedule.items.length} className="px-6 py-4 whitespace-nowrap align-top">
                                                            <div className="flex space-x-2">
                                                                <button 
                                                                    onClick={() => handleUpdate(schedule)}
                                                                    className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                                                                >
                                                                    <FaEdit size={18} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDelete(schedule.day)}
                                                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                                                >
                                                                    <MdDeleteForever size={20} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center py-8">
                                <p className="text-gray-500">No schedules found matching your criteria</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Edit Schedule Modal */}
                {editingSchedule && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Schedule for {editDay}</h2>
                            <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                <div className="space-y-3">
                                    {editItems.map((item, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                                            <div className="space-y-1">
                                                <label className="text-sm text-gray-600">Subject</label>
                                                <input
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    type="text"
                                                    placeholder="Subject"
                                                    value={item.subject}
                                                    onChange={(e) => handleEditItemChange(index, 'subject', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm text-gray-600">Teacher</label>
                                                <input
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    type="text"
                                                    placeholder="Teacher"
                                                    value={item.teacher}
                                                    onChange={(e) => handleEditItemChange(index, 'teacher', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm text-gray-600">Start Time</label>
                                                <input
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    type="time"
                                                    value={item.startTime}
                                                    onChange={(e) => handleEditItemChange(index, 'startTime', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm text-gray-600">End Time</label>
                                                <input
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    type="time"
                                                    value={item.endTime}
                                                    onChange={(e) => handleEditItemChange(index, 'endTime', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeEditItem(index)}
                                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingSchedule(null)}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addEditItem}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Add Item
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                    >
                                        Update Schedule
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

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
        </div>
    )
}

export default Calendar;