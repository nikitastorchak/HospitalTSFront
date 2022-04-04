import React from 'react';
import axios from 'axios';

interface IList {
  _id?: string,
  user_id?:string,
  fio?: string,
  doctor?:string,
  date?:string,
  complaint?:string,
}

interface ModalDeleteProps {
  modalActive:boolean,
  setModalActive: (param:boolean) => void,
  setList: (arr:IList[]) => void,
  idx:string,
  list:IList[]
}

const ModalDelete: React.FC<ModalDeleteProps> = ({modalActive, setModalActive, setList, idx, list} ) => {


  

  const onDelClicked = async (id:string) => {
    await axios.delete(`http://localhost:8000/delete?_id=${id}`).then(res => {
      const deletedList:IList[] = list.filter((element:IList) => element._id !== id);
      setList(deletedList);
    });
  };

  return (
    <div className={modalActive ? 'modalWrap active' : 'modalWrap'} onClick={() => setModalActive(false)}>
      <div className={modalActive ? 'modal active' : 'modal'} onClick={(e: React.MouseEvent<HTMLDivElement>): void => e.stopPropagation()}>
        <div className='modalHeader'>
          <p>Удалить прием</p>
        </div>
        <div className='modalBody'>
          <p>Вы действительно хотите удалить прием?</p>
        </div>
        <div className='modalFooter'>
          <button onClick={() => setModalActive(false)} >Cancel</button>
          <button onClick={() => { onDelClicked(idx); setModalActive(false) }}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default ModalDelete;
