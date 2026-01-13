/**
 * Natural Language Parser Unit Tests
 *
 * Tests: Intent parsing, rule-based parsing, amount conversion
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NaturalLanguageParser, NaturalLanguageAshborn } from "@/nlp";

// Mock fetch for OpenAI API
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Natural Language Parser", () => {
  let parser: NaturalLanguageParser;

  beforeEach(() => {
    vi.clearAllMocks();
    // Parser without API key uses rule-based parsing only
    parser = new NaturalLanguageParser();
  });

  describe("Rule-based Parsing", () => {
    describe("Shield Commands", () => {
      it('should parse "shield X SOL"', async () => {
        const result = await parser.parse("shield 1 SOL");

        expect(result.action).toBe("shield");
        expect(result.amountUsd).toBe(200); // 1 SOL * $200
        expect(result.confidence).toBeGreaterThan(0.9);
      });

      it('should parse "shield $X"', async () => {
        const result = await parser.parse("shield $500");

        expect(result.action).toBe("shield");
        expect(result.amountUsd).toBe(500);
      });

      it('should parse "hide X USD"', async () => {
        const result = await parser.parse("hide 1000 usd");

        expect(result.action).toBe("shield");
        expect(result.amountUsd).toBe(1000);
      });

      it('should parse "protect my funds"', async () => {
        const result = await parser.parse("protect my funds");

        expect(result.action).toBe("shield");
      });
    });

    describe("Send Commands", () => {
      it('should parse "send X SOL to recipient"', async () => {
        const result = await parser.parse("send 0.5 SOL to @alice");

        expect(result.action).toBe("send");
        expect(result.amountUsd).toBe(100); // 0.5 SOL * $200
        expect(result.recipient).toBe("@alice");
      });

      it('should parse "send $X to recipient privately"', async () => {
        const result = await parser.parse("send $100 to mom privately");

        expect(result.action).toBe("send");
        expect(result.amountUsd).toBe(100);
        expect(result.recipient).toBe("mom");
      });

      it('should parse "pay recipient $X"', async () => {
        const result = await parser.parse("pay @bob $50");

        expect(result.action).toBe("send");
        expect(result.amountUsd).toBe(50);
      });

      it('should parse "transfer X to address"', async () => {
        const result = await parser.parse("transfer 2 SOL to friend.sol");

        expect(result.action).toBe("send");
        expect(result.recipient).toContain("friend");
      });
    });

    describe("Prove Commands", () => {
      it('should parse "prove balance under $X"', async () => {
        const result = await parser.parse("prove my balance is under $10000");

        expect(result.action).toBe("prove");
        expect(result.proofType).toBe("range");
        expect(result.rangeMax).toBe(10000n);
      });

      it('should parse "prove balance over $X"', async () => {
        const result = await parser.parse("prove balance over $1000");

        expect(result.action).toBe("prove");
        expect(result.rangeMin).toBe(1000n);
      });

      it('should parse "prove balance between $X and $Y"', async () => {
        const result = await parser.parse(
          "prove balance between $1000 and $50000",
        );

        expect(result.action).toBe("prove");
        expect(result.rangeMin).toBe(1000n);
        expect(result.rangeMax).toBe(50000n);
      });

      it("should handle comma-separated numbers", async () => {
        const result = await parser.parse("prove balance under $10,000");

        expect(result.rangeMax).toBe(10000n);
      });
    });

    describe("Balance Commands", () => {
      it('should parse "what\'s my balance"', async () => {
        const result = await parser.parse("what's my balance");

        expect(result.action).toBe("balance");
      });

      it('should parse "how much do I have"', async () => {
        const result = await parser.parse("how much do I have");

        expect(result.action).toBe("balance");
      });
    });

    describe("Unshield Commands", () => {
      it('should parse "unshield X SOL"', async () => {
        const result = await parser.parse("unshield 1 SOL");

        expect(result.action).toBe("unshield");
        expect(result.amountUsd).toBe(200);
      });

      it('should parse "withdraw"', async () => {
        const result = await parser.parse("withdraw my funds");

        expect(result.action).toBe("unshield");
      });
    });

    describe("Help Commands", () => {
      it('should parse "help"', async () => {
        const result = await parser.parse("help");

        expect(result.action).toBe("help");
      });

      it('should parse "what commands"', async () => {
        const result = await parser.parse("what commands can I use");

        expect(result.action).toBe("help");
      });
    });

    describe("Unknown Commands", () => {
      it("should return unknown for gibberish", async () => {
        const result = await parser.parse("asdfghjkl");

        expect(result.action).toBe("unknown");
        expect(result.confidence).toBeLessThan(0.5);
      });
    });
  });

  describe("LLM-based Parsing", () => {
    it("should call OpenAI API when key is provided", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    action: "send",
                    amountUsd: 100,
                    recipient: "@alice",
                    confidence: 0.95,
                  }),
                },
              },
            ],
          }),
      });

      const parserWithKey = new NaturalLanguageParser({
        apiKey: "sk-test-key",
      });

      const result = await parserWithKey.parse(
        "send one hundred dollars to alice",
      );

      expect(mockFetch).toHaveBeenCalled();
      expect(result.action).toBe("send");
      expect(result.amountUsd).toBe(100);
    });

    it("should fallback to rules on API error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("API Error"));

      const parserWithKey = new NaturalLanguageParser({
        apiKey: "sk-test-key",
      });

      const result = await parserWithKey.parse("shield 1 SOL");

      // Should still parse via rules
      expect(result.action).toBe("shield");
    });
  });
});

describe("Natural Language Ashborn", () => {
  let nlAshborn: NaturalLanguageAshborn;

  beforeEach(() => {
    nlAshborn = new NaturalLanguageAshborn();
  });

  describe("Execute Commands", () => {
    it("should format shield response", async () => {
      const response = await nlAshborn.execute("shield $200");

      expect(response).toContain("Shielding");
      expect(response).toContain("$200");
    });

    it("should format send response", async () => {
      const response = await nlAshborn.execute("send $50 to @mom");

      expect(response).toContain("Sending");
      expect(response).toContain("@mom");
    });

    it("should format prove response", async () => {
      const response = await nlAshborn.execute("prove balance under $10k");

      expect(response).toContain("proof");
      expect(response).toContain("$10,000");
    });

    it("should format balance response", async () => {
      const response = await nlAshborn.execute("what's my balance");

      expect(response).toContain("Balance");
    });

    it("should provide help message", async () => {
      const response = await nlAshborn.execute("help");

      expect(response).toContain("shield");
      expect(response).toContain("send");
      expect(response).toContain("prove");
    });

    it("should handle unknown commands gracefully", async () => {
      const response = await nlAshborn.execute("foobar");

      expect(response).toContain("I'm not sure what you meant");
      expect(response).toContain("Options");
    });
  });
});
