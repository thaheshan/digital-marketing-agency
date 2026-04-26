import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';

const router = Router();

// Dashboard Stats
router.get('/stats', adminController.getDashboardStats);

// Team Management
router.get('/team', adminController.getTeam);

// Client Management
router.get('/clients', adminController.getClients);
router.put('/clients/:id/status', adminController.toggleClientStatus);

// Invoice Management
router.get('/invoices', adminController.getInvoices);
router.post('/invoices', adminController.createInvoice);
router.put('/invoices/:id/status', adminController.updateInvoiceStatus);

// Global Search
router.get('/search', adminController.globalSearch);

// Campaign Management
router.get('/campaigns', adminController.getCampaigns);

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

export default router;
