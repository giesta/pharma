import React from 'react';
import NestedList from '../../components/treatments/nested-list.component';
import {render, cleanup, screen} from '@testing-library/react';

afterEach(cleanup)


const InitialTreatments = [
  {
    label: "Gelezis",
    children: [
      {
        label: "Stiprumas",
        children: [
          {
            label: "Forma",
            children: [
            {
              label: "drug",
              drug: 
                  {
                    link: "http://localhost:8443/ImportantDoc.pdf",
                    label: "Important.pdf"
                  }
              },
            ]
          },
        ]
      },
    ]

  },
];


it('Treatments nested list rendering', () => {

    render(<><NestedList nodes={InitialTreatments}></NestedList></>);

    expect(screen.getByText('Gelezis')).toBeInTheDocument();
 })