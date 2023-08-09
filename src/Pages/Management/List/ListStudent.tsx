import React, {useEffect,useState,ReactNode }  from 'react';
import { Form, Input, InputNumber, Table,Typography,Popconfirm,Select } from 'antd';
import axios from 'axios';  
import { format } from 'date-fns';
import Item from 'antd/es/list/Item'; 
interface Item {
  studentId: string; // Make sure you have a unique id for each item in the array
  studentName: string;
  studentImage: string; 
  studentBirthDate: Date; 
  facultyName:string;
  facultyId:string;

}
interface Faculty {
  facultyId: string;
  facultyName: string;
  // Add other properties if applicable
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
type RenderWithCellFunction = (value: any, record: Item, index: number) => ReactNode ;
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
  const [deleteId, setDelete] = useState('');
  const [DataEditKhoa, setDataEditKhoa] = useState('');
  // const [DataEditKhoaId, setDataEditKhoaId] = useState('');
  const [dataKH, setDataKH] = useState<Faculty[]>([]); 
  const [dataStudent, setDataStudent] = useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState({ Item:{} as Item})
  useEffect(() => {
    const fetchData = async () => {
      axios
      .get("https://localhost:7232/api/Faculties")
      .then((response) => {
        setDataKH(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
      try {
        const response = await axios.get("https://localhost:7232/api/Students/TakeNameFaculty");
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
    fetchData();
  }, [dataUpdate]);
  const isEditing = (record: Item) => record.studentId === editingid;

  const edit = (record: Partial<Item> & { studentId:string }) => {
    console.log(record.studentId);
    form.setFieldsValue({  studentName: '',studentImage :'',studentBirthDate :'' ,facultyName:'', ...record });
    setEditingid(record.studentId);
  };
  const handleDataChange = (newData: any) => {
    setdataUpdate(prevData => ({
      ...prevData,
      Item: newData
    }));
  };
  const DeleteID = (record: Partial<Item> & { studentId:string }) => {
    axios
        .delete(
          "https://localhost:7232/api/Students/" +record.studentId
        )
        .then((response) =>{ 
          alert("Đã xóa học sinh");
          const newDataStudent = dataStudent.filter(item => item.studentId !== record.studentId);
          handleDataChange(newDataStudent);
        })
        .catch((err) => console.log(err));
  };


  const cancel = () => {
    setEditingid('');
  };

  const save = async (id:string) => {
    try {
      const row = (await form.validateFields()) as Item;
      row.studentId = id;
      row.facultyId = DataEditKhoa;
      // row.facultyId = DataEditKhoaId;

      const newData = [...dataStudent];
      const index = newData.findIndex((item) => id === item.studentId);
      // id
      if (index > -1) {
        const item = newData[index]; 
        console.log(row); 
        newData.splice(index, 1,row);  
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
        .catch((err) => {console.log(err) 
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
    setDataEditKhoa(newFacultyId);
    // setDataEditKhoaId(newFacultyId.facultyId);
  };
 const dataColumns: ShowColumns[]  = [
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
         <Select onChange={handleSelectChange}>
            {dataKH.map((p, index) => (
              <Select.Option key={p.facultyId} value={p.facultyId}>
                {p.facultyName}
              </Select.Option>
            ))}
          </Select>
      ) : (
        <>
        <h1>{record.facultyName}</h1>
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
        inputType: col.dataIndex === 'id' ? 'studentName' :"null",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}  style={{width:"86%"}}> 
      <Table<Item>
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={dataStudent}   
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      >
      {mergedColumns.map((column:ShowColumns, demcolumn) => {
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
  );
};

export default App;