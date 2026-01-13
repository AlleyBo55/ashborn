# Contributing to Ashborn

> "The shadow army grows stronger with each warrior who joins."

## Welcome, Shadow Soldier! 🌑

Thank you for considering contributing to Ashborn. Every contribution helps us build a more private future on Solana.

## Getting Started

### Prerequisites

- Rust 1.75+ with `cargo`
- Solana CLI 1.18+
- Anchor CLI 0.30+
- Node.js 18+
- A Solana wallet with devnet SOL

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/ashborn.git
cd ashborn

# Install dependencies
npm install

# Build programs
anchor build

# Run tests
anchor test
```

## How to Contribute

### Reporting Bugs

Found a shadow that shouldn't be there? Open an issue with:

1. Clear description of the bug
2. Steps to reproduce
3. Expected vs actual behavior
4. Environment details (OS, versions)

### Suggesting Features

Have an idea to strengthen the shadow army? Open an issue with:

1. Feature description
2. Use case / motivation
3. Proposed implementation (optional)

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/shadow-enhancement`
3. Make your changes
4. Run tests: `anchor test`
5. Run lints: `cargo clippy` and `npm run lint`
6. Commit with clear message: `git commit -m "feat: add shadow enhancement"`
7. Push and open a PR

### Coding Standards

**Rust (On-Chain)**
- Follow Rust style guidelines
- Use `cargo fmt` before committing
- No `unwrap()` in production code—proper error handling only
- Document all public functions

**TypeScript (SDK/Frontend)**
- Use TypeScript strict mode
- Follow ESLint configuration
- Add JSDoc comments for public APIs
- Test all new functionality

## Code of Conduct

Be respectful. Be inclusive. Be a shadow of good, not evil.

---

*"Together, we make privacy the default on Solana."*
