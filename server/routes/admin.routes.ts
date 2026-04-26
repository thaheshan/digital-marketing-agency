import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';

const router = Router();

// Dashboard Stats
router.get('/stats', adminController.getDashboardStats);

// Team Management
router.get('/team', adminController.getTeam);
router.post('/team', adminController.createTeamMember);
router.put('/team/:id', adminController.updateTeamMember);
router.delete('/team/:id', adminController.deleteTeamMember);

// Client Management
router.get('/clients', adminController.getClients);
router.put('/clients/:id/status', adminController.toggleClientStatus);

// Invoice Management
router.get('/invoices', adminController.getInvoices);
router.post('/invoices', adminController.createInvoice);
router.put('/invoices/:id/status', adminController.updateInvoiceStatus);
router.get('/invoices/:id/pdf', adminController.downloadInvoicePDF);
router.post('/invoices/:id/send', adminController.sendInvoiceToClient);
router.delete('/invoices/:id', adminController.cancelInvoice);

// Global Search
router.get('/search', adminController.globalSearch);

// Campaign Management
router.get('/campaigns', adminController.getCampaigns);
router.get('/campaigns/:id', adminController.getCampaignById);
router.get('/campaigns/:id/performance', adminController.getCampaignPerformance);
router.put('/campaigns/:id', adminController.updateCampaign);

// Enquiries Management
router.get('/enquiries', adminController.getEnquiries);
router.get('/enquiries/:id', adminController.getEnquiryDetail);
router.put('/enquiries/:id/status', adminController.updateEnquiryStatus);
router.post('/enquiries/:id/convert', adminController.convertEnquiryToClient);

// Reports Management
router.get('/reports', adminController.getReports);
router.post('/reports/generate', adminController.generateReport);
router.patch('/reports/:id/visibility', adminController.updateReportVisibility);
router.post('/strategy-reviews', adminController.createStrategyReview);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// Services
router.get('/services', adminController.getServices);

// Content Lists
router.get('/blog', adminController.getBlogPosts);
router.get('/portfolio', adminController.getPortfolioItems);

// Campaign Actions
router.post('/campaigns/create', adminController.createCampaign);

// Content Creation
router.post('/portfolio/create', adminController.createPortfolioItem);
router.post('/blog/create', adminController.createBlogPost);
router.post('/services/create', adminController.createService);

// System Settings & Notifications
router.get('/notifications', adminController.getNotifications);
router.delete('/notifications', adminController.clearNotifications);
router.get('/status', adminController.getAgencyStatus);
router.post('/status', adminController.updateAgencyStatus);

// Agency Settings (full CRUD)
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

export default router;
