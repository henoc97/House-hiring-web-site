
// 192.168.137.1
const root = 'http://10.0.0.74:3000/';

const host = root + "backendowner/";

const hostTenant = root + "backendtenant/";

const ownerURL = "/owner";

const dashboardURL = root + ownerURL;

const tenantURL = "/tenant";

// root end with "/" and tenant starts with "/" so tenantURL.substring(1).
const activateURL = root + tenantURL.substring(1) + "/activate";

const receiptURL = ownerURL + "/receipt";

const ownerLogSignURL = ownerURL + "/sign_log";

const ownerErrorPage = ownerURL + ""; // A completer
