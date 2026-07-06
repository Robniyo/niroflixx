import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import NotFoundPage from './pages/public/NotFoundPage';
import PrivacyPage from './pages/public/PrivacyPage';
import TermsPage from './pages/public/TermsPage';
import AcademyPage from './pages/public/AcademyPage';
import PublicOpportunitiesPage from './pages/public/OpportunitiesPage';
import PublicServicesPage from './pages/public/ServicesPage';
import PublicResourcesPage from './pages/public/ResourcesPage';
import PublicNewsPage from './pages/public/NewsPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCoursesPage from './pages/admin/CoursesPage';
import AdminOpportunitiesPage from './pages/admin/OpportunitiesPage';
import AdminNewsPage from './pages/admin/NewsPage';
import AdminServicesPage from './pages/admin/ServicesPage';
import AdminResourcesPage from './pages/admin/ResourcesPage';
import UsersPage from './pages/admin/UsersPage';
import SettingsPage from './pages/admin/SettingsPage';
import ClassesPage from './pages/admin/ClassesPage';

import TestimonialsPage from './pages/admin/TestimonialsPage';
import PartnersPage from './pages/admin/PartnersPage';

import TrainersPage from './pages/admin/TrainersPage';
import CandidatesPage from './pages/admin/CandidatesPage';
import ApplicationsPage from './pages/admin/ApplicationsPage';
import AdvertisementsPage from './pages/admin/AdvertisementsPage';
import SubscribersPage from './pages/admin/SubscribersPage';
import CourseDetailPage from './pages/public/CourseDetailPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import DashboardSettingsPage from './pages/dashboard/SettingsPage';
import TrainerDashboard from './pages/dashboard/TrainerDashboard';
import ReportsPage from './pages/admin/ReportsPage';
import CandidateProfilePage from './pages/dashboard/CandidateProfilePage';
import DownloadsPage from './pages/dashboard/DownloadsPage';
import AuthPage from './pages/auth/AuthPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import SearchPage from './pages/public/SearchPage';
import ChatBot from './components/ui/ChatBot';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ScrollToTop from './components/ui/ScrollToTop';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import MaintenancePage from './pages/public/MaintenancePage';

import ResourceDetailPage from './pages/public/ResourceDetailPage';
import OpportunityDetailPage from './pages/public/OpportunityDetailPage';
import NewsDetailPage from './pages/public/NewsDetailPage';
import SessionsPage from './pages/admin/SessionsPage';
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.role !== 'CONTENT_MANAGER')) {
    window.location.href = '/login';
    return null;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: '12px', background: '#1E293B', color: '#F8FAFC', fontSize: '14px' } }} />
      <Routes>
        {/* Auth Routes — Clean, no Navbar/Footer */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/settings" element={<DashboardSettingsPage />} />
        <Route path="/dashboard/candidate" element={<CandidateProfilePage />} />
        <Route path="/dashboard/downloads" element={<DownloadsPage />} />
        

        {/* Trainer Dashboard */}
        <Route path="/trainer" element={<TrainerDashboard />} />

        {/* Public Routes — With Navbar & Footer */}
          <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/opportunities" element={<PublicOpportunitiesPage />} />
          <Route path="/services" element={<PublicServicesPage />} />
          <Route path="/resources" element={<PublicResourcesPage />} />
          <Route path="/news" element={<PublicNewsPage />} />
          <Route path="/academy/:slug" element={<CourseDetailPage />} />
          <Route path="/resources/:slug" element={<ResourceDetailPage />} />
          <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />

        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="opportunities" element={<AdminOpportunitiesPage />} />
          <Route path="news" element={<AdminNewsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="resources" element={<AdminResourcesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="partners" element={<PartnersPage />} />
          <Route path="trainers" element={<TrainersPage />} />
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="advertisements" element={<AdvertisementsPage />} />
          <Route path="subscribers" element={<SubscribersPage />} />
          <Route path="sessions" element={<SessionsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          

        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ChatBot />
    </>
  );
}