/**
 * Enhanced NLP with Confidence Thresholds
 *
 * Confidence calibration and user confirmation
 */

/** Parsed intent with confidence */
export interface ParsedIntent {
  action:
    | "shield"
    | "send"
    | "prove"
    | "balance"
    | "unshield"
    | "help"
    | "unknown";
  amountSol?: number;
  amountUsd?: number;
  recipient?: string;
  proofType?: "range" | "ownership";
  rangeMin?: bigint;
  rangeMax?: bigint;
  confidence: number;
  rawQuery: string;
  needsConfirmation: boolean;
}

/** Confirmation request */
export interface ConfirmationRequest {
  intent: ParsedIntent;
  message: string;
  options: string[];
}

/** NLP config */
export interface NLPConfig {
  apiKey?: string;
  model?: string;
  confidenceThreshold?: number;
  requireConfirmation?: boolean;
}

const SOL_PRICE_USD = 200; // Placeholder, would fetch from oracle
const DEFAULT_CONFIDENCE_THRESHOLD = 0.8;

/**
 * Natural Language Parser with confidence calibration
 */
export class NaturalLanguageParser {
  private apiKey?: string;
  private model: string;
  private confidenceThreshold: number;
  private requireConfirmation: boolean;

  constructor(config: NLPConfig = {}) {
    this.apiKey = config.apiKey;
    this.model = config.model ?? "gpt-4o-mini";
    this.confidenceThreshold =
      config.confidenceThreshold ?? DEFAULT_CONFIDENCE_THRESHOLD;
    this.requireConfirmation = config.requireConfirmation ?? true;
  }

  /**
   * Parse natural language command
   */
  async parse(query: string): Promise<ParsedIntent> {
    const normalizedQuery = query.toLowerCase().trim();

    // Try rule-based first (faster, more reliable for common patterns)
    const ruleBasedResult = this.parseWithRules(normalizedQuery);

    // If confident enough, return
    if (ruleBasedResult.confidence >= 0.9) {
      return this.addConfirmationFlag(ruleBasedResult);
    }

    // Use LLM for complex/ambiguous queries
    if (this.apiKey) {
      try {
        const llmResult = await this.parseWithLLM(normalizedQuery);
        // Take higher confidence result
        if (llmResult.confidence > ruleBasedResult.confidence) {
          return this.addConfirmationFlag(llmResult);
        }
      } catch {
        // Fall back to rules on LLM error
      }
    }

    return this.addConfirmationFlag(ruleBasedResult);
  }

  /**
   * Add confirmation flag based on confidence threshold
   */
  private addConfirmationFlag(intent: ParsedIntent): ParsedIntent {
    const needsConfirmation =
      this.requireConfirmation && intent.confidence < this.confidenceThreshold;

    return {
      ...intent,
      needsConfirmation,
    };
  }

  /**
   * Generate confirmation request for low-confidence intents
   */
  generateConfirmation(intent: ParsedIntent): ConfirmationRequest {
    const message = this.buildConfirmationMessage(intent);
    const options = this.buildConfirmationOptions(intent);

    return {
      intent,
      message,
      options,
    };
  }

  private buildConfirmationMessage(intent: ParsedIntent): string {
    switch (intent.action) {
      case "shield":
        return `🤔 Did you mean to **shield $${intent.amountUsd ?? 0}**?`;
      case "send":
        return `🤔 Did you mean to **send $${intent.amountUsd ?? 0} to ${intent.recipient ?? "unknown"}**?`;
      case "prove":
        return `🤔 Did you mean to **prove your balance is ${this.formatRange(intent)}**?`;
      case "unshield":
        return `🤔 Did you mean to **unshield $${intent.amountUsd ?? 0}**?`;
      default:
        return `🤔 I'm not sure what you meant. Can you clarify?`;
    }
  }

  private formatRange(intent: ParsedIntent): string {
    if (intent.rangeMin && intent.rangeMax) {
      return `between $${intent.rangeMin} and $${intent.rangeMax}`;
    } else if (intent.rangeMax) {
      return `under $${intent.rangeMax}`;
    } else if (intent.rangeMin) {
      return `over $${intent.rangeMin}`;
    }
    return "in a range";
  }

  private buildConfirmationOptions(intent: ParsedIntent): string[] {
    const options = ["Yes, do it", "No, cancel"];

    // Add clarification options based on what might be ambiguous
    if (intent.action === "unknown") {
      options.push("Shield assets", "Send privately", "Check balance");
    } else if (!intent.amountUsd && intent.action !== "balance") {
      options.push("Use all balance", "Specify amount");
    }

    return options;
  }

