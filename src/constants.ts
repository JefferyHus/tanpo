export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  MULTIPLY_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  LOGIN_TIMEOUT: 440,
  TOO_MANY_REQUESTS: 429,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
  GONE: 410,
  PRECONDITION_FAILED: 412,
  REQUEST_TIMEOUT: 408,
  REQUEST_ENTITY_TOO_LARGE: 413,
  REQUEST_URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  EXPECTATION_FAILED: 417,
  IM_A_TEAPOT: 418,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

export const DATABASE_ERROR_CODES = {
  DUPLICATE_KEY: 0,
  ENTITY_NOT_FOUND: 1,
  ENTITY_ALREADY_EXISTS: 2,
};

// Authentication Error Messages
export const AUTHENTICATION_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid Credentials',
  INVALID_SIGNATURE: 'Invalid Signature',
  INVALID_USER: 'Invalid User',
  UNABLE_LOGOUT: 'Unable to Logout',
  USER_EXISTS: 'User Already Exists',
  USER_NOT_FOUND: 'User Not Found',
  USER_CREATE: 'Unable to Create User',
  NOT_SIGNED_IN: 'Not Signed In',
  USER_LOGIN: 'Unable to Login User',
  USER_LOGOUT: 'Unable to Logout User',
  USER_REFRESH: 'Unable to Refresh Token',
};

// Authentication Success Messages
export const AUTHENTICATION_MESSAGES = {
  USER_CREATED: 'User Created',
  USER_LOGGED_IN: 'User Logged In',
  USER_LOGGED_OUT: 'User Logged Out',
  USER_FOUND: 'User Found',
};

// User Service Error Messages
export const USER_SERVICE_ERRORS = {
  EMAIL_ALREADY_EXISTS: 'Email Already Exists',
  USERNAME_ALREADY_EXISTS: 'Username Already Exists',
  NOT_FOUND: 'User Not Found',
  PROFILE_ALREADY_EXISTS: 'Profile Already Exists for this User',
  PROFILE_DOES_NOT_EXIST: 'Profile Does Not Exist for this User',
  NO_SAASQUATCH_ID: 'User Does Not Have a SaaSQuatch ID',
  COULD_NOT_CREATE_PROFILE: 'Could Not Create Profile',
  COULD_NOT_UPDATE_PROFILE: 'Could Not Update Profile',
  INVALID_PASSWORD: 'Invalid Password',
  INVALID_REFRESH_TOKEN: 'Invalid Refresh Token',
  INVALID_ACCESS_TOKEN: 'Invalid Access Token',
  FAILED_TO_GET_USER: 'Failed to get user',
  FAILED_TO_CREATE_USER: 'Failed to create user',
  FAILED_TO_UPDATE_USER: 'Failed to update user',
};

// Profile Service Error Messages
export const PROFILE_SERVICE_ERRORS = {
  ALREADY_HAS_PROFILE: 'User Already Has Profile',
  NOT_FOUND: 'Profile Not Found',
  COULD_NOT_UPDATE_PROFILE: 'Could Not Update Profile',
};

// Profile Service Success Messages
export const PROFILE_SERVICE_MESSAGES = {
  PROFILE_CREATED: 'Profile Created',
  PROFILE_UPDATED: 'Profile Updated',
};

// Services Success Messages
export const SERVICES_MESSAGES = {
  SERVICE_CREATED: 'Service Created',
  SERVICE_DELETED: 'Service Deleted',
  SERVICE_ACTIVATED: 'Service Activated',
  SERVICE_DEACTIVATED: 'Service Deactivated',
  SERVICE_UPDATED: 'Service Updated',
};

// Services Error Messages
export const SERVICES_ERRORS = {
  SERVICE_NOT_FOUND: 'Service Not Found',
  SERVICE_ALREADY_EXISTS: 'Service Already Exists',
  COULD_NOT_CREATE_SERVICE: 'Could Not Create Service',
  COULD_NOT_DELETE_SERVICE: 'Could Not Delete Service',
  COULD_NOT_ACTIVATE_SERVICE: 'Could Not Activate Service',
  COULD_NOT_DEACTIVATE_SERVICE: 'Could Not Deactivate Service',
  COULD_NOT_UPDATE_SERVICE: 'Could Not Update Service',
  COULD_NOT_LIST_SERVICES: 'Could Not List Services',
};

