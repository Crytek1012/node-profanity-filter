import { flaggedWords } from "./data/words-list.js";
import { Trie } from "./structures/trie.js";

export interface FilterOptions {
    wordBoundaries?: boolean;
    parseObfuscated?: boolean;
    replaceWith?: string;
    disableDefaultList?: boolean;
    excludeWords?: string[];
    includeWords?: string[];
}

export class Filter {
    private words: Trie;
    private wordBoundaries: boolean;
    private parseObfuscated: boolean;
    private replaceWith: string;
    private static readonly WORD_REGEX = /\b[\w@!$-]+\b/gi;
    private static readonly charMap: Record<string, string> = {
        '@': 'a',
        '$': 's',
        '1': 'i',
        "0": 'o',
        '3': 'e'
    };

    constructor({ wordBoundaries = false, parseObfuscated = true, replaceWith = '', disableDefaultList = false, excludeWords = [], includeWords = [] }: FilterOptions = {}) {
        this.wordBoundaries = wordBoundaries;
        this.parseObfuscated = parseObfuscated;
        this.replaceWith = replaceWith;

        const baseWords = disableDefaultList ? [] : flaggedWords.filter(w => !excludeWords.includes(w));
        const combinedWords = [...baseWords, ...includeWords];

        this.words = new Trie(combinedWords);
    }

    /**
     * Helper method to normalize obfuscated text
     * @param text 
     * @param maxRepeats the max num of repeats allowed for a char
     * @returns 
     */
    private normalizeObfuscated(text: string, maxRepeats = 1): string {
        let result = '';
        let lastChar = '';
        let repeatCount = 0;

        for (let i = 0; i < text.length; i++) {
            const c = text[i].toLowerCase();
            const mapped = Filter.charMap[c] ?? c;

            if (mapped === lastChar) {
                if (++repeatCount <= maxRepeats) result += mapped;
            } else {
                lastChar = mapped;
                repeatCount = 1;
                result += mapped;
            }
        }

        return result;
    }

    /**
     * Whether the string contains profane words
     * @param string 
     * @param wordBoundaries match whole words (defaults to config)
     * @returns 
     */
    isProfane(text: string, wordBoundaries = this.wordBoundaries): boolean {
        if (wordBoundaries) {
            return (text.match(Filter.WORD_REGEX) || []).some(w => {

                const lower = w.toLowerCase();
                if (this.words.contains(lower)) return true;

                const normalized = this.parseObfuscated ? this.normalizeObfuscated(w) : w.toLowerCase();
                return this.words.contains(normalized);
            });
        }

        const lower = text.toLowerCase();
        if (this.words.containsIn(lower.replace(/[^a-z0-9]/g, ''))) return true;

        if (this.parseObfuscated) {
            const normalized = this.normalizeObfuscated(lower);
            return this.words.containsIn(normalized.replace(/[^a-z0-9]/g, ''));
        }

        return false;
    }

    /**
     * Replace detected words
     * @param text 
     * @param replaceWith word used for replacing ( defaults to config )
     * @param wordBoundaries match whole words (defaults to config)
     * @returns 
     */
    sanitize(text: string, replaceWith: string = this.replaceWith): string {
        return text.replace(/\b[\w@!$-]+\b/g, (word) => {
            const normalized = this.parseObfuscated ? this.normalizeObfuscated(word) : word.toLowerCase();
            return this.words.contains(normalized)
                ? replaceWith.length === 1 ? replaceWith.repeat(word.length) : replaceWith
                : word;
        });
    }

    /**
     * Get a list of all matched words and their position
     * @param text 
     * @param wordBoundaries match whole words (defaults to config)
     * @returns 
     */
    getMatches(text: string, wordBoundaries = this.wordBoundaries): { word: string; start: number; end: number }[] {
        const matches = [];

        if (wordBoundaries) {
            const words = text.match(/\b[\w@!$-]+\b/gi) || [];
            let offset = 0;
            for (const w of words) {
                const start = text.indexOf(w, offset);
                offset = start + w.length;
                const normalized = this.parseObfuscated ? this.normalizeObfuscated(w) : w.toLowerCase();
                if (this.words.contains(normalized)) {
                    matches.push({ word: w, start, end: start + w.length });
                }
            }
        } else {
            const normalizedText = this.parseObfuscated ? this.normalizeObfuscated(text) : text.toLowerCase();
            for (let i = 0; i < normalizedText.length; i++) {
                const len = this.words.matchLengthAt(normalizedText, i);
                if (len > 0) {
                    matches.push({ word: text.slice(i, i + len), start: i, end: i + len });
                    i += len - 1;
                }
            }
        }

        return matches;
    }



}