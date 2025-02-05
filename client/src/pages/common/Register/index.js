import { Form, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await registerUser(values);

      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // Password validation rule
  const passwordValidator = (_, value) => {
    if (!value) {
      return Promise.reject('Please enter your password!');
    }
    if (value.length < 8) {
      return Promise.reject('Password must be at least 8 characters!');
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject('Password must contain at least one lowercase letter!');
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject('Password must contain at least one uppercase letter!');
    }
    if (!/[0-9]/.test(value)) {
      return Promise.reject('Password must contain at least one number!');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return Promise.reject('Password must contain at least one special character!');
    }
    return Promise.resolve();
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-white">
      <div className="card w-400 p-4 shadow-md rounded-lg">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-center">
            AT PORTAL - REGISTER <i className="ri-user-add-line"></i>
          </h1>
          <div className="divider"></div>
          <Form layout="vertical" className="mt-2" onFinish={onFinish}>
            <Form.Item name="name" label="Name">
              <input type="text" className="input-field" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <input type="email" className="input-field" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ validator: passwordValidator }]}>
              <input type="password" className="input-field" />
            </Form.Item>
            <Form.Item name="profileUrl" label="Profile URL">
              <input type="url" placeholder="Enter your profile URL" className="input-field" />
            </Form.Item>

            <div className="flex flex-col gap-2">
              <button type="submit" className="primary-contained-btn mt-2 w-full">
                Register
              </button>
              <Link to="/login" className="text-center text-blue-600">
                Already a member? Login
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
