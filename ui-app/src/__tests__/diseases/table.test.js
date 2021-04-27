import React from 'react';
import DiseaseTable from '../../components/diseases/table.component';
import {render, cleanup, screen} from '@testing-library/react';

afterEach(cleanup)

const columns = [{  
    dataField: 'no',  
    text: 'Nr' },  
  {  
    dataField: 'name',  
    text: 'Pavadinimas',  
    sort:true}, {  
    dataField: 'description',  
    text: 'Aprašymas',  
    sort: true  },  
  { dataField: 'symptoms',  
    text: 'Simptomai',  
    sort: true  },  
  {
    text: 'Veiksmai',
    dataField: 'Actions',
    editable: false 
  }];
const diseases = [
    {
        name: 'Alergija',
        description: 'padidejes jautrumas',
        symptoms: []
    },
    {
        name: 'Galvos skausmas',
        description: 'padidejes skausmas',
        symptoms: []
    },

]

const GetActionFormat = (row) =>{};

it('Diseases table rendering', () => {

    render(<><DiseaseTable columns ={columns} diseases = {diseases} GetActionFormat={GetActionFormat}/></>);

    expect(screen.getByText('Pavadinimas')).toBeInTheDocument();
    expect(screen.getByText('Aprašymas')).toBeInTheDocument();
    expect(screen.getByText('Simptomai')).toBeInTheDocument();
    expect(screen.getByText('Galvos skausmas')).toBeInTheDocument();
    expect(screen.getByText('Alergija')).toBeInTheDocument();
    expect(screen.getByText('padidejes jautrumas')).toBeInTheDocument();
    expect(screen.getByText('padidejes skausmas')).toBeInTheDocument();
 })