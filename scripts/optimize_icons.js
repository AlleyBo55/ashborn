const fs = require('fs');
const path = require('path');

console.log('Building icon map...');
const iconsDir = '/Users/gilang/ngoding/ashborn/app/node_modules/hugeicons-react/dist/esm/icons';
const map = new Map();

if (fs.existsSync(iconsDir)) {
    const iconFiles = fs.readdirSync(iconsDir);
    iconFiles.forEach(file => {
        if (file.endsWith('.js') && file !== 'index.js') {
            const nameWithoutExt = file.replace('.js', '');
            // Convert snake_case to PascalCase
            // e.g. sent_icon -> SentIcon, add_01_icon -> Add01Icon
            const pascalName = nameWithoutExt
                .split('_')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join('');

            map.set(pascalName, nameWithoutExt);
        }
    });
} else {
    console.error(`Icons directory not found at: ${iconsDir}`);
    process.exit(1);
}

console.log(`Loaded ${map.size} icons from directory scan.`);

// 2. Identify Files (Hardcoded from grep results for safety and precision)
const files = [
    "/Users/gilang/ngoding/ashborn/app/src/components/landing/ProtectionFeed.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/landing/SkillCombo.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/landing/HowAshbornWorks.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/landing/MarketingWhy.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/landing/SystemCapabilities.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/landing/MarketingArsenal.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/landing/ParallaxHero.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/landing/CinematicHero.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/landing/ShadowAgentHighlight.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/landing/PrivacyRelayShowcase.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/landing/SystemWarning.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/landing/Comparison.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/landing/Hero.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/landing/ShadowECDHShowcase.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/ui/CodeBlock.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/app/docs/page.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/demo/DemoPageHeader.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/demo/TxLink.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/demo/InfoCard.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/components/ui/base/BaseButton.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/app/demo/page.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/app/demo/nlp/page.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/app/demo/layout.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/app/demo/prove/page.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/app/demo/ai-payment/page.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/app/demo/shadow-agent/page.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/app/demo/interop/page.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/app/demo/transfer/page.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/app/demo/shield/page.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/app/demo/radr/page.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/app/demo/ai-transfer/page.tsx",
    "/Users/gilang/ngoding/ashborn/app/src/app/demo/ai-lending/page.tsx"
];

// 3. Process each file
files.forEach(processFile);

function processFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`Skipping missing file: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // improved regex to capture the import block
    // matches: import { ... } from 'hugeicons-react';
    // flags: g (global), s (dot matches newline is NOT supported in JS RegExp literal by default unless 's' flag, but easier to use [\s\S])
    // actually, let's use [^;]+ to suffice for now.

    // Improved regex to capture the import block specifically for hugeicons-react
    // Use [^{}]* to match content inside braces, ensuring we don't bleed into other imports
    const importPattern = /import\s*\{([^{}]*?)\}\s*from\s*['"]hugeicons-react['"];?/g;

    content = content.replace(importPattern, (match, importsBody) => {
        // Split by comma, clean whitespace
        const icons = importsBody.split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const replacements = icons.map(iconEntry => {
            // Handle aliases if present: "CubeIcon as MyIcon"
            // Simple split by space
            const parts = iconEntry.split(/\s+as\s+/);
            const originalName = parts[0];
            const aliasName = parts[1] || originalName;

            const filename = map.get(originalName);
            if (!filename) {
                console.warn(`  [WARN] Icon not found in map: ${originalName} in ${path.basename(filePath)}`);
                // fallback to original import for this one (tricky if mixed)
                // for now, we just comment it out to force manual fix or fail? 
                // No, better to leave it as a named import if possible? But we are replacing the whole block.
                // We will emit a specific named import for it from main package (not optimized)
                return `import { ${originalName} ${originalName !== aliasName ? `as ${aliasName}` : ''} } from 'hugeicons-react';`;
            }

            // Construct new import
            // import MyIcon from 'hugeicons-react/dist/esm/icons/cube_icon';
            return `import ${aliasName} from 'hugeicons-react/dist/esm/icons/${filename}';`;
        });

        return replacements.join('\n');
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${path.basename(filePath)}`);
    } else {
        // console.log(`No changes needed: ${path.basename(filePath)}`);
    }
}
