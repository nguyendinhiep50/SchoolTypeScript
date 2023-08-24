import React, { useState, useEffect } from 'react';
import { LockOutlined, UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { Link, useHistory } from 'react-router-dom'; import axios from "axios";
import jwt_decode from "jwt-decode";
interface DecodedToken {
    [claimName: string]: string[]; // Hoặc các kiểu dữ liệu khác tùy thuộc vào claim
}
const App: React.FC = () => {
    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };
    const [DataPost, setDataPost] = useState({
        nameLogin: "",
        passWord: "",
    });
    const [DataClaim, setDataClaim] = useState("");
    const [DataToken, setDataToken] = useState("");

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
                nameLogin: newPassWorld,
            }));
        }
    };
    const handlePassWorld = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
        // Sử dụng React.ChangeEvent<HTMLInputElement> để chỉ định kiểu dữ liệu cho event
        if (event) {
            const newPassWorld = event.target.value;
            setDataPost((prevData) => ({
                ...prevData,
                passWord: newPassWorld,
            }));
        }
    };
    useEffect(() => {
        if (DataClaim == "Management") {
            localStorage.setItem("access_tokenAdmin", DataToken);
            history.push("/Management/ManagementIndex");
        }
        else if (DataClaim == "Teacher") {
            localStorage.setItem("access_tokenTeacher", DataToken);
            history.push("/Teacher/IndexTeacher");
        }
        else if (DataClaim == "Student") {
            localStorage.setItem("access_tokenStudent", DataToken);
            history.push("/Student/IndexStudent");
        }
        else {
            console.log(DataClaim);
        }
    }, [DataClaim]);
    useEffect(() => {
        if (DataToken != "") {
            const decodedToken: DecodedToken = jwt_decode(DataToken);
            let DataClaimMain: string = "";
            const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            if (roleClaim.toString() === "Student") {
                DataClaimMain = roleClaim.toString();
            }
            else {
                for (const rs in roleClaim) {
                    if (roleClaim[rs] === "Management") {
                        const chuoi = roleClaim[rs];
                        DataClaimMain = chuoi;
                    } else if (roleClaim[rs] === "Teacher" && DataClaimMain !== "Management") {
                        const chuoi = roleClaim[rs];
                        DataClaimMain = chuoi;
                    }
                }
            }
            setDataClaim(DataClaimMain);
            // Sau khi hoàn thành tất cả các hoạt động trong LoopRole, gọi CheckClaim 
        }
    }, [DataToken]);
    const handleSaveLoginAdmin = async () => {
        console.log(DataPost);
        try {
            const response = await axios.post(
                `https://localhost:7232/api/Login/LoginAccount`, DataPost
            );
            const token = response.data;
            setDataToken(token);
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
            history.push("/");
        }
    };
    return (
        <>
            <h1 style={{ margin: "0px 30%", textAlign: "center" }}>Register Account</h1>
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
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<MailOutlined className="site-form-item-icon" />}
                        autoComplete="off"
                        onBlur={handleLoginEmail}
                        placeholder="Mail " />
                </Form.Item>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<PhoneOutlined className="site-form-item-icon" />}
                        autoComplete="off"
                        onBlur={handleLoginEmail}
                        placeholder="Phone" />
                </Form.Item>
                <Form.Item>
                    <Button style={{ marginRight: "6px" }} type="primary" onClick={handleSaveLoginAdmin}>Create Account</Button>
                </Form.Item>
            </Form>
        </>

    );
};

export default App;