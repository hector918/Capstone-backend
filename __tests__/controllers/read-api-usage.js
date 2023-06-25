// Assuming your Express application is exported from a file named 'app.js'
const request = require('supertest');
const app = require('./app'); // adjust this to your actual file path
const { read_api_usage } = require('../queries/api-usage');

jest.mock('../queries/api-usage');

describe('GET /', () => {
  it('responds with JSON data from read_api_usage', async () => {
    const mockData = [{ timestamp: '2023-06-25', user_input: 'test', caller: 'caller', url: 'url', json: '{}', req_usage: 1, ip_address: '127.0.0.1' }];
    read_api_usage.mockResolvedValue(mockData);

    const response = await request(app).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  it('properly parses start and limit parameters', async () => {
    const start = 10;
    const limit = 100;

    await request(app).get('/').query({ start, limit });

    expect(read_api_usage).toHaveBeenCalledWith(start, limit);
  });

  it('returns an error if read_api_usage fails', async () => {
    read_api_usage.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/');

    expect(response.statusCode).toBe(500);
    // check if the error message is in the response, for instance:
    expect(response.text).toMatch('Database error');
  });
});
