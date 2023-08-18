import React, { useEffect, useState, ReactNode } from 'react';
import { Form, Input, InputNumber, Table, Typography, Popconfirm, Select, Button } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import Item from 'antd/es/list/Item';
interface Item {
  classLearnsId: string; // Make sure you have a unique id for each item in the array
  classLearnName: string;
  classLearnEnrollment: number;
  academicProgramId: string;
  teacherId: string;
}
interface Teacher {
  teacherId: string;
  teacherName: string;
}
interface AcademicProgram {
  academicProgramId: string;
  academicProgramName: string;
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
  editable: boolean;
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
  const accessToken = localStorage.getItem("access_tokenAdmin");
  const [form] = Form.useForm();
  const [editingid, setEditingid] = useState('');

  const [dataTeacherId, setdataTeacherId] = useState('');
  const [dataAcademicProgramId, setdataAcademicProgramId] = useState('');

  const [DataTeacher, setDataTeacher] = useState<Teacher[]>([]);
  const [AcademicProgram, setAcademicProgram] = useState<AcademicProgram[]>([]);
  const [DataListClass, setDataListClass] = useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7232/api/ClassLearns", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log(response.data);
        const studentsData = response.data.map((ClassLearns: any, index: number) => ({
          classLearnsId: ClassLearns.classLearnsId,
          classLearnName: ClassLearns.classLearnName,
          classLearnEnrollment: ClassLearns.classLearnEnrollment,
          academicProgramId: ClassLearns.academicProgramId,
          teacherId: ClassLearns.teacherId,
        }));
        setDataListClass(studentsData);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [dataUpdate]);
  useEffect(() => {
    axios
      .get("https://localhost:7232/api/Teachers", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        setDataTeacher(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get("https://localhost:7232/api/AcademicPrograms", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        setAcademicProgram(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const isEditing = (record: Item) => record.classLearnsId === editingid;

  const edit = (record: Partial<Item> & { classLearnsId: string }) => {
    form.setFieldsValue({ classLearnName: '', classLearnEnrollment: '' });
    setEditingid(record.classLearnsId);
  };
  const handleDataChange = (newData: any) => {
    setdataUpdate(prevData => ({
      ...prevData,
      Item: newData
    }));
  };
  const DeleteID = (record: Partial<Item> & { classLearnsId: string }) => {
    axios
      .delete(
        "https://localhost:7232/api/ClassLearns/" + record.classLearnsId, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
      )
      .then((response) => {
        alert("Đã xóa lớp học này");
        const newDataListClass = DataListClass.filter(item => item.classLearnsId !== record.classLearnsId);
        handleDataChange(newDataListClass);
      })
      .catch((err) => console.log(err));
  };


  const cancel = () => {
    setEditingid('');
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Item;
      row.classLearnsId = id;
      row.academicProgramId = dataAcademicProgramId;
      row.teacherId = dataTeacherId;
      const newData = [...DataListClass];
      const index = newData.findIndex((item) => id === item.classLearnsId);
      // id
      if (index > -1) {
        newData.splice(index, 1, row);
        setDataListClass(newData);
        setEditingid('');
        // xử lý cập nhật dữ liệu
        axios
          .put(
            "https://localhost:7232/api/ClassLearns/" +
            id,
            newData[index], {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
          )
          .then((response) => { alert("cạp nhat thanh cong") })
          .catch((err) => {
            console.log(err)
          });
      } else {
        newData.push(row);
        setDataListClass(newData);
        setEditingid('');
      }
    } catch (errInfo) {
      setEditingid('');
      console.log('Validate Failed:', errInfo);
    }
  };
  const handleSelectChangeTeacher = (newteacherid: string) => {
    setdataTeacherId(newteacherid);
  };
  const handleSelectChangeAcademicProgram = (newAcademicProgramid: string) => {
    setdataAcademicProgramId(newAcademicProgramid);
  };
  const dataColumns: ShowColumns[] = [
    {
      title: 'Tên Lớp',
      dataIndex: 'classLearnName',
      width: '16%',
      editable: true,
    },
    {
      title: 'Sĩ Số',
      dataIndex: 'classLearnEnrollment',
      width: '10%',
      editable: true,

    },
    {
      title: 'Học kì - Khoa',
      dataIndex: 'studentBirthDate',
      width: '8%',
      editable: false,
      render: (_: any, record: Item) => {
        const editableShow = isEditing(record);
        return editableShow ? (
          <Select onChange={handleSelectChangeAcademicProgram} style={{ minWidth: "100px" }}>
            {AcademicProgram.map((p, index) => (
              <Select.Option key={p.academicProgramId} value={p.academicProgramId}>
                {p.academicProgramName}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <>
            <span>{AcademicProgram.find(x => x.academicProgramId == record.academicProgramId)?.academicProgramName}</span>
          </>
        );
      },
    },
    {
      title: 'Giáo Viên',
      dataIndex: 'facultyName',
      width: '8%',
      editable: false,
      render: (_: any, record: Item) => {
        const editableShow = isEditing(record);
        return editableShow ? (
          <Select onChange={handleSelectChangeTeacher} style={{ minWidth: "100px" }}>
            {DataTeacher.map((p, index) => (
              <Select.Option key={p.teacherId} value={p.teacherId}>
                {p.teacherName}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <>
            <span>{DataTeacher.find(x => x.teacherId == record.teacherId)?.teacherName}</span>
          </>
        );
      },
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      width: '8%',
      editable: false,
      render: (_: any, record: Item) => {
        const editableShow = isEditing(record);
        return editableShow ? (
          <span>
            <Typography.Link onClick={() => save(record.classLearnsId)} style={{ marginRight: 8 }}>
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
            <Typography.Link disabled={editingid !== ''} style={{ marginLeft: '20px' }} onClick={() => DeleteID(record)}>
              Delete
            </Typography.Link>
          </>
        );
      },
    },
  ];
  const mergedColumns = dataColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'id' ? 'classLearnName' : "null",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      <Link to="/Management/ClassAdd">
        <Button type="primary" style={{ width: "120px", marginBottom: "20px" }}>Add class</Button>
      </Link>
      <Form form={form} component={false} style={{ width: "86%" }}>
        <Table<Item>
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={DataListClass}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        >
          {mergedColumns.map((column: ShowColumns, demcolumn) => {
            const { dataIndex, title, width, ...restColumnProps } = column;


            // Adjust the render function to pass the count as the index parameter
            const adjustedRender = column.render
              ? (value: any, record: Item, index: number) =>
                column.render!(value, record as Item, index)
              : undefined;
            return (
              <Table.Column<Item>
                key={dataIndex}
                title={title}
                dataIndex={dataIndex}
                width={width}
                render={adjustedRender}
                {...restColumnProps}
              />
            );
          })}
        </Table>
      </Form>
    </>
  );
};

export default App;