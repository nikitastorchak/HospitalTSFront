import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Context } from '../../index';
import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Header from '../../Parts/Header/Header';
import UnderHeader from '../../Parts/UnderHeader/UnderHeader';
import Body from '../../Parts/Body/Body';
import Table from '../../Parts/Table/Table';
import ModalDelete from '../ModalDelete/ModalDelete'
import UserService from "../../service/UserService";
import ModalEdit from '../ModalEdit/ModalEdit';
import Constants from '../Constants/Constants';
import '../../css/SnackBar.scss';

interface IList {
  token?: string,
  user_id?:string,
  fio?: string,
  doctor?:string,
  date?:string,
  complaint?:string,
}
interface IRes {
  data:IList[]
}
interface ISort {
  [key: string]: string
}



const Appointment: React.FC = () => {
  
  const [appoint, setAppoint] = useState<(IList )>(
    {
      fio: '',
      doctor:'',
      date:'',
      complaint:'',
    }
  );
  const [list, setList] = useState<(IList[] | any)>([]);
  const { store } = useContext(Context);
  const [modalActive, setModalActive] = useState(false);
  const [modalEditActive, setModalEditActive] = useState(false);
  const [idx, setIdx] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState<string | null>();
  const [sortWay, setSortWay] = useState<string | null>();
  const [filterActive, setFilterActive] = useState(false);
  const url = 'http://localhost:8000';
  const navigate = useNavigate();
  const [snackOpen, setSnackOpen] = useState(false);
  const Alert:any = React.forwardRef(function Alert(props, ref:any) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const buildAppoint = (value: string, type: string) => {
    console.log('APPOINYT',appoint)
    setAppoint({...appoint, [type]: value});
  };

  const handleClose = () => {
    setSnackOpen(false);
  };

  const getAllTasks = async ():Promise<void> => {
    const response:IRes = await UserService.ActionGetAppointments();
    setList(response.data);
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/signin')
    getAllTasks()
  }, []);

  const updateList = async () => {
    await axios.get(`${url}/show?token=${localStorage.getItem('token')}`).then(res => {
      setList(res.data);
    });
  };

  const sortList:any[] = (list.sort((a: any, b: any): number | any => {
    if (!sortField || !sortWay) {
      return 0;
    };
    if (sortWay === 'asc') {
      if (sortField) {
        if (a[sortField] === b[sortField]) return 0;
        return a[sortField] > b[sortField] ? 1 : -1;
      };
    } else {
      if (a[sortField] === b[sortField]) return 0;
      return a[sortField] > b[sortField] ? -1 : 1;
    };
  }))

  const filteredArray:IList[] = [...sortList];
  const filterFunction = (arr:IList[]) => {
    if (filterActive) {
      if (dateTo && dateFrom) {
        arr = _.filter(filteredArray, (item) =>
          moment(item.date).isBetween(dateFrom, dateTo, 'date', '[]')
        );
      } else if (dateFrom) {
        arr = _.filter(filteredArray, (item) => moment(item.date).isAfter(dateFrom));
      } else if (dateTo) {
        arr = _.filter(filteredArray, (item) => moment(item.date).isBefore(dateTo));
      };
      return arr;
    } else {
      arr = sortList;
      setList(arr);
    };
    return arr;
  };

  const addAppointment = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(appoint)
    if (appoint.fio && appoint.doctor && appoint.date && appoint.complaint) {
      await axios.post(`${url}/add`, {
        token: localStorage.getItem('token'),
        
        fio: appoint.fio,
        doctor: appoint.doctor,
        date: appoint.date,
        complaint: appoint.complaint
      }).then(res => {
        const newList = [...list]
        newList.push(res.data)
        setList(newList)
      });
      setAppoint({
        fio: '',
        doctor: '',
        date: '',
        complaint: '',
      });
    } else {
      setSnackOpen(true);
    };
  };

  return (
    <>
      <Header>
        <div className="flexWrap">
          <p>Приемы</p>
          <button onClick={() => store.logout()}>Выход</button>
        </div>
      </Header>
      <UnderHeader>
        <div className='inputWrap'>
          <label>Имя:</label>
          <input type='fio' name='fio' value={appoint.fio} placeholder='ФИО' onChange={(e: React.ChangeEvent<HTMLInputElement>): void => buildAppoint(e.target.value, 'fio')} />
        </div>
        <div className='inputWrap'>
          <label>Врач:</label>
          <select name='doctor' value={appoint.doctor} onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => buildAppoint(e.target.value, 'doctor')}>
            <option></option>
            <Constants />
          </select>
        </div>
        <div className='inputWrap'>
          <label>Дата:</label>
          <input type='date' name='date' value={appoint.date} placeholder='Дата' onChange={(e: React.ChangeEvent<HTMLInputElement>): void => buildAppoint(e.target.value, 'date')} />
        </div>
        <div className='inputWrap'>
          <label>Жалобы:</label>
          <input type='complaint' name='complaint' value={appoint.complaint} placeholder='Жалобы' onChange={(e: ChangeEvent<HTMLInputElement>): void => buildAppoint(e.target.value, 'complaint')} />
        </div>
        <button type='submit' onClick={addAppointment} >Добавить</button>
        <div>
          <Snackbar
            open={snackOpen}
            onClose={handleClose}
          >
            <Alert severity="error">Вы ввели не все поля!</Alert>
          </Snackbar>
        </div>

      </UnderHeader>
      <Body>
        <div className="wrapper wrapperAppoints">
          <div className='sortWrap'>
            <label>Сортировать по:</label>
            <select onChange={(e) => setSortField(e.target.value)}>
              <option></option>
              <option value={'fio'}>ФИО</option>
              <option value={'doctor'}>Врач</option>
              <option value={'date'}>Дата</option>
            </select>
            {
              sortField ?
                <>
                  <label>Направление:</label>
                  <select onChange={(e) => setSortWay(e.target.value)}>
                  <option></option>
                    <option value={'asc'} >По возрастанию</option>
                    <option value={'dec'}>По убыванию</option>
                  </select>
                </> : ''
            }
            {!filterActive ?
              <>
                <label>Добавить фильтр по дате:</label>
                <svg onClick={() => setFilterActive(!filterActive)} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26.6667 0H3.33333C1.48333 0 0 1.5 0 3.33333V26.6667C0 28.5 1.48333 30 3.33333 30H26.6667C28.5 30 30 28.5 30 26.6667V3.33333C30 1.5 28.5 0 26.6667 0ZM23.3333 16.6667H16.6667V23.3333H13.3333V16.6667H6.66667V13.3333H13.3333V6.66667H16.6667V13.3333H23.3333V16.6667Z" fill="black" fill-opacity="0.8" />
                </svg>
              </> : ''
            }
          </div>
          <div >
            {filterActive && (
              <div className="filterWrap">
                <div>
                  <label>с:</label>
                  <input placeholder='Login' type={'date'} onChange={(e) => setDateFrom(e.target.value)} />
                </div>
                <div>
                  <label>по:</label>
                  <input placeholder='Login' type={'date'} onChange={(e) => setDateTo(e.target.value)} />
                </div>
                <button onClick={() => {
                  setList(filterFunction(filteredArray));
                }}>Фильтровать</button>
                <svg onClick={() => { updateList(); setFilterActive(false) }} width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.00004 26.6667C2.00004 28.5 3.50004 30 5.33337 30H18.6667C20.5 30 22 28.5 22 26.6667V6.66667H2.00004V26.6667ZM5.33337 10H18.6667V26.6667H5.33337V10ZM17.8334 1.66667L16.1667 0H7.83337L6.16671 1.66667H0.333374V5H23.6667V1.66667H17.8334Z" fill="black" />
                </svg>
              </div>
            )}
          </div>
          <table>
            <thead>
              <tr>
                <td className='tableHead'>Имя</td>
                <td className='tableHead'>Врач</td>
                <td className='tableHead'>Дата</td>
                <td className='tableHead'>Жалобы</td>
                <td className='tableHead'></td>
              </tr>
            </thead>
            <tbody>
              <Table
                sortList={sortList}
                setModalEditActive={setModalEditActive}
                setModalActive={setModalActive}
                setIdx={setIdx}
                appoint={appoint}
                setAppoint={setAppoint}
              />
            </tbody>
          </table>
          <ModalEdit
            modalEditActive={modalEditActive}
            setModalEditActive={setModalEditActive}
            setList={setList}
            idx={idx}
            appoint={appoint}
            setAppoint={setAppoint}
          />
          <ModalDelete
            modalActive={modalActive}
            setModalActive={setModalActive}
            setList={setList}
            list={list}
            idx={idx}
          />
        </div>
      </Body>
    </>
  )
}

export default Appointment;