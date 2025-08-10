import { useState, useEffect } from 'react';
import SideBar from '../../components/SideBar/SideBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Exams.css';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const Exams = () => {
  const [marks, setMarks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchSubjects, setSearchSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    class: '',
    semester: '',
    subject: '',
    firstQuiz: '',
    secondQuiz: '',
    finalExam: ''
  });

  const [searchData, setSearchData] = useState({
    id: '',
    class: '',
    semester: '',
    subject: ''
  });

  const [editingMark, setEditingMark] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch('http://localhost:3000/dashboard/classes');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setClasses(data.data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchFormSubjects = async () => {
      if (formData.class && formData.semester) {
        try {
          const res = await fetch(`http://localhost:3000/dashboard/subjects/by-class-semester?class=${formData.class}&semester=${formData.semester}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          setSubjects(data.data || []);
        } catch (err) {
          toast.error(err.message);
          setSubjects([]);
        }
      } else {
        setSubjects([]);
      }
    };
    fetchFormSubjects();
  }, [formData.class, formData.semester]);

  useEffect(() => {
    const fetchSearchSubjects = async () => {
      if (searchData.class && searchData.semester) {
        try {
          const res = await fetch(`http://localhost:3000/dashboard/subjects/by-class-semester?class=${searchData.class}&semester=${searchData.semester}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          setSearchSubjects(data.data || []);
        } catch (err) {
          toast.error(err.message);
          setSearchSubjects([]);
        }
      } else {
        setSearchSubjects([]);
      }
    };
    fetchSearchSubjects();
  }, [searchData.class, searchData.semester]);

  const fetchMarks = async () => {
    try {
      const filters = {};

      if (searchData.id.trim() !== '') filters.id = searchData.id.trim();
      if (searchData.class.trim() !== '') filters.class = searchData.class.trim();
      if (searchData.semester !== '' && searchData.semester !== null && searchData.semester !== undefined)
        filters.semester = searchData.semester;
      if (searchData.subject.trim() !== '') filters.subject = searchData.subject.trim();

      if (Object.keys(filters).length === 0) {
        throw new Error('Please provide at least one filter');
      }

      setLoading(true);

      const res = await fetch('http://localhost:3000/dashboard/marks/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMarks(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'class' || name === 'semester' ? { subject: '' } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, class: className, semester, subject, firstQuiz, secondQuiz, finalExam } = formData;
      if (!id || !className || !semester || !subject) throw new Error('All fields required');
      const res = await fetch('http://localhost:3000/dashboard/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, class: className, subject, firstQuiz: +firstQuiz, secondQuiz: +secondQuiz, finalExam: +finalExam })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
      resetForm();
      // No automatic fetchMarks here as requested
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!editingMark) return;
      const res = await fetch(`http://localhost:3000/dashboard/marks/${editingMark._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstQuiz: +formData.firstQuiz,
          secondQuiz: +formData.secondQuiz,
          finalExam: +formData.finalExam
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
      resetForm();
      // No automatic fetchMarks here as requested
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm('Are you sure?')) return;
      const res = await fetch(`http://localhost:3000/dashboard/marks/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
      // No automatic fetchMarks here as requested
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetForm = () => {
    setEditingMark(null);
    setFormData({ id: '', class: '', semester: '', subject: '', firstQuiz: '', secondQuiz: '', finalExam: '' });
  };

  const startEditing = (mark) => {
    setEditingMark(mark);
    setFormData({
      id: mark.studentId.identifier,
      class: mark.subjectId.classId.name,
      semester: mark.subjectId.semester.toString(),
      subject: mark.subjectId.name,
      firstQuiz: mark.firstQuiz,
      secondQuiz: mark.secondQuiz,
      finalExam: mark.finalExam
    });
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="mt-[120px] ml-10 w-full pr-10">
        {/* Create Mark Section */}
        <div className="section-card">
          <h2 className="section-title">Create Mark</h2>
          <p className="section-subtitle">Fill out all fields to add a new mark</p>

          <form onSubmit={editingMark ? handleUpdate : handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Student ID</label>
              <input type="text" className="form-input" name="id" value={formData.id} onChange={handleInputChange} required disabled={!!editingMark} />
            </div>

            <div>
              <label className="form-label">Class</label>
              <select className="form-input" name="class" value={formData.class} onChange={handleInputChange} required disabled={!!editingMark}>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">Semester</label>
              <select className="form-input" name="semester" value={formData.semester} onChange={handleInputChange} required disabled={!!editingMark}>
                <option value="">Select Semester</option>
                <option value={1}>الفصل الأول</option>
                <option value={2}>الفصل الثاني</option>
              </select>
            </div>

            <div>
              <label className="form-label">Subject</label>
              <select className="form-input" name="subject" value={formData.subject} onChange={handleInputChange} required disabled={!!editingMark}>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">First Quiz</label>
              <input type="number" className="form-input" name="firstQuiz" value={formData.firstQuiz} onChange={handleInputChange} required />
            </div>

            <div>
              <label className="form-label">Second Quiz</label>
              <input type="number" className="form-input" name="secondQuiz" value={formData.secondQuiz} onChange={handleInputChange} required />
            </div>

            <div>
              <label className="form-label">Final Exam</label>
              <input type="number" className="form-input" name="finalExam" value={formData.finalExam} onChange={handleInputChange} required />
            </div>

            <div className="col-span-2">
              {editingMark ? (
                <div className="flex gap-3">
                  <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
                  <button type="submit" className="action-button">Update Mark</button>
                </div>
              ) : (
                <button type="submit" className="action-button">Create Mark</button>
              )}
            </div>
          </form>
        </div>

        {/* Marks Control Panel */}
        <div className="section-card">
          <h2 className="section-title">Marks Control Panel</h2>
          <p className="section-subtitle">Search, edit, or delete marks</p>

          {/* Search Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="form-label">Student ID</label>
              <input type="text" className="form-input" name="id" value={searchData.id} onChange={handleSearchChange} />
            </div>

            <div className="col-span-2 flex gap-4 items-center">
              <div className="w-1/3">
                <label className="form-label">Class</label>
                <select className="form-input" name="class" value={searchData.class} onChange={handleSearchChange}>
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="w-1/3">
                <label className="form-label">Semester</label>
                <select className="form-input" name="semester" value={searchData.semester} onChange={handleSearchChange}>
                  <option value="">Select Semester</option>
                  <option value={1}>الفصل الأول</option>
                  <option value={2}>الفصل الثاني</option>
                </select>
              </div>

              <div className="w-1/3">
                <label className="form-label">Subject</label>
                <select className="form-input" name="subject" value={searchData.subject} onChange={handleSearchChange} disabled={!searchData.class || !searchData.semester}>
                  <option value="">Select Subject</option>
                  {searchSubjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="col-span-2">
              <button className="action-button flex items-center gap-2" onClick={fetchMarks}><FaSearch /> Search</button>
            </div>
          </div>

          {/* Marks List */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : marks.length === 0 ? (
            <p>No marks found.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {marks.map(mark => (
                <div key={mark._id} className="cardInfoBoard flex justify-between items-center flex-col md:flex-row gap-4">
                  <div>
                    <p className="font-bold">{mark.studentId?.firstName} {mark.studentId?.lastName}</p>
                    <p className="text-sm text-gray-500">{mark.subjectId?.name} (Semester {mark.subjectId?.semester})</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span>Q1: {mark.firstQuiz}</span>
                    <span>Q2: {mark.secondQuiz}</span>
                    <span>Final: {mark.finalExam}</span>
                    <span className="font-bold text-[#40277E]">Total: {mark.total}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditing(mark)}><FaEdit className="text-[#40277E] text-xl hover:scale-110 transition" /></button>
                    <button onClick={() => handleDelete(mark._id)}><FaTrash className="text-[#FB7D5B] text-xl hover:scale-110 transition" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={4000} />
    </div>
  );
};

export default Exams;
