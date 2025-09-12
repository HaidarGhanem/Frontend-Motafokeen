import './App.css'
import { Routes, Route ,  Navigate} from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import Admins from './pages/admins/Admins';
import Teachers from './pages/Teachers/Teachers';
import Years from './pages/years/Years';
import Classes from './pages/Classes/Classes';
import Subclasses from './pages/subclasses/Subclasses';
import Students from './pages/students/Students';
import Absence from './pages/Absence/Absence';
import Exams from './pages/exams/Exams';
import Subjects from './pages/Subjects/Subjects';
import Calendar from './pages/Calendar/Calendar';
import Activities from './pages/Activities/Activities';
import Posts from './pages/Posts/Posts';
import Olympic from './pages/Olympic/Olympic';
import Web from './pages/Web/Web';
import Cert from './pages/Cert/Cert';
import Employees from './pages/Employees/Employees';
import Notifications from './pages/Notify/Notifications';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/admins" element={<Admins />} />
                <Route path="/dashboard/teachers" element={<Teachers />} />
                <Route path="/dashboard/employees" element={<Employees />} />
                <Route path="/dashboard/academic-years" element={<Years />} />
                <Route path="/dashboard/classes" element={<Classes />} />
                <Route path="/dashboard/subclasses" element={<Subclasses />} />
                <Route path="/dashboard/students" element={<Students />} />
                <Route path="/dashboard/absence" element={<Absence />} />
                <Route path="/dashboard/exams" element={<Exams />} />
                <Route path="/dashboard/subjects" element={<Subjects />} />
                <Route path="/dashboard/calendar" element={<Calendar />} />
                <Route path="/dashboard/activities" element={<Activities />} />
                <Route path="/dashboard/app-posts" element={<Posts />} />
                <Route path="/dashboard/olympiad" element={<Olympic />} />
                <Route path="/dashboard/website-posts" element={<Web />} />
                <Route path="/dashboard/cert" element={<Cert />} />
                {/* <Route path="/dashboard/notifications" element={<Notifications />} /> */}
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App