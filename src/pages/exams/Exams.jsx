import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Exams.css';
import { FaUserEdit } from 'react-icons/fa';
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
  const [firstQuiz, setFirstQuiz] = useState('');
  const [secondQuiz, setSecondQuiz] = useState('');
  const [finalExam, setFinalExam] = useState('');

  // Edit state
  const [editingMark, setEditingMark] = useState(null);
  const [editFirstQuiz, setEditFirstQuiz] = useState('');
  const [editSecondQuiz, setEditSecondQuiz] = useState('');
  const [editFinalExam, setEditFinalExam] = useState('');

  // Search filters
  const [searchId, setSearchId] = useState('');
  const [searchFirstName, setSearchFirstName] = useState('');
  const [searchMiddleName, setSearchMiddleName] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [searchClass, setSearchClass] = useState('');
  const [searchSemester, setSearchSemester] = useState('');
  const [searchSubject, setSearchSubject] = useState('');

  // 🔹 Centralized semesters
  const semesters = [
    { value: '1', label: 'الفصل الأول' },
    { value: '2', label: 'الفصل الثاني' },
  ];

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await fetch("http://localhost:3000/dashboard/classes");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch classes");
      setClasses(data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Fetch subclasses
  const fetchSubclasses = async (className) => {
    try {
      const cls = classes.find(c => c.name === className);
      if (!cls) return setSubclasses([]);
      const res = await fetch(`http://localhost:3000/dashboard/subclasses/by-class/${cls._id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSubclasses(data.data);
    } catch (err) {
      toast.error(err.message);
      setSubclasses([]);
    }
  };

  // Fetch students
  const fetchStudents = async (cls, sub) => {
    try {
      const clsObj = classes.find(c => c.name === cls);
      const subObj = subclasses.find(s => s.name === sub);
      if (!clsObj || !subObj) return;
      const res = await fetch(
        `http://localhost:3000/dashboard/students?classId=${clsObj._id}&subclassId=${subObj._id}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStudents(data.data || []);
    } catch (err) {
      toast.error(err.message);
      setStudents([]);
    }
  };

  // Fetch marks
  const fetchMarks = async (filters = {}) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/dashboard/marks/search", {
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

  // Fetch subjects
  const fetchSubjects = async (cls, sem) => {
    try {
      if (!cls || !sem) return [];
      const res = await fetch(`http://localhost:3000/dashboard/subjects/by-class-semester?class=${cls}&semester=${sem}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.data || [];
    } catch (err) {
      toast.error(err.message);
      return [];
    }
  };

  // Submit new mark
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/dashboard/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: studentIdentifier,
          class: className,
          subject,
          firstQuiz: +firstQuiz,
          secondQuiz: +secondQuiz,
          finalExam: +finalExam,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save mark");
      toast.success("Mark saved successfully");
      
      // Reset form
      setStudentIdentifier('');
      setSubject('');
      setFirstQuiz('');
      setSecondQuiz('');
      setFinalExam('');
      
      fetchMarks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Update mark
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/dashboard/marks/${editingMark._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstQuiz: +editFirstQuiz,
          secondQuiz: +editSecondQuiz,
          finalExam: +editFinalExam,
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

  // Delete mark
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/dashboard/marks/${id}`, {
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

  // Handle search
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

  // Clear search
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
          {/* Create Exam Marks Section */}
          <section className="exams-section">
            <header className="exams-section-header">
              <h1 className='text-[#40277E]'>Add Exam Marks</h1>
              <p>Please fill out the details to add new exam marks</p>
            </header>

            <form className="exams-form" onSubmit={handleSubmit}>
              <select value={className} onChange={(e) => setClassName(e.target.value)} required>
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>

              <select value={subclassName} onChange={(e) => setSubclassName(e.target.value)} required>
                <option value="">Select Subclass</option>
                {subclasses.map((s) => (
                  <option key={s._id} value={s.name}>{s.name}</option>
                ))}
              </select>

              <select value={studentIdentifier} onChange={(e) => setStudentIdentifier(e.target.value)} required>
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s._id} value={s.identifier}>
                    {s.firstName} {s.lastName} ({s.identifier})
                  </option>
                ))}
              </select>

              {/* Semester Dropdown */}
              <select value={semester} onChange={(e) => setSemester(e.target.value)} required>
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem.value} value={sem.value}>{sem.label}</option>
                ))}
              </select>

              {/* Subject Dropdown */}
              <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s.name}>{s.name}</option>
                ))}
              </select>

              <input type="number" placeholder="First Quiz" value={firstQuiz} onChange={(e) => setFirstQuiz(e.target.value)} min="0" max="10" />
              <input type="number" placeholder="Second Quiz" value={secondQuiz} onChange={(e) => setSecondQuiz(e.target.value)} min="0" max="10" />
              <input type="number" placeholder="Final Exam" value={finalExam} onChange={(e) => setFinalExam(e.target.value)} min="0" max="80" />

              <button type="submit" className="btn-primary">Add Mark</button>
            </form>
          </section>

          {/* Search Section */}
          <section className="exams-section">
            <header className="exams-section-header">
              <h1 className='text-[#40277E]'>Search Marks</h1>
              <p>Filter marks by different criteria</p>
            </header>

            <form className="exams-form" onSubmit={handleSearch}>
              <input type="text" placeholder="Student ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
              <input type="text" placeholder="First Name" value={searchFirstName} onChange={(e) => setSearchFirstName(e.target.value)} />
              <input type="text" placeholder="Middle Name" value={searchMiddleName} onChange={(e) => setSearchMiddleName(e.target.value)} />
              <input type="text" placeholder="Last Name" value={searchLastName} onChange={(e) => setSearchLastName(e.target.value)} />

              <select value={searchClass} onChange={(e) => setSearchClass(e.target.value)}>
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>

              <select value={searchSemester} onChange={(e) => setSearchSemester(e.target.value)}>
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem.value} value={sem.value}>{sem.label}</option>
                ))}
              </select>

              <input type="text" placeholder="Subject" value={searchSubject} onChange={(e) => setSearchSubject(e.target.value)} />

              <div className="form-actions">
                <button type="submit" className="btn-primary">Search</button>
                <button type="button" onClick={clearSearch} className="btn-secondary">Clear</button>
              </div>
            </form>
          </section>

          {/* Marks Control Panel */}
          <section className="exams-section">
            <header className="exams-section-header">
              <h1 className='text-[#40277E]'>Marks Control Panel</h1>
              <p>Here you can view, edit, and delete marks</p>
            </header>

            {loading ? (
              <p>Loading marks...</p>
            ) : error ? (
              <p className="text-error">{error}</p>
            ) : marks.length > 0 ? (
              <div className="marks-table-container">
                <table className="marks-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Semester</th>
                      <th>Subject</th>
                      <th>First Quiz</th>
                      <th>Second Quiz</th>
                      <th>Final Exam</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((m) => (
                      <tr key={m._id}>
                        {editingMark && editingMark._id === m._id ? (
                          <>
                            <td colSpan="4">
                              {m.studentId?.firstName} {m.studentId?.lastName} ({m.studentId?.identifier})
                            </td>
                            <td>
                              <input 
                                type="number" 
                                value={editFirstQuiz} 
                                onChange={(e) => setEditFirstQuiz(e.target.value)} 
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                value={editSecondQuiz} 
                                onChange={(e) => setEditSecondQuiz(e.target.value)} 
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                value={editFinalExam} 
                                onChange={(e) => setEditFinalExam(e.target.value)} 
                              />
                            </td>
                            <td>{+editFirstQuiz + +editSecondQuiz + +editFinalExam}</td>
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
                            {/* <td>{m.subjectId?.classId?.name}</td> */}
                            <td>
                              {semesters.find(s => s.value === String(m.subjectId?.semester))?.label || m.subjectId?.semester}
                            </td>
                            <td>{m.subjectId?.name}</td>
                            <td>{m.firstQuiz}</td>
                            <td>{m.secondQuiz}</td>
                            <td>{m.finalExam}</td>
                            <td>{m.firstQuiz + m.secondQuiz + m.finalExam}</td>
                            <td>
                              <div className="table-actions">
                                <button onClick={() => {
                                  setEditingMark(m);
                                  setEditFirstQuiz(m.firstQuiz);
                                  setEditSecondQuiz(m.secondQuiz);
                                  setEditFinalExam(m.finalExam);
                                }}>
                                  <FaUserEdit className="icon-edit" />
                                </button>
                                <button onClick={() => handleDelete(m._id)}>
                                  <MdDeleteForever className="icon-delete" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No marks found</p>
            )}
          </section>
        </main>
      </div>

      <ToastContainer position="bottom-right" autoClose={5000} />
    </>
  );
};

export default Exams;
