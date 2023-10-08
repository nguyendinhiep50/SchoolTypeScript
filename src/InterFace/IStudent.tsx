import { Form, Input, InputNumber } from 'antd';
import React, { ReactNode } from 'react';


export interface Item {
    studentId: string; // Make sure you have a unique id for each item in the array
    studentName: string;
    studentImage: string;
    studentBirthDate: Date;
    facultyName: string;
    facultyId: string;
}
export interface Faculty {
    facultyId: string;
    facultyName: string;
    // Add other properties if applicable
}

export interface ChildProps {
    dataKH: Faculty[];
    FilterString: any;
}
export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}

export interface ShowColumns {
    title: string;
    dataIndex: string;
    width: string;
    editable: boolean;
    render?: RenderFunction | RenderWithCellFunction;
}
type RenderFunction = (value: any, record: Item, index: number) => ReactNode;
type RenderWithCellFunction = (value: any, record: Item, index: number) => ReactNode;
export const EditableCell: React.FC<EditableCellProps> = ({
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