  /**
   * Rule-based parsing (fast, reliable)
   */
  private parseWithRules(query: string): ParsedIntent {
    const base: ParsedIntent = {
      action: "unknown",
      confidence: 0,
      rawQuery: query,
      needsConfirmation: false,
    };

    // Shield patterns
    if (/\b(shield|hide|protect|deposit)\b/i.test(query)) {
      const amount = this.extractAmount(query);
      return {
        ...base,
        action: "shield",
        ...amount,
        confidence: amount.amountUsd ? 0.95 : 0.7,
      };
    }

    // Send patterns
    if (/\b(send|pay|transfer|give)\b/i.test(query)) {
      const amount = this.extractAmount(query);
      const recipient = this.extractRecipient(query);
      const hasRecipient = !!recipient;
      const hasAmount = !!amount.amountUsd;

      return {
        ...base,
        action: "send",
        ...amount,
        recipient,
        confidence:
          hasRecipient && hasAmount
            ? 0.95
            : hasRecipient || hasAmount
              ? 0.7
              : 0.5,
      };
    }

    // Prove/range patterns
    if (/\b(prove|verify|show|demonstrate)\b/i.test(query)) {
      const range = this.extractRange(query);
      return {
        ...base,
        action: "prove",
        proofType: "range",
        ...range,
        confidence: range.rangeMax || range.rangeMin ? 0.9 : 0.6,
      };
    }

    // Balance patterns
    if (/\b(balance|how much|what.*have|total)\b/i.test(query)) {
      return {
        ...base,
        action: "balance",
        confidence: 0.95,
      };
    }

    // Unshield patterns
    if (/\b(unshield|withdraw|exit|cash out|reveal)\b/i.test(query)) {
      const amount = this.extractAmount(query);
      return {
        ...base,
        action: "unshield",
        ...amount,
        confidence: amount.amountUsd ? 0.9 : 0.7,
      };
    }

    // Help patterns
    if (/\b(help|what|how|commands?)\b/i.test(query)) {
      return {
        ...base,
        action: "help",
        confidence: 0.9,
      };
    }

    return {
      ...base,
      action: "unknown",
      confidence: 0.2,
    };
  }

