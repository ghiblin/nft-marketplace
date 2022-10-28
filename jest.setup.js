import "@testing-library/jest-dom/extend-expect";
import { server } from "./mocks/server";

// Setting up MSW for mocking request API
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
