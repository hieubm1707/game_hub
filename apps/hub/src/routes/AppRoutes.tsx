import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '../app/ThemeContext';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { PublicLayout } from '../components/PublicLayout';
import { HomePage } from '../features/catalog/HomePage';
import { GamesListPage } from '../features/catalog/GamesListPage';
import { GameDetailPage } from '../features/catalog/GameDetailPage';
import {
  AboutPage,
  ContactPage,
  NotFoundPage,
  PrivacyPage,
  TermsPage,
} from '../features/catalog/LegalPages';
import { PlayPage } from '../features/player/PlayPage';
import { AdminLoginPage } from '../features/admin/AdminLoginPage';
import { AdminLayout } from '../features/admin/AdminLayout';
import { AdminDashboardPage } from '../features/admin/AdminDashboardPage';
import { AdminGamesPage } from '../features/admin/AdminGamesPage';
import { AdminGameFormPage } from '../features/admin/AdminGameFormPage';
import { AdminReleasesPage } from '../features/admin/AdminReleasesPage';
import {
  AdminCategoriesPage,
  AdminContentPage,
  AdminSettingsPage,
} from '../features/admin/AdminCategoriesPage';

export function AppRoutes() {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<GamesListPage />} />
          <Route path="/games/:slug" element={<GameDetailPage />} />
          <Route path="/play/:slug" element={<PlayPage />} />
          <Route path="/categories/:category" element={<GamesListPage />} />
          <Route path="/search" element={<GamesListPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="games" element={<AdminGamesPage />} />
          <Route path="games/new" element={<AdminGameFormPage />} />
          <Route path="games/:id/edit" element={<AdminGameFormPage />} />
          <Route path="games/:id/releases" element={<AdminReleasesPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
      <ThemeSwitcher />
    </ThemeProvider>
  );
}
