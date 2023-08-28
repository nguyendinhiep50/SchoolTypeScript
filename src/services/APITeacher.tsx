import axios from 'axios';
import { PagesAndSize } from './types';
import { Item } from '../InterFace/ITeacher'
const accessToken = localStorage.getItem("access_tokenAdmin");

export const CountTeachers = async () => {
    const response = await axios.get("https://localhost:7232/api/Teachers/TakeCountAll",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).catch((err) => console.log(err));
    return response;
}
export const GetListTeacherPage = async (params: PagesAndSize) => {
    const { pages, size } = params;
    const response = await axios.get("https://localhost:7232/api/Teachers?pages="
        + pages + "&size=" + size, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).catch((err) => console.log(err));
    return response;
}
export const DeleteTeacher = async (params: string) => {
    const bien = params;
    const response = await axios.delete("https://localhost:7232/api/Teachers/"
        + bien, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).catch((err) => console.log(err));
    return response;
}
export const UpdateTeacher = async (params: Item, id: string) => {
    const dataupdate = params;
    const response = axios.put("https://localhost:7232/api/Teachers/" + id, dataupdate,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    ).then(() => { alert("cạp nhat thanh cong") })
        .catch((err) => {
            console.log(err)
        });
    return response;
}