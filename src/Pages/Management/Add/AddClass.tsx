import React, { useState ,useEffect } from 'react'; 
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Layout,theme
} from 'antd';
import moment from 'moment';
import axios from "axios";
const FormDisabledDemo: React.FC = () => {
  const [form] = Form.useForm();
  interface AcademicProgram {
    id: string;
    academicProgramName: string; 
    // Add other properties if applicable
  }
  interface Teacher {
    id: string;
    teacherName: string; 
    // Add other properties if applicable
  }
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  const [dataAcademicProgram, setSemester] = useState<AcademicProgram[]>([]);
  const [dataTeacher, setTeacher] = useState<Teacher[]>([]);   
  const [DataPost,setDataPost] = useState({ 
    classLearnName:"",
    classLearnEnrollment:"",
    academicProgramId: "",
    teacherId:"",
  });
  useEffect(() => {
    axios
      .get("https://localhost:7232/api/AcademicPrograms")
      .then((response) => {
        setSemester(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get("https://localhost:7232/api/Teachers")
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
  const handleTeacherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAddClass = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      teacherId: newAddClass,
    }));
  };
  const handleAcademicProgramChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAddClass = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      academicProgramId: newAddClass,
    }));
  };
  const handleSaveClick = async () => {
    console.log(DataPost);
    axios
      .post("https://localhost:7232/api/Students", DataPost)
      .then((response) => alert("Tạo lớp học thành công"))
      .catch((err) => console.log(err));
  };
  const { Content } = Layout;
  const {
      token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
      <Layout style={{ padding: "0 24px 24px" }}>
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
              <Input onBlur={handleClassLearnNameChange} placeholder={"Họ và tên học sinh"}/>
            </Form.Item>
            <Form.Item name="classLearnEnrollment" label="Sĩ số">
              <Input onBlur={handleClassLearnNameChange} placeholder={"Sĩ số học sinh"}/>
            </Form.Item>
          <Form.Item name="Semester" label="Học kì">
              <Select onChange={handleAcademicProgramChange}>
                {dataAcademicProgram.map((p, index) => (
                  <Select.Option key={index} value={p.id}>
                    {p.academicProgramName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="teacher" label="Cô giáo">
              <Select onChange={handleTeacherChange}>
                {dataTeacher.map((p, index) => (
                  <Select.Option key={index} value={p.id}>
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