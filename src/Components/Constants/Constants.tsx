import React from 'react';

const ModalDelete: React.FC = ({}) => {
  const doctors =
  [
    {
      doctor: 'Доктор Ливси'
    },
    {
      doctor: 'Доктор Стрэндж'
    },
    {
      doctor: 'Убийца садовник'
    }
  ]

  return (
    <>
    {
    doctors.map(element => {
      return (
        <option>{element.doctor}</option>
      )
    })
    }
    </>
  )
}

export default ModalDelete;
