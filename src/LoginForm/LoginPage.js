import React, { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import HttpsIcon from '@mui/icons-material/Https';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import { setToken } from './auth'; 
import { getToken } from "./auth";

const LoginForm = ({ onLoginSuccess }) => {
    const [user_name, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login', { user_name, password });
            if (response.data.status === "Success") {
                console.log("Logged in successfully");
    
                setToken(response.headers.authorization); 
                const token = getToken();
                console.log(token);
    
                const userRole = response.data.model.role; 
                console.log (userRole);
                onLoginSuccess();
    
                if (userRole === 'ADMIN') {
                    navigate('/home'); 
                } else if (userRole === 'INVESTOR') {
                    navigate('/new-page'); 
                } else {
                    setError("Role is not recognized!");
                }
            } else {
                setError("There was an error logging in! wrong password or username");
            }
        } catch (error) {
            console.error("There was an error logging in!", error);
            setError("There was an error try again");
        }
    };

    return(
        <div style={{
            backgroundColor:'#093B80',
            margin: '0',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            height:'100vh',
            overflow:'hidden'
        }}>
        <div className={styles["login-container"]}>
            <form onSubmit={handleSubmit} className={styles["login-form"]}>
                <h1>Login</h1>
                {error && <div className={styles.error}>{error}</div>}
                <div className={styles["input-container"]}>
                    <PersonIcon className={styles.icon}/>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={user_name} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className={styles["input-container"]}>
                    <HttpsIcon className={styles.icon}/>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className={styles["login-button"]}>Login</button>
            </form>
        </div>
        </div>
    );
};

export default LoginForm;
