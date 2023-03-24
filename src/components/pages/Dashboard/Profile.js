import React from "react";
import { Outlet, useLocation } from 'react-router-dom'
import Container from "../Container";
import { useNavigate } from 'react-router-dom'
import { FiUser } from 'react-icons/fi'
import { BsCreditCard } from 'react-icons/bs'
import { BiHomeSmile } from 'react-icons/bi'
import { MdOutlineLocalShipping } from 'react-icons/md'
import { TbShirt } from 'react-icons/tb'
import { RiBillLine } from 'react-icons/ri'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { AiOutlineLineChart } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import Data from "./Data";
import './styles.css';

const Profile = () => {
  const location = useLocation()
  const history = useNavigate()
  const breshop = useSelector(state => state.AppReducer.breshop)
  // console.log('breshop', breshop)

  return (
    <Container>
      <div className='box p-3'>
        <div className='row'>
          <div className='col-3'>
            <nav className="user-dash">
              <ul>
                <li className='hvr-grow pointer' onClick={() => history('/profile')}>
                  <FiUser />
                  <p className='small' style={{ color: 'black' }}>Dados Gerais</p>
                </li>
                <li className='hvr-grow pointer' onClick={() => history('/profile/address')}>
                  <MdOutlineLocalShipping />
                  <p className='small' style={{ color: 'black' }}>Endereços</p>
                </li>
                <li className='hvr-grow pointer' onClick={() => history('/profile/payment')}>
                  <BsCreditCard />
                  <p className='small' style={{ color: 'black' }}>Cartões</p>
                </li>
                <li className='hvr-grow pointer' onClick={() => history('/profile/orders')}>
                  <RiBillLine />
                  <p className='small' style={{ color: 'black' }}>Pedidos</p>
                </li>
                <li className='hvr-grow pointer' onClick={() => history('/profile/breshop')}>
                  <BiHomeSmile />
                  <p className='small' style={{ color: 'black' }}>Minha loja</p>
                </li>
                {breshop &&
                  <>
                    <li className='hvr-grow pointer' onClick={() => history('/profile/products')}>
                      <TbShirt />
                      <p className='small' style={{ color: 'black' }}>Meus produtos</p>
                    </li>
                    <li className='hvr-grow pointer' onClick={() => history('/profile/withdrawals')}>
                      <FaRegMoneyBillAlt />
                      <p className='small' style={{ color: 'black' }}>Meus saques</p>
                    </li>
                    <li className='hvr-grow pointer' onClick={() => history('/profile/recipient-orders')}>
                      <AiOutlineLineChart />
                      <p className='small' style={{ color: 'black' }}>Meus pedidos</p>
                    </li>
                  </>}
              </ul>
            </nav>
          </div>
          <div className='col-9 p-sm-3'>
            {location.pathname === '/profile' ? <Data /> : <Outlet />}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
