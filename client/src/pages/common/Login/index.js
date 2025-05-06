import React, { useState } from "react";
import { Form, message } from "antd";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./index.css";

function Login() {
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await loginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div className="login-container">
      {/* Top Header */}
      <div className="header1">
        <h1>Welcome to the Virtual Assessment System</h1>
        <p>
          AT Portal is a comprehensive platform designed to help you develop
          your skills through assessments, AI evaluations, and real-time
          analytics. Whether you're a beginner or an expert, the portal
          provides tools to enhance your skills, track progress, and receive
          personalized feedback. Start your journey today!
        </p>
        </div>

      {/* First Section: Animation + Login Form */}
      <div className="main-content">
        {/* Left Section - Animation */}
        <div className="left-section">
       
        
        
        
        <DotLottieReact
    src="https://lottie.host/bee70a92-c4bd-4c1d-a6f2-ccf3c7851b58/RJUDlSuDPO.lottie"
    loop
    autoplay
    className="lottie-animation"
    
/>
        

     
         
        </div>

        {/* Right Section - Login Form */}
        <div className="right-section">
          <div className="login-card">
            <h2 className="form-heading">Login to AT Portal</h2>
            <Form layout="vertical" className="mt-2" onFinish={onFinish}>
              <Form.Item name="email" label="Email" className="form-item">
                <input type="email" className="input-field" placeholder="Enter your email" />
              </Form.Item>

              <Form.Item name="password" label="Password" className="form-item">
                <div className="password-container">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="input-field"
                    placeholder="Enter your password"
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Item>

              <div className="actions">
                <button type="submit" className="primary-btn">
                  Login
                </button>
                <Link to="/register" className="register-link">
                  Not a member? Register
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
