/**
 * Eliza Plugin Unit Tests
 *
 * Tests: Action validation, handlers, evaluators
 */

import { describe, it, expect, vi } from "vitest";
import ashbornPlugin from "../src/index";

describe("Ashborn Eliza Plugin", () => {
  describe("Plugin Structure", () => {
    it("should have correct plugin metadata", () => {
      expect(ashbornPlugin.name).toBe("ashborn");
      expect(ashbornPlugin.description).toContain("Privacy");
    });

    it("should export 5 actions", () => {
      expect(ashbornPlugin.actions).toHaveLength(5);
    });

    it("should export 1 evaluator", () => {
      expect(ashbornPlugin.evaluators).toHaveLength(1);
    });

    it("should export 1 provider", () => {
      expect(ashbornPlugin.providers).toHaveLength(1);
    });
  });

  describe("Shield Action", () => {
    const shieldAction = ashbornPlugin.actions.find(
      (a) => a.name === "ASHBORN_SHIELD",
    );

    it("should exist", () => {
      expect(shieldAction).toBeDefined();
    });

    it('should validate "shield 1 SOL"', async () => {
      const mockRuntime = {} as any;
      const mockMessage = { content: "shield 1 SOL", userId: "test" };

      const isValid = await shieldAction!.validate(mockRuntime, mockMessage);
      expect(isValid).toBe(true);
    });

    it('should validate "hide $500"', async () => {
      const isValid = await shieldAction!.validate({} as any, {
        content: "hide $500",
        userId: "test",
      });
      expect(isValid).toBe(true);
    });

    it("should not validate unrelated messages", async () => {
      const isValid = await shieldAction!.validate({} as any, {
        content: "hello world",
        userId: "test",
      });
      expect(isValid).toBe(false);
    });

    it("should handle shield command", async () => {
      const result = await shieldAction!.handler(
        {} as any,
        { content: "shield 2 SOL", userId: "test" },
        {},
      );

      expect(result.text).toContain("Shielded");
      expect(result.text).toContain("2");
      expect(result.data?.action).toBe("shield");
    });
  });

  describe("Send Action", () => {
    const sendAction = ashbornPlugin.actions.find(
      (a) => a.name === "ASHBORN_SEND",
    );

    it("should exist", () => {
      expect(sendAction).toBeDefined();
    });

    it('should validate "send 0.5 SOL to @alice"', async () => {
      const isValid = await sendAction!.validate({} as any, {
        content: "send 0.5 SOL to @alice",
        userId: "test",
      });
      expect(isValid).toBe(true);
    });

    it('should validate "pay @bob $50"', async () => {
      const isValid = await sendAction!.validate({} as any, {
        content: "pay @bob $50",
        userId: "test",
      });
      expect(isValid).toBe(true);
    });

    it("should handle send command", async () => {
      const result = await sendAction!.handler(
        {} as any,
        { content: "send 1 SOL to @alice", userId: "test" },
        {},
      );

      expect(result.text).toContain("Shadow transfer");
      expect(result.text).toContain("@alice");
      expect(result.data?.action).toBe("transfer");
    });
  });

  describe("Prove Action", () => {
    const proveAction = ashbornPlugin.actions.find(
      (a) => a.name === "ASHBORN_PROVE",
    );

    it("should exist", () => {
      expect(proveAction).toBeDefined();
    });

    it('should validate "prove my balance is under $10k"', async () => {
      const isValid = await proveAction!.validate({} as any, {
        content: "prove my balance is under $10k",
        userId: "test",
      });
      expect(isValid).toBe(true);
    });

    it("should handle prove command", async () => {
      const result = await proveAction!.handler(
        {} as any,
        { content: "prove balance under $5000", userId: "test" },
        {},
      );

      expect(result.text).toContain("Proof");
      expect(result.text).toContain("$5,000");
      expect(result.data?.action).toBe("prove");
    });
  });

  describe("Balance Action", () => {
    const balanceAction = ashbornPlugin.actions.find(
      (a) => a.name === "ASHBORN_BALANCE",
    );

    it("should exist", () => {
      expect(balanceAction).toBeDefined();
    });

    it("should validate balance queries", async () => {
      const queries = [
        "what's my ashborn balance",
        "how much shielded",
        "my balance",
      ];

      for (const q of queries) {
        const isValid = await balanceAction!.validate({} as any, {
          content: q,
          userId: "test",
        });
        expect(isValid).toBe(true);
      }
    });

    it("should return balance info", async () => {
      const result = await balanceAction!.handler(
        {} as any,
        { content: "balance", userId: "test" },
        {},
      );

      expect(result.text).toContain("Shadow Vault Balance");
      expect(result.data?.action).toBe("balance");
    });
  });

  describe("Unshield Action", () => {
    const unshieldAction = ashbornPlugin.actions.find(
      (a) => a.name === "ASHBORN_UNSHIELD",
    );

    it("should exist", () => {
      expect(unshieldAction).toBeDefined();
    });

    it('should validate "unshield 1 SOL"', async () => {
      const isValid = await unshieldAction!.validate({} as any, {
        content: "unshield 1 SOL",
        userId: "test",
      });
      expect(isValid).toBe(true);
    });

    it("should handle unshield command", async () => {
      const result = await unshieldAction!.handler(
        {} as any,
        { content: "unshield 0.5 SOL", userId: "test" },
        {},
      );

      expect(result.text).toContain("Unshielded");
      expect(result.data?.action).toBe("unshield");
    });
  });

  describe("Privacy Evaluator", () => {
    const privacyEvaluator = ashbornPlugin.evaluators.find(
      (e) => e.name === "PRIVACY_NEED",
    );

    it("should exist", () => {
      expect(privacyEvaluator).toBeDefined();
    });

    it("should score high for privacy keywords", async () => {
      const messages = [
        "I want to send privately",
        "make this transfer secret",
        "hide my transaction",
        "use ashborn",
        "stealth transfer",
      ];

      for (const content of messages) {
        const score = await privacyEvaluator!.handler({} as any, {
          content,
          userId: "test",
        });
        expect(score).toBeGreaterThan(0);
      }
    });

    it("should score low for non-privacy messages", async () => {
      const score = await privacyEvaluator!.handler({} as any, {
        content: "hello how are you",
        userId: "test",
      });
      expect(score).toBe(0);
    });
  });

  describe("Ashborn Provider", () => {
    const ashbornProvider = ashbornPlugin.providers.find(
      (p) => p.name === "ashborn",
    );

    it("should exist", () => {
      expect(ashbornProvider).toBeDefined();
    });

    it("should return SDK status", async () => {
      const mockRuntime = {
        getSetting: vi.fn().mockReturnValue(undefined),
      };

      const sdk = await ashbornProvider!.get(mockRuntime as any);

      expect(sdk).toHaveProperty("initialized");
      expect(sdk).toHaveProperty("network");
    });
  });
});
