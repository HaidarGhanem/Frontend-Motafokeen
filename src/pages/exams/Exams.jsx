import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Exams.css';
import { FaUserEdit, FaSearch } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";

const Exams = () => {
  const [classes, setClasses] = useState([]);
  const [subclasses, setSubclasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form fields
  const [className, setClassName] = useState('');
  const [subclassName, setSubclassName] = useState('');
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [verbal, setVerbal] = useState('');
  const [homeworks, setHomeworks] = useState('');
  const [activities, setActivities] = useState('');
  const [quiz, setQuiz] = useState('');
  const [finalExam, setFinalExam] = useState('');

  // Edit state
  const [editingMark, setEditingMark] = useState(null);
  const [editVerbal, setEditVerbal] = useState('');
  const [editHomeworks, setEditHomeworks] = useState('');
  const [editActivities, setEditActivities] = useState('');
  const [editQuiz, setEditQuiz] = useState('');
  const [editFinalExam, setEditFinalExam] = useState('');

  // Search filters
  const [searchId, setSearchId] = useState('');
  const [searchFirstName, setSearchFirstName] = useState('');
  const [searchMiddleName, setSearchMiddleName] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [searchClass, setSearchClass] = useState('');
  const [searchSemester, setSearchSemester] = useState('');
  const [searchSubject, setSearchSubject] = useState('');

  const semesters = [
    { value: '1', label: 'الفصل الأول' },
    { value: '2', label: 'الفصل الثاني' },
  ];

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await fetch("https://backend-motafokeen-ajrd.onrender.com/dashboard/classes");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch classes");
      setClasses(data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchSubclasses = async (className) => {
    try {
      const cls = classes.find(c => c.name === className);
      if (!cls) return setSubclasses([]);
      const res = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/subclasses/by-class/${cls._id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSubclasses(data.data);
    } catch (err) {
      toast.error(err.message);
      setSubclasses([]);
    }
  };

  const fetchStudents = async (cls, sub) => {
    try {
      const clsObj = classes.find(c => c.name === cls);
      const subObj = subclasses.find(s => s.name === sub);
      if (!clsObj || !subObj) return;
      const res = await fetch(
        `https://backend-motafokeen-ajrd.onrender.com/dashboard/students?classId=${clsObj._id}&subclassId=${subObj._id}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStudents(data.data || []);
    } catch (err) {
      toast.error(err.message);
      setStudents([]);
    }
  };

  const fetchSubjects = async (cls, sem) => {
    try {
      if (!cls || !sem) return [];
      const res = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/subjects/by-class-semester?class=${cls}&semester=${sem}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.data || [];
    } catch (err) {
      toast.error(err.message);
      return [];
    }
  };

  const fetchMarks = async (filters = {}) => {
    try {
      setLoading(true);
      const res = await fetch("https://backend-motafokeen-ajrd.onrender.com/dashboard/marks/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch marks");
      setMarks(data.data || []);
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
      const res = await fetch("https://backend-motafokeen-ajrd.onrender.com/dashboard/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: studentIdentifier,
          class: className,
          subject,
          semester,
          verbal: +verbal,
          homeworks: +homeworks,
          activities: +activities,
          quiz: +quiz,
          finalExam: +finalExam
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save mark");
      toast.success("Mark saved successfully");

      setStudentIdentifier('');
      setSubject('');
      setVerbal('');
      setHomeworks('');
      setActivities('');
      setQuiz('');
      setFinalExam('');

      fetchMarks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/marks/${editingMark._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verbal: +editVerbal,
          homeworks: +editHomeworks,
          activities: +editActivities,
          quiz: +editQuiz,
          finalExam: +editFinalExam
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Mark updated successfully");
        setEditingMark(null);
        fetchMarks();
      } else {
        toast.error(data.message || "Failed to update mark");
      }
    } catch (err) {
      toast.error("An error occurred during mark update");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/marks/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Mark deleted successfully");
        fetchMarks();
      } else {
        toast.error(data.message || "Failed to delete mark");
      }
    } catch (err) {
      toast.error("An error occurred during mark deletion");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {
      id: searchId,
      firstName: searchFirstName,
      middleName: searchMiddleName,
      lastName: searchLastName,
      class: searchClass,
      semester: searchSemester,
      subject: searchSubject
    };
    fetchMarks(filters);
  };

  const clearSearch = () => {
    setSearchId('');
    setSearchFirstName('');
    setSearchMiddleName('');
    setSearchLastName('');
    setSearchClass('');
    setSearchSemester('');
    setSearchSubject('');
    fetchMarks();
  };

  useEffect(() => {
    fetchClasses();
    fetchMarks();
  }, []);

  useEffect(() => {
    if (className) fetchSubclasses(className);
  }, [className]);

  useEffect(() => {
    if (className && subclassName) fetchStudents(className, subclassName);
  }, [className, subclassName]);

  useEffect(() => {
    if (className && semester) {
      fetchSubjects(className, semester).then(setSubjects);
    }
  }, [className, semester]);

  return (
    <>
      <div className="flex">
        <SideBar />
        <main className="exams-main-container flex-1">

          {/* Add Marks Form */}
          <section className="exams-section p-4 bg-white rounded-lg shadow-md mb-6">
  <header className="exams-section-header mb-4">
    <h1 className="text-[#40277E] text-xl font-semibold">Add Exam Marks</h1>
  </header>

  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
    {/* Row 1: Class, Subclass, Student, Semester, Subject */}
    <div className="flex flex-wrap gap-3">
      <select
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        required
        className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      >
        <option value="">Select Class</option>
        {classes.map((c) => (
          <option key={c._id} value={c.name}>{c.name}</option>
        ))}
      </select>

      <select
        value={subclassName}
        onChange={(e) => setSubclassName(e.target.value)}
        required
        className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      >
        <option value="">Select Subclass</option>
        {subclasses.map((s) => (
          <option key={s._id} value={s.name}>{s.name}</option>
        ))}
      </select>

      <select
        value={studentIdentifier}
        onChange={(e) => setStudentIdentifier(e.target.value)}
        required
        className="flex-1 min-w-[180px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      >
        <option value="">Select Student</option>
        {students.map((s) => (
          <option key={s._id} value={s.identifier}>
            {s.firstName} {s.lastName} ({s.identifier})
          </option>
        ))}
      </select>

      <select
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
        required
        className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      >
        <option value="">Select Semester</option>
        {semesters.map((sem) => (
          <option key={sem.value} value={sem.value}>{sem.label}</option>
        ))}
      </select>

      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
        className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      >
        <option value="">Select Subject</option>
        {subjects.map((s) => (
          <option key={s._id} value={s.name}>{s.name}</option>
        ))}
      </select>
    </div>

    {/* Row 2: Marks Inputs */}
    <div className="flex flex-wrap gap-3">
      <input
        type="number"
        placeholder="Verbal (10%)"
        value={verbal}
        onChange={(e) => setVerbal(e.target.value)}
        required
        className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      />
      <input
        type="number"
        placeholder="Homeworks (20%)"
        value={homeworks}
        onChange={(e) => setHomeworks(e.target.value)}
        required
        className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      />
      <input
        type="number"
        placeholder="Activities (20%)"
        value={activities}
        onChange={(e) => setActivities(e.target.value)}
        required
        className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      />
      <input
        type="number"
        placeholder="Quiz (20%)"
        value={quiz}
        onChange={(e) => setQuiz(e.target.value)}
        required
        className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      />
      <input
        type="number"
        placeholder="Final Exam (40%)"
        value={finalExam}
        onChange={(e) => setFinalExam(e.target.value)}
        required
        className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      />
    </div>

    {/* Row 3: Full-width Button */}
    <div>
      <button
        type="submit"
        className="w-full bg-[#40277E] text-white py-3 rounded-lg hover:bg-[#5937B0] transition-colors"
      >
        Add Mark
      </button>
    </div>
  </form>
</section>


          {/* Search Filters */}
          <section className="exams-section search-panel p-4 bg-white rounded-lg shadow-md mb-6">
  <header className="exams-section-header mb-3">
    <h1 className="text-[#40277E] text-xl font-semibold">Search / Filter Marks</h1>
  </header>
  <form className="search-form flex flex-wrap gap-3 items-end" onSubmit={handleSearch}>
    <input
      type="text"
      placeholder="ID"
      value={searchId}
      onChange={(e) => setSearchId(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E] flex-1 min-w-[120px]"
    />
    <input
      type="text"
      placeholder="First Name"
      value={searchFirstName}
      onChange={(e) => setSearchFirstName(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E] flex-1 min-w-[140px]"
    />
    <input
      type="text"
      placeholder="Middle Name"
      value={searchMiddleName}
      onChange={(e) => setSearchMiddleName(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E] flex-1 min-w-[140px]"
    />
    <input
      type="text"
      placeholder="Last Name"
      value={searchLastName}
      onChange={(e) => setSearchLastName(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E] flex-1 min-w-[140px]"
    />
    <select
      value={searchClass}
      onChange={(e) => setSearchClass(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E] flex-1 min-w-[120px]"
    >
      <option value="">Class</option>
      {classes.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
    </select>
    <select
      value={searchSemester}
      onChange={(e) => setSearchSemester(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E] flex-1 min-w-[120px]"
    >
      <option value="">Semester</option>
      {semesters.map((sem) => <option key={sem.value} value={sem.value}>{sem.label}</option>)}
    </select>
    <select
      value={searchSubject}
      onChange={(e) => setSearchSubject(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E] flex-1 min-w-[140px]"
    >
      <option value="">Subject</option>
      {subjects.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
    </select>
    <button
      type="submit"
      className="bg-[#40277E] text-white px-4 py-2 rounded-lg hover:bg-[#5937B0] flex items-center gap-1"
    >
      <FaSearch /> Search
    </button>
    <button
      type="button"
      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
      onClick={clearSearch}
    >
      Clear
    </button>
  </form>
</section>


          {/* Marks Table */}
          <section className="exams-section">
            <header className="exams-section-header">
              <h1 className='text-[#40277E]'>Marks Control Panel</h1>
            </header>

            {loading ? <p>Loading marks...</p> : error ? <p className="text-error">{error}</p> : (
              <div className="marks-table-container">
                <table className="marks-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Semester</th>
                      <th>Subject</th>
                      <th>Verbal</th>
                      <th>Homeworks</th>
                      <th>Activities</th>
                      <th>Quiz</th>
                      <th>Final Exam</th>
                      <th>Total (60%)</th>
                      <th>Final Total (100%)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.length === 0 && <tr><td colSpan="11" className="text-center">No marks found</td></tr>}
                    {marks.map((m) => (
                      <tr key={m._id}>
                        {editingMark && editingMark._id === m._id ? (
                          <>
                            <td>{m.studentId?.firstName} {m.studentId?.lastName}</td>
                            <td>{semesters.find(s => s.value == m.subjectId?.semester)?.label || m.subjectId?.semester}</td>
                            <td>{m.subjectId?.name}</td>
                            <td><input type="number" value={editVerbal} onChange={(e) => setEditVerbal(e.target.value)} /></td>
                            <td><input type="number" value={editHomeworks} onChange={(e) => setEditHomeworks(e.target.value)} /></td>
                            <td><input type="number" value={editActivities} onChange={(e) => setEditActivities(e.target.value)} /></td>
                            <td><input type="number" value={editQuiz} onChange={(e) => setEditQuiz(e.target.value)} /></td>
                            <td><input type="number" value={editFinalExam} onChange={(e) => setEditFinalExam(e.target.value)} /></td>
                            <td>{(+editVerbal*0.1 + +editHomeworks*0.2 + +editActivities*0.2 + +editQuiz*0.2).toFixed(2)}</td>
                            <td>{(+editVerbal*0.1 + +editHomeworks*0.2 + +editActivities*0.2 + +editQuiz*0.2 + +editFinalExam*0.4).toFixed(2)}</td>
                            <td>
                              <div className="table-actions">
                                <button onClick={handleUpdateSubmit} className="btn-save">Save</button>
                                <button onClick={() => setEditingMark(null)} className="btn-cancel">Cancel</button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{m.studentId?.firstName} {m.studentId?.lastName}</td>
                            <td>{semesters.find(s => s.value == m.subjectId?.semester)?.label || m.subjectId?.semester}</td>
                            <td>{m.subjectId?.name}</td>
                            <td>{m.verbal}</td>
                            <td>{m.homeworks}</td>
                            <td>{m.activities}</td>
                            <td>{m.quiz}</td>
                            <td>{m.finalExam}</td>
                            <td>{m.total}</td>
                            <td>{m.finalTotal}</td>
                            <td>
                              <div className="table-actions">
                                <button onClick={() => {
                                  setEditingMark(m);
                                  setEditVerbal(m.verbal);
                                  setEditHomeworks(m.homeworks);
                                  setEditActivities(m.activities);
                                  setEditQuiz(m.quiz);
                                  setEditFinalExam(m.finalExam);
                                }}><FaUserEdit className="icon-edit" /></button>
                                <button onClick={() => handleDelete(m._id)}><MdDeleteForever className="icon-delete" /></button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </>
  );
};

export default Exams;
