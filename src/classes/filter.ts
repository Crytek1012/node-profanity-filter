import { AhoCorasick, Match } from './aho-corasick';

export interface FilterOptions {
    words?: string[];
    wordBoundaries?: boolean;
    normalize?: boolean;
    replaceWith?: string;
    strict?: boolean;
}

interface QueryOptions {
    normalize?: boolean;
    replaceWith?: string;
    strict?: boolean;
}

export class Filter {
    readonly matcher: AhoCorasick;
    readonly wordBoundaries: boolean;
    readonly normalize: boolean;
    readonly replaceWith: string;
    readonly strict: boolean;
    private static readonly charMap: Record<string, string> = {
        '@': 'a',
        '$': 's',
        '1': 'i',
        '0': 'o',
        '3': 'e'
    };

    constructor({ words = [], wordBoundaries = false, normalize = true, replaceWith = '', strict = false }: FilterOptions = {}) {
        this.wordBoundaries = wordBoundaries;
        this.normalize = normalize;
        this.replaceWith = replaceWith;
        this.strict = strict;

        this.matcher = new AhoCorasick(
            words.map(w => w.toLowerCase())
        );
    }

    sanitize(input: string, strict = this.strict): string {
        const { normalized } = this._normalizeToMap(input, strict, this.normalize);
        return normalized;
    }

    search(input: string, options: QueryOptions = {}): Match[] {
        const normalize = options.normalize ?? this.normalize;
        const query = normalize ? this._normalizeToMap(input, options.strict ?? this.strict, normalize).normalized : input.toLowerCase();
        const res = this.matcher.search(query);
        const filtered = this.wordBoundaries
            ? res.filter(m =>
                this.isBoundary(query, m.start - 1) &&
                this.isBoundary(query, m.end + 1)
            )
            : res;

        return this.resolveMatches(filtered);
    }

    isProfane(input: string, options: QueryOptions = {}) {
        return this.search(input, options).length > 0;
    }

    replace(input: string, options: QueryOptions = {}) {
        const strict = options.strict ?? this.strict;
        const normalize = options.normalize ?? this.normalize;

        const { map } = normalize
            ? this._normalizeToMap(input, strict, normalize)
            : { map: Array.from({ length: input.length }, (_, i) => i) };

        const matches = this.search(input, { normalize, strict });
        const replaceWith = options.replaceWith ?? this.replaceWith;

        const sorted = matches.sort((a, b) => a.start - b.start);

        let result = '';
        let cursor = 0;

        for (const m of sorted) {
            const start = map[m.start]!;
            const end = map[m.end]!;

            result += input.slice(cursor, start);
            result += replaceWith;

            cursor = end + 1;
        }

        result += input.slice(cursor);

        return result;
    }

    private _normalizeToMap(input: string, strict: boolean, normalize: boolean) {
        const map: number[] = [];
        let normalized = '';

        for (let i = 0; i < input.length; i++) {
            let ch = input[i]!.toLowerCase();

            if (strict && !/[a-z0-9@$]/.test(ch)) continue;
            if (normalize) {
                ch = Filter.charMap[ch] ?? ch;
            }

            normalized += ch;
            map.push(i);
        }

        return { normalized, map };
    }

    private resolveMatches(matches: Match[]): Match[] {
        const sorted = [...matches].sort((a, b) =>
            a.start - b.start || b.end - a.end
        );

        const result: Match[] = [];
        let lastEnd = -1;

        for (const m of sorted) {
            if (m.start < lastEnd) continue;

            result.push(m);
            lastEnd = m.end;
        }

        return result;
    }

    private isBoundary = (query: string, i: number) =>
        i < 0 || i >= query.length || !/[a-z0-9]/i.test(query[i]!);
}