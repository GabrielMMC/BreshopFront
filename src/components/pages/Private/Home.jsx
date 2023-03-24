import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Aside from './SideBar/Aside';
import { mudarDados } from '../../../components/actions/AppActions';
import { useParams, useLocation, Outlet } from "react-router-dom";
import Header from './Header';
import './SideBar/styles/index.css';
import './SideBar/styles/App.scss';
import './SideBar/styles/bootstrap.css';

const Home = (props) => {
    const toggled = useSelector(store => store.AppReducer.toggled)
    const collapsed = useSelector(store => store.AppReducer.collapsed)

    const dispatch = useDispatch();
    const [image, setImage] = useState(true);
    const handleCollapsedChange = (checked) => {
        dispatch(mudarDados({ collapsed: checked }));

    };

    const handleToggleSidebar = (value) => {
        // setToggled(value);
        dispatch(mudarDados({ toggled: value }));
    };

    useEffect(() => {
        const event = (e) => {
            if (window.innerWidth <= 768) {
                dispatch(mudarDados({ toggled: false, collapsed: false }));

            }
            else {

                dispatch(mudarDados({ toggled: true, collapsed: true }));

            }
        };
        return () => {
            window.removeEventListener('resize', event);
        }
    }, [])
    const location = useLocation()
    const marginLeft = (toggled === false || window.innerWidth <= 768) ? 0 : (collapsed === false ? 270 : 80);
    console.log('toggle', toggled, collapsed);
    return (
        <div className={`app ${toggled ? 'toggled' : ''}`}>
            <Aside
                image={image}
                collapsed={collapsed}
                toggled={toggled}

                handleToggleSidebar={handleToggleSidebar}
                handleCollapsedChange={handleCollapsedChange}

            />
            <Header
                image={image}
                toggled={toggled}
                collapsed={collapsed}
                handleToggleSidebar={handleToggleSidebar}
                handleCollapsedChange={handleCollapsedChange}
            />
            <div className="content-page" >
                <div className="content" style={{ marginLeft: marginLeft, transition: 'all 0.3s ', paddingBottom: 100, background: '#f8f8fa' }}>
                    <div className="container-fluid">
                        <Outlet />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Home;