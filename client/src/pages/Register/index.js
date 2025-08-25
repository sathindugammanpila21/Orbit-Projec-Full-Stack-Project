import React, { useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../components/Divider";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { buttonLoading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await RegisterUser(values);
      dispatch(SetButtonLoading(false));
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetButtonLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-primary">ORBIT</h1>
            <p className="text-text-secondary">Your projects, perfectly aligned.</p>
        </div>
        <h2 className="text-xl font-semibold mb-6 text-center text-text-primary">Create an Account</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={getAntdFormInputRules}
          >
            <Input placeholder="Enter your first name" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={getAntdFormInputRules}
          >
            <Input placeholder="Enter your last name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={getAntdFormInputRules}>
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={getAntdFormInputRules}
          >
            <Input type="password" placeholder="Enter your password" />
          </Form.Item>

          <button
            type="submit"
            disabled={buttonLoading}
            className="w-full bg-primary text-white h-10 rounded-md hover:bg-blue-600 transition-colors mt-2 flex justify-center items-center disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {buttonLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Register'
            )}
          </button>

          <div className="text-center mt-5">
            <Link to="/login" className="text-primary font-medium">
              Already have an account? Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
