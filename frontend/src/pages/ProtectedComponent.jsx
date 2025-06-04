import NotFound from "./NotFound";

const ProtectedComponent = ({ user, allowedRoles, children }) => {
  if (!user || !allowedRoles.includes(user.role)) {
    return <NotFound />
  }
  return children;
};

export default ProtectedComponent;