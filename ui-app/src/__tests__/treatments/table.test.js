import React from 'react';
import TreatmentTable from '../../components/treatments/table.component';
import {render, cleanup, screen} from '@testing-library/react';

afterEach(cleanup)

const columns = [{  
    dataField: '',  
    text: 'Nr' },  
  {  
    dataField: 'title',  
    text: 'Pavadinimas',  
    sort:true}, {  
    dataField: 'description',  
    text: 'Aprašymas',  
    sort: true  }, {  
    dataField: 'disease',  
    text: 'Liga',  
    sort: true  }, {  
    dataField: 'public',  
    text: 'Viešas',  
    sort: false  },   
    {
    text: 'Veiksmai',
    dataField: 'Actions',
    editable: false 
  }
];
const treatments = {
        data:[
        {
            title: 'Alergijos gydymas',
            description: 'alergine reakcija',
            disease: {
                name: 'Alergija',
            },
            public: "1",
        },
        {
            title: 'Skausmo gydymas',
            description: 'skausmas',
            disease: {
                name: 'Galvos skausmas',
            },
            public: "1",
        },

    ]
}


const GetActionFormat = (row) =>{};

it('Treatments table rendering', () => {

    render(<><TreatmentTable columns ={columns} Treatments = {treatments} GetActionFormat={GetActionFormat}/></>);

    expect(screen.getByText('Pavadinimas')).toBeInTheDocument();
    expect(screen.getByText('Aprašymas')).toBeInTheDocument();
    expect(screen.getByText('Liga')).toBeInTheDocument();
    expect(screen.getByText('Viešas')).toBeInTheDocument();
    expect(screen.getByText('Nr')).toBeInTheDocument();
    expect(screen.getByText('Alergijos gydymas')).toBeInTheDocument();
    expect(screen.getByText('alergine reakcija')).toBeInTheDocument();
    expect(screen.getByText('Skausmo gydymas')).toBeInTheDocument();
    expect(screen.getByText('skausmas')).toBeInTheDocument();
 })