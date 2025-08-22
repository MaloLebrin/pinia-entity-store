import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
    {
        ignores: [
            "dist/**/*",
            "packages/*/dist/**/*",
            "build/**/*",
            "out/**/*",
            "node_modules/**/*",
            ".pnpm/**/*",
            "*.d.ts",
            "*.js.map",
            "coverage/**/*",
            ".nyc_output/**/*",
            ".vscode/**/*",
            ".idea/**/*",
            "*.log",
            "npm-debug.log*",
            "yarn-debug.log*",
            "yarn-error.log*",
            "pnpm-debug.log*",
            ".eslintcache",
            ".cache/**/*",
            ".parcel-cache/**/*",
            ".next/**/*",
            ".nuxt/**/*",
            ".out/**/*",
            ".storybook-out/**/*",
            "tmp/**/*",
            "temp/**/*"
        ]
    },
    js.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: {
                // Test globals
                describe: "readonly",
                it: "readonly",
                test: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly",
                // Vue/Pinia globals
                defineStore: "readonly",
                createApp: "readonly",
                createPinia: "readonly",
                setActivePinia: "readonly",
                // Utility globals
                noNull: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": typescript,
        },
        rules: {
            "no-console": ["warn", {
                allow: ["warn", "error"],
            }],
            "curly": [0, "all"],
            "brace-style": [0, "stroustrup", {
                allowSingleLine: false,
            }],
            "@typescript-eslint/brace-style": [0, "stroustrup", {
                allowSingleLine: false,
            }],
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error"],
            "arrow-parens": [2, "as-needed"],
            // Ignore dist and packages/*/dist
            "no-undef": "off",
        },
    },
    {
        files: ["dist/**/*", "packages/*/dist/**/*"],
        rules: {
            "no-undef": "off",
            "@typescript-eslint/no-unused-vars": "off",
        },
    },
];