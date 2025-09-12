import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFilePdf } from 'react-icons/fa';
import { MdCloudUpload, MdDelete } from 'react-icons/md';

const Cert = () => {
  const [classes, setClasses] = useState([]);
  const [subclasses, setSubclasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [className, setClassName] = useState('');
  const [subclassName, setSubclassName] = useState('');
  const [studentIdentifier, setStudentIdentifier] = useState('');

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [filePreview, setFilePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);

  const API_BASE = "https://backend-motafokeen-ajrd.onrender.com/dashboard/certifications"; // ✅ adjust if deployed

  // ---------- Fetch Classes ----------
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

  // ---------- Fetch Subclasses ----------
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

  // ---------- Fetch Students ----------
  const fetchStudents = async (cls, sub) => {
    try {
      const clsObj = classes.find(c => c.name === cls);
      const subObj = subclasses.find(s => s.name === sub);
      if (!clsObj || !subObj) return;
      const res = await fetch(`https://backend-motafokeen-ajrd.onrender.com/dashboard/students?classId=${clsObj._id}&subclassId=${subObj._id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStudents(data.data || []);
    } catch (err) {
      toast.error(err.message);
      setStudents([]);
    }
  };

  // ---------- Fetch Upload History ----------
  const fetchUploadHistory = async (studentId) => {
    if (!studentId) return setUploadHistory([]);
    try {
      const res = await fetch(`${API_BASE}/${studentId}/certificates`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch history");
      setUploadHistory(data || []);
    } catch (err) {
      toast.error(err.message || "Error fetching history");
      setUploadHistory([]);
    }
  };

  // ---------- File Handling ----------
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        toast.error('Only PDF files are allowed!');
        e.target.value = '';
      }
    }
  };

  // ---------- Upload Certificate ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentIdentifier) {
      toast.error('Student is required');
      return;
    }
    if (!file) {
      toast.error('Please select a PDF file to upload');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('certificate', file);

      const response = await fetch(`${API_BASE}/${studentIdentifier}/certificates`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to upload certificate');

      toast.success(data.message || 'Certificate uploaded successfully');
      fetchUploadHistory(studentIdentifier);

      // Reset form
      setFile(null);
      setFileName('');
      setFilePreview(null);
      document.getElementById('file-upload').value = '';
    } catch (err) {
      toast.error(err.message || 'Error uploading certificate');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Delete Certificate ----------
  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const res = await fetch(`${API_BASE}/${studentIdentifier}/certificates/${index}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete certificate');

      toast.success(data.message || 'Certificate deleted successfully');
      fetchUploadHistory(studentIdentifier);
    } catch (err) {
      toast.error(err.message || 'Error deleting certificate');
    }
  };

  // ---------- Hooks ----------
  useEffect(() => fetchClasses(), []);
  useEffect(() => { if (className) fetchSubclasses(className); }, [className]);
  useEffect(() => { if (className && subclassName) fetchStudents(className, subclassName); }, [className, subclassName]);
  useEffect(() => { fetchUploadHistory(studentIdentifier); }, [studentIdentifier]);

  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1 mt-[120px] ml-10 w-full pr-10 flex flex-col gap-20">

        {/* Upload Header */}
        <section className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-[#40277E]">Upload Certificate</h1>
          <span className="text-sm text-[#383838]">Upload PDF certificates for students</span>
        </section>

        {/* Upload Form */}
        <section className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-4">
              {/* Class */}
              <div className="flex-1 min-w-[160px] flex flex-col">
                <label>Class:</label>
                <select value={className} onChange={e => setClassName(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              {/* Subclass */}
              <div className="flex-1 min-w-[160px] flex flex-col">
                <label>Subclass:</label>
                <select value={subclassName} onChange={e => setSubclassName(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select Subclass</option>
                  {subclasses.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              {/* Student */}
              <div className="flex-1 min-w-[200px] flex flex-col">
                <label>Student:</label>
                <select value={studentIdentifier} onChange={e => setStudentIdentifier(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.identifier})</option>)}
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="file-upload">PDF Certificate (Max 50MB):</label>
              <div className="flex items-center gap-4">
                <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#40277E] to-[#6B4EFF] text-white font-semibold shadow-md">
                  <MdCloudUpload size={22} /> Choose File
                  <input id="file-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                </label>
                {fileName && <span className="flex items-center gap-2 bg-[#fbe9e6] text-[#bf4a3f] px-3 py-1 rounded-lg font-medium text-sm">
                  <FaFilePdf size={16} /> {fileName}
                </span>}
              </div>

              {filePreview && <iframe src={filePreview} className="mt-4 w-full h-96 border rounded-lg shadow" title="PDF Preview"></iframe>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className={`self-start flex items-center gap-2 px-6 py-2 rounded-lg bg-[#40277E] text-white font-semibold shadow-md hover:bg-[#6B4EFF] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading && <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>}
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </section>

        {/* Upload History */}
        <section className="w-full max-w-4xl flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#40277E] mb-1">Upload History</h1>
            <span className="text-sm text-[#383838]">Recently uploaded certificates</span>
          </div>

          {uploadHistory.length > 0 ? (
            <div className="flex flex-col gap-4">
              {uploadHistory.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center gap-6">
                    <FaFilePdf className="text-red-600 text-[40px]" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-[#383838]">{item.name}</span>
                      <span className="text-xs text-gray-500">Uploaded: {new Date(item.uploadedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-6 items-center">
                    <a
                      href={`${API_BASE}/${studentIdentifier}/certificates/${item.index}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(item.index)}
                      className="text-[#40277E] hover:text-[#e06d50] flex items-center gap-1 text-sm border-none bg-transparent cursor-pointer"
                    >
                      <MdDelete size={18} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500">No upload history yet</p>}
        </section>
      </main>

      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default Cert;
