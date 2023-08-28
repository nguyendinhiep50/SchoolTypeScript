import axios from 'axios';
import { PagesAndSize } from './types';
import { Item } from '../InterFace/IFaculty'
const accessToken = localStorage.getItem("access_tokenAdmin");
export const CountFaculty = async () => {
    const response = await axios.get("https://localhost:7232/api/Faculties/TakeCountAll",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).catch((err) => console.log(err));
    return response;
}
export const GetListFacultyPage = async (params: PagesAndSize) => {
    const { pages, size } = params;
    const response = await axios.get("https://localhost:7232/api/Faculties?pages="
        + pages + "&size=" + size, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).catch((err) => console.log(err));
    return response;
}
export const DeleteFaculty = async (params: string) => {
    const bien = params;
    const response = await axios.delete("https://localhost:7232/api/Faculties/"
        + bien, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).catch((err) => console.log(err));
    return response;
}
export const UpdateFaculty = async (params: Item, id: string) => {
    const dataupdate = params;
    const response = axios.put("https://localhost:7232/api/Faculties/" + id, dataupdate,
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