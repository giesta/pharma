import React from 'react';
import TreatmentCard from '../../components/treatments/treatment-card.component';
import {render, cleanup, screen} from '@testing-library/react';

afterEach(cleanup)


const InitialTreatment = {
        data:[
        {
            title: 'Alergijos gydymas',
            description: 'alergine reakcija',
            disease: {
                name: 'Alergija',
            },
            public: "1",
            created: "2015-12-12",
            updated: "2015-12-14",
            comments: [],
        }
    ]
}


it('Treatments card rendering', () => {

    render(<><TreatmentCard Treatments = {InitialTreatment.data}></TreatmentCard></>);
    expect(screen.getByText('Alergijos gydymas')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Sukurta: 2015-12-12')).toBeInTheDocument();
    expect(screen.getByText('Atnaujinta: 2015-12-14')).toBeInTheDocument();
 })