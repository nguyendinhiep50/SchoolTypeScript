import React, { useEffect, useState, ReactNode } from 'react';
import { Form, Button, Table, Typography, Popconfirm, Select, Pagination } from 'antd';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { format } from 'date-fns';
// import Item from 'antd/es/list/Item';
import { GetListStudentPage, CountStudents, DeleteStudent, UpdateStudent } from '../../../services/APIStudent';
import { Item, ChildProps, ShowColumns, EditableCell } from "../../../InterFace/IStudent";
import { PagesAndSize } from '../../../services/types';

const App: React.FC<ChildProps> = (props) => {
  const [form] = Form.useForm();
  const [Pageschange, setPageschange] = useState(1);
  const [Size, setSize] = useState(3);
  const [countStudent, setcountStudent] = useState(0);
  const [editingid, setEditingid] = useState('');
  const [DataEditKhoaId, setDataEditKhoaId] = useState('');
  const { dataKH } = props;
  const { DataFilter, FilterString } = props.FilterString;
  const [dataStudent, setDataStudent] = useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
  useEffect(() => {
    const fetchDataCount = async () => {
      try {
        const response = await CountStudents();
        console.log(response);
        const value: any = response;
        setcountStudent(value.data);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
      }
    };
    fetchDataCount();
    const fetchData = async () => {
      try {
        const pagesAndSize: PagesAndSize = { pages: Pageschange, size: 3 };
        const studentList = await GetListStudentPage(pagesAndSize);
        if (typeof studentList === 'undefined') {
          console.log('studentList is of type void');
        } else {
          const studentsData = studentList.data.map((student: any, index: number) => ({
            studentId: student.studentId,
            studentName: student.studentName,
            studentImage: student.studentImage,
            studentBirthDate: format(new Date(student.studentBirthDate), 'yyyy-MM-dd'),
            facultyName: student.facultyName,
          }));
          setDataStudent(studentsData);
        }
        console.log(dataStudent);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    console.log("render lại nè");
  }, [dataUpdate, DataFilter, Pageschange]);
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
    const bienxoa = DeleteStudent(record.studentId);
    if (typeof bienxoa === 'undefined') {
      console.log('studentList is of type void');
    } else {
      const newDataStudent = dataStudent.filter(item => item.studentId !== record.studentId);
      handleDataChange(newDataStudent);
    }
  };
  const cancel = () => {
    setEditingid('');
  };
  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Item;
      row.studentId = id;
      row.facultyName = dataKH.find(x => x.facultyId === DataEditKhoaId)?.facultyName || "null";
      row.facultyId = DataEditKhoaId;
      const newData = [...dataStudent];
      const index = newData.findIndex((item) => id === item.studentId);
      // id
      if (index > -1) {

        newData.splice(index, 1, row);
        const update = await UpdateStudent(row, id);
        if (typeof update === 'undefined') {
          setEditingid('');
          return;
        }
        setDataStudent(newData);
        setEditingid('');

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
    setPageschange(newPages);
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
          <Select onChange={handleSelectChange} style={{ minWidth: "200px" }}>
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