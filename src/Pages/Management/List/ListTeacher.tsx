import React, { useEffect, useState, ReactNode } from 'react';
import { Form, Button, Input, InputNumber, Popconfirm, Table, Typography, Pagination } from 'antd';
import { BrowserRouter as Router, Route, Link, useHistory, useLocation } from 'react-router-dom';

import axios from 'axios';
import { format } from 'date-fns';
interface Item {
  teacherId: string; // Make sure you have a unique id for each item in the array
  teacherName: string;
  teacherImage: string;
  teacherEmail: string;
  teacherBirthDate: Date;
  teacherPhone: string;
  teacherAdress: string;
}
interface ShowColumns {
  title: string;
  dataIndex: string;
  width: string;
  fixed: string;
  editable: boolean;
  render?: RenderFunction | RenderWithCellFunction;
}
const accessToken = localStorage.getItem("access_tokenAdmin");

type RenderFunction = (value: any, record: Item, index: number) => ReactNode;
type RenderWithCellFunction = (value: any, record: Item, index: number) => ReactNode;
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}
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
  const [dataTeacher, setdataTeacher] = useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
  const [Pages, setPages] = useState(1);
  const [Size, setSize] = useState(3);
  const [countTeacher, setcountTeacher] = useState(0);
  useEffect(() => {
    const accessToken = localStorage.getItem("access_tokenAdmin");

    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7232/api/Students/TakeCountAll", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const value: any = response.data;
        setcountTeacher(value);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const accessToken = localStorage.getItem("access_tokenAdmin");
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7232/api/Teachers", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log(response.data);
        const studentsData = response.data.map((teacher: any, index: number) => ({
          teacherId: teacher.teacherId,
          teacherName: teacher.teacherName,
          teacherImage: teacher.teacherImage,
          teacherEmail: teacher.teacherEmail,
          teacherBirthDate: format(new Date(teacher.teacherBirthDate), 'yyyy-MM-dd'),
          teacherPhone: teacher.teacherPhone,
          teacherAdress: teacher.teacherAdress,
        }));

        setdataTeacher(studentsData);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dataUpdate]);
  const isEditing = (record: Item) => record.teacherId === editingid;

  const edit = (record: Partial<Item> & { teacherId: string }) => {
    form.setFieldsValue({ teacherName: '', teacherImage: '', teacherEmail: '', teacherBirthDate: '', teacherPhone: '', teacherAdress: '', ...record });
    setEditingid(record.teacherId);
  };
  const handleDataChange = (newData: any) => {
    setdataUpdate(prevData => ({
      ...prevData,
      Item: newData
    }));
  };
  const DeleteID = (record: Partial<Item> & { teacherId: string }) => {
    axios
      .delete(
        "https://localhost:7232/api/Teachers/" + record.teacherId, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
      )
      .then((response) => {
        alert("Đã xóa giáo viên");
        const newDataStudent = dataTeacher.filter(item => item.teacherId !== record.teacherId);
        handleDataChange(newDataStudent);
      })
      .catch((err) => console.log(err));
  };
  const cancel = () => {
    setEditingid('');
  };

  const save = async (teacherId: string) => {
    try {
      const row = (await form.validateFields()) as Item;
      row.teacherId = teacherId;
      const newData = [...dataTeacher];
      const index = newData.findIndex((item) => teacherId === item.teacherId);
      if (index > -1) {
        console.log(row);
        newData.splice(index, 1, row);
        setdataTeacher(newData);
        setEditingid('');
        // xử lý cập nhật dữ liệu
        axios
          .put(
            "https://localhost:7232/api/Teachers/" +
            teacherId,
            newData[index], {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
          )
          .then((response) => console.log(response))
          .catch((err) => console.log(err));
      } else {
        newData.push(row);
        setdataTeacher(newData);
        setEditingid('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const handleChanegPages = (newPages: number) => {
    console.log(newPages);
    setPages(newPages);
  };
  const dataColumns: ShowColumns[] = [
    {
      title: 'Tên giáo viên',
      dataIndex: 'teacherName',
      width: '10%',
      fixed: 'left',
      editable: true,
    },
    {
      title: 'Ảnh',
      dataIndex: 'teacherImage',
      width: '10%',
      editable: true,
      fixed: '',
    },
    {
      title: 'Email',
      dataIndex: 'teacherEmail',
      width: '20%',
      editable: true,
      fixed: '',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'teacherBirthDate',
      width: '8%',
      editable: true,
      fixed: '',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'teacherAdress',
      width: '15%',
      editable: true,
      fixed: '',
    },
    {
      title: 'điện thoại',
      dataIndex: 'teacherPhone',
      width: '10%',
      editable: true,
      fixed: '',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      fixed: 'right',
      editable: false,
      width: '10%',
      render: (_: any, record: Item) => {
        const editableShow = isEditing(record);
        return editableShow ? (
          <span>
            <Typography.Link onClick={() => save(record.teacherId)} style={{ marginRight: 8 }}>
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
            <Typography.Link style={{ marginLeft: "20px" }} disabled={editingid !== ''} onClick={() => DeleteID(record)}>
              DELETE
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
        inputType: col.dataIndex === 'id' ? 'studentName' : "null",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      <Link to="/Management/TeacherAdd">
        <Button type="primary" style={{ width: "120px", marginBottom: "20px" }}>Add Teacher</Button>
      </Link>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataTeacher}
          scroll={{ x: 1600 }}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        >
          {mergedColumns.map((column: ShowColumns, demcolumn) => {
            const { dataIndex, title, width, fixed, ...restColumnProps } = column;
            const mappedFixed = fixed === 'left' ? 'left' : fixed === 'right' ? 'right' : undefined;

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
                fixed={mappedFixed}
                render={adjustedRender}
                {...restColumnProps}
              />
            );
          })}
        </Table>
        <Pagination defaultCurrent={1} defaultPageSize={Size} onChange={handleChanegPages} total={countTeacher.valueOf()} />

      </Form>
    </>
  );
};

export default App;