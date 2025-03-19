import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPlus, FaHistory, FaSignOutAlt } from 'react-icons/fa';
import KidsSwitcher from '../KidsSwitcher';
import { useAuth } from '../../context/AuthContext';
import { useKids} from "../../context/KidsContext";
import './index.css';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const { state } = useKids();
  const currentKid = state.kids?.find(kid => kid.user_id === state.currentKid);
  const title = state.parent ? '孩子们的存钱罐' : `${currentKid?.username}的存钱罐`;


  return (
    <div className="layout">
      <header className="header">
        <h1>{title}</h1>
        <div className="header-right">
            {state?.parent && ( <KidsSwitcher />) }
          <div className="user-info">
            <span>{user?.username}</span>
            <button className="logout-btn" onClick={logout}>
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <nav className="nav-bar">
        <Link to="/" className="nav-item">
          <FaHome />
          <span>首页</span>
        </Link>
        {state?.parent  && (
            <Link to="/add" className="nav-item">
              <FaPlus />
              <span>记账</span>
              </Link>)
        }
        <Link to="/history" className="nav-item">
          <FaHistory />
          <span>历史</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
