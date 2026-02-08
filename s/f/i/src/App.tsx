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
import { LearnerCourses } from './views/LearnerCourses';
import { CoursePlayer } from './views/CoursePlayer';
import { CoursePreview } from './views/CoursePreview';
import { EnrollmentSuccess } from './views/EnrollmentSuccess';
import { Profile } from './views/Profile';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/watch-story" element={<WatchStory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<InfluencerOnboarding />} />
          <Route path="/company-onboarding" element={<CompanyOnboarding />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/influencer-dashboard" element={<InfluencerDashboard />} />
          <Route path="/influencer/analytics" element={<InfluencerAnalytics />} />
          <Route path="/influencer/partnerships" element={<InfluencerPartnerships />} />
          <Route path="/company/ai-agent" element={<AIAgent />} />
          <Route path="/company/funds" element={<Funds />} />
          <Route path="/company/analytics" element={<Analytics />} />
          <Route path="/company/campaigns" element={<Campaigns />} />
          <Route path="/company/campaigns/new" element={<CreateCampaign />} />
          <Route path="/company/influencers" element={<CompanyInfluencers />} />
          <Route path="/company/courses" element={<LearnerCourses />} />
          <Route path="/company/course/preview/:id" element={<CoursePreview />} />
          <Route path="/company/course/success/:id" element={<EnrollmentSuccess />} />
          <Route path="/company/course/:id" element={<CoursePlayer />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/influencer/settings" element={<InfluencerSettings />} />
          <Route path="/influencer/wallet" element={<InfluencerWallet />} />
          <Route path="/influencer/create-course" element={<CreateCourse />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
