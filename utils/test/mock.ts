export const getLastMockParams = (mock: jest.Mock) =>
  mock.mock.calls.slice(-1)[0][0]
