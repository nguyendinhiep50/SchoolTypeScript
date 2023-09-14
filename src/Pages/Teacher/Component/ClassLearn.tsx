import React, { useEffect, useState, ReactNode } from 'react';
import { Form, Button, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';

import axios from 'axios';
interface Item {
    classLearnsId: string; // Make sure you have a unique id for each item in the array
    classLearnName: string;
    classLearnEnrollment: number;
    academicProgramId: string;
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
const App: React.FC = ({ history }: any) => {
    const [form] = Form.useForm();
    const [editingid, setEditingid] = useState('');
    const [dataClassLearn, setdataClassLearn] = useState<Item[]>([]);
    const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
    const [data, setData] = useState<any>(null);
    useEffect(() => {
        const accessToken = localStorage.getItem("access_tokenTeacher");
        console.log(accessToken);
        const fetchData = async () => {
            try {
                const response = await axios.get("https://localhost:7232/api/Teachers/GetClassLearnForTeacher?token=" + accessToken);
                console.log(response.data);
                const ClassLearnsData = response.data.map((ClassLearn: any, index: number) => ({
                    classLearnsId: ClassLearn.classLearnsId,
                    classLearnName: ClassLearn.classLearnName,
                    classLearnEnrollment: ClassLearn.classLearnEnrollment,
                    academicProgramId: ClassLearn.academicProgramId
                }));
                setdataClassLearn(ClassLearnsData);
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
    const DeleteID = (record: Partial<Item> & { classLearnsId: string }) => {
        axios
            .delete(
                "https://localhost:7232/api/ClassLearns/" + record.classLearnsId
            )
            .then((response) => {
                alert("Đã xóa môn học này -" + record.classLearnsId);
                const newDataStudent = dataClassLearn.filter(item => item.classLearnsId !== record.classLearnsId);
                setdataClassLearn(newDataStudent);
            })
            .catch((err) => console.log(err));
    };

    const isEditing = (record: Item) => record.classLearnsId === editingid;

    const edit = (record: Partial<Item> & { classLearnsId: string }) => {
        form.setFieldsValue({ ClassLearnName: '', ClassLearnCredit: 0, ClassLearnMandatory: 'hiban', ...record });
        setEditingid(record.classLearnsId);
    };
    const DetailCLass = (record: Partial<Item> & { classLearnsId: string }) => {

        axios.get('https://localhost:7232/api/Teachers/ListStudentLearn?IdClass=' + record.classLearnsId)
            .then((response) => {
                // Lấy dữ liệu từ phản hồi
                const responseData = response.data;
                setData(responseData);
                console.log(responseData);
                // Chuyển hướng đến một thành phần khác và truyền dữ liệu
                history.push('./ListStudentClassLean', { data: responseData });
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API:', error);
            });
    };
    const SubjectGrades = (record: Partial<Item> & { classLearnsId: string }) => {

        axios.get('https://localhost:7232/api/SubjectGrades/GetSubjectGradesAllClassLearn?IdClassLearn=' + record.classLearnsId)
            .then((response) => {
                // Lấy dữ liệu từ phản hồi
                const responseData = response.data;
                setData(responseData);
                console.log(responseData);
                // Chuyển hướng đến một thành phần khác và truyền dữ liệu
                history.push('./ListSubjectGrades', { data: responseData });
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API:', error);
            });
    };
    const cancel = () => {
        setEditingid('');
    };

    const save = async (id: string) => {
        try {
            const row = (await form.validateFields());
            row.ClassLearnId = id;
            console.log(row.ClassLearnMandatory);
            let result = (row.ClassLearnMandatory === "true" ? true : false);
            row.ClassLearnMandatory = result;
            const newData = [...dataClassLearn];
            const index = newData.findIndex((item) => id === item.classLearnsId);
            // id 
            if (index > -1) {
                newData.splice(index, 1, row);
                setdataClassLearn(newData);
                setEditingid('');
                axios
                    .put(
                        "https://localhost:7232/api/ClassLearns/" +
                        id,
                        newData[index]
                    )
                    .then((response) => console.log(response))
                    .catch((err) => console.log(err));
            } else {
                newData.push(row);
                setdataClassLearn(newData);
                setEditingid('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Tên lớp',
            dataIndex: 'classLearnName',
            width: '15',
            editable: true,
        },
        {
            title: 'sĩ số',
            dataIndex: 'classLearnEnrollment',
            width: '15%',
            editable: true,
        },
        {
            title: 'Khóa',
            dataIndex: 'academicProgramId',
            width: '20%',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            width: '20%',
            render: (_: any, record: Item) => {
                return (
                    <>
                        <Typography.Link disabled={editingid !== ''} style={{ marginLeft: "20px" }} onClick={() => SubjectGrades(record)}>
                            Student Grades
                        </Typography.Link>
                        <Typography.Link disabled={editingid !== ''} style={{ marginLeft: "20px" }} onClick={() => DetailCLass(record)}>
                            Detail
                        </Typography.Link>
                    </>
                )
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
                inputType: col.dataIndex === 'id' ? 'ClassLearnName' : 'ClassLearnMandatory',
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
                    dataSource={dataClassLearn}
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