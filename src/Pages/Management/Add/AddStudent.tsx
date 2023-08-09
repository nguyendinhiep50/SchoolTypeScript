import React, { useState ,useEffect } from 'react'; 
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Layout,theme

} from 'antd';
import dayjs from 'dayjs'; 
import axios from "axios";
const FormDisabledDemo: React.FC = () => {
  const [form] = Form.useForm();
  interface Faculty {
    facultyId: string;
    facultyName: string;
    // Add other properties if applicable
  }

  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  const [dataKH, setDataKH] = useState<Faculty[]>([]); 
  const [DataPost,setDataPost] = useState({ 
    studentName:"",
    studentEmail:"",
    studentBirthDate: "",
    facultyId:"",
  });
  useEffect(() => {
    axios
      .get("https://localhost:7232/api/Faculties")
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

const handleSelectChange = (newFacultyId: string) => { 
  setDataPost((prevData) => ({
    ...prevData,
    facultyId: newFacultyId,
  }));
};

  const handleSaveClick = async () => {
    console.log(DataPost);
    axios
      .post("https://localhost:7232/api/Students", DataPost)
      .then((response) => alert("Thêm thành công"))
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
              <Input onBlur={handleStudentNameChange} placeholder={"Họ và tên học sinh"}/>
            </Form.Item>
            <Form.Item name="EmailStudent" label="Email">
              <Input onBlur={handleStudentEmailChange}  placeholder={"Email học sinh"} />
            </Form.Item>
            <Form.Item name="BirthDateStudent" label="Ngày sinh">
              <DatePicker onBlur={handleStudentBirthDateChange}  defaultValue={dayjs("2000-01-01", "YYYY-MM-DD")} />
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