import SideBar from '../../components/SideBar/SideBar'
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Students.css'
import { FaUserGraduate, FaUserEdit } from 'react-icons/fa';
import { MdDeleteForever, MdClose } from 'react-icons/md';

const Students = () => {
  // Create form state
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [secondMiddleName, setSecondMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubclass, setSelectedSubclass] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [city, setCity] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');

  // Students list and loading
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filterClass, setFilterClass] = useState('');
  const [filterSubclass, setFilterSubclass] = useState('');
  const [filteredSubclasses, setFilteredSubclasses] = useState([]);

  // Options for dropdowns
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  // Modals and edit states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  // Edit form state
  const [editFirstName, setEditFirstName] = useState('');
  const [editMiddleName, setEditMiddleName] = useState('');
  const [editSecondMiddleName, setEditSecondMiddleName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editClass, setEditClass] = useState('');
  const [editSubclass, setEditSubclass] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editGender, setEditGender] = useState('');
  const [editNationality, setEditNationality] = useState('عربي سوري');
  const [editCity, setEditCity] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editFatherName, setEditFatherName] = useState('');
  const [editMotherName, setEditMotherName] = useState('');

  // Update subclasses dropdown when filterClass changes
  useEffect(() => {
    if (filterClass) {
      const selectedClassObj = classes.find(c => c._id === filterClass);
      setFilteredSubclasses(selectedClassObj?.subclasses || []);
      setFilterSubclass('');
    } else {
      const allSubs = classes.flatMap(c => c.subclasses || []);
      setFilteredSubclasses(allSubs);
    }
  }, [filterClass, classes]);

  // Fetch dropdown options
  const fetchOptions = async () => {
    try {
      const res = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/students/options');
      const data = await res.json();
      if (data.success) {
        setClasses(data.data.classes);
        setAcademicYears(data.data.academicYears);
        setFilteredSubclasses(data.data.classes.flatMap(c => c.subclasses || []));
      } else {
        throw new Error(data.message || 'Failed to fetch options');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  // Fetch students with filters
  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams();
      if (filterClass) params.append('classId', filterClass);
      if (filterSubclass) params.append('subclassId', filterSubclass);
      const res = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/students?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAllStudents(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch students');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch options and students on mount
  useEffect(() => {
    fetchOptions();
    fetchStudents();
  }, []);

  // Filter handlers
  const handleFilterChange = () => {
    setLoading(true);
    fetchStudents();
  };
  const resetFilters = () => {
    setFilterClass('');
    setFilterSubclass('');
    setLoading(true);
    fetchStudents();
  };

  // Create student submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          middleName,
          secondMiddleName,
          lastName,
          email,
          classId: selectedClass,
          subclassId: selectedSubclass,
          academicYearId: selectedYear,
          gender,
          nationality,
          city,
          birthDate,
          father_name: fatherName,
          mother_name: motherName
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('تم إنشاء سجل الطالب بنجاح');
        // Reset form
        setFirstName(''); setMiddleName(''); setSecondMiddleName(''); setLastName('');
        setEmail(''); setSelectedClass(''); setSelectedSubclass('');
        setSelectedYear(''); setGender(''); setNationality('');
        setCity(''); setBirthDate(''); setFatherName(''); setMotherName('');
        fetchStudents();
      } else {
        toast.error(data.message || 'Failed to create student');
      }
    } catch {
      toast.error('An error occurred during student creation');
    }
  };

  // Open student detail modal
  const openStudentDetails = (student) => {
    setSelectedStudent(student);
  };

  const closeStudentDetails = () => {
    setSelectedStudent(null);
  };

  // Open edit modal with data filled
  const handleEditOpen = (student) => {
    setEditingStudent(student);
    setEditFirstName(student.firstName);
    setEditMiddleName(student.middleName || '');
    setEditSecondMiddleName(student.secondMiddleName || '');
    setEditLastName(student.lastName);
    setEditEmail(student.email || 'motafokeen.school@gmail.com');
    setEditClass(student.classId?._id || '');
    setEditSubclass(student.subclassId?._id || '');
    setEditYear(student.academicYearId?._id || '');
    setEditGender(student.gender || '');
    setEditNationality(student.nationality || 'عربي سوري');
    setEditCity(student.city || '');
    setEditBirthDate(student.birthDate ? student.birthDate.slice(0, 10) : '');
    setEditFatherName(student.father_name || '');
    setEditMotherName(student.mother_name || '');
  };

  // Update student submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/students/${editingStudent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: editFirstName,
          middleName: editMiddleName,
          secondMiddleName: editSecondMiddleName,
          lastName: editLastName,
          email: editEmail,
          classId: editClass,
          subclassId: editSubclass,
          academicYearId: editYear,
          gender: editGender,
          nationality: editNationality,
          city: editCity,
          birthDate: editBirthDate,
          father_name: editFatherName,
          mother_name: editMotherName
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('تم تحديث سجل الطالب بنجاح');
        setEditingStudent(null);
        fetchStudents();
      } else {
        toast.error(data.message || 'Failed to update student');
      }
    } catch {
      toast.error('An error occurred during student update');
    }
  };

  // Delete student
  const handleDelete = async (studentId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطالب؟')) return;
    try {
      const res = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/students/${studentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('تم حذف سجل الطالب بنجاح');
        fetchStudents();
      } else {
        toast.error(data.message || 'Failed to delete student');
      }
    } catch {
      toast.error('An error occurred during student deletion');
    }
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="mt-[120px] ml-10 w-full pr-10 flex-1">

        {/* Create Student Form */}
        <div className="bg-[#FAF9FC] p-8 rounded-xl shadow-md mb-16">
          <h2 className="text-2xl font-bold text-[#40277E] mb-2">Create Student</h2>
          <p className="text-sm text-[#666] mb-6">Please enter student details to create a new student</p>

           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="form-label">First Name</label>
              <input
                className="form-input"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Middle Name</label>
              <input
                className="form-input"
                placeholder="Middle Name"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">2th Middle Name</label>
              <input
                className="form-input"
                placeholder="2th Middle Name"
                value={secondMiddleName}
                onChange={(e) => setSecondMiddleName(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Last Name</label>
              <input
                className="form-input"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Email</label>
              <input
                className="form-input"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Gender</label>
              <select
                className="form-input"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>

            <div>
              <label className="form-label">Nationality</label>
              <input
                className="form-input"
                placeholder="Nationality"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">City</label>
              <input
                className="form-input"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Birth Date</label>
              <input
                className="form-input"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Father's Name</label>
              <input
                className="form-input"
                placeholder="Father's Name"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Mother's Name</label>
              <input
                className="form-input"
                placeholder="Mother's Name"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Class</label>
              <select
                className="form-input"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                required
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Subclass</label>
              <select
                className="form-input"
                value={selectedSubclass}
                onChange={(e) => setSelectedSubclass(e.target.value)}
                disabled={!selectedClass}
                required
              >
                <option value="">Select Subclass</option>
                {classes
                  .find((c) => c._id === selectedClass)
                  ?.subclasses?.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="form-label">Academic Year</label>
              <select
                className="form-input"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                required
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((year) => (
                  <option key={year._id} value={year._id}>
                    {year.year}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-full">
              <button
                type="submit"
                className="bg-[#40277E] hover:bg-[#5b3ea4] text-white px-6 py-2 rounded-lg transition-all duration-200 w-full md:w-fit"
              >
                Create Student
              </button>
            </div>
          </form>
        </div>

        {/* Filter Section */}
        <div className="w-full bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#535353] mb-4">Filter Students</h2>
          <div className="flex flex-wrap gap-4">
            <select
              className="forminputcrud"
              value={filterClass}
              onChange={e => setFilterClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {classes.map(cls => <option key={cls._id} value={cls._id}>{cls.name}</option>)}
            </select>
            <select
              className="forminputcrud"
              value={filterSubclass}
              onChange={e => setFilterSubclass(e.target.value)}
              disabled={!filterClass}
            >
              <option value="">All Subclasses</option>
              {filteredSubclasses.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
            </select>
            <button onClick={handleFilterChange} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Apply</button>
            <button onClick={resetFilters} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Reset</button>
          </div>
        </div>

        {/* Students List */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-[#6A46A8] mb-4">Students Control Panel</h2>
          <p className="text-sm text-[#383838] mb-6">Click on a student card to view details</p>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {allStudents.map(student => (
                <div
                  key={student._id}
                  className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition-shadow w-full flex items-center gap-6"
                  onClick={() => openStudentDetails(student)}
                >
                  <FaUserGraduate className="text-[48px] text-[#6A46A8]" />
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 text-gray-700">
                    <div>
                      <p className="font-semibold text-[#40277E]">Full Name</p>
                      <p>{student.firstName} {student.middleName || ''} {student.lastName}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#40277E]">Identifier</p>
                      <p>{student.identifier}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#40277E]">Password</p>
                      <p><code className="bg-gray-100 px-2 rounded">{student.password}</code></p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#40277E]">Class</p>
                      <p>{student.classId?.name || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#40277E]">Subclass</p>
                      <p>{student.subclassId?.name || '-'}</p>
                    </div>
                    
                  </div>

                  {/* Edit & Delete Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditOpen(student);
                      }}
                      title="Edit Student"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaUserEdit size={24} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(student._id);
                      }}
                      title="Delete Student"
                      className="text-red-600 hover:text-red-800"
                    >
                      <MdDeleteForever size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student Details Modal */}
        {selectedStudent && !editingStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={closeStudentDetails}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                aria-label="Close student details"
              >
                <MdClose size={28} />
              </button>

              <h2 className="text-2xl font-bold text-[#40277E] mb-6">Student Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
                <div><strong>Full Name:</strong><p>{selectedStudent.firstName} {selectedStudent.middleName || ''} {selectedStudent.secondMiddleName || ''}  {selectedStudent.lastName}</p></div>
                <div><strong>Identifier:</strong><p>{selectedStudent.identifier}</p></div>
                <div><strong>Email:</strong><p>{selectedStudent.email}</p></div>
                <div><strong>Password:</strong><p><code className="bg-gray-100 px-2 rounded">{selectedStudent.password}</code></p></div>
                <div><strong>Class:</strong><p>{selectedStudent.classId?.name || '-'}</p></div>
                <div><strong>Subclass:</strong><p>{selectedStudent.subclassId?.name || '-'}</p></div>
                <div><strong>Academic Year:</strong><p>{selectedStudent.academicYearId?.year || '-'}</p></div>
                <div><strong>Gender:</strong><p>{selectedStudent.gender || '-'}</p></div>
                <div><strong>Nationality:</strong><p>{selectedStudent.nationality || '-'}</p></div>
                <div><strong>City:</strong><p>{selectedStudent.city || '-'}</p></div>
                <div><strong>Birth Date:</strong><p>{selectedStudent.birthDate ? new Date(selectedStudent.birthDate).toLocaleDateString() : '-'}</p></div>
                <div><strong>Father's Name:</strong><p>{selectedStudent.father_name || '-'}</p></div>
                <div><strong>Mother's Name:</strong><p>{selectedStudent.mother_name || '-'}</p></div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {editingStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4 overflow-auto">
            <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setEditingStudent(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                aria-label="Close edit student"
              >
                <MdClose size={28} />
              </button>

              <h2 className="text-2xl font-bold text-[#40277E] mb-6">Edit Student</h2>

              <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="form-label">First Name</label>
                  <input
                    className="form-input"
                    value={editFirstName}
                    onChange={e => setEditFirstName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Middle Name</label>
                  <input
                    className="form-input"
                    value={editMiddleName}
                    onChange={e => setEditMiddleName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">2th Middle Name</label>
                  <input
                    className="form-input"
                    value={editSecondMiddleName}
                    onChange={e => setEditSecondMiddleName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-input"
                    value={editLastName}
                    onChange={e => setEditLastName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Gender</label>
                  <select
                    className="form-input"
                    value={editGender}
                    onChange={e => setEditGender(e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Nationality</label>
                  <input
                    className="form-input"
                    value={editNationality}
                    onChange={e => setEditNationality(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">City</label>
                  <input
                    className="form-input"
                    value={editCity}
                    onChange={e => setEditCity(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Birth Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={editBirthDate}
                    onChange={e => setEditBirthDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Father's Name</label>
                  <input
                    className="form-input"
                    value={editFatherName}
                    onChange={e => setEditFatherName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Mother's Name</label>
                  <input
                    className="form-input"
                    value={editMotherName}
                    onChange={e => setEditMotherName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Class</label>
                  <select
                    className="form-input"
                    value={editClass}
                    onChange={e => setEditClass(e.target.value)}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Subclass</label>
                  <select
                    className="form-input"
                    value={editSubclass}
                    onChange={e => setEditSubclass(e.target.value)}
                    disabled={!editClass}
                    required
                  >
                    <option value="">Select Subclass</option>
                    {classes
                      .find(c => c._id === editClass)
                      ?.subclasses?.map(sub => (
                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Academic Year</label>
                  <select
                    className="form-input"
                    value={editYear}
                    onChange={e => setEditYear(e.target.value)}
                    required
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map(year => (
                      <option key={year._id} value={year._id}>{year.year}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-full">
                  <button
                    type="submit"
                    className="bg-[#40277E] hover:bg-[#5b3ea4] text-white px-6 py-2 rounded-lg transition-all duration-200 w-full md:w-fit"
                  >
                    Update Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      </div>
    </div>
  );
};

export default Students;
