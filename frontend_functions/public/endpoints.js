
// 192.168.137.1

const ip = "localhost";

const port = "3000";

const root = 'http://' + ip + ':' + port + '/';

const host = root + "backendowner/";

const hostSocket = "ws://" + ip  + ":" + port + "/";

const hostTenant = root + "backendtenant/";

const ownerURL = "/owner";

const ownerError = root + 'owner/owner-error';

const ownerDashboardURL = root + "owner" + ownerURL; // Not an error

const tenantURL = "/tenant";

const tenantError = root + 'tenant/tenant-error';

const tenantDashboardURL = root + "tenant" + tenantURL; // Not an error

// root end with "/" and tenant starts with "/" so tenantURL.substring(1).
const activateURL = root + tenantURL.substring(1) + "/tenant-activate";

const receiptURL = ownerURL + "/owner-receipt";

const receiptURLTenant = tenantURL + "/tenant-receipt";

const ownerLogSignURL = ownerURL + "/owner-sign-log";

const ownerErrorPage = ownerURL + ""; // A completer
