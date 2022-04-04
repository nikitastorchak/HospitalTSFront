import React from "react";
import './UnderHeader.scss';

const UnderHeader = ({children}) => {

  return (
    <div className='underHeaderWrap'>
      <div className='underHeader'>
        {children}
      </div>
    </div>
  )
}

export default UnderHeader;
