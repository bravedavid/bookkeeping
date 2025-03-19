import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const KidsContext = createContext();

const initialState = {
  currentKid: null,
  parent: false,
  kids: []  // 初始化为空数组，以便后续从API填充
};

const kidsReducer = (state, action) => {
  switch (action.type) {
    case 'SWITCH_KID':
      return {
        ...state,
        currentKid: action.payload
      };
    case 'SET_KIDS':  // 用于设置孩子列表
      return {
        ...state,
        kids: action.payload
      };
    case 'SET_PARENT':  // 用于设置家长状态
      return {
        ...state,
        parent: action.payload
      };
    default:
      return state;
  }
};

export const KidsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(kidsReducer, initialState);
  const { isAuthenticated } = useAuth(); // 使用 useAuth 获取登录状态


  // 用于请求孩子数据的useEffect
  useEffect(() => {
    const fetchKids = async () => {
      try {
        const response = await axios.post('/api/user/getChildren');
        const data = await response.data;
        if (data) {  // 根据返回结构调整
          if (data.length > 0) {
            dispatch({ type: 'SET_PARENT', payload: true });
            dispatch({ type: 'SET_KIDS', payload: data});
            dispatch({ type: 'SWITCH_KID', payload: data[0].user_id}); // 设置当前孩子
          } else {
            // 非家长账号
            const response = await axios.post('/api/user/info');
            const data = await response.data.user;
            if (data) {
              dispatch({ type: 'SET_PARENT', payload: false });
              dispatch({ type: 'SET_KIDS', payload: [data]});
              dispatch({ type: 'SWITCH_KID', payload: data.user_id}); // 设置当前孩子
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch kids:", error);  // 可选的错误处理
      }
    };

    if (isAuthenticated) { // 仅在用户登录时请求孩子数据
      fetchKids();
    }
  }, [isAuthenticated]);  // 这个effect只在组件挂载时运行一次

  return (
      <KidsContext.Provider value={{ state, dispatch }}>
        {children}
      </KidsContext.Provider>
  );
};

export const useKids = () => {
  const context = useContext(KidsContext);
  if (!context) {
    throw new Error('useKids must be used within a KidsProvider');
  }
  return context;
};
