import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { BrowserRouter as Link, useHistory } from 'react-router-dom';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Upload,
  Layout, theme
} from 'antd';
import axios from "axios";
import dayjs from 'dayjs';



const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const FormDisabledDemo: React.FC = () => {
  const accessToken = localStorage.getItem("access_tokenAdmin");
  const history = useHistory();
  const [DataPost, setDataPost] = useState({
    teacherName: "",
    teacherImage: "",
    teacherEmail: "",
    teacherBirthDate: "",
    teacherPhone: "",
    teacherAdress: "",
  });
  // update Name
  const handleTeacherNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTeacherName = event.target.value;
    console.log(newTeacherName)
    setDataPost((prevData) => ({
      ...prevData,
      teacherName: newTeacherName,
    }));
  };

  const handleTeacherEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTeacherEmail = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      teacherEmail: newTeacherEmail,
    }));
  };
  const handleTeacherBirthDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTeacherBirthDate = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      teacherBirthDate: newTeacherBirthDate,
    }));
  };
  const handleTeacherImageChange = (info: any) => {
    console.log(info.file.name);
    const { fileList } = info;
    setFileList(fileList);
    setDataPost((prevData) => ({
      ...prevData,
      teacherImage: info.file.name,
    }));
  };
  const handleTeacherAdressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTeacherAdress = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      teacherAdress: newTeacherAdress.toString(),
    }));
  };

  const handleTeacherPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTeacherPhone = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      teacherPhone: newTeacherPhone.toString(),
    }));
  };
  const [fileList, setFileList] = useState([]);
  const handleRemove = () => {
    setFileList([]);
  };
  const handleSaveClick = async () => {
    console.log(DataPost);
    axios
      .post("https://localhost:7232/api/Teachers", DataPost, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        alert("thêm giáo viên thành công")
        history.push("/Management/TeacherList");
      })
      .catch((err) => console.log(err));
  };
  const { Content } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
      <Layout>
        <Content
          style={{
            padding: "0 24px",
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{ maxWidth: 600 }}
          >
            <Form.Item label="Name Account">
              <Input onBlur={handleTeacherNameChange} placeholder={"Name Account"} />
            </Form.Item>
            <Form.Item label="Email">
              <Input onBlur={handleTeacherEmailChange} placeholder={"Email giáo viên"} />
            </Form.Item>
            <Form.Item label="Số điện thoại">
              <Input onBlur={handleTeacherPhoneChange} placeholder={"Số điện thoại giáo viên"} />
            </Form.Item>
            <Form.Item label="Địa chỉ">
              <Input onBlur={handleTeacherAdressChange} placeholder={"Họ và tên học sinh"} />
            </Form.Item>
            <Form.Item label="Ngày sinh">
              <DatePicker onBlur={handleTeacherBirthDateChange} defaultValue={dayjs("2000-01-01", "YYYY-MM-DD")} />
            </Form.Item>
            <Form.Item
              label="Thay đổi ảnh"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              name="avatar" // Give the form item a name
            >
              <Upload
                action="/upload.do"
                listType="picture-card"
                fileList={fileList} // Provide the fileList
                onChange={handleTeacherImageChange}
                onRemove={handleRemove} // Add remove handler
              >
                {fileList.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Button type="primary" block onClick={handleSaveClick}>
              Add Teacher
            </Button>
          </Form>
        </Content>
      </Layout>


    </>
  );
};

export default () => <FormDisabledDemo />;

