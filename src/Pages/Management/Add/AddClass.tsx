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

import axios from "axios";
const FormDisabledDemo: React.FC = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  interface AcademicProgram {
    academicProgramId: string;
    academicProgramName: string;
    // Add other properties if applicable
  }
  interface Teacher {
    teacherId: string;
    teacherName: string;
    // Add other properties if applicable
  }
  interface Item {
    classLearnName: string;
    classLearnEnrollment: number;
    academicProgramId: string;
    teacherId: string;
  }

  const [dataAcademicProgram, setSemester] = useState<AcademicProgram[]>([]);
  const [dataTeacher, setTeacher] = useState<Teacher[]>([]);
  const [DataPost, setDataPost] = useState<Item>({
    classLearnName: '',
    classLearnEnrollment: 0,
    academicProgramId: '',
    teacherId: '',
  });
  const accessToken = localStorage.getItem("access_tokenAdmin");
  useEffect(() => {
    axios
      .get("https://localhost:7232/api/AcademicPrograms", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        setSemester(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get("https://localhost:7232/api/Teachers", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        setTeacher(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // update Name
  const handleClassLearnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newclassLearnName = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      classLearnName: newclassLearnName,
    }));
  };
  const handleClassLearnEnrollmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newclassLearnName = parseInt(event.target.value);
    setDataPost((prevData) => ({
      ...prevData,
      classLearnEnrollment: newclassLearnName,
    }));
  };
  const handleSelectChangeTeacher = (newteacherid: string) => {
    setDataPost((prevData) => ({
      ...prevData,
      teacherId: newteacherid,
    }));
  };
  const handleSelectChangeAcademicProgram = (newAcademicProgramid: string) => {
    setDataPost((prevData) => ({
      ...prevData,
      academicProgramId: newAcademicProgramid,
    }));
  };
  const handleSaveClick = async () => {
    console.log(DataPost);
    axios
      .post("https://localhost:7232/api/ClassLearns", DataPost, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        alert("Tạo lớp học thành công")
        history.push("/Management/ClassList");
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
              <Input onBlur={handleClassLearnNameChange} placeholder={"Họ và tên học sinh"} />
            </Form.Item>
            <Form.Item name="classLearnEnrollment" label="Sĩ số">
              <Input onBlur={handleClassLearnEnrollmentChange} placeholder={"Sĩ số học sinh"} />
            </Form.Item>
            <Form.Item name="Semester" label="Học kì">
              <Select onChange={handleSelectChangeAcademicProgram}>
                {dataAcademicProgram.map((p, index) => (
                  <Select.Option key={p.academicProgramId} value={p.academicProgramId}>
                    {p.academicProgramName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="teacher" label="Cô giáo">
              <Select onChange={handleSelectChangeTeacher}>
                {dataTeacher.map((p, index) => (
                  <Select.Option key={p.teacherId} value={p.teacherId}>
                    {p.teacherName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Button type="primary" block onClick={handleSaveClick}>
              Add Class
            </Button>
          </Form>
        </Content>
      </Layout>
    </>
  );
};

export default () => <FormDisabledDemo />;