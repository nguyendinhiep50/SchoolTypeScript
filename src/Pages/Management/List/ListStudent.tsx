import React, { useEffect, useState, ReactNode } from 'react';
import { Form, Button, Input, InputNumber, Table, Typography, Popconfirm, Select, Pagination } from 'antd';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { format } from 'date-fns';
import Item from 'antd/es/list/Item';
interface Item {
  studentId: string; // Make sure you have a unique id for each item in the array
  studentName: string;
  studentImage: string;
  studentBirthDate: Date;
  facultyName: string;
  facultyId: string;

}
interface Faculty {
  facultyId: string;
  facultyName: string;
  // Add other properties if applicable
}

interface ChildProps {
  dataKH: Faculty[];
  FilterString: any;
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

const App: React.FC<ChildProps> = (props) => {
  const [form] = Form.useForm();
  const [Pages, setPages] = useState(1);
  const [Size, setSize] = useState(3);
  const [countStudent, setcountStudent] = useState(0);
  const [editingid, setEditingid] = useState('');
  const [DataEditKhoaId, setDataEditKhoaId] = useState('');
  const { dataKH } = props;
  const { DataFilter, FilterString } = props.FilterString;
  const [dataStudent, setDataStudent] = useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
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
        setcountStudent(value);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchDataCount = async () => {
      try {
        const response = await axios.get("https://localhost:7232/api/Students/TakeCountAll");
        const value: any = response.data;
        setcountStudent(value);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
      }
    };
    fetchDataCount();
    const accessToken = localStorage.getItem("access_tokenAdmin");
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7232/api/Students/TakeNameFaculty?pages="
          + Pages + "&size=" + Size, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const studentsData = response.data.map((student: any, index: number) => ({
          studentId: student.studentId,
          studentName: student.studentName,
          studentImage: student.studentImage,
          studentBirthDate: format(new Date(student.studentBirthDate), 'yyyy-MM-dd'),
          facultyName: student.facultyName,
        }));
        setDataStudent(studentsData);
        console.log(dataStudent);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchDataFilter = async () => {
      try {
        const response = await axios.get("https://localhost:7232/api/Students/StudentInFaculty/" + FilterString);
        console.log(response.data);
        const studentsData = response.data.map((student: any, index: number) => ({
          studentId: student.studentId,
          studentName: student.studentName,
          studentImage: student.studentImage,
          studentBirthDate: format(new Date(student.studentBirthDate), 'yyyy-MM-dd'),
          facultyName: student.facultyName,
        }));
        setDataStudent(studentsData);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
      }
    };
    if (FilterString != "")
      fetchData();
    else
      fetchDataFilter();

    console.log("render lại nè");
  }, [dataUpdate, DataFilter, Pages]);
  const isEditing = (record: Item) => record.studentId === editingid;

  const edit = (record: Partial<Item> & { studentId: string }) => {
    console.log(record.studentId);
    form.setFieldsValue({ studentName: '', studentImage: '', studentBirthDate: '', facultyName: '', ...record });
    setEditingid(record.studentId);
  };
  const handleDataChange = (newData: any) => {
    setdataUpdate(prevData => ({
      ...prevData,
      Item: newData
    }));
  };
  const DeleteID = (record: Partial<Item> & { studentId: string }) => {
    axios
      .delete(
        "https://localhost:7232/api/Students/" + record.studentId
      )
      .then((response) => {
        alert("Đã xóa học sinh");
        const newDataStudent = dataStudent.filter(item => item.studentId !== record.studentId);
        handleDataChange(newDataStudent);
      })
      .catch((err) => console.log(err));
  };


  const cancel = () => {
    setEditingid('');
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Item;
      row.studentId = id;
      row.facultyId = DataEditKhoaId;
      row.facultyName = dataKH.find(x => x.facultyId = DataEditKhoaId)?.facultyName || "null";
      const newData = [...dataStudent];
      const index = newData.findIndex((item) => id === item.studentId);
      // id
      if (index > -1) {
        console.log(row);
        newData.splice(index, 1, row);
        setDataStudent(newData);
        setEditingid('');
        // xử lý cập nhật dữ liệu
        axios
          .put(
            "https://localhost:7232/api/Students/" +
            id,
            newData[index]
          )
          .then((response) => console.log(response))
          .catch((err) => {
            console.log(err)
            console.log(newData[index])
          });
        console.log(newData[index]);
      } else {
        newData.push(row);
        setDataStudent(newData);
        setEditingid('');
      }
    } catch (errInfo) {
      setEditingid('');
      console.log('Validate Failed:', errInfo);
    }
  };
  const handleSelectChange = (newFacultyId: string) => {
    setDataEditKhoaId(newFacultyId);
  };
  const handleChanegPages = (newPages: number) => {
    console.log(newPages);
    setPages(newPages);
  };
  const dataColumns: ShowColumns[] = [
    {
      title: 'Tên học sinh',
      dataIndex: 'studentName',
      width: '16%',
      editable: true,
    },
    {
      title: 'Ảnh',
      dataIndex: 'studentImage',
      width: '10%',
      editable: true,

    },
    {
      title: 'Ngày sinh',
      dataIndex: 'studentBirthDate',
      width: '8%',
      editable: true,
    },
    {
      title: 'Khoa',
      dataIndex: 'facultyName',
      width: '8%',
      editable: false,
      render: (_: any, record: Item) => {
        const editableShow = isEditing(record);
        return editableShow ? (
          <Select onChange={handleSelectChange} style={{ minWidth: "100px" }}>
            {dataKH.map((p, index) => (
              <Select.Option key={p.facultyId} value={p.facultyId}>
                {p.facultyName}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <>
            <span>{record.facultyName}</span>
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
            <Typography.Link onClick={() => save(record.studentId)} style={{ marginRight: 8 }}>
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
        inputType: col.dataIndex === 'id' ? 'studentName' : "null",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      <Link to="/Management/StudentAdd">
        <Button type="primary" style={{ width: "120px", marginBottom: "20px" }}>Add Student</Button>
      </Link>
      <Form form={form} component={false} style={{ width: "86%" }}>
        <Table<Item>
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataStudent}
          rowClassName="editable-row"
          pagination={false}
        >
          {mergedColumns.map((column: ShowColumns) => {
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
        <Pagination defaultCurrent={1} defaultPageSize={Size} onChange={handleChanegPages} total={countStudent.valueOf()} />
      </Form>
    </>
  );
};

export default App;