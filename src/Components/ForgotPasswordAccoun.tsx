import React, { useState } from 'react';
import axios from "axios";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
const App: React.FC = () => {
    const accessToken = localStorage.getItem("access_tokenAdmin");
    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };
    const [DataPost, setDataPost] = useState({
        loginName: "",
        passWord: "",
        passWordNew: ""
    });

    const handleUpdatePassword = async () => {
        console.log(DataPost);
        axios
            .post(
                "https://localhost:7232/api/Login/ResetPassword",
                DataPost, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
            )
            .then((response) => { alert("ChangePassword Succes") })
            .catch((err) => {
                alert(err);
            });
    };
    const handleLoginName = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
        if (event) {
            const LoginName = event.target.value;
            setDataPost((prevData) => ({
                ...prevData,
                loginName: LoginName,
            }));
        }
    };
    const handlePassWord = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
        if (event) {
            const LoginPassWord = event.target.value;
            setDataPost((prevData) => ({
                ...prevData,
                passWord: LoginPassWord,
            }));
        }
    };
    const handleNewPassWord = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
        if (event) {
            const NewPassWord = event.target.value;
            setDataPost((prevData) => ({
                ...prevData,
                passWordNew: NewPassWord,
            }));
        }
    };
    return (
        <>
            <h1 style={{ margin: "0px 30%", textAlign: "center" }}>Forgot Password</h1>
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
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} onBlur={handleLoginName} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Email"
                        onBlur={handlePassWord}
                    />
                </Form.Item>
                <Form.Item
                    name="newpassword"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="New password"
                        onBlur={handleNewPassWord}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleUpdatePassword}  >
                        Change Password
                    </Button>

                </Form.Item>
            </Form>
        </>

    );
};

export default App;