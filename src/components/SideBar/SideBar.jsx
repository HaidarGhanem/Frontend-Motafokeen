import './SideBar.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiHomeAlt } from "react-icons/bi";
import { TbShield } from "react-icons/tb";
import { LiaUserTieSolid } from "react-icons/lia";
import { MdOutlineDateRange } from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";
import { PiStudent } from "react-icons/pi";
import { LiaClipboardListSolid } from "react-icons/lia";
import { PiExam } from "react-icons/pi";
import { IoBookOutline } from "react-icons/io5";
import { IoMedalOutline } from "react-icons/io5";
import { GrAnnounce } from "react-icons/gr";
import { CgWebsite } from "react-icons/cg";
import { FiActivity } from "react-icons/fi";
import { BsCalendarEvent } from "react-icons/bs";
import { SiGoogleclassroom } from "react-icons/si";
import { GrCertificate } from "react-icons/gr";

const SideBar = () => {
  const [activeBtn, setActiveBtn] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role?.toLowerCase();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/dashboard/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const baseMenuBtns = [
    { 
      id: 'dashboard',
      icon: <BiHomeAlt className='w-[18px]'/>,
      text: 'Dashboard',
      path: '/dashboard'
    },
    {
      id: 'academicYear',
      icon: <MdOutlineDateRange className='w-[18px]'/>,
      text: 'Academic Years',
      path: '/dashboard/academic-years'
    },
    {
      id: 'classes',
      icon: <RiGraduationCapLine className='w-[18px]'/>,
      text: 'Classes',
      path: '/dashboard/classes'
    },
    {
      id: 'subclasses',
      icon: <SiGoogleclassroom className='w-[18px]'/>,
      text: 'Sub Classes',
      path: '/dashboard/subclasses'
    },
    {
      id: 'subjects',
      icon: <IoBookOutline className='w-[18px]'/>,
      text: 'Subjects',
      path: '/dashboard/subjects'
    },
    {
      id: 'teachers',
      icon: <LiaUserTieSolid className='w-[18px]'/>,
      text: 'Teachers',
      path: '/dashboard/teachers'
    },
    {
      id: 'employees',
      icon: <LiaUserTieSolid className='w-[18px]'/>,
      text: 'Employees',
      path: '/dashboard/employees'
    },
    {
      id: 'students',
      icon: <PiStudent className='w-[18px]'/>,
      text: 'Students',
      path: '/dashboard/students'
    },
    {
      id: 'calendar',
      icon: <BsCalendarEvent className='w-[18px]'/>,
      text: 'Schedules',
      path: '/dashboard/calendar'
    },
    {
      id: 'exams',
      icon: <PiExam className='w-[18px]'/>,
      text: 'Exam Grades',
      path: '/dashboard/exams'
    },
    {
      id: 'absence',
      icon: <LiaClipboardListSolid className='w-[18px]'/>,
      text: 'Attendance & Absence',
      path: '/dashboard/absence'
    },  
    {
      id: 'olympiad',
      icon: <IoMedalOutline className='w-[18px]'/>,
      text: 'Olympiad',
      path: '/dashboard/olympiad'
    },
    {
      id: 'app posts',
      icon: <GrAnnounce className='w-[18px]'/>,
      text: 'App Posts',
      path: '/dashboard/app-posts'
    },
    {
      id: 'website posts',
      icon: <CgWebsite className='w-[18px]'/>,
      text: 'Website Posts',
      path: '/dashboard/website-posts'
    },
    {
      id: 'activities',
      icon: <FiActivity className='w-[18px]'/>,
      text: 'Activities',
      path: '/dashboard/activities'
    },
    {
      id: 'certifications',
      icon: <GrCertificate className='w-[18px]'/>,
      text: 'Certifications',
      path: '/dashboard/cert'
    }
  ];

  // IDs of buttons visible ONLY to owner
  const ownerMenuIds = [
    'dashboard',
    'academicYear',
    'classes',
    'subclasses',
    'students',
    'subjects',
    'teachers',
    'calendar',
    'certifications',
    'exams',
    'absence',
    'olympiad',
    'app posts',
    'website posts',
    'activities',
    'admins',
    'employees'
  ];

  // Define the admins button explicitly since it's not in baseMenuBtns
  const adminsBtn = {
    id: 'admins',
    icon: <TbShield className='w-[18px]' />,
    text: 'Admins',
    path: '/dashboard/admins'
  };

  // Buttons only for owner
  const ownerBaseBtns = baseMenuBtns.filter(btn => ownerMenuIds.includes(btn.id) && btn.id !== 'admins');

  const ownerMenuBtns = [adminsBtn, ...ownerBaseBtns];

  // Buttons for all other roles (exclude owner-only)
  const nonOwnerMenuBtns = baseMenuBtns.filter(btn => !ownerMenuIds.includes(btn.id));

  // Final menu buttons based on role
  const menuBtns = role === 'owner' ? ownerMenuBtns : nonOwnerMenuBtns;

  useEffect(() => {
    const currentPath = location.pathname;
    const match = menuBtns.find(item => item.path === currentPath);
    if (match) {
      setActiveBtn(match.id);
    }
  }, [location.pathname, menuBtns]);

  const handleNavigation = (id, path) => {
    setActiveBtn(id);
    navigate(path);
  };

  return (
    <>
      <div className='sidebar-container'>
        <div className={`w-[242px] ${role === 'admin' ? 'h-[100vh]' : 'h-full'} bg-[#40277E] relative flex flex-col`}>
          <div className='LogoFrame flex justify-center items-center flex-col pt-[32px]'>
            <img src="/LogoFrame.png" alt="Logo" className='w-[50px] h-[50px]' />
            <h1 className='text-[#FFFEFE] font-[600] text-[14px] mt-[16px]'>Al-Mutafawiqin School</h1>
            <p className='text-[#FFFEFE] font-[300] text-[12px] mt-[8px]'>
              {user?.role}: {user?.name}
            </p>
          </div>

          <div className='lineBar w-full h-[1px] bg-[#5C4B8B] my-4'></div>

          <nav className='flex flex-col items-end h-full'>
            {menuBtns.map((btn) => (
              <button 
                key={btn.id} 
                className={`
                  menu_btn  
                  flex items-center px-4 py-3
                  ${activeBtn === btn.id 
                    ? 'bg-[#A098AE]' 
                    : 'text-[#ffffff]'
                  }
                `} 
                onClick={() => handleNavigation(btn.id, btn.path)}
              >
                <span className='icon-wrapper mr-3'>{btn.icon}</span>
                <span className='text-sm font-medium text-left'>{btn.text}</span>
              </button>
            ))}
          </nav>

          <div className='user-section p-4'>
            <div className='userBadge flex justify-center items-center mb-2'>
              <p className='text-white text-sm'>Logged in as: {user?.name}</p>
            </div>
          </div>
        </div>
      </div>

      <button 
        className='
          userLogout w-full py-2 px-4 
          bg-[#5C4B8B] text-white rounded 
          hover:bg-[#6a56a0] transition-colors
          active:transform active:scale-95
        '
        onClick={handleLogout}
      >
        <p>Log out</p>
      </button>
    </>
  );
};

export default SideBar;
