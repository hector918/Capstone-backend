global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};
// Assuming this is part of a module named 'apiUsage'
const { read_api_usage } = require('../../queries/api-usage');  
const db = require('../../queries/db-config'); // the module where your db object lives

jest.mock('../../queries/db-config'); // Mock the db module

describe('read_api_usage', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    db.any.mockClear();
  });

  it('calls db.any with correct SQL and parameters', async () => {
    const start = 0;
    const limit = 100;
    const display_fields = ['timestamp', 'user_input', 'caller', 'url', 'json', 'req_usage', 'ip_address'];
    const expectedSQL = `SELECT ${display_fields.join(',')} FROM api_usage ORDER BY timestamp DESC OFFSET $[start] LIMIT $[limit];`;
    const expectedParameters = { start, limit };
    
    await read_api_usage(start, limit);

    expect(db.any).toHaveBeenCalledTimes(1);
    expect(db.any).toHaveBeenCalledWith(expectedSQL, expectedParameters);
  });

  it('returns data from db.any', async () => {
    const mockData = [{ timestamp: '2023-06-25', user_input: 'test', caller: 'caller', url: 'url', json: '{}', req_usage: 1, ip_address: '127.0.0.1' }];
    db.any.mockResolvedValue(mockData);

    const data = await read_api_usage(0, 100);

    expect(data).toEqual(mockData);
  });

  it('handles database error and returns false', async () => {
    db.any.mockRejectedValue(new Error('Database error'));

    const data = await read_api_usage(0, 100);

    expect(data).toBe(false);
    expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // expects console.error to have been called with any Error object
  });
});
