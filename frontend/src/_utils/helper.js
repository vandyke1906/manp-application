const hasRole = (permissions) => {
  const userData = JSON.parse(sessionStorage.getItem("user")); // Retrieve user data from session storage
  const userRole = userData?.role || 0;
   return (permissions & userRole) !== 0;
};



const ROLES = {
    PROPONENTS: 0x01,
    RPS_TEAM: 0x02,
    MANAGER: 0x04,
    ADMINISTRATOR: 0x08,
};


export { hasRole, ROLES };