
// 192.168.137.1

const ip = "10.0.0.74";

const port = "3000";

const root = 'http://' + ip + ':' + port + '/';

const host = root + "backendowner/";

const hostSocket = "ws://" + ip  + ":" + port + "/";

const hostTenant = root + "backendtenant/";

const ownerURL = "/owner";

const ownerDashboardURL = root + "owner/" + ownerURL; // Not an error

const tenantURL = "/tenant";

// root end with "/" and tenant starts with "/" so tenantURL.substring(1).
const activateURL = root + tenantURL.substring(1) + "/activate";

const receiptURL = ownerURL + "/owner_receipt";

const ownerLogSignURL = ownerURL + "/owner_sign_log";

const ownerErrorPage = ownerURL + ""; // A completer
