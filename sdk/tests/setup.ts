import { vi } from "vitest";

// Mock snarkjs globally for unit tests to prevent worker threats
vi.mock("snarkjs", () => ({
  groth16: {
    fullProve: vi.fn(),
    verify: vi.fn(),
  },
}));
