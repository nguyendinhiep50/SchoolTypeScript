import React, { useEffect, useState } from 'react';
import { Form, Button, Popconfirm, Table, Typography, Pagination } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Item, ShowColumns, EditableCell } from '../../../InterFace/ITeacher'
import { format } from 'date-fns';
import { GetListTeacherPage, CountTeachers, DeleteTeacher, UpdateTeacher } from '../../../services/APITeacher';
import { PagesAndSize } from '../../../services/types'
const App: React.FC = () => {
  const [form] = Form.useForm();
  const [Pageschange, setPageschange] = useState(1);
  const [Size, setSize] = useState(3);
  const [editingid, setEditingid] = useState('');
  const [dataTeacher, setdataTeacher] = useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
  const [countTeacher, setcountTeacher] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CountTeachers();
        const value: any = response;
        setcountTeacher(value.data);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const pagesAndSize: PagesAndSize = { pages: Pageschange, size: 3 };
    const fetchData = async () => {
      try {
        const response = await GetListTeacherPage(pagesAndSize);
        if (typeof response === 'undefined') {
          console.log('studentList is of type void');
        } else {
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
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dataUpdate, Pageschange]);
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
    const bienxoa = DeleteTeacher(record.teacherId);
    if (typeof bienxoa === 'undefined') {
      console.log('studentList is of type void');
    } else {
      const newDataStudent = dataTeacher.filter(item => item.teacherId !== record.teacherId);
      handleDataChange(newDataStudent);
    }
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
        const update = UpdateTeacher(newData[index], teacherId);
        if (typeof update === 'undefined') {
          setEditingid('');
          console.log('Validate Failed');
        }

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
    setPageschange(newPages);
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
          pagination={false}
          bordered
          dataSource={dataTeacher}
          rowClassName="editable-row"
        >
          {mergedColumns.map((column: ShowColumns) => {
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