import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import useUserStore from "../../_utils/store/useUserStore";
import axios from "axios";

const VerificationLinkPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser, isSameUser } = useUserStore();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const redirectURL = params.get("redirect");
        if (!redirectURL) {
            navigate("/verification-failed");
        }
        axios.get(redirectURL, { maxRedirects: 0 }).then((response) => {
                const { success, data } = response.data;
                if (success) {
                     setUser(data);
                     navigate("/");
                } else {
                    navigate("/verification-failed");
                }
            })
            .catch(() => {
                navigate("/verification-failed");
            });
    }, [location, navigate]);


    return <p>Verifying your email... Please wait.</p>;
};

export default VerificationLinkPage;