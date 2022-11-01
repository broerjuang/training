import { render } from '@testing-library/react';

import MachinesTodos from './machines-todos';

describe('MachinesTodos', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MachinesTodos />);
    expect(baseElement).toBeTruthy();
  });
});
