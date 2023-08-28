import React, { useState, useEffect } from 'react';
import {
    Button,
    Form,
    Input,
    Layout, theme

} from 'antd';
import axios from "axios";
const FormDisabledDemo: React.FC = () => {
    const [form] = Form.useForm();
    const [DataPost, setDataPost] = useState({
        nameAccountUser: "",
        emailAccountUser: "",
        roleAccountRole: "",
    });

    // update Name
    const handleAddNameAccount = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newStudentName = event.target.value;
        setDataPost((prevData) => ({
            ...prevData,
            nameAccountUser: newStudentName,
        }));
    };
    const handleAddEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newStudentEmail = event.target.value;
        setDataPost((prevData) => ({
            ...prevData,
            emailAccountUser: newStudentEmail,
        }));
    };
    const handleAddRole = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newStudentEmail = event.target.value;
        setDataPost((prevData) => ({
            ...prevData,
            roleAccountRole: newStudentEmail,
        }));
    };
    const handleSaveClick = async () => {
        console.log(DataPost);
        const accessToken = localStorage.getItem("access_tokenAdmin");
        axios
            .post("https://localhost:7232/api/Login/AddRoleUser", DataPost
                , {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
            .then((response) => {
                alert("Thêm thành công");
            })
            .catch((err) => console.log(err));
    };
    const { Content } = Layout;
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <>
            <Layout >
                <Content
                    style={{
                        padding: "0 24px",
                        margin: 0,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    <Form
                        form={form}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        style={{ maxWidth: 600 }}
                    >
                        <Form.Item name="NameAccount" label="Name Account">
                            <Input onBlur={handleAddNameAccount} placeholder={"Name Account"} />
                        </Form.Item>
                        <Form.Item name="EmailAccount" label="Email Account">
                            <Input onBlur={handleAddEmail} placeholder={"Email Account"} />
                        </Form.Item>
                        <Form.Item name="RoleAccount" label="Role Account">
                            <Input onBlur={handleAddRole} placeholder={"Role Account"} />
                        </Form.Item>
                        <Button type="primary" block onClick={handleSaveClick}>
                            Add Role
                        </Button>
                    </Form>
                </Content>
            </Layout>
        </>
    );
};

export default () => <FormDisabledDemo />;