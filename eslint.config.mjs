import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("@antfu"), {
    rules: {
        "no-console": ["warn", {
            allow: ["warn", "error"],
        }],

        curly: [0, "all"],

        "brace-style": [0, "stroustrup", {
            allowSingleLine: false,
        }],

        "@typescript-eslint/brace-style": [0, "stroustrup", {
            allowSingleLine: false,
        }],

        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
        "arrow-parens": [2, "as-needed"],
    },
}];