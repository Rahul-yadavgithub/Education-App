import React from 'react';

import {useContext} from 'react';

import {useNavigate} from 'react-router-dom';

import {SIDE_MENU_DATA} from '../../Utils/data.js';

import {UserDataContext} from '../../Context/UserContext.jsx';

import CharAvatar from '../Cards/CharAvatar.jsx';

import axiosInstance from '../../Utils/axiosInstance.js';
import {API_PATHS} from '../../Utils/apiPaths.js';

const SideMenu = ({activeMenu})=>{

    const {user, clearUser} = useContext(UserDataContext);

    const navigate = useNavigate();

    const handlClick = (route) =>{
        if(route == "logout"){
            handleLogout();
            return;
        }
        navigate(route);
    };

    const handleLogout = async()=>{
        try{
            await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
        }
        catch(error){
            console.log("Logout Error :",error)
        }
        finally {
            clearUser();
            navigate("/login");
        }
    };


    return(
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
            <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
                {user?.profileImageUrl ?(
                    <img
                    src = {user?.profileImageUrl || ""}
                    alt = "Profile - Image"
                    className="w-20 h-20 bg-slate-400 rounded-full object-cover"
                    />
                ) :(
                    <CharAvatar
                    name = {user ?.name || ""}
                    width = "w-20"
                    height = "h-20"
                    style = "text-xl"
                    />
                )}

                <h5 className="text-gray-950 font-medium leading-6">
                    {user?.name || "User"}
                </h5>

            { SIDE_MENU_DATA.map( (item, index)  =>  (<button 
            key = {`menu_${index}`}
            className = {`w-full flex items-center gap-4 text-[15px] cursor-pointer ${
                activeMenu == item.label && "text-white bg-primary"
            } py-3 px-6 rounded-lg mb-3`}

            onClick = {() => handlClick(item.path)}
                >
                <item.icon className="text-xl"/>
                {item.label}
            </button>

            ))}
            </div>
        </div>
    );
};


export default SideMenu;