  /**
   * LLM-based parsing (for complex queries)
   */
  private async parseWithLLM(query: string): Promise<ParsedIntent> {
    const systemPrompt = `You are parsing privacy protocol commands. Output JSON with:
{
  "action": "shield" | "send" | "prove" | "balance" | "unshield" | "help" | "unknown",
  "amountUsd": number or null,
  "recipient": string or null,
  "rangeMin": number or null,
  "rangeMax": number or null,
  "confidence": 0-1
}

Examples:
"put 2 SOL in the vault" -> {"action": "shield", "amountUsd": 400, "confidence": 0.95}
"send fifty bucks to bob privately" -> {"action": "send", "amountUsd": 50, "recipient": "bob", "confidence": 0.9}
"prove i have less than ten grand" -> {"action": "prove", "rangeMax": 10000, "confidence": 0.85}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const parsed = JSON.parse(data.choices[0].message.content);

    return {
      action: parsed.action ?? "unknown",
      amountUsd: parsed.amountUsd,
      amountSol: parsed.amountUsd
        ? parsed.amountUsd / SOL_PRICE_USD
        : undefined,
      recipient: parsed.recipient,
      rangeMin: parsed.rangeMin ? BigInt(parsed.rangeMin) : undefined,
      rangeMax: parsed.rangeMax ? BigInt(parsed.rangeMax) : undefined,
      confidence: parsed.confidence ?? 0.5,
      rawQuery: query,
      needsConfirmation: false,
    };
  }

  // Helper extractors
  private extractAmount(query: string): {
    amountSol?: number;
    amountUsd?: number;
  } {
    // Match $X or X USD patterns (handled in cleanQuery processing below)
    // Simple regex: extract all number-like sequences, pick the relevant one
    // Remove all commas first to simplify
    const cleanQuery = query.replace(/,/g, "");

    // Match numbers, potentially with decimals
    // Heuristic: If "SOL" is present, the number near it is likely SOL amount
    // Match numbers with optional k/m/b suffixes
    const match = cleanQuery.match(/(\d+(?:\.\d+)?)\s*([kmb])?/i);

    if (!match) return {};

    let value = parseFloat(match[1]);
    const suffix = match[2]?.toLowerCase();

    if (suffix === "k") value *= 1000;
    if (suffix === "m") value *= 1000000;
    if (suffix === "b") value *= 1000000000;

    // Heuristic: If "SOL" is present, use as SOL
    if (cleanQuery.match(/sol/i)) {
      return { amountSol: value, amountUsd: value * SOL_PRICE_USD };
    } else {
      // Default to USD
      return { amountUsd: value, amountSol: value / SOL_PRICE_USD };
    }
  }

  private extractRecipient(query: string): string | undefined {
    // Match @username
    const atMatch = query.match(/@(\w+)/);
    if (atMatch) return "@" + atMatch[1];

    // Match "to X"
    const toMatch = query.match(/\bto\s+([a-z0-9_.-]+)/i);
    if (toMatch && !["the", "my", "a"].includes(toMatch[1].toLowerCase())) {
      return toMatch[1];
    }

    return undefined;
  }

  private extractRange(query: string): {
    rangeMin?: bigint;
    rangeMax?: bigint;
  } {
    // Helper to parse amount with k/m/b support
    const parseAmount = (str: string): bigint => {
      const cleanStr = str.replace(/,/g, "");
      const match = cleanStr.match(/(\d+(?:\.\d+)?)\s*([kmb])?/i);
      if (!match) return 0n;

      let val = parseFloat(match[1]);
      const suffix = match[2]?.toLowerCase();
      if (suffix === "k") val *= 1000;
      if (suffix === "m") val *= 1000000;
      if (suffix === "b") val *= 1000000000;

      return BigInt(Math.floor(val));
    };

    // Match "under $X"
    const underMatch = query.match(
      /(?:under|below|less than)\s*\$?\s*([\d,.kmb]+)/i,
    );
    if (underMatch) {
      return { rangeMax: parseAmount(underMatch[1]) };
    }

    // Match "over $X"
    const overMatch = query.match(
      /(?:over|above|more than|at least)\s*\$?\s*([\d,.kmb]+)/i,
    );
    if (overMatch) {
      return { rangeMin: parseAmount(overMatch[1]) };
    }

    // Match "between $X and $Y"
    const betweenMatch = query.match(
      /between\s*\$?\s*([\d,.kmb]+)\s*(?:and|-)\s*\$?\s*([\d,.kmb]+)/i,
    );
    if (betweenMatch) {
      return {
        rangeMin: parseAmount(betweenMatch[1]),
        rangeMax: parseAmount(betweenMatch[2]),
      };
    }

    return {};
  }
}

/**
 * Execute commands with confirmation flow
 */
export class NaturalLanguageAshborn {
  private parser: NaturalLanguageParser;
  private pendingIntent?: ParsedIntent;

  constructor(config: NLPConfig = {}) {
    this.parser = new NaturalLanguageParser(config);
  }

  /**
   * Process user input with confirmation
   */
  async execute(input: string): Promise<string> {
    // Check if confirming pending intent
    if (this.pendingIntent && this.isConfirmation(input)) {
      return this.executeConfirmed(this.pendingIntent);
    }

    // Parse new input
    const intent = await this.parser.parse(input);

    // If low confidence, ask for confirmation
    if (intent.needsConfirmation) {
      this.pendingIntent = intent;
      const confirmation = this.parser.generateConfirmation(intent);
      return `${confirmation.message}\n\nOptions: ${confirmation.options.join(" | ")}`;
    }

    // Execute with high confidence
    this.pendingIntent = undefined;
    return this.executeConfirmed(intent);
  }

  private isConfirmation(input: string): boolean {
    return /^(yes|y|do it|confirm|ok|sure)/i.test(input.trim());
  }

  private async executeConfirmed(intent: ParsedIntent): Promise<string> {
    this.pendingIntent = undefined;

    switch (intent.action) {
      case "shield":
        return `🛡️ **Shielding $${intent.amountUsd ?? 0}...**\nYour assets are now hidden from the world.`;
      case "send":
        return `👻 **Sending $${intent.amountUsd ?? 0} to ${intent.recipient ?? "recipient"}...**\nPrivate transfer complete. No trace left behind.`;
      case "prove":
        return `✅ **Generating range proof...**\nProved balance is ${this.formatRange(intent)}`;
      case "balance":
        return `💰 **Shadow Vault Balance**\n• Shielded: 2.5 SOL (~$500)\n• Notes: 3 active`;
      case "unshield":
        return `🔓 **Unshielding $${intent.amountUsd ?? 0}...**\nAssets returned to public wallet.`;
      case "help":
        return `🌑 **Ashborn Commands**
• \`shield 1 SOL\` - Hide assets
• \`send $50 to @alice\` - Private transfer
• \`prove balance under $10k\` - Range proof
• \`balance\` - Check vault
• \`unshield 0.5 SOL\` - Exit private mode`;
      default:
        return `🤔 I didn't understand "${intent.rawQuery}".\n\nTry: \`shield\`, \`send\`, \`prove\`, \`balance\`, or \`unshield\``;
    }
  }

  private formatRange(intent: ParsedIntent): string {
    if (intent.rangeMin && intent.rangeMax) {
      return `between $${intent.rangeMin.toLocaleString()} and $${intent.rangeMax.toLocaleString()}`;
    } else if (intent.rangeMax) {
      return `under $${intent.rangeMax.toLocaleString()}`;
    } else if (intent.rangeMin) {
      return `over $${intent.rangeMin.toLocaleString()}`;
    }
    return "in specified range";
  }
}
