import React from 'react';
import UserTable from '../../components/users/table.component';
import {render,  cleanup, screen} from '@testing-library/react';

afterEach(cleanup)

const columns = [{  
    dataField: 'no',  
    text: 'Nr' },  
  {  
    dataField: 'name',  
    text: 'Vardas',  
    sort:true}, {  
    dataField: 'email',  
    text: 'El. paštas',  
    sort: true  },   
    {
        text: 'Veiksmai',
        dataField: 'Actions',
        editable: false 
     } 
];
const users = [
    {
        name: 'shiler',
        email: 'a@a.com',
    },
    {
        name: 'mark',
        email: 'm@a.com',
    },

]

const GetActionFormat = (row) =>{};

it('Users table rendering', () => {

    render(<><UserTable columns ={columns} users = {users} GetActionFormat={GetActionFormat}/></>);

    expect(screen.getByText('El. paštas')).toBeInTheDocument();
    expect(screen.getByText('Vardas')).toBeInTheDocument();
    expect(screen.getByText('Nr')).toBeInTheDocument();
    expect(screen.getByText('shiler')).toBeInTheDocument();
    expect(screen.getByText('a@a.com')).toBeInTheDocument();
    expect(screen.getByText('mark')).toBeInTheDocument();
    expect(screen.getByText('m@a.com')).toBeInTheDocument();
 })