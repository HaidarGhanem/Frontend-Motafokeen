import SideBar from '../../components/SideBar/SideBar'
import { useEffect, useState } from 'react';
import './Dashboard.css'
import { LuUserRound } from "react-icons/lu";
import { PiStudent } from "react-icons/pi";
import { MdOutlineDateRange } from "react-icons/md";
import { TbShield } from "react-icons/tb";
import { FaMale, FaFemale } from "react-icons/fa";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [cityStats, setCityStats] = useState(null);
    const [promotionReport, setPromotionReport] = useState(null);
    const [activeTab, setActiveTab] = useState('class'); // 'class' or 'city'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [promotionLoading, setPromotionLoading] = useState(false);
    const [promotionMessage, setPromotionMessage] = useState('');

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                // Fetch main statistics
                const response = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/info');
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                
                if (data.success) {
                    setStats(data.data);
                    
                    // Now fetch city distribution
                    const cityResponse = await fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/info/city-distribution');
                    if (cityResponse.ok) {
                        const cityData = await cityResponse.json();
                        if (cityData.success) {
                            setCityStats(cityData.data);
                        }
                    }
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

    // Function to handle promotion
    const handlePromote = async () => {
        setPromotionLoading(true);
        setPromotionMessage('');
        try {
            const res = await fetch("https://backend-motafokeen-ajrd.onrender.com/dashboard/promotions/promote", {
                method: "PUT"
            });
            const data = await res.json();
            
            if (data.success) {
                setPromotionMessage(`Promotion successful! ✅ Promoted: ${data.promotedCount}, Skipped: ${data.skippedCount}`);
                // Refresh the promotion report after promotion
                await handleShowReport();
            } else {
                setPromotionMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setPromotionMessage(`Error: ${error.message}`);
        } finally {
            setPromotionLoading(false);
        }
    };

    // Function to reset failed subjects
    const handleResetFailed = async () => {
        setPromotionLoading(true);
        setPromotionMessage('');
        try {
            const res = await fetch("https://backend-motafokeen-ajrd.onrender.com/dashboard/promotions/reset-failed", {
                method: "PUT"
            });
            const data = await res.json();
            
            if (data.success) {
                setPromotionMessage(`Reset successful! ✅ Reset for ${data.modifiedCount} students`);
                // Refresh the promotion report after reset
                await handleShowReport();
            } else {
                setPromotionMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setPromotionMessage(`Error: ${error.message}`);
        } finally {
            setPromotionLoading(false);
        }
    };

    // Function to show promotion report
    const handleShowReport = async () => {
        setPromotionLoading(true);
        setPromotionMessage('');
        try {
            const res = await fetch("https://backend-motafokeen-ajrd.onrender.com/dashboard/promotions/report");
            const data = await res.json();
            
            if (data.success) {
                setPromotionReport(data.data);
                setPromotionMessage(`Report loaded successfully! Found ${data.data.length} students`);
            } else {
                setPromotionMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setPromotionMessage(`Error: ${error.message}`);
        } finally {
            setPromotionLoading(false);
        }
    };

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

    // Find male and female counts
    const maleCount = stats.studentDistribution.byGender?.find(g => g.gender === "ذكر")?.count || 0;
    const femaleCount = stats.studentDistribution.byGender?.find(g => g.gender === "أنثى")?.count || 0;
    const malePercentage = stats.studentDistribution.byGender?.find(g => g.gender === "ذكر")?.percentage || 0;
    const femalePercentage = stats.studentDistribution.byGender?.find(g => g.gender === "أنثى")?.percentage || 0;

    return (
        <>
            <div className='flex'>
                <SideBar />
                <div>
                    {/* ================= TOP INFO CARDS ================= */}
                    <div className='infoBoard flex justify-center items-center flex-1'>
                        <div className='flex justify-center items-center gap-10'>
                            {/* Students */}
                            <div className='flex justify-center items-center gap-5'>
                                <div className="BoardInfoIcon flex justify-center items-center" style={{ backgroundColor: '#4D44B5' }}>
                                    <PiStudent className='text-white text-5xl'/>
                                </div>
                                <div className='BoardInfoText flex flex-col items-start gap-2'>
                                    <p>Students</p>
                                    <h1>{stats.counts.students}</h1>
                                </div>
                            </div>
                            
                            {/* Teachers */}
                            <div className='flex justify-center items-center gap-5'>
                                <div className="BoardInfoIcon flex justify-center items-center" style={{ backgroundColor: '#FB7D5B' }}>
                                    <LuUserRound className='text-white text-5xl'/>
                                </div>
                                <div className='BoardInfoText flex flex-col items-start gap-2'>
                                    <p>Teachers</p>
                                    <h1>{stats.counts.teachers}</h1>
                                </div>
                            </div>
                            
                            {/* Year */}
                            <div className='flex justify-center items-center gap-5'>
                                <div className="BoardInfoIcon flex justify-center items-center" style={{ backgroundColor: '#FCC43E' }}>
                                    <MdOutlineDateRange className='text-white text-5xl'/>
                                </div>
                                <div className='BoardInfoText flex flex-col items-start gap-2'>
                                    <p>Academic Year</p>
                                    <h1>{stats.counts.yearName}</h1>
                                </div>
                            </div>
                            
                            {/* Admins */}
                            <div className='flex justify-center items-center gap-5'>
                                <div className="BoardInfoIcon flex justify-center items-center" style={{ backgroundColor: '#303972'}}>
                                    <TbShield className='text-white text-5xl'/>
                                </div>
                                <div className='BoardInfoText flex flex-col items-start gap-2'>
                                    <p>Admins</p>
                                    <h1>{stats.counts.admins}</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= STUDENTS BY CLASS / CITY ================= */}
                    <div className='w-[1000px] ml-[24px] flex justify-center items-start mt-[40px] gap-[20px]'>
                        <div className='w-[573px] bg-[#F9F9F9] pieCircle flex flex-col items-start'>
                            <div className="flex justify-between items-center w-full p-[20px_40px_0_40px]">
                                <h1>
                                    {activeTab === 'class' ? 'Students By Class' : 'Students By City'}
                                </h1>
                                <div className="flex gap-2">
                                    <button 
                                        className={`px-3 py-1 rounded ${activeTab === 'class' ? 'bg-[#4D44B5] text-white' : 'bg-gray-200'}`}
                                        onClick={() => setActiveTab('class')}
                                    >
                                        Class
                                    </button>
                                    <button 
                                        className={`px-3 py-1 rounded ${activeTab === 'city' ? 'bg-[#4D44B5] text-white' : 'bg-gray-200'}`}
                                        onClick={() => setActiveTab('city')}
                                    >
                                        City
                                    </button>
                                </div>
                            </div>
                            
                            <div className="w-full p-[40px] max-h-[600px] overflow-y-auto">
                                {activeTab === 'class' ? (
                                    stats.studentDistribution.byClass.map((classInfo, index) => (
                                        <div key={index} className="mb-4">
                                            <div className="flex justify-between">
                                                <span style={{color: '#4D44B5', fontWeight: 'bold'}}>{classInfo.className}</span>
                                                <span style={{color: '#4D44B5' , fontWeight: 'bold'}}>{classInfo.count} students ({classInfo.percentage}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                                <div 
                                                    className="bg-[#4D44B5] h-2.5 rounded-full" 
                                                    style={{ width: `${classInfo.percentage}% `}}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    cityStats ? (
                                        <>
                                            {cityStats.predefinedCities.map((cityInfo, index) => (
                                                <div key={index} className="mb-4">
                                                    <div className="flex justify-between">
                                                        <span style={{color: '#4D44B5', fontWeight: 'bold'}}>{cityInfo.city}</span>
                                                        <span style={{color: '#4D44B5' , fontWeight: 'bold'}}>{cityInfo.count} students ({cityInfo.percentage}%)</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                                        <div 
                                                            className="bg-[#4D44B5] h-2.5 rounded-full" 
                                                            style={{ width: `${cityInfo.percentage}% `}}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                            {cityStats.otherCities.total > 0 && (
                                                <div className="mb-4 mt-6 pt-4 border-t border-gray-200">
                                                    <div className="flex justify-between">
                                                        <span style={{color: '#FB7D5B', fontWeight: 'bold'}}>Other Cities</span>
                                                        <span style={{color: '#FB7D5B', fontWeight: 'bold'}}>
                                                            {cityStats.otherCities.total} students ({cityStats.otherCities.percentage}%)
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                                        <div 
                                                            className="bg-[#FB7D5B] h-2.5 rounded-full" 
                                                            style={{ width: `${cityStats.otherCities.percentage}% `}}
                                                        ></div>
                                                    </div>
                                                    <div className="mt-3 pl-2 text-sm">
                                                        {cityStats.otherCities.cities.map((city, idx) => (
                                                            <div key={idx} className="flex justify-between text-gray-600">
                                                                <span>{city.city}</span>
                                                                <span>{city.count} ({city.percentage}%)</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div>Loading city data...</div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Gender + Notes */}
                        <div className='w-[395px] flex flex-col gap-[20px]'>
                            <div className='bg-[#F9F9F9] pieNotes flex flex-col items-start'>
                                <h1 className='p-[40px]'>Gender Distribution</h1>
                                <div className="w-full p-[40px]">
                                    {/* Male */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaMale className="text-blue-400" />
                                            <span className='text-[18px]' style={{color: '#4D44B5', fontWeight: 'bold'}}>male students</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className='text-[16px]' style={{color: '#4D44B5'}}>{maleCount} students</span>
                                            <span className='text-[16px]' style={{color: '#4D44B5', fontWeight: 'bold'}}>{malePercentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div 
                                                className="bg-blue-400 h-2 rounded-full" 
                                                style={{ width: `${malePercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    {/* Female */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaFemale className="text-pink-400" />
                                            <span className='text-[18px]' style={{color: '#4D44B5', fontWeight: 'bold'}}>female students</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className='text-[16px]' style={{color: '#4D44B5'}}>{femaleCount} students</span>
                                            <span className='text-[16px]' style={{color: '#4D44B5', fontWeight: 'bold'}}>{femalePercentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div 
                                                className="bg-pink-400 h-2 rounded-full" 
                                                style={{ width: `${femalePercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className='bg-[#F9F9F9] pieNotes flex flex-col items-start '>
                                <h1 className='p-[40px]'>Notes for Dashboard</h1>
                                <ol className='olpieNotes pl-[40px] mb-4 flex flex-col items-start gap-2'>
                                    <li>Create Academic Year</li>
                                    <li>Create Classes </li>
                                    <li>Create Subclasses</li>
                                    <li>Add Students or Subjects</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* ================= PROMOTIONS SECTION ================= */}
<div className="w-full bg-[#F9F9F9] rounded-xl shadow-md p-6 flex flex-col gap-6">
    <h1 className="text-2xl font-bold text-[#303972]">Promotions Management</h1>

    {promotionMessage && (
        <div className={`p-3 rounded ${promotionMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {promotionMessage}
        </div>
    )}

    {/* Buttons Row */}
    <div className="flex flex-wrap gap-4">
        <button
            onClick={handlePromote}
            disabled={promotionLoading}
            className="flex-1 min-w-[200px] px-4 py-2 bg-[#4D44B5] text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed text-center"
        >
            {promotionLoading ? 'Processing...' : ' Promote Eligible Students'}
        </button>

        <button
            onClick={handleResetFailed}
            disabled={promotionLoading}
            className="flex-1 min-w-[200px] px-4 py-2 bg-[#FB7D5B] text-white rounded-lg  disabled:bg-gray-400 disabled:cursor-not-allowed text-center"
        >
            {promotionLoading ? 'Processing...' : ' Reset Failed Subjects'}
        </button>

        <button
            onClick={handleShowReport}
            disabled={promotionLoading}
            className="flex-1 min-w-[200px] px-4 py-2 bg-[#303972] text-white rounded-lg  disabled:bg-gray-400 disabled:cursor-not-allowed text-center"
        >
            {promotionLoading ? 'Loading...' : ' Show Promotion Report'}
        </button>
    </div>

    {/* Promotion Report */}
    {promotionReport && (
  <div className="overflow-x-auto mt-4">
    <h2 className="text-xl font-semibold mb-3 text-[#4D44B5]">Promotion Eligibility Report</h2>
    {/* Scrollable container with fixed height */}
    <div className="max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg shadow-sm">
      <table className="min-w-full text-sm text-center bg-white rounded-xl">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            {['Student', 'Current Class', 'Failed Subjects', 'Eligible'].map((th, idx) => (
              <th
                key={idx}
                className="px-6 py-3 font-medium text-gray-700 border-b border-gray-200"
              >
                {th}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {promotionReport.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-6 text-gray-400">
                No promotion data available
              </td>
            </tr>
          ) : (
            promotionReport.map((student, idx) => (
              <tr
                key={idx}
                className={`transition-colors hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-6 py-3 border-b border-gray-100">{student.name}</td>
                <td className="px-6 py-3 border-b border-gray-100">{student.currentClass}</td>
                <td className="px-6 py-3 border-b border-gray-100">{student.failedSubjects}</td>
                <td className="px-6 py-3 border-b border-gray-100">
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-semibold ${
                      student.eligibleForPromotion
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {student.eligibleForPromotion ? '✅' : '❌'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}





</div>

                </div>
            </div>
        </>
    );
}
 
export default Dashboard;