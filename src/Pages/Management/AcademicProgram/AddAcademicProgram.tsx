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
    const history = useHistory();
    const [form] = Form.useForm();
    interface AcademicProgram {
        academicProgramId: string;
        academicProgramName: string;
    }
    interface Subject {
        subjectId: string;
        subjectName: string;
    }
    interface Semester {
        semesterId: string;
        semesterName: string;
    }
    interface Faculty {
        facultyId: string;
        facultyName: string;
    }
    interface Item {
        academicProgramName: string,
        academicProgramTimeEnd: string,
        semesterId: string,
        facultyId: string,
        subjectId: string
    }

    const [dataSubject, setSubject] = useState<Subject[]>([]);
    const [dataFaculty, setFaculty] = useState<Faculty[]>([]);
    const [dataSemester, setSemester] = useState<Semester[]>([]);

    const [DataPost, setDataPost] = useState<Item>({
        academicProgramName: "",
        academicProgramTimeEnd: "",
        semesterId: "",
        facultyId: "",
        subjectId: ""
    });
    const accessToken = localStorage.getItem("access_tokenAdmin");
    useEffect(() => {
        axios
            .get("https://localhost:7232/api/Semesters/GetSemesters?pages=1&size=0", {
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
            .get("https://localhost:7232/api/Faculties?pages=1&size=0", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then((response) => {
                setFaculty(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
        axios
            .get("https://localhost:7232/api/Subjects", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then((response) => {
                setSubject(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // update Name
    const handleAcademicNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAcademicName = event.target.value;
        setDataPost((prevData) => ({
            ...prevData,
            academicProgramName: newAcademicName,
        }));
    };
    const handleAcademicEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSemesterDayEnd = event.target.value;
        setDataPost((prevData) => ({
            ...prevData,
            academicProgramTimeEnd: newSemesterDayEnd,
        }));
    };
    const handleSelectChangeSemesterId = (newSemesterId: string) => {
        setDataPost((prevData) => ({
            ...prevData,
            semesterId: newSemesterId,
        }));
    };
    const handleSelectChangeFaculty = (newFacultyid: string) => {
        setDataPost((prevData) => ({
            ...prevData,
            facultyId: newFacultyid,
        }));
    };
    const handleSelectChangeSubject = (newSubjectid: string) => {
        setDataPost((prevData) => ({
            ...prevData,
            subjectId: newSubjectid,
        }));
    };


    const handleSaveClick = async () => {
        console.log(DataPost);
        axios
            .post("https://localhost:7232/api/AcademicPrograms", DataPost, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then((response) => {
                alert("Tạo lớp học thành công")
                history.push("/Management/ListAcademicProgram");
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
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 12 }}
                        layout="horizontal"
                        style={{ maxWidth: 800 }}
                    >
                        <Form.Item name="NameStudent" label="Name Academic Program">
                            <Input onBlur={handleAcademicNameChange} placeholder={"Name Academic Program"} />
                        </Form.Item>
                        <Form.Item name="datend" label="Ngày kết thúc">
                            <DatePicker onBlur={handleAcademicEndChange} defaultValue={dayjs("2000-01-01", "YYYY-MM-DD")} />
                        </Form.Item>
                        <Form.Item name="Semester" label="Semester">
                            <Select onChange={handleSelectChangeSemesterId}>
                                {dataSemester.map((p, index) => (
                                    <Select.Option key={p.semesterId} value={p.semesterId}>
                                        {p.semesterName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="faculty" label="Faculty">
                            <Select onChange={handleSelectChangeFaculty}>
                                {dataFaculty.map((p, index) => (
                                    <Select.Option key={p.facultyId} value={p.facultyId}>
                                        {p.facultyName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="Subject" label="Subject">
                            <Select onChange={handleSelectChangeSubject}>
                                {dataSubject.map((p, index) => (
                                    <Select.Option key={p.subjectId} value={p.subjectId}>
                                        {p.subjectName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Button type="primary" block onClick={handleSaveClick}>
                            Add Academic Program
                        </Button>
                    </Form>
                </Content>
            </Layout>
        </>
    );
};

export default () => <FormDisabledDemo />;