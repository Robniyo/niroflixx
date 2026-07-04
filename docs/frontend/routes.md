# NIROFLIXX — ROUTE & COMPONENT MAP v1.0

## Public Routes

- `/` → HomePage (HeroSection, Statistics, FeaturedCourses, FeaturedOpportunities, PopularServices, LatestNews, FreeResources, Testimonials, Partners, CTASection, Newsletter)
- `/about` → AboutPage
- `/contact` → ContactPage (ContactForm, WhatsApp, Email, Phone, Map)
- `/privacy` → PrivacyPage
- `/terms` → TermsPage
- `/faqs` → FAQsPage (Accordion)
- `/academy` → AcademyPage (SearchBox, Filters, CourseCard grid)
- `/academy/:slug` → CourseDetailPage (Hero, Overview, Curriculum, Instructor, Reviews, FAQ, EnrollCTA)
- `/opportunities` → OpportunitiesPage (SearchBox, Filters, OpportunityCard grid)
- `/opportunities/:id` → OpportunityDetailPage (Overview, Requirements, Benefits, Deadline, ApplyCTA)
- `/services` → ServicesPage (ServiceCard grid, CategoryFilter)
- `/services/:slug` → ServiceDetailPage (Overview, Portfolio, Pricing, FAQ, RequestCTA)
- `/resources` → ResourcesPage (SearchBox, Filters, ResourceCard grid)
- `/resources/:slug` → ResourceDetailPage (Preview, Description, DownloadCTA)
- `/news` → NewsPage (NewsCard grid, CategoryFilter, Pagination)
- `/news/:slug` → NewsDetailPage (Article, ShareButtons, RelatedNews)
- `/search` → SearchPage (SearchBox, TabResults)
- `/login` → LoginPage (LoginForm)
- `/register` → RegisterPage (RegisterForm)
- `/forgot-password` → ForgotPasswordPage
- `/reset-password/:token` → ResetPasswordPage
- `/verify-email/:token` → VerifyEmailPage
- `*` → NotFoundPage

## Dashboard Routes

- `/dashboard` → DashboardPage (StatisticsCards, RecentActivity, UpcomingClasses)
- `/dashboard/courses` → MyCoursesPage (CourseCard list, ProgressBar)
- `/dashboard/courses/:id` → MyCourseDetailPage
- `/dashboard/applications` → MyApplicationsPage (ApplicationCard list, StatusBadge)
- `/dashboard/downloads` → MyDownloadsPage
- `/dashboard/bookmarks` → MyBookmarksPage (Tabs per type)
- `/dashboard/notifications` → NotificationsPage
- `/dashboard/messages` → MessagesPage
- `/dashboard/profile` → ProfilePage (ProfileForm, PhotoUpload)
- `/dashboard/profile/candidate` → CandidateProfilePage
- `/dashboard/settings` → SettingsPage
- `/dashboard/settings/security` → SecurityPage

## Admin Routes

- `/admin` → AdminDashboardPage
- `/admin/users` → UsersPage (DataTable, RoleBadge)
- `/admin/users/:id` → UserDetailPage
- `/admin/courses` → CoursesPage (DataTable)
- `/admin/courses/new` → CourseCreatePage
- `/admin/courses/:id/edit` → CourseEditPage
- `/admin/courses/:id/lessons` → LessonsPage
- `/admin/enrollments` → EnrollmentsPage
- `/admin/opportunities` → OpportunitiesPage
- `/admin/opportunities/new` → OpportunityCreatePage
- `/admin/opportunities/:id/edit` → OpportunityEditPage
- `/admin/applications` → ApplicationsPage
- `/admin/resources` → ResourcesPage
- `/admin/resources/new` → ResourceCreatePage
- `/admin/resources/:id/edit` → ResourceEditPage
- `/admin/news` → NewsPage
- `/admin/news/new` → NewsCreatePage
- `/admin/news/:id/edit` → NewsEditPage
- `/admin/services` → ServicesPage
- `/admin/services/new` → ServiceCreatePage
- `/admin/services/:id/edit` → ServiceEditPage
- `/admin/services/requests` → ServiceRequestsPage
- `/admin/candidates` → CandidatesPage
- `/admin/candidates/:id` → CandidateDetailPage
- `/admin/media` → MediaPage
- `/admin/advertisements` → AdvertisementsPage
- `/admin/announcements` → AnnouncementsPage
- `/admin/analytics` → AnalyticsPage
- `/admin/reports` → ReportsPage
- `/admin/logs` → LogsPage
- `/admin/settings` → SettingsPage
- `/admin/settings/backups` → BackupsPage

## Core Components (94 total)

### Layout (7)
Navbar, Footer, TopBar, DashboardSidebar, AdminSidebar, AnnouncementBar, MobileNav

### UI (48)
Button, Input, Textarea, Select, MultiSelect, Checkbox, Radio, Toggle, Badge, Avatar, Card, Modal, Drawer, Dropdown, Accordion, Tabs, Breadcrumb, Pagination, Table, Tooltip, Alert, Toast, Skeleton, EmptyState, ErrorState, LoadingSpinner, SearchBox, DatePicker, FileUpload, ImageViewer, VideoPlayer, PDFViewer, ProgressBar, Chart, StatisticsCard, Timeline, ActivityCard, NotificationCard, CookieBanner, NewsletterForm, ThemeToggle, ScrollToTop, FloatingActionButton, StarRating, ShareButton, BookmarkButton, CopyLink, SocialShare

### Feedback (5)
SuccessAlert, ErrorAlert, WarningAlert, InfoAlert, ConfirmationDialog

### Data (5)
DataTable, ListView, GridView, TimelineView, CalendarView

### Navigation (4)
MainMenu, MobileMenu, MegaMenu, Stepper

### Content (8)
HeroSection, ArticleCard, BlogList, Gallery, FAQ, TestimonialCard, PartnerLogo, NewsletterSection

### Media (5)
ImageOptimized, VideoEmbed, AudioPlayer, Lightbox, Carousel

### Homepage Sections (12)
HeroSection, FeaturedCourses, FeaturedOpportunities, PopularServices, LatestNews, FreeResources, Statistics, Testimonials, Partners, Newsletter, CTASection, SearchSection

## State Contexts
- AuthContext — user, login, logout, token
- ThemeContext — dark/light mode
- NotificationContext — toast notifications
- SearchContext — query, filters, results

## Build Priority
1. Layout + Button + Input + Card (primitives)
2. PublicLayout + HomePage
3. AuthContext + LoginPage + RegisterPage
4. DashboardLayout + DashboardPage
5. AdminLayout + AdminDashboardPage
6. Feature pages (Academy, Opportunities, etc.)