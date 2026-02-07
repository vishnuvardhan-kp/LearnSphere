import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './views/Home';
import { Login } from './views/Login';
import { Register } from './views/Register';
import { CompanyDashboard } from './views/CompanyDashboard';
import { InfluencerDashboard } from './views/InfluencerDashboard';
import { InfluencerOnboarding } from './views/InfluencerOnboarding';
import { CompanyOnboarding } from './views/CompanyOnboarding';
import { Funds } from './views/Funds';
import { Analytics } from './views/Analytics';
import { Campaigns } from './views/Campaigns';
import { Settings } from './views/Settings';
import { AIAgent } from './views/AIAgent';
import { About } from './views/About';
import { InfluencerAnalytics } from './views/InfluencerAnalytics';
import { InfluencerSettings } from './views/InfluencerSettings';
import { InfluencerWallet } from './views/InfluencerWallet';
import { CompanyInfluencers } from './views/CompanyInfluencers';
import { CreateCampaign } from './views/CreateCampaign';
import { InfluencerPartnerships } from './views/InfluencerPartnerships';
import { WatchStory } from './views/WatchStory';
import { CreateCourse } from './views/CreateCourse';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/watch-story" element={<WatchStory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<InfluencerOnboarding />} />
          <Route path="/company-onboarding" element={<CompanyOnboarding />} />

          {/* Protected Instructor Routes */}
          <Route path="/influencer-dashboard" element={
            <ProtectedRoute allowedRoles={['influencer']}>
              <InfluencerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/influencer/analytics" element={
            <ProtectedRoute allowedRoles={['influencer']}>
              <InfluencerAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/influencer/partnerships" element={
            <ProtectedRoute allowedRoles={['influencer']}>
              <InfluencerPartnerships />
            </ProtectedRoute>
          } />
          <Route path="/influencer/settings" element={
            <ProtectedRoute allowedRoles={['influencer']}>
              <InfluencerSettings />
            </ProtectedRoute>
          } />
          <Route path="/influencer/wallet" element={
            <ProtectedRoute allowedRoles={['influencer']}>
              <InfluencerWallet />
            </ProtectedRoute>
          } />
          <Route path="/influencer/create-course" element={
            <ProtectedRoute allowedRoles={['influencer']}>
              <CreateCourse />
            </ProtectedRoute>
          } />

          {/* Protected Learner Routes */}
          <Route path="/company-dashboard" element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/company/ai-agent" element={
            <ProtectedRoute allowedRoles={['company']}>
              <AIAgent />
            </ProtectedRoute>
          } />
          <Route path="/company/funds" element={
            <ProtectedRoute allowedRoles={['company']}>
              <Funds />
            </ProtectedRoute>
          } />
          <Route path="/company/analytics" element={
            <ProtectedRoute allowedRoles={['company']}>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/company/campaigns" element={
            <ProtectedRoute allowedRoles={['company']}>
              <Campaigns />
            </ProtectedRoute>
          } />
          <Route path="/company/campaigns/new" element={
            <ProtectedRoute allowedRoles={['company']}>
              <CreateCampaign />
            </ProtectedRoute>
          } />
          <Route path="/company/influencers" element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyInfluencers />
            </ProtectedRoute>
          } />

          {/* Shared Protected Routes */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
