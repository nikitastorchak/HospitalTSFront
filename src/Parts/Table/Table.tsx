import React, { useState } from 'react';
import moment from 'moment';
import './Table.scss';
import del from '../../del.svg'
import edit from '../../edit.svg'

interface IList {
  _id?:string | any,
  user_id?:string | any,
  fio?: string | any,
  doctor?:string | any,
  date?:string | any,
  complaint?:string | any,
}

interface ITable {
  sortList: IList[],
  setModalEditActive: (a:boolean) => void,
  setModalActive: (a:boolean) => void,
  setIdx: (a:string) => void,
  setAppoint: (a:IList) => void,
  appoint: IList,
}

const Table: React.FC<ITable> = ({ sortList, setModalEditActive, setModalActive, setIdx, setAppoint, appoint }) => {
    

  const buildAppoint = (item:IList, ) => {
    setAppoint(item)
  };
  console.log(sortList)

  return (
    <>
      {
        sortList.map((item, index) => (
          
          
          <>
            <tr className='tableBodyWrap' key={index}>
              <td className='tableBody fio'>{item.fio}</td>
              <td className='tableBody doctor'>{item.doctor}</td>
              <td className='tableBody date'>{moment(item.date).format('L').split('/').join('.')}</td>
              <td className='tableBody complaint'>{item.complaint}</td>
              <td className='tableBody svgs'>
                <div className='svgWrap'>
                  <img onClick={() => { setModalActive(true);console.log('SORTR', sortList);console.log('IDDDD', item._id); setIdx(item._id) }} src={del} />
                  <img onClick={() => {
                    console.log('IDDDD', item._id)
                    setIdx(item._id);
                    buildAppoint(item)
                 
                    setModalEditActive(true);
                  }} src={edit} />
                </div>
              </td>
            </tr>
          </>
        ))
      }
    </>
  )
}

export default Table;