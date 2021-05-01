import React from 'react';
import DrugsTable from '../../components/drugs/table.component';
import {render, cleanup, screen} from '@testing-library/react';

afterEach(cleanup)

const columns = [{  
    dataField: 'no',  
    text: 'Nr' },  
  {  
    dataField: 'name',  
    text: 'Pavadinimas',  
    sort:true}, {  
    dataField: 'substance',  
    text: 'Veiklioji',  
    sort: true  },  
  { dataField: 'ATC',  
    text: 'ATC',  
    sort: true  },  
  { dataField: 'strength',  
    text: 'Stiprumas',  
    sort: true },  
  {  
    dataField: 'form',  
    text: 'Forma',  
    sort: true  
  }, {  
    dataField: 'package',  
    text: 'Pakuotė',  
    sort: true },
 {
    text: 'Veiksmai',
    dataField: 'Actions',
    editable: false 
 }];
const drugs = [
    {
        id: 1,  
        name: "prospan",
        substance: "Gebenes",
        ATC:"121212a",
        strength:"20mg",
        form:"tabletes",
        package:"lapelis",
        package_description:"N10",
        registration:"Registruotas",
    },
    {
        id: 2,  
        name: "hedelix",
        substance: "Gebeniu ekstraktas",
        ATC:"121212a",
        strength:"25mg",
        form:"tabletes",
        package:"lapelis",
        package_description:"N10",
        registration:"Registruotas",
    },
]

const GetActionFormat = (row) =>{};

it('Drugs table rendering', () => {

    render(<><DrugsTable columns ={columns} drugs = {drugs} GetActionFormat={GetActionFormat}/></>);

    expect(screen.getByText('Pavadinimas')).toBeInTheDocument();
    expect(screen.getByText('ATC')).toBeInTheDocument();
    expect(screen.getByText('Forma')).toBeInTheDocument();
    expect(screen.getByText('Pakuotė')).toBeInTheDocument();
    expect(screen.getByText('prospan')).toBeInTheDocument();
    expect(screen.getByText('Gebenes')).toBeInTheDocument();
    expect(screen.getByText('20mg')).toBeInTheDocument();
 })