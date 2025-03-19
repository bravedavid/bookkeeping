import React from 'react';
import { FaPiggyBank, FaCoins, FaStar } from 'react-icons/fa';
import './index.css';

const PiggyBank = ({ balance }) => {
  const isPositive = balance >= 0;
  const stars = Array(3).fill(null);

  return (
    <div className="piggy-bank-container">
        {/*<div className="coins">*/}
        {/*    {[...Array(3)].map((_, i) => (*/}
        {/*        <FaCoins*/}
        {/*            key={i}*/}
        {/*            className="coin"*/}
        {/*            style={{*/}
        {/*                animationDelay: `${i * 0.3}s`,*/}
        {/*                opacity: isPositive ? 1 : 0.3*/}
        {/*            }}*/}
        {/*        />*/}
        {/*    ))}*/}
        {/*</div>*/}
      <div className="stars">
        {stars.map((_, index) => (
          <FaStar key={index} className="star" style={{ animationDelay: `${index * 0.2}s` }} />
        ))}
      </div>

      <div className={`piggy-bank ${isPositive ? 'happy' : 'worried'}`}>
        <div className="piggy-icon">
            <div className="avatar-container">
                <img src="https://img.alicdn.com/imgextra/i2/O1CN013sYJMn1pX3WFdxGXS_!!6000000005369-0-tps-1809-2037.jpg" alt="头像" className="avatar" />
            </div>
          {/*<FaPiggyBank />*/}
        </div>
        <div className="balance-text">
          {/*<div className="balance-label">我的存钱罐</div>*/}
          <div className="balance-amount">
            <span className="currency">¥</span>
            <span className="amount">{Math.abs(balance).toFixed(2)}</span>
          </div>
          <div className="balance-message">
            {isPositive ? (
              balance > 100 ? '太棒了！继续加油！' : '不错哦，继续存钱吧！'
            ) : '要开源节流哦～'}
          </div>
        </div>
      </div>

      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="cloud cloud-3"></div>
    </div>
  );
};

export default PiggyBank;
