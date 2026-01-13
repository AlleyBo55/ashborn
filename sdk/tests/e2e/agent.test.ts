/**
 * Agent Integration E2E Tests
 *
 * Tests: Natural language commands, Eliza plugin actions
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { NaturalLanguageAshborn, NaturalLanguageParser } from "../../src/nlp";

// Mock OpenAI API
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("E2E: Agent Integration", () => {
  let nlAshborn: NaturalLanguageAshborn;
  let parser: NaturalLanguageParser;

  beforeEach(() => {
    vi.clearAllMocks();
    nlAshborn = new NaturalLanguageAshborn();
    parser = new NaturalLanguageParser();
  });

  describe("Natural Language Commands", () => {
    describe("Shield Commands", () => {
      it('should handle "shield 1 SOL"', async () => {
        const response = await nlAshborn.execute("shield 1 SOL");

        expect(response).toContain("Shielding");
        expect(response).toContain("$200");
      });

      it('should handle "hide $500"', async () => {
        const response = await nlAshborn.execute("hide $500");

        expect(response).toContain("$500");
      });

      it('should handle "protect my funds"', async () => {
        const intent = await parser.parse("protect my funds");

        expect(intent.action).toBe("shield");
      });
    });

    describe("Send Commands", () => {
      it('should handle "send $100 to @alice"', async () => {
        const response = await nlAshborn.execute("send $100 to @alice");

        expect(response).toContain("$100");
        expect(response).toContain("@alice");
      });

      it('should handle "pay @mom $50 privately"', async () => {
        const intent = await parser.parse("pay @mom $50 privately");

        expect(intent.action).toBe("send");
        expect(intent.amountUsd).toBe(50);
        expect(intent.recipient).toBe("@mom");
      });

      it('should handle "transfer 0.5 SOL to friend.sol"', async () => {
        const intent = await parser.parse("transfer 0.5 SOL to friend.sol");

        expect(intent.action).toBe("send");
        expect(intent.amountUsd).toBe(100); // 0.5 * $200
      });
    });

    describe("Prove Commands", () => {
      it('should handle "prove balance under $10k"', async () => {
        const response = await nlAshborn.execute(
          "prove my balance is under $10000",
        );

        expect(response).toContain("proof");
        expect(response).toContain("$10,000");
      });

      it('should handle "prove balance over $1000"', async () => {
        const intent = await parser.parse("prove balance over $1000");

        expect(intent.action).toBe("prove");
        expect(intent.rangeMin).toBe(1000n);
      });

      it('should handle "prove balance between $5k and $50k"', async () => {
        const intent = await parser.parse(
          "prove balance between $5000 and $50000",
        );

        expect(intent.action).toBe("prove");
        expect(intent.rangeMin).toBe(5000n);
        expect(intent.rangeMax).toBe(50000n);
      });
    });

    describe("Balance Commands", () => {
      it('should handle "what\'s my balance"', async () => {
        const response = await nlAshborn.execute("what's my balance");

        expect(response).toContain("Balance");
      });

      it('should handle "how much do I have"', async () => {
        const intent = await parser.parse("how much do I have");

        expect(intent.action).toBe("balance");
      });
    });

    describe("Unshield Commands", () => {
      it('should handle "unshield 1 SOL"', async () => {
        const response = await nlAshborn.execute("unshield 1 SOL");

        expect(response).toContain("Unshielding");
      });

      it('should handle "withdraw my funds"', async () => {
        const intent = await parser.parse("withdraw my funds");

        expect(intent.action).toBe("unshield");
      });
    });

    describe("Help Commands", () => {
      it('should handle "help"', async () => {
        const response = await nlAshborn.execute("help");

        expect(response).toContain("shield");
        expect(response).toContain("send");
        expect(response).toContain("prove");
      });
    });

    describe("Unknown Commands", () => {
      it("should handle gibberish gracefully", async () => {
        const response = await nlAshborn.execute("foobar unknown command");

        expect(response).toContain("Ashborn Commands");
      });
    });
  });

  describe("Conversational Flow", () => {
    it("should handle multi-step conversation", async () => {
      // Step 1: Check balance
      const balance = await nlAshborn.execute("check balance");
      expect(balance).toContain("Balance");

      // Step 2: Shield more
      const shield = await nlAshborn.execute("shield 2 SOL");
      expect(shield).toContain("Shielding");

      // Step 3: Send to friend
      const send = await nlAshborn.execute("send $50 to @alice");
      expect(send).toContain("Sending");

      // Step 4: Check balance again
      const finalBalance = await nlAshborn.execute("check balance");
      expect(finalBalance).toContain("Balance");
    });
  });

  describe("Error Handling", () => {
    it("should handle ambiguous commands", async () => {
      const intent = await parser.parse("do something");

      expect(intent.action).toBe("unknown");
      expect(intent.confidence).toBeLessThan(0.5);
    });

    it("should handle missing amounts", async () => {
      const intent = await parser.parse("send to alice");

      // Should still parse recipient
      expect(intent.recipient).toContain("alice");
    });
  });

  describe("Amount Parsing", () => {
    it("should convert SOL to USD", async () => {
      const intent = await parser.parse("shield 5 SOL");

      expect(intent.amountUsd).toBe(1000); // 5 * $200
    });

    it("should handle USD directly", async () => {
      const intent = await parser.parse("shield $1000");

      expect(intent.amountUsd).toBe(1000);
    });

    it("should handle decimal amounts", async () => {
      const intent = await parser.parse("shield 0.5 SOL");

      expect(intent.amountUsd).toBe(100); // 0.5 * $200
    });
  });
});
