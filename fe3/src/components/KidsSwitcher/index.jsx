import React, { useState } from 'react';
import { useKids } from '../../context/KidsContext';
import { FaUserPlus, FaExchangeAlt } from 'react-icons/fa';
import './index.css';

const KidsSwitcher = () => {
  const { state, dispatch } = useKids();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKidName, setNewKidName] = useState('');

  const handleAddKid = (e) => {
    e.preventDefault();
    if (newKidName.trim()) {
      dispatch({
        type: 'ADD_KID',
        payload: {
          name: newKidName.trim(),
          transactions: []
        }
      });
      setNewKidName('');
      setIsModalOpen(false);
    }
  };

  const handleSwitchKid = (kidId) => {
    dispatch({ type: 'SWITCH_KID', payload: kidId });
  };

  const currentKid = state.kids.find(kid => kid.user_id === state.currentKid);

  return (
    <div className="kids-switcher">
      <div className="current-kid">
        {/*<span className="kid-label">当前账本:</span>*/}
        <span className="kid-name">{currentKid?.username || '未选择'}</span>
        <button
          className="switch-btn"
          onClick={() => setIsModalOpen(true)}
        >
          {state.kids.length > 0 ? <FaExchangeAlt /> : <FaUserPlus />}
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{state.kids.length > 1 ? '切换账本' : ''}</h3>

            {state.kids.length > 1 && (
              <div className="kids-list">
                {state.kids.map(kid => (
                  <button
                    key={kid.id}
                    className={`kid-item ${kid.id === state.currentKid ? 'active' : ''}`}
                    onClick={() => {
                      handleSwitchKid(kid.id);
                      setIsModalOpen(false);
                    }}
                  >
                    {kid.username}
                  </button>
                ))}
              </div>
            )}

            {/*<form onSubmit={handleAddKid} className="add-kid-form">*/}
            {/*  <input*/}
            {/*    type="text"*/}
            {/*    value={newKidName}*/}
            {/*    onChange={(e) => setNewKidName(e.target.value)}*/}
            {/*    placeholder="输入新账本名称"*/}
            {/*    maxLength={20}*/}
            {/*  />*/}
            {/*  <button type="submit">创建新账本</button>*/}
            {/*</form>*/}

            <button
              className="close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KidsSwitcher;
