

const hasRole = (requiredRole) => {
  const userData = JSON.parse(sessionStorage.getItem("user")); // Retrieve user data from session storage
  const userRole = userData?.role || 0;
  return (userRole & requiredRole) === requiredRole; // Bitwise AND comparison
};



export { hasRole };