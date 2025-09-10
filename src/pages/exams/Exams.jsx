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

 {/* Add Exam Marks */}
<section className="exams-section p-4 bg-white rounded-lg shadow-md mb-6">
  <header className="exams-section-header mb-4">
    <h1 className="text-[#40277E] text-xl font-semibold">Add Exam Marks</h1>
  </header>

  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
    {/* Row 1: Class, Subclass, Student, Semester, Subject */}
    <div className="flex flex-wrap gap-3">
      <div className="flex-1 min-w-[140px] flex flex-col">
        <label className="mb-1 text-gray-700 font-medium">Class</label>
        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
        >
          <option value="">Select Class</option>
          {classes.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      <div className="flex-1 min-w-[140px] flex flex-col">
        <label className="mb-1 text-gray-700 font-medium">Subclass</label>
        <select
          value={subclassName}
          onChange={(e) => setSubclassName(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
        >
          <option value="">Select Subclass</option>
          {subclasses.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
        </select>
      </div>

      <div className="flex-1 min-w-[180px] flex flex-col">
        <label className="mb-1 text-gray-700 font-medium">Student</label>
        <select
          value={studentIdentifier}
          onChange={(e) => setStudentIdentifier(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s._id} value={s.identifier}>
              {s.firstName} {s.lastName} ({s.identifier})
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[120px] flex flex-col">
        <label className="mb-1 text-gray-700 font-medium">Semester</label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
        >
          <option value="">Select Semester</option>
          {semesters.map((sem) => <option key={sem.value} value={sem.value}>{sem.label}</option>)}
        </select>
      </div>

      <div className="flex-1 min-w-[140px] flex flex-col">
        <label className="mb-1 text-gray-700 font-medium">Subject</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
        </select>
      </div>
    </div>

    {/* Row 2: Marks Inputs */}
    <div className="flex flex-wrap gap-3">
      <div className="flex-1 min-w-[120px] flex flex-col">
        <label className="mb-1 text-gray-700 font-medium">Verbal (10%)</label>
        <input
          type="number"
          value={verbal}
          onChange={(e) => setVerbal(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
        />
      </div>

      <div className="flex-1 min-w-[120px] flex flex-col">
        <label className="mb-1 text-gray-700 font-medium">Homeworks (20%)</label>
        <input
          type="number"
          value={homeworks}
          onChange={(e) => setHomeworks(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
        />
      </div>

      <div className="flex-1 min-w-[120px] flex flex-col">
        <label className="mb-1 text-gray-700 font-medium">Activities (20%)</label>
        <input
          type="number"
          value={activities}
          onChange={(e) => setActivities(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
        />
      </div>

      <div className="flex-1 min-w-[120px] flex flex-col">
        <label className="mb-1 text-gray-700 font-medium">Quiz (20%)</label>
        <input
          type="number"
          value={quiz}
          onChange={(e) => setQuiz(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
        />
      </div>

      <div className="flex-1 min-w-[120px] flex flex-col">
        <label className="mb-1 text-gray-700 font-medium">Final Exam (40%)</label>
        <input
          type="number"
          value={finalExam}
          onChange={(e) => setFinalExam(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
        />
      </div>
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

{/* Search / Filter Marks */}
<section className="exams-section search-panel p-4 bg-white rounded-lg shadow-md mb-6">
  <header className="exams-section-header mb-3">
    <h1 className="text-[#40277E] text-xl font-semibold">Search / Filter Marks</h1>
  </header>

  <form className="search-form flex flex-wrap gap-3 items-end" onSubmit={handleSearch}>
    <div className="flex flex-col flex-1 min-w-[120px]">
      <label className="mb-1 text-gray-700 font-medium">ID</label>
      <input
        type="text"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      />
    </div>

    <div className="flex flex-col flex-1 min-w-[140px]">
      <label className="mb-1 text-gray-700 font-medium">First Name</label>
      <input
        type="text"
        value={searchFirstName}
        onChange={(e) => setSearchFirstName(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      />
    </div>

    <div className="flex flex-col flex-1 min-w-[140px]">
      <label className="mb-1 text-gray-700 font-medium">Middle Name</label>
      <input
        type="text"
        value={searchMiddleName}
        onChange={(e) => setSearchMiddleName(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      />
    </div>

    <div className="flex flex-col flex-1 min-w-[140px]">
      <label className="mb-1 text-gray-700 font-medium">Last Name</label>
      <input
        type="text"
        value={searchLastName}
        onChange={(e) => setSearchLastName(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      />
    </div>

    <div className="flex flex-col flex-1 min-w-[120px]">
      <label className="mb-1 text-gray-700 font-medium">Class</label>
      <select
        value={searchClass}
        onChange={(e) => setSearchClass(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      >
        <option value="">Class</option>
        {classes.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
      </select>
    </div>

    <div className="flex flex-col flex-1 min-w-[120px]">
      <label className="mb-1 text-gray-700 font-medium">Semester</label>
      <select
        value={searchSemester}
        onChange={(e) => setSearchSemester(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      >
        <option value="">Semester</option>
        {semesters.map((sem) => <option key={sem.value} value={sem.value}>{sem.label}</option>)}
      </select>
    </div>

    <div className="flex flex-col flex-1 min-w-[140px]">
      <label className="mb-1 text-gray-700 font-medium">Subject</label>
      <select
        value={searchSubject}
        onChange={(e) => setSearchSubject(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40277E]"
      >
        <option value="">Subject</option>
        {subjects.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
      </select>
    </div>

    <button
      type="submit"
      className="bg-[#40277E] text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-[#5937B0]"
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
<section className="exams-section p-4 bg-white rounded-lg shadow-md mb-6">
  <header className="exams-section-header mb-4">
    <h1 className="text-[#40277E] text-xl font-semibold">Marks Control Panel</h1>
  </header>

  {loading ? (
    <p>Loading marks...</p>
  ) : error ? (
    <p className="text-red-500">{error}</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            {['Student', 'Semester', 'Subject', 'Verbal', 'Homeworks', 'Activities', 'Quiz', 'Final Exam', 'Total (60%)', 'Final Total (100%)', 'Result', 'Actions'].map((th, idx) => (
              <th key={idx} className="px-4 py-3 text-left font-medium text-gray-700">{th}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {marks.length === 0 && (
            <tr>
              <td colSpan="12" className="text-center py-6 text-gray-400">
                No marks found
              </td>
            </tr>
          )}

          {marks.map((m, index) => {
            const resultColor =
              m.result === 'passed' ? 'bg-green-500' :
              m.result === 'failed' ? 'bg-red-500' :
              'bg-gray-400';

            return (
              <tr key={m._id} className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} h-14`}>
                {editingMark && editingMark._id === m._id ? (
                  <>
                    <td className="px-4 py-2">{m.studentId?.firstName} {m.studentId?.lastName}</td>
                    <td className="px-4 py-2">{semesters.find(s => s.value == m.subjectId?.semester)?.label || m.subjectId?.semester}</td>
                    <td className="px-4 py-2">{m.subjectId?.name}</td>
                    {['Verbal', 'Homeworks', 'Activities', 'Quiz', 'Final Exam'].map((field, i) => (
                      <td key={i} className="px-2 py-2 text-center">
                        <input
                          type="number"
                          value={
                            field === 'Verbal' ? editVerbal :
                            field === 'Homeworks' ? editHomeworks :
                            field === 'Activities' ? editActivities :
                            field === 'Quiz' ? editQuiz :
                            editFinalExam
                          }
                          onChange={(e) => {
                            if(field==='Verbal') setEditVerbal(e.target.value)
                            else if(field==='Homeworks') setEditHomeworks(e.target.value)
                            else if(field==='Activities') setEditActivities(e.target.value)
                            else if(field==='Quiz') setEditQuiz(e.target.value)
                            else setEditFinalExam(e.target.value)
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#40277E]"
                        />
                      </td>
                    ))}
                    <td className="px-2 py-2 text-center">
                      {(+editVerbal*0.1 + +editHomeworks*0.2 + +editActivities*0.2 + +editQuiz*0.2).toFixed(2)}
                    </td>
                    <td className="px-2 py-2 text-center">
                      {(+editVerbal*0.1 + +editHomeworks*0.2 + +editActivities*0.2 + +editQuiz*0.2 + +editFinalExam*0.4).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`inline-block w-3 h-3 rounded-full ${resultColor}`}></span>
                    </td>
                    <td className="px-4 py-2 text-center flex justify-center gap-2">
                      <button onClick={handleUpdateSubmit} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition">Save</button>
                      <button onClick={() => setEditingMark(null)} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{m.studentId?.firstName} {m.studentId?.lastName}</td>
                    <td className="px-4 py-2">{semesters.find(s => s.value == m.subjectId?.semester)?.label || m.subjectId?.semester}</td>
                    <td className="px-4 py-2">{m.subjectId?.name}</td>
                    <td className="px-2 py-2 text-center">{m.verbal}</td>
                    <td className="px-2 py-2 text-center">{m.homeworks}</td>
                    <td className="px-2 py-2 text-center">{m.activities}</td>
                    <td className="px-2 py-2 text-center">{m.quiz}</td>
                    <td className="px-2 py-2 text-center">{m.finalExam}</td>
                    <td className="px-2 py-2 text-center">{m.total}</td>
                    <td className="px-2 py-2 text-center">{m.finalTotal}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`inline-block w-3 h-3 rounded-full ${resultColor}`}></span>
                    </td>
                    <td className="px-4 py-2 text-center flex justify-center gap-2">
                      <button onClick={() => {
                        setEditingMark(m);
                        setEditVerbal(m.verbal);
                        setEditHomeworks(m.homeworks);
                        setEditActivities(m.activities);
                        setEditQuiz(m.quiz);
                        setEditFinalExam(m.finalExam);
                      }} className="text-blue-600 hover:text-blue-800 transition"><FaUserEdit /></button>
                      <button onClick={() => handleDelete(m._id)} className="text-red-600 hover:text-red-800 transition"><MdDeleteForever /></button>
                    </td>
                  </>
                )}
              </tr>
            )
          })}
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
