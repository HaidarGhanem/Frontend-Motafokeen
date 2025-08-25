import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFilePdf } from 'react-icons/fa';
import { MdCloudUpload, MdDelete } from 'react-icons/md';

const Cert = () => {
  const [id, setId] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        const fileUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(fileUrl);
      } else {
        toast.error('Only PDF files are allowed!', { position: 'bottom-right', autoClose: 5000 });
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      toast.error('Student ID is required', { position: 'bottom-right', autoClose: 5000 });
      return;
    }

    if (!file) {
      toast.error('Please select a PDF file to upload', { position: 'bottom-right', autoClose: 5000 });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('certificate', file);
      formData.append('id', id);

      const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/certifications/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload certificate');
      }

      if (data.success) {
        toast.success(data.message, { position: 'bottom-right', autoClose: 5000 });
        setUploadHistory((prev) => [
          {
            studentId: id,
            fileName: data.data.name,
            uploadedAt: data.data.uploadedAt,
            previewUrl: previewUrl,
          },
          ...prev,
        ]);

        setId('');
        setFile(null);
        setFileName('');
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        document.getElementById('file-upload').value = '';
      } else {
        throw new Error(data.message || 'Failed to upload certificate');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || 'An error occurred during upload', { position: 'bottom-right', autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId, fileName) => {
    try {
      setUploadHistory((prev) => prev.filter((item) => !(item.studentId === studentId && item.fileName === fileName)));
      toast.success('Certificate removed from history', { position: 'bottom-right', autoClose: 5000 });
    } catch (err) {
      toast.error('Failed to remove certificate', { position: 'bottom-right', autoClose: 5000 });
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1 mt-[120px] ml-10 w-full pr-10 flex flex-col gap-20">

        {/* Upload Certificate Header */}
        <section className="flex flex-col gap-2 items-start">
          <h1 className="text-3xl font-bold text-[#40277E]">Upload Certificate</h1>
          <span className="text-sm text-[#383838]">Upload PDF certificates for students</span>
        </section>

        {/* Upload Form */}
        <section className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="id" className="form-label">Student ID:</label>
              <input
                id="id"
                type="text"
                placeholder="Enter student ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
  <label htmlFor="file-upload" className="form-label">PDF Certificate (Max 50MB):</label>
  <div className="flex items-center gap-4">
    <label
      htmlFor="file-upload"
      className="file-label cursor-pointer select-none flex items-center gap-2 px-5 py-2 rounded-lg bg-[#40277E] text-white font-semibold shadow-md transition-colors duration-300 hover:bg-[#e06d50]"
      title="Choose PDF file"
    >
      <MdCloudUpload size={22} />
      Choose File
      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
        required
      />
    </label>
    {fileName && (
      <span className="file-name flex items-center gap-2 bg-[#fbe9e6] text-[#bf4a3f] px-3 py-1 rounded-lg font-medium text-sm shadow-inner select-text">
        <FaFilePdf size={16} />
        {fileName}
      </span>
    )}
  </div>
</div>

            {previewUrl && (
              <div className="flex flex-col gap-2">
                <span className="form-label">Preview:</span>
                <iframe
                  src={previewUrl}
                  title="PDF Preview"
                  className="iframe-preview rounded-md border border-gray-300"
                  frameBorder="0"
                ></iframe>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`form-button self-start flex items-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
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
                <div
                  key={index}
                  className="card flex justify-between items-center cursor-default"
                >
                  <div className="flex items-center gap-6">
                    <FaFilePdf className="text-red-600 text-[40px]" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-[#383838]">{item.fileName}</span>
                      <span className="text-xs text-gray-500">Student ID: {item.studentId}</span>
                      <span className="text-xs text-gray-500">Uploaded: {new Date(item.uploadedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-6 items-center">
                    <a
                      href={item.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(item.studentId, item.fileName)}
                      className="text-[#40277E] hover:text-[#e06d50] flex items-center gap-1 text-sm border-none bg-transparent cursor-pointer"
                      aria-label="Delete certificate"
                    >
                      <MdDelete size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upload history yet</p>
          )}
        </section>
      </main>

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
  );
};

export default Cert;
