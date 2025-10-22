import React from 'react';

import {useContext} from 'react';

import {UserDataContext} from '../../Context/UserContext.jsx';

import SideMenu from '../Commans/SideMenu.jsx';

import NavBar from '../Commans/NavBar.jsx';


const DashboardLayout = ({children, activeMenu}) => {
    const {user} = useContext(UserDataContext);

    if (!user) return null; // prevents rendering if not logged in

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <NavBar activeMenu={activeMenu} user={user} />

            <div className="flex flex-1">
                <div className="max-[1080px]:hidden">
                    <SideMenu activeMenu={activeMenu} user={user} />
                </div>

                <div className="flex-1 mx-5">
                    {children}
                </div>
            </div>
        </div>
    );
};


export default DashboardLayout;