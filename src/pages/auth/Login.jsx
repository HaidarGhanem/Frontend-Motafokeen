// src/pages/auth/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('admin');
    const [activeBtn, setActiveBtn] = useState(false);
    const navigate = useNavigate();
  
    const toggleBtn = () => {
        setActiveBtn(!activeBtn);
    };

    const userTypes = [
        { value: 'owner', label: 'Owner' },
        { value: 'admin', label: 'Admin' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password, role: userType })
            });

            const data = await response.json();
        
            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                toast.error(data.message || 'Login failed', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored"
                });
            }
        } catch (err) {
            toast.error('An error occurred during login', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
        }
    };

    return (
        <div className="login-container w-full h-[100vh] flex flex-col md:flex-row justify-center items-center gap-20">
            {/* Toastify Container */}
            <ToastContainer />

            <div className='flex flex-col justify-center items-center '>
                <div className='bg-white w-[300px] h-[300px] img_logo flex justify-center items-center'>
                    <img src='/Logo.svg' className='w-[270px] h-[270px]' alt="School Logo" />
                </div>
                <h1 className='text-[#FFFEFE] font-[600] text-[24px] mt-[16px]'>Al-Motafokeen School</h1>
                <p className='text-[#FFFEFE]'>Management System Dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-10 items-center'>
                <div className='flex flex-col gap-5 w-full'>
                    <label htmlFor="username" className='text-white'>Username</label>
                    <input
                        className='forminput'
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className='flex flex-col gap-5 w-full'>
                    <label htmlFor="password" className='text-white'>Password</label>
                    <input
                        className='forminput'
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className='flex flex-col gap-5 w-full'>
                    <label htmlFor="userType" className='text-white'>User Type</label>
                    <select 
                        id="userType"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="form-select w-full p-2 rounded"
                    >
                        {userTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
                
                <button type="submit" onClick={toggleBtn} className={`formbtn ${activeBtn ? 'formbtnactive' : ''}`}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
