import React, { useState, useEffect } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { Link, useHistory } from 'react-router-dom'; import axios from "axios";

const App: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };
  const [DataPost, setDataPost] = useState({
    loginEmail: "",
    passWorld: "",
  });
  const history = useHistory();
  useEffect(() => {
    // check Login 
    const accessTokenAdmin = localStorage.getItem("access_tokenAdmin");
    const accessTokenStudent = localStorage.getItem("access_tokenStudent");
    const accessTokenTeacher = localStorage.getItem("access_tokenTeacher");

    if (accessTokenAdmin != null) {
      history.push("/Management/ManagementIndex");
    }
    else if (accessTokenStudent != null) {
      history.push("/Student/IndexStudent");
    } else if (accessTokenTeacher != null) {
      history.push("/Teacher/IndexTeacher");
    }
  }, []);
  const handleLoginEmail = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    // Sử dụng React.ChangeEvent<HTMLInputElement> để chỉ định kiểu dữ liệu cho event
    if (event) {
      const newPassWorld = event.target.value;
      setDataPost((prevData) => ({
        ...prevData,
        loginEmail: newPassWorld,
      }));
    }
  };
  const handlePassWorld = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    // Sử dụng React.ChangeEvent<HTMLInputElement> để chỉ định kiểu dữ liệu cho event
    if (event) {
      const newPassWorld = event.target.value;
      setDataPost((prevData) => ({
        ...prevData,
        passWorld: newPassWorld,
      }));
    }
  };
  const handleSaveLoginStudent = async () => {
    console.log(DataPost);
    try {
      const response = await axios.post(
        `https://localhost:7232/api/Students/login`, DataPost
      );
      const { token } = response.data;

      // Lưu access token vào localStorage
      localStorage.setItem("access_tokenStudent", token);
      history.push("/Student/IndexStudent");
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      history.push("/");
    }
  };
  const handleSaveLoginTeacher = async () => {
    console.log(DataPost);
    try {
      const response = await axios.post(
        `https://localhost:7232/api/Teachers/login`, DataPost
      );
      const { token } = response.data;

      // Lưu access token vào localStorage
      localStorage.setItem("access_tokenTeacher", token);
      history.push("/Teacher/IndexTeacher");
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      history.push("/");
    }
  };
  const handleSaveLoginAdmin = async () => {
    console.log(DataPost);
    try {
      const response = await axios.post(
        `https://localhost:7232/api/Managements/login`, DataPost
      );
      const { token } = response.data;

      // Lưu access token vào localStorage
      localStorage.setItem("access_tokenAdmin", token);
      history.push("/Management/ManagementIndex");
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      history.push("/");
    }
  };
  return (
    <>
      <h1 style={{ margin: "0px 30%" }}>Login School</h1>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{ margin: "0px 30%" }}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />}
            autoComplete="off"
            onBlur={handleLoginEmail}
            placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            autoComplete="off"
            onBlur={handlePassWorld}
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            <button onClick={handleSaveLoginAdmin}>
              <i className="fa fa-shopping-cart"></i> Account Managemnet
            </button>
          </Button>
          <Button type="primary" htmlType="submit" className="login-form-button">
            <button onClick={handleSaveLoginStudent}>
              <i className="fa fa-shopping-cart"></i> Account Student
            </button>
          </Button>
          <Button type="primary" htmlType="submit" className="login-form-button">
            <button onClick={handleSaveLoginTeacher}>
              <i className="fa fa-shopping-cart"></i> Account Teacher
            </button>
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    </>

  );
};

export default App;