import React, { useEffect, useState, ReactNode } from 'react';
import { Form, Button, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import axios from 'axios';
import { format } from 'date-fns';
interface Item {
    subjectId: string; // Make sure you have a unique id for each item in the array
    subjectName: string;
    subjectCredit: number;
    subjectMandatory: boolean;
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}
interface ShowColumns {
    title: string;
    dataIndex: string;
    width: string;
    fixed: string;
    render?: RenderFunction | RenderWithCellFunction;
}

type RenderFunction = (value: any, record: Item, index: number) => ReactNode;
type RenderWithCellFunction = (value: any, record: Item, index: number) => ReactNode;

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const App: React.FC = () => {
    const [form] = Form.useForm();
    const [editingid, setEditingid] = useState('');
    const [dataSubject, setdataSubject] = useState<Item[]>([]);
    const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
    useEffect(() => {
        const accessToken = localStorage.getItem("access_tokenStudent");
        console.log(accessToken);
        const fetchData = async () => {
            try {
                const response = await axios.get("https://localhost:7232/api/Subjects/TakeSubjectForStudent?tokenStudent=" + accessToken);
                console.log(response.data);
                const SubjectsData = response.data.map((Subject: any, index: number) => ({
                    subjectId: Subject.subjectId,
                    subjectName: Subject.subjectName,
                    subjectCredit: Subject.subjectCredit,
                    subjectMandatory: Subject.subjectMandatory === true ? "true" : "false",
                }));
                setdataSubject(SubjectsData);
                console.log('Fetch data successful');
            } catch (error) {
                console.error(error);

            }
        };
        fetchData();
    }, [dataUpdate]);
    const handleDataChange = (newData: Item) => {
        setdataUpdate(prevData => ({
            ...prevData,
            Item: newData
        }));
    };
    const DeleteID = (record: Partial<Item> & { subjectId: string }) => {
        axios
            .delete(
                "https://localhost:7232/api/Subjects/" + record.subjectId
            )
            .then((response) => {
                alert("Đã xóa môn học này -" + record.subjectName);
                const newDataStudent = dataSubject.filter(item => item.subjectId !== record.subjectId);
                setdataSubject(newDataStudent);
            })
            .catch((err) => console.log(err));
    };

    const isEditing = (record: Item) => record.subjectId === editingid;

    const edit = (record: Partial<Item> & { subjectId: string }) => {
        form.setFieldsValue({ subjectName: '', subjectCredit: 0, subjectMandatory: 'hiban', ...record });
        setEditingid(record.subjectId);
    };

    const cancel = () => {
        setEditingid('');
    };

    const save = async (id: string) => {
        try {
            const row = (await form.validateFields());
            row.subjectId = id;
            console.log(row.subjectMandatory);
            let result = (row.subjectMandatory === "true" ? true : false);
            row.subjectMandatory = result;
            const newData = [...dataSubject];
            const index = newData.findIndex((item) => id === item.subjectId);
            // id 
            if (index > -1) {
                newData.splice(index, 1, row);
                setdataSubject(newData);
                setEditingid('');
                axios
                    .put(
                        "https://localhost:7232/api/Subjects/" +
                        id,
                        newData[index]
                    )
                    .then((response) => console.log(response))
                    .catch((err) => console.log(err));
            } else {
                newData.push(row);
                setdataSubject(newData);
                setEditingid('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
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
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.subjectId)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                        <Typography.Link disabled={editingid !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Typography.Link disabled={editingid !== ''} style={{ marginLeft: "20px" }} onClick={() => DeleteID(record)}>
                            Delete
                        </Typography.Link>
                    </>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: col.dataIndex === 'id' ? 'subjectName' : 'subjectMandatory',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={dataSubject}
                    columns={mergedColumns}

                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                    }}
                />
            </Form>
        </>
    );
};

export default App;