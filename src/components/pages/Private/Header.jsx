import React from 'react';
import ProfileMenu from './ProfileMenu';
import { connect } from 'react-redux';
import { FaBars } from 'react-icons/fa';


const Header = ({ handleToggleSidebar, handleCollapsedChange, toggled,
    collapsed }) => {


    const marginLeft = (toggled == false || window.innerWidth <= 768) ? 0 : (collapsed == false ? 270 : 80);
    return (
        <div className="topbar">



            <nav className="navbar-custom d-flex justify-content-between align-items-center" style={{ marginLeft: marginLeft, transition: 'all 0.3s ' }}>
                <div className="btn-toggle" style={{
                    background: '#ececf1',
                    color: '#353535'
                }} onClick={() => {
                    if (window.innerWidth <= 768) {
                        handleToggleSidebar(!toggled)

                    }
                    else {
                        handleCollapsedChange(!collapsed)

                    }
                }}>
                    <FaBars />
                </div>
            </nav>
        </div>

    );

}


export default Header;