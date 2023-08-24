export const environment = {
  production: true,
  baseApiUrl: "https://national-directory.fast.hl7.org/fhir",
  authBypassSessionKey: "auth-bypass-header-enabled",
  idpIssuer: "https://oauth.lantanagroup.com/auth/realms/Connectathon",
  idpClientId: 'ndh-management',
  idpClientSecret: '',
  idpScope: 'openid profile email',
  redirectUri: window.location.origin + '/',
  loginUrl: window.location.origin + '/',
};
