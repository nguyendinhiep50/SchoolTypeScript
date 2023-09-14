import React, { useEffect, useState, ReactNode } from 'react';
import { Form, Table, Typography, Select, message, Space } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Register, SubjectRegister, SubjectNoRegister, SubjectRegisterAll, } from '../../../services/APISubject';
import { Item, EditableCell } from '../../../InterFace/ISubject'
import { AxiosResponse } from 'axios';
const App: React.FC = () => {
    const [form] = Form.useForm();
    const [dataSubject, setdataSubject] = useState<Item[]>([]);
    const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
    const [Selector, setSelector] = useState("");
    const UpdateDatebase = (ValueRespone: void | AxiosResponse<any, any>) => {
        if (typeof ValueRespone === 'undefined') {
            console.log('Subject is of type void');
        } else {
            const SubjectsData = ValueRespone.data.map((Subject: any) => ({
                subjectId: Subject.subjectId,
                subjectName: Subject.subjectName,
                subjectCredit: Subject.subjectCredit,
                subjectMandatory: Subject.subjectMandatory === true ? "true" : "false",
            }));
            setdataSubject(SubjectsData);
        }
    };
    useEffect(() => {
        const accessToken = localStorage.getItem("access_tokenStudent");
        console.log(accessToken);
        const fetchData = async () => {
            try {
                if (Selector === "" || Selector === "ALL") {
                    const response = await SubjectRegisterAll();
                    UpdateDatebase(response);
                }
                else if (Selector === "Register") {
                    const response = await SubjectRegister();
                    UpdateDatebase(response);
                }
                else if (Selector === "NoRegister") {
                    const response = await SubjectNoRegister();
                    UpdateDatebase(response);
                }
                console.log('Fetch data successful');
            } catch (error) {
                console.error(error);

            }
        };
        fetchData();
    }, [dataUpdate, Selector]);

    const RegisterSubject = async (id: string) => {
        const response = await Register(id);
        if (typeof response === 'undefined') {
            message.error(' Erro Resgister');
        } else {
            setdataUpdate({ Item: {} as Item });
            message.success('Sucess Resgister');
        }

    };
    const columns = [
        {
            title: 'Tên môn',
            dataIndex: 'subjectName',
            width: '20%',
            editable: true,
        },
        {
            title: 'chứng chỉ',
            dataIndex: 'subjectCredit',
            width: '20%',
            editable: true,
        },
        {
            title: 'bắt buộc',
            dataIndex: 'subjectMandatory',
            width: '20%',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            width: '15%',
            render: (_: any, record: Item) => {
                if (Selector === "" || Selector === "ALL") {
                    return (
                        null
                    );
                }
                else if (Selector === "Register") {
                    return (
                        <Typography.Link onClick={() => RegisterSubject(record.subjectId)} style={{ marginRight: 8 }}>
                            Cancel Register
                        </Typography.Link>
                    );
                }
                else if (Selector === "NoRegister") {
                    return (
                        <Typography.Link onClick={() => RegisterSubject(record.subjectId)} style={{ marginRight: 8 }}>
                            Register
                        </Typography.Link>
                    );
                }

            },
        },
    ];
    const ChangeSelect = (valueChange: string) => {
        setSelector(valueChange);
    };
    return (
        <>
            <Select
                onChange={ChangeSelect}
                defaultValue="ALL"
                style={{ width: 160 }}

                options={[
                    { value: 'ALL', label: 'SubjectALL' },
                    { value: 'Register', label: 'SubjectRegister' },
                    { value: 'NoRegister', label: 'SubjectNoRegister' },
                ]}
            />
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={dataSubject}
                    columns={columns}

                    rowClassName="editable-row"
                />
            </Form>
        </>
    );
};

export default App;