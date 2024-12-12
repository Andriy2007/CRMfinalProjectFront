import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SetPasswordPage = () => {
    const { token } = useParams(); // Отримуємо токен з URL
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSetPassword = async () => {
        try {
            await axios.post("http://localhost:3002/auth/set-password", { token, password });
            alert("Password set successfully! You can now log in.");
            navigate("/login");
        } catch (err) {
            setError("Failed to set password. Try again.");
        }
    };

    return (
        <div>
            <h2>Set New Password</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSetPassword}>Submit</button>
        </div>
    );
};

export {
    SetPasswordPage
}

