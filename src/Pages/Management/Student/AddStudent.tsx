import React, { useState, useEffect } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Layout, theme

} from 'antd';
import { BrowserRouter as Link, useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from "axios";
const FormDisabledDemo: React.FC = () => {
  const accessToken = localStorage.getItem("access_tokenAdmin");
  const history = useHistory();
  const [form] = Form.useForm();
  interface Faculty {
    facultyId: string;
    facultyName: string;
    // Add other properties if applicable
  }

  const [dataKH, setDataKH] = useState<Faculty[]>([]);
  const [DataPost, setDataPost] = useState({
    studentName: "",
    studentEmail: "",
    studentNameLogin: "",
    studentPhoneNumber: "",
    studentBirthDate: "",
    facultyId: "",
  });
  useEffect(() => {
    axios
      .get("https://localhost:7232/api/Faculties", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        setDataKH(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // update Name
  const handleStudentNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStudentName = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      studentName: newStudentName,
    }));
  };
  const handleStudentEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStudentEmail = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      studentEmail: newStudentEmail,
    }));
  };
  const handleStudentBirthDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStudentBirthDate = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      studentBirthDate: newStudentBirthDate,
    }));
  };
  const handleStudentNameLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStudentNameLogin = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      studentNameLogin: newStudentNameLogin,
    }));
  }; const handleStudentPhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStudentPhoneNumbe = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      studentPhoneNumber: newStudentPhoneNumbe,
    }));
  };
  const handleSelectChange = (newFacultyId: string) => {
    setDataPost((prevData) => ({
      ...prevData,
      facultyId: newFacultyId,
    }));
  };

  const handleSaveClick = async () => {
    console.log(DataPost);
    const accessToken = localStorage.getItem("access_tokenAdmin");
    axios
      .post("https://localhost:7232/api/Students", DataPost
        , {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      .then((response) => {
        alert("Thêm thành công")
        history.push("/Management/StudentList");
      })
      .catch((err) => console.log(err));
  };
  const ChangePageManyPostStudent = async () => {
    history.push("/Management/AddExcel");
  };
  const { Content } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
      <Button type="primary" block style={{ margin: " 0px 0px 20px 0" }} onClick={ChangePageManyPostStudent}>
        Add Many Student Excel
      </Button>
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
            <Form.Item name="NameStudent" label="Họ và tên">
              <Input onBlur={handleStudentNameChange} placeholder={"Họ và tên học sinh"} />
            </Form.Item>
            <Form.Item name="EmailStudent" label="Email">
              <Input onBlur={handleStudentEmailChange} placeholder={"Email học sinh"} />
            </Form.Item>
            <Form.Item name="NameStudent" label="Ten Dang Nhap">
              <Input onBlur={handleStudentNameLogin} placeholder={"Họ và tên học sinh"} />
            </Form.Item>
            <Form.Item name="EmailStudent" label="Số điện thoại">
              <Input onBlur={handleStudentPhoneNumber} placeholder={"Email học sinh"} />
            </Form.Item>
            <Form.Item name="BirthDateStudent" label="Ngày sinh">
              <DatePicker onBlur={handleStudentBirthDateChange} defaultValue={dayjs("2000-01-01", "YYYY-MM-DD")} />
            </Form.Item>
            <Form.Item name="faculty" label="Khoa">
              <Select onChange={handleSelectChange}>
                {dataKH.map((p, index) => (
                  <Select.Option key={p.facultyId} value={p.facultyId}>
                    {p.facultyName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Button type="primary" block onClick={handleSaveClick}>
              Add Student
            </Button>
          </Form>
        </Content>
      </Layout>
    </>
  );
};

export default () => <FormDisabledDemo />;