import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import api from './services/api';

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
import SearchPage from './pages/public/SearchPage';
import CourseDetailPage from './pages/public/CourseDetailPage';
import ResourceDetailPage from './pages/public/ResourceDetailPage';
import OpportunityDetailPage from './pages/public/OpportunityDetailPage';
import NewsDetailPage from './pages/public/NewsDetailPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import MaintenancePage from './pages/public/MaintenancePage';

import AuthPage from './pages/auth/AuthPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import DashboardPage from './pages/dashboard/DashboardPage';
import DashboardSettingsPage from './pages/dashboard/SettingsPage';
import CandidateProfilePage from './pages/dashboard/CandidateProfilePage';
import DownloadsPage from './pages/dashboard/DownloadsPage';
import TrainerDashboard from './pages/dashboard/TrainerDashboard';

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
import SessionsPage from './pages/admin/SessionsPage';
import ReportsPage from './pages/admin/ReportsPage';
import CategoriesPage from './pages/admin/CategoriesPage';

import ScrollToTop from './components/ui/ScrollToTop';
//import ChatBot from './components/ui/ChatBot';

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
  const [maintenance, setMaintenance] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.get('/admin/maintenance').then(r => {
      setMaintenance(r.data.data?.enabled || false);
      setChecking(false);
    }).catch(() => setChecking(false));
  }, []);

  if (checking) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  if (maintenance && !window.location.pathname.includes('/admin') && !window.location.pathname.includes('/login')) {
    return <MaintenancePage />;
  }

  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: '12px', background: '#1E293B', color: '#F8FAFC', fontSize: '14px' } }} />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/settings" element={<DashboardSettingsPage />} />
        <Route path="/dashboard/candidate" element={<CandidateProfilePage />} />
        <Route path="/dashboard/downloads" element={<DownloadsPage />} />

        <Route path="/trainer" element={<TrainerDashboard />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/academy/:slug" element={<CourseDetailPage />} />
          <Route path="/opportunities" element={<PublicOpportunitiesPage />} />
          <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
          <Route path="/services" element={<PublicServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/resources" element={<PublicResourcesPage />} />
          <Route path="/resources/:slug" element={<ResourceDetailPage />} />
          <Route path="/news" element={<PublicNewsPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
        </Route>

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="sessions" element={<SessionsPage />} />
          <Route path="opportunities" element={<AdminOpportunitiesPage />} />
          <Route path="news" element={<AdminNewsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="resources" element={<AdminResourcesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="partners" element={<PartnersPage />} />
          <Route path="trainers" element={<TrainersPage />} />
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="advertisements" element={<AdvertisementsPage />} />
          <Route path="subscribers" element={<SubscribersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}