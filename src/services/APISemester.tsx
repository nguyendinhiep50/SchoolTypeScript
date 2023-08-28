import axios from 'axios';
import { PagesAndSize } from './types';
import { Item } from '../InterFace/ISemester'
const accessToken = localStorage.getItem("access_tokenAdmin");

export const CountSemesters = async () => {
    const response = await axios.get("https://localhost:7232/api/Semesters/TakeCountAll",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).catch((err) => console.log(err));
    return response;
}
export const GetListSemesterPage = async (params: PagesAndSize) => {
    const { pages, size } = params;
    const response = await axios.get("https://localhost:7232/api/Semesters/GetSemesters?pages="
        + pages + "&size=" + size, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).catch((err) => console.log(err));
    return response;
}
export const DeleteSemester = async (params: string) => {
    const bien = params;
    const response = await axios.delete("https://localhost:7232/api/Semesters/"
        + bien, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).catch((err) => console.log(err));
    return response;
}
export const UpdateSemester = async (params: Item, id: string) => {
    const dataupdate = params;
    const response = axios.put("https://localhost:7232/api/Semesters/" + id, dataupdate,
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