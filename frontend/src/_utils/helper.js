const hasRole = (permissions) => {
  const userData = JSON.parse(localStorage.getItem("user")); // Retrieve user data from session storage
  const userRole = userData?.role || 0;
   return (permissions & userRole) !== 0;
};

const ROLES = {
    PROPONENTS: 0x01,
    RPS_TEAM: 0x02,
    MANAGER: 0x04,
    ADMINISTRATOR: 0x08,
};

const formatFileSize = (bytes)  => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

const formatDate = (dateString, format = 'dd-MMM-yyyy hh:mm A') => {
    try {
        const date = new Date(dateString);
    
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        // Convert to 12-hour format and determine AM/PM
        let hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

        const formatMap = {
            yyyy: date.getFullYear(),
            mm: String(date.getMonth() + 1).padStart(2, '0'),
            MMMM: fullMonthNames[date.getMonth()],
            MMM: monthNames[date.getMonth()],
            dd: String(date.getDate()).padStart(2, '0'),
            hh: String(hours).padStart(2, '0'), // 12-hour format
            HH: String(date.getHours()).padStart(2, '0'), // 24-hour format
            MM: String(date.getMinutes()).padStart(2, '0'),
            SS: String(date.getSeconds()).padStart(2, '0'),
            A: ampm // AM/PM
        };

        return format.replace(/yyyy|mm|MMMM|MMM|dd|hh|HH|MM|SS|A/g, match => formatMap[match]);
    } catch (error) {
        return "";
    }
};

export { hasRole, ROLES, formatFileSize, formatDate };