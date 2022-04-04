import React, {  } from 'react';
import axios from 'axios';
import moment from 'moment';
import Constants from '../Constants/Constants';

interface IList {
  _id?: string,
  user_id?:string,
  fio?: string,
  doctor?:string,
  date?:string,
  complaint?:string,
}

interface ModalEditProps {
  modalEditActive:boolean,
  setModalEditActive: (param:boolean) => void,
  setList: (arr:IList[]) => void,
  idx:string,
  setAppoint: (param:IList) => void,
  appoint:IList
}


const ModalEdit: React.FC<ModalEditProps> = ({ modalEditActive, setModalEditActive, setList, idx, setAppoint, appoint}) => {
  console.log('FFFFFFFFFF',appoint)
  console.log('DATE', appoint.date?.slice(1, 10))
  const onEditClicked = async (_id:string, appoint:IList) => {
    
    await axios.patch('http://localhost:8000/update', {
      token: localStorage.getItem('token'),
      _id: idx,
      fio: appoint.fio,
      doctor: appoint.doctor,
      date: appoint.date,
      complaint: appoint.complaint,
    }).then(res => {
      setList(res.data);
    });
    setAppoint({
      fio: '', 
      doctor: '', 
      date: '', 
      complaint: '', 
    });
  };

  const buildAppoint = (value:string, type:string) => {
    setAppoint({...appoint, [type]: value});
  
  };

  return (
    <div className={modalEditActive ? 'modalWrap active' : 'modalWrap'} onClick={() => setModalEditActive(false)}>
      <div className={modalEditActive ? 'modal active' : 'modal'} onClick={e => e.stopPropagation()}>
        <div className='modalHeader'>
          <p>Изменить прием</p>
        </div>
        <div className='modalEditBody'>
          <label>Имя:</label>
          <input type='text' value={appoint.fio} onChange={(e) => buildAppoint(e.target.value, 'fio')} />
          <label>Врач:</label>
          <select value={appoint.doctor} onChange={(e) => buildAppoint(e.target.value, 'doctor')}>
            <option ></option>
            <Constants/>
          </select>
          <label>Дата:</label>
          
          <input type='date' value={appoint.date?.slice(0, 10)} onChange={(e) => buildAppoint(e.target.value, 'date')} />
          <label>Жалобы:</label>
          <textarea value={appoint.complaint} onChange={(e) => buildAppoint(e.target.value, 'complaint')}></textarea>
        </div>
        <div className='modalFooter'>
          <button onClick={() => setModalEditActive(false)} >Cancel</button>
          <button onClick={() => { onEditClicked(idx, appoint); setModalEditActive(false) }}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default ModalEdit;