// Service Planning Success Messages
export const SERVICE_PLANNING_MESSAGES = {
  SERVICE_PLANNING_CREATED: 'Service Planning Created',
  SERVICE_PLANNING_DELETED: 'Service Planning Deleted',
  SERVICE_PLANNING_ACTIVATED: 'Service Planning Activated',
  SERVICE_PLANNING_DEACTIVATED: 'Service Planning Deactivated',
  SERVICE_PLANNING_UPDATED: 'Service Planning Updated',
  SERVICE_PLANNING_RESERVED: 'Service Planning Reserved',
  SERVICE_PLANNING_UNRESERVED: 'Service Planning Unreserved',
};

// Service Planning Error Messages
export const SERVICE_PLANNING_ERRORS = {
  SERVICE_PLANNING_NOT_FOUND: 'Service Planning Not Found',
  SERVICE_PLANNING_ALREADY_EXISTS: 'Service Planning Already Exists',
  COULD_NOT_CREATE_SERVICE_PLANNING: 'Could Not Create Service Planning',
  COULD_NOT_DELETE_SERVICE_PLANNING: 'Could Not Delete Service Planning',
  COULD_NOT_ACTIVATE_SERVICE_PLANNING: 'Could Not Activate Service Planning',
  COULD_NOT_DEACTIVATE_SERVICE_PLANNING:
    'Could Not Deactivate Service Planning',
  COULD_NOT_UPDATE_SERVICE_PLANNING: 'Could Not Update Service Planning',
  COULD_NOT_LIST_SERVICE_PLANNINGS: 'Could Not List Service Plannings',
  COULD_NOT_RESERVE_SERVICE_PLANNING: 'Could Not Reserve Service Planning',
  COULD_NOT_GET_SERVICE_PLANNINGS_BY_AGENT_ID:
    'Could Not Get Service Plannings By Agent Id',
  COULD_NOT_GET_SERVICE_PLANNINGS_BY_SERVICE_ID:
    'Could Not Get Service Plannings By Service Id',
};

// Generic Error Messages
export const GENERIC_ERRORS = {
  SERVER_ERROR: 'Server Error',
  NOT_FOUND: 'Not Found',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  BAD_REQUEST: 'Bad Request',
  MISSING_REQUIRED_FIELDS: 'Missing Required Fields',
  EXPECTATION_FAILED: 'Expectation Failed',
};

// Generic Success Messages
export const GENERIC_MESSAGES = {
  SUCCESS: 'Success',
};

// Body Parser metadata keys
export const BODY_PARSER_METADATA = '__body_parser__';
export const BODY_PARSER_OPTIONS_METADATA = '__body_parser_options__';

// Router metadata keys
export const ROUTER_METADATA = '__router__';
export const ROUTER_PATH_METADATA = '__router_path__';
export const ROUTER_OPTIONS_METADATA = '__router_options__';
export const ROUTER_METHODS_METADATA = '__router_methods__';
export const ROUTER_METHOD_PATH_METADATA = '__router_method_path__';
export const ROUTER_MIDDLEWARES_METADATA = '__router_middlewares__';
export const ROUTER_MIDDLEWARES_PATH_METADATA = '__router_middlewares_path__';
export const ROUTER_INTERCEPTORS_METADATA = '__router_interceptors__';

// Dependency Injection metadata keys
export const INJECTABLE_METADATA = '__injectable__';
export const INJECT_METADATA = '__inject__';
export const MODULE_METADATA = '__module__';
export const INJECT_OPTIONS_METADATA = '__inject_options__';
export const INJECTABLE_OPTIONS_METADATA = '__injectable_options__';
export const PARAMTYPES_METADATA = '__paramtypes__';
export const SELF_DECLARED_DEPS_METADATA = '__self_declared_dependencies__';

// JOB metadata keys
export const JOB_METADATA = '__job__';
export const JOB_OPTIONS_METADATA = '__job_options__';
export const JOB_NAME_METADATA = '__job_name__';
export const JOB_CRON_METADATA = '__job_cron__';

// OpenAPI metadata keys
export const OPENAPI_METADATA = '__openapi__';
export const OPENAPI_PATH_METADATA = '__openapi_path__';
export const OPENAPI_METHODS_METADATA = '__openapi_methods__';
export const OPENAPI_METHOD_PATH_METADATA = '__openapi_method_path__';
export const OPENAPI_METHOD_METADATA = '__openapi_method__';
export const OPENAPI_METHOD_RESPONSES_METADATA = '__openapi_method_responses__';

// JWT
export const JWT_SECRET = String(process.env.JWT_SECRET);
