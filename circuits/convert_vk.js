#!/usr/bin/env node
/**
 * Convert snarkjs verification key JSON to Rust format
 * Usage: node convert_vk.js <vkey.json> <circuit_name>
 */

const fs = require('fs');
const path = require('path');

// BN254 field modulus
const P = BigInt("21888242871839275222246405745257275088696311157297823662689037894645226208583");

function bigIntToBytes32BE(n) {
    const hex = BigInt(n).toString(16).padStart(64, '0');
    const bytes = [];
    for (let i = 0; i < 64; i += 2) {
        bytes.push(`0x${hex.slice(i, i + 2)}`);
    }
    return bytes;
}

function g1PointToBytes(point) {
    // G1 point: [x, y] -> 64 bytes (big-endian)
    const x = bigIntToBytes32BE(point[0]);
    const y = bigIntToBytes32BE(point[1]);
    return [...x, ...y];
}

function g2PointToBytes(point) {
    // G2 point: [[x1, x0], [y1, y0]] -> 128 bytes (big-endian)
    // Note: snarkjs uses [c0, c1] order, we need [c1, c0] for Solana
    const x0 = bigIntToBytes32BE(point[0][0]);
    const x1 = bigIntToBytes32BE(point[0][1]);
    const y0 = bigIntToBytes32BE(point[1][0]);
    const y1 = bigIntToBytes32BE(point[1][1]);
    return [...x1, ...x0, ...y1, ...y0];  // Reversed order for alt_bn128
}

function formatBytesArray(bytes, name, size, indent = "    ") {
    let result = `${indent}pub const ${name}: [u8; ${size}] = [\n`;
    for (let i = 0; i < bytes.length; i += 8) {
        result += `${indent}    ${bytes.slice(i, i + 8).join(', ')},\n`;
    }
    result += `${indent}];\n`;
    return result;
}

function formatICArray(ic, indent = "    ") {
    let result = `${indent}pub const IC: [[u8; 64]; ${ic.length}] = [\n`;
    for (const point of ic) {
        const bytes = g1PointToBytes(point);
        result += `${indent}    [\n`;
        for (let i = 0; i < bytes.length; i += 8) {
            result += `${indent}        ${bytes.slice(i, i + 8).join(', ')},\n`;
        }
        result += `${indent}    ],\n`;
    }
    result += `${indent}];\n`;
    return result;
}

function convertVK(vkPath, circuitName) {
    const vk = JSON.parse(fs.readFileSync(vkPath, 'utf8'));

    const alpha = g1PointToBytes(vk.vk_alpha_1);
    const beta = g2PointToBytes(vk.vk_beta_2);
    const gamma = g2PointToBytes(vk.vk_gamma_2);
    const delta = g2PointToBytes(vk.vk_delta_2);

    let rust = `/// Verification key for ${circuitName} circuit\n`;
    rust += `/// Generated from ${path.basename(vkPath)}\n`;
    rust += `pub mod ${circuitName}_vk {\n`;
    rust += formatBytesArray(alpha, 'ALPHA_G1', 64);
    rust += formatBytesArray(beta, 'BETA_G2', 128);
    rust += formatBytesArray(gamma, 'GAMMA_G2', 128);
    rust += formatBytesArray(delta, 'DELTA_G2', 128);
    rust += formatICArray(vk.IC);
    rust += `    pub const N_PUBLIC: usize = ${vk.nPublic};\n`;
    rust += `}\n`;

    return rust;
}

// Main
const args = process.argv.slice(2);
if (args.length === 0) {
    // Convert all VKs
    const vks = ['shield', 'transfer', 'range'];
    let output = `//! Real Groth16 Verification Keys\n//!\n//! Generated from Circom circuits using snarkjs\n//! DO NOT EDIT - regenerate using convert_vk.js\n\n`;
    output += `pub const DEMO_MODE: bool = false; // Real VKs!\n\n`;

    for (const name of vks) {
        const vkPath = `build/${name}_vkey.json`;
        if (fs.existsSync(vkPath)) {
            output += convertVK(vkPath, name);
            output += '\n';
            console.log(`Converted ${name}_vkey.json`);
        } else {
            console.log(`Warning: ${vkPath} not found`);
        }
    }

    fs.writeFileSync('../programs/ashborn/src/zk/vkeys_generated.rs', output);
    console.log('\nGenerated: ../programs/ashborn/src/zk/vkeys_generated.rs');
} else {
    const [vkPath, circuitName] = args;
    console.log(convertVK(vkPath, circuitName));
}
