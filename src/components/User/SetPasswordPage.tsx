import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {useAppDispatch} from "../../hook/reduxHook";
import {userActions} from "../../store/slices";
import css from './User.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';



const SetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSetPassword = async () => {
        if (!token) {
            setError("Invalid token.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            await dispatch(userActions.setPasswordUser({ token, password })).unwrap();
            alert("Password set successfully!");
            navigate("/users");
        } catch (err) {
            setError("Failed to set password. Try again.");
        }
    };

    return (
        <div className={css.loGiN}>
            <div className={css.box}>
                <div className={css.head}>
                    <h2>Set New Password</h2>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
                <div className={css.blank}>
                    <div className={css.inputWrapper}>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                        <button
                            className={css.eyeButton}
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>

                    <div className={css.inputWrapper}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                        />
                        <button
                            className={css.eyeButton}
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                        >
                            {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                    <button onClick={handleSetPassword}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export {
    SetPasswordPage
}

