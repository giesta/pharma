import React from 'react';
import UserList from '../../components/users/users-list.component';
import {render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const users = [
    {
        name: 'shiler',
        email: 'a@a.com',
    },
    {
        name: 'mark',
        email: 'm@a.com',
    },

];

const server = setupServer(
    rest.get('/api/users/list?page=1&name=', (req, res, ctx) => {
        if (req.url.searchParams.get('page') === '1') {
            return res(ctx.json({ data: users }));
          }
      return res(ctx.json({ data: users }));
    })
  );
  
  beforeAll(() => server.listen());
  afterAll(() => server.close());




test('Users list from internets', async () => {
    render(<UserList />);
    
    //const tableItems = await screen.getByText('Loading...'); 
    //expect(tableItems[0]).toHaveTextContent('mark');
  });

