import SideBar from '../../components/SideBar/SideBar'
import { useEffect, useState } from 'react';
import './Dashboard.css'
import { LuUserRound } from "react-icons/lu";
import { PiStudent } from "react-icons/pi";
import { MdOutlineDateRange } from "react-icons/md";
import { TbShield } from "react-icons/tb";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch('http://localhost:3000/dashboard/info');
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                
                if (data.success) {
                    setStats(data.data);
                } else {
                    throw new Error(data.message || 'Failed to fetch statistics');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) {
        return (
            <div className='flex'>
                <SideBar />
                <div className="flex justify-center items-center w-full h-screen">
                    <div style={{fontWeight: 'bold' , fontSize:'24px' , color:'#5C4B8B'}}>Loading dashboard data...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex'>
                <SideBar />
                <div className="flex justify-center items-center w-full h-screen">
                    <div style={{fontWeight: 'bold' , fontSize:'24px' , color:'#FB7D5B'}}>Error: {error}</div>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className='flex'>
                <SideBar />
                <div className="flex justify-center items-center w-full h-screen">
                    <div>No statistics data available</div>
                </div>
            </div>
        );
    }



    return (
        <>
            <div className='flex'>
                <SideBar />
                <div>
                    <div className='infoBoard flex justify-center items-center'>
                        <div className='flex justify-center items-center gap-10'>
                            {/* Students */}
                            <div className='flex justify-center items-center gap-5'>
                                <div className={`BoardInfoIcon flex justify-center items-center`} style={{ backgroundColor: '#4D44B5' }}>
                                    <PiStudent className='text-white text-5xl'/>
                                </div>
                                <div className='BoardInfoText flex flex-col items-start gap-2'>
                                    <p>Students</p>
                                    <h1>{stats.counts.students}</h1>
                                </div>
                            </div>
                            
                            {/* Teachers */}
                            <div className='flex justify-center items-center gap-5'>
                                <div className={`BoardInfoIcon flex justify-center items-center`} style={{ backgroundColor: '#FB7D5B' }}>
                                    <LuUserRound className='text-white text-5xl'/>
                                </div>
                                <div className='BoardInfoText flex flex-col items-start gap-2'>
                                    <p>Teachers</p>
                                    <h1>{stats.counts.teachers}</h1>
                                </div>
                            </div>
                            
                            {/* Year */}
                            <div className='flex justify-center items-center gap-5'>
                                <div className={`BoardInfoIcon flex justify-center items-center`} style={{ backgroundColor: '#FCC43E' }}>
                                    <MdOutlineDateRange className='text-white text-5xl'/>
                                </div>
                                <div className='BoardInfoText flex flex-col items-start gap-2'>
                                    <p>Academic Year</p>
                                    <h1>{stats.counts.yearName}</h1>
                                </div>
                            </div>
                            
                            {/* Admins */}
                            <div className='flex justify-center items-center gap-5'>
                                <div className={`BoardInfoIcon flex justify-center items-center`} style={{ backgroundColor: '#303972'}}>
                                    <TbShield className='text-white text-5xl'/>
                                </div>
                                <div className='BoardInfoText flex flex-col items-start gap-2'>
                                    <p>Admins</p>
                                    <h1>{stats.counts.admins}</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-[1000px] ml-[24px] flex justify-center items-start mt-[40px] gap-[20px]'>
                        <div className='w-[573px] bg-[#F9F9F9] pieCircle flex flex-col items-start'>
                            <h1 className='p-[40px]'>Students By Class</h1>
                            <div className="w-full p-[40px]">
                                {stats.studentDistribution.byClass.map((classInfo, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="flex justify-between">
                                            <span style={{color: '#4D44B5', fontWeight: 'bold'}}>{classInfo.className}</span>
                                            <span style={{color: '#4D44B5' , fontWeight: 'bold'}}>{classInfo.count} students ({classInfo.percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                            <div 
                                                className="bg-[#A098AE] h-2.5 rounded-full" 
                                                style={{ width: `${classInfo.percentage}% `}}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='w-[395px] bg-[#F9F9F9] pieNotes flex flex-col items-start '>
                            <h1 className='p-[40px]'>Notes for Dashboard</h1>
                                <ol className='olpieNotes pl-[40px] mb-4 flex flex-col items-start gap-2'>
                                    <li>Create Academic Year</li>
                                    <li>Create Classes </li>
                                    <li>Create Subclasses</li>
                                    <li>Add Students or Subjects</li>
                                </ol >
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;