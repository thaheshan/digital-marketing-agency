import { processDripEmails } from "./jobs/emailDrip.job";

// In your app.ts or server.ts you would call this:
export const initializeJobs = () => {
    // Run every 30 minutes
    setInterval(processDripEmails, 30 * 60 * 1000);
    
    // Also run once on startup
    processDripEmails();
};
