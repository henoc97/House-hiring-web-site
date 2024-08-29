/**
 * @fileoverview This file contains configuration constants for the application.
 * It includes URLs and endpoints used throughout the application for various services
 * such as owner, tenant, and admin functionalities.
 */

/**
 * IP address of the server.
 * @constant {string}
 */
const ip = "localhost";

/**
 * Port number on which the server is running.
 * @constant {string}
 */
const port = "8443";

/**
 * Base URL for the application.
 * @constant {string}
 */
const root = 'https://' + ip + ':' + port + '/';

/**
 * Base URL for the backend owner service.
 * @constant {string}
 */
const host = root + "backend-owner/";

/**
 * WebSocket URL for real-time communication.
 * @constant {string}
 */
const hostSocket = "wss://" + ip  + ":" + port + "/";

/**
 * Base URL for the backend tenant service.
 * @constant {string}
 */
const hostTenant = root + "backend-tenant/";

/**
 * Base URL for the backend admin service.
 * @constant {string}
 */
const hostAdmin = root + "backend-admin/";

/**
 * URL path for the owner dashboard.
 * @constant {string}
 */
const ownerURL = "/owner";

/**
 * URL for the owner error page.
 * @constant {string}
 */
const ownerError = root + 'owner/owner-error';

/**
 * Base URL for owner-related functionalities.
 * @constant {string}
 */
const ownerRoot = root + "owner";

/**
 * Complete URL for the owner dashboard.
 * @constant {string}
 */
const ownerDashboardURL = ownerRoot + ownerURL; // Not an error

/**
 * URL path for the tenant dashboard.
 * @constant {string}
 */
const tenantURL = "/tenant";

/**
 * URL path for the admin dashboard.
 * @constant {string}
 */
const adminURL = "/admin";

/**
 * URL for the admin error page.
 * @constant {string}
 */
const adminError = root + "admin/admin-error";

/**
 * URL for the tenant error page.
 * @constant {string}
 */
const tenantError = root + 'tenant/tenant-error';

/**
 * Complete URL for the tenant dashboard.
 * @constant {string}
 */
const tenantDashboardURL = root + "tenant" + tenantURL; // Not an error

/**
 * Complete URL for the admin dashboard.
 * @constant {string}
 */
const adminDashboardURL = root + "admin" + adminURL; // Not an error

/**
 * URL for tenant activation.
 * The `tenantURL.substring(1)` removes the leading slash from the tenantURL path.
 * @constant {string}
 */
const activateURL = root + tenantURL.substring(1) + "/tenant-activate";

/**
 * URL for owner receipt management.
 * @constant {string}
 */
const receiptURL = ownerURL + "/owner-receipt";

/**
 * URL for tenant receipt management.
 * @constant {string}
 */
const receiptURLTenant = tenantURL + "/tenant-receipt";

/**
 * URL for owner sign log management.
 * @constant {string}
 */
const ownerLogSignURL = ownerURL + "/owner-sign-log";

/**
 * URL for admin sign log management.
 * @constant {string}
 */
const adminLogSignURL = adminURL + "/admin-sign-log";

/**
 * URL for tenant sign log management.
 * @constant {string}
 */
const tenantLogSignURL = tenantURL + "/tenant-sign-log";

/**
 * URL for sending email from the owner service.
 * @constant {string}
 */
const ownerSendEmailURL = ownerRoot + "/owner-send-email";

/**
 * URL for tenant password reset.
 * @constant {string}
 */
const tenantResetPwdURL = tenantURL + "/tenant-reset-pwd";
