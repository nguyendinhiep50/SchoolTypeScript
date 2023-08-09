import React, {useEffect,useState,ReactNode }  from 'react';
import { Form, Input, InputNumber, Table,Typography,Popconfirm } from 'antd';
import axios from 'axios';  
import { format } from 'date-fns';
import Item from 'antd/es/list/Item'; 
interface Item {
  id: string; // Make sure you have a unique id for each item in the array
  studentName: string;
  studentImage: string; 
  studentBirthDate: Date; 
  facultyId:string;
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
  const [dataStudent, setDataStudent] = useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState({ Item:{} as Item})
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7232/api/Students");
        console.log(response.data);
        const studentsData = response.data.map((student: any, index: number) => ({
          id: student.StudentId,
          studentName: student.studentName,
          studentImage: student.studentImage, 
          studentBirthDate: format(new Date(student.studentBirthDate), 'yyyy-MM-dd'),        
          facultyId: student.facultyName,
        }));
        setDataStudent(studentsData);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
        
      }
    };

    fetchData();
  }, [dataUpdate]);
  const isEditing = (record: Item) => record.id === editingid;

  const edit = (record: Partial<Item> & { id:string }) => {
    form.setFieldsValue({  studentName: 'hi bạn', studentEmail: '',studentPassword: '',studentAdress:'',studentDateCome:'',studentPhone:'',facultyId:'', ...record });
    setEditingid(record.id);
  };
  const handleDataChange = (newData: Item) => {
    setdataUpdate(prevData => ({
      ...prevData,
      Item: newData
    }));
  };
  const DeleteID = (record: Partial<Item> & { id:string }) => {
    axios
        .delete(
          "https://localhost:7232/api/Students/" +record.id
        )
        .then((response) =>{ 
          alert("Đã xóa học sinh");
          const newDataStudent = dataStudent.filter(item => item.id !== record.id);
          setDataStudent(newDataStudent);
        })
        .catch((err) => console.log(err));
  };


  const cancel = () => {
    setEditingid('');
  };

  const save = async (id:string) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...dataStudent];
      const index = newData.findIndex((item) => id === item.id);
      // id
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1);
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
        .catch((err) => console.log(err));

        console.log(newData[index]);
      } else {
        newData.push(row);
        setDataStudent(newData);
        setEditingid('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
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
      dataIndex: 'facultyId',
      width: '8%',
      editable: true, 

    },
    {
      title: 'operation',
      dataIndex: 'operation',
      width: '8%',
      editable: true, 
      render: (_: any, record: Item) => {
      const editable = isEditing(record);
      return editable ? (
        <span>
          <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
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
      {dataColumns.map((column:ShowColumns, demcolumn) => {
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