import React from 'react';
import BigRoundButton from './BigRoundButton';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BigRoundButton />
  </QueryClientProvider>
);

export default App;
