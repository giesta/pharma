import React from 'react';
import DiagramTable from '../../components/diagrams/table.component';
import {render, cleanup, screen} from '@testing-library/react';

afterEach(cleanup)

const columns = [{  
  dataField: 'no',  
  text: 'Nr' },  
{  
    dataField: 'name',  
    text: 'Pavadinimas',  
    sort:true}, 
  {  
    dataField: 'created_at',  
    text: 'Sukurta',  
    sort: true  }, 
  {  
    dataField: 'updated_at',  
    text: 'Atnaujinta',  
    sort: true  },  
  {
      text: 'Veiksmai',
      dataField: 'Actions',
      editable: false 
   } 
];
const diagrams = [
    {
        name: 'Alergija',
        created_at: '2015-05-12T14:48:00.000Z',
        updated_at: '2015-12-12T14:48:00.000Z',
    },
    {
      name: 'Skausmas',
      created_at: '2015-05-08T14:48:00.000Z',
      updated_at: '2015-12-18T14:48:00.000Z',
    },

]

const GetActionFormat = (row) =>{};

it('Diagrams table rendering', () => {

    render(<><DiagramTable columns ={columns} diagrams = {diagrams} GetActionFormat={GetActionFormat}/></>);

    expect(screen.getByText('Pavadinimas')).toBeInTheDocument();
    expect(screen.getByText('Sukurta')).toBeInTheDocument();
    expect(screen.getByText('Atnaujinta')).toBeInTheDocument();
    expect(screen.getByText('Skausmas')).toBeInTheDocument();
    expect(screen.getByText('Alergija')).toBeInTheDocument();
    expect(screen.getByText('2015-05-08 17:48')).toBeInTheDocument();
    expect(screen.getByText('2015-12-18 16:48')).toBeInTheDocument();
 })