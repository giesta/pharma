import React, { useEffect } from 'react';
import MaterialTable from 'material-table';
import DrugsDataService from "../../services/drugs/list.service";

export default function MaterialTableDemo() {
  const [state, setState] = React.useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Substance', field: 'substance' },
      { title: 'Indication', field: 'indication' },
      { title: 'Contraindication', field: 'contraindication'},
      { title: 'Reactions', field: 'reactions'},
      { title: 'Use', field: 'use'},
    ],
    data: [ ],
  });
  useEffect(()=>{
        retrieveDrugs();
  }, []);
  const retrieveDrugs = () => {
    DrugsDataService.getAll()
      .then(response => {
        setState(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <MaterialTable
      title="Drugs"
      columns={state.columns}
      data={state.data}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
    />
  );
}