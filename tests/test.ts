import { Filter } from "../src/filter.js";

describe('Profanity Filter', () => {
    let filter: Filter;

    beforeEach(() => {
        filter = new Filter({
            wordBoundaries: false,
            parseObfuscated: true,
            replaceWith: '*',
            excludeWords: ['hello'] // example excluded word
        });

        filter['words'].insert('badword');
        filter['words'].insert('nasty');
    });

    test('detects simple profanity', () => {
        expect(filter.isProfane('This is a badword.')).toBe(true);
        expect(filter.isProfane('Clean text.')).toBe(false);
    });

    test('detects obfuscated profanity', () => {
        expect(filter.isProfane('b@dw0rd')).toBe(true);
        expect(filter.isProfane('n@sty!')).toBe(true);
    });

    test('replaces profanity correctly', () => {
        const text = 'This is nasty and badword!';
        const cleaned = filter.sanitize(text, '#');
        expect(cleaned).toContain('####');
        expect(cleaned).toContain('#######');
    });

    test('respects wordBoundaries option', () => {
        filter = new Filter({ wordBoundaries: true, replaceWith: 'BLEEP' });
        filter['words'].insert('bad');

        expect(filter.isProfane('bad')).toBe(true);
        expect(filter.isProfane('badly')).toBe(false);

        const result = filter.sanitize('bad badly');
        expect(result).toBe('BLEEP badly');
    });

    test('does not flag excluded words', () => {
        expect(filter.isProfane('hello')).toBe(false);
        expect(filter.sanitize('hello badword')).toContain('hello');
    });

    test('handles mixed case and punctuation', () => {
        expect(filter.isProfane('BadWord!')).toBe(true);
        expect(filter.isProfane('nAsTy?')).toBe(true);
        expect(filter.sanitize('What a badword!')).toContain('***');
    });

    test('normalizes repeated chars in obfuscation', () => {
        expect(filter.isProfane('baaadword')).toBe(true);
        expect(filter.isProfane('naaasty')).toBe(true);
    });

    test('handles empty string gracefully', () => {
        expect(filter.isProfane('')).toBe(false);
        expect(filter.sanitize('')).toBe('');
    });

    test('detects profanity with special chars mixed in', () => {
        expect(filter.isProfane('b@d-w0rd')).toBe(true);
        expect(filter.isProfane('n@!$ty')).toBe(true);
    });

    test('sanitize preserves whitespace and punctuation', () => {
        const input = 'badword, nasty! Hello.';
        const sanitized = filter.sanitize(input, '*');
        expect(sanitized).toMatch(/^\*{7}, \*{5}! Hello\.$/);
    });

    test('replacement length matches replaced word length when single char replacement', () => {
        const sanitized = filter.sanitize('badword nasty', '*');
        expect(sanitized).toBe('******* *****');
    });

    test('replacement uses whole string when replacement length > 1', () => {
        const sanitized = filter.sanitize('badword nasty', '[CENSORED]');
        expect(sanitized).toBe('[CENSORED] [CENSORED]');
    });

    test('sanitize works with wordBoundaries and obfuscation enabled', () => {
        filter = new Filter({ wordBoundaries: true, parseObfuscated: true, replaceWith: 'X' });
        filter['words'].insert('badword');
        expect(filter.isProfane('b@a@dword')).toBe(true);
        expect(filter.sanitize('b@a@dword nasty')).toBe('XXXXXXXXX nasty');
    });

    test('sanitize works with wordBoundaries and obfuscation disabled', () => {
        filter = new Filter({ wordBoundaries: true, parseObfuscated: false, replaceWith: 'X' });
        filter['words'].insert('badword');
        expect(filter.isProfane('badword')).toBe(true);
        expect(filter.isProfane('b@a@dword')).toBe(false);
        expect(filter.sanitize('badword b@a@dword')).toBe('XXXXXXX b@a@dword');
    });

    test('sanitize with mixed case profane words', () => {
        expect(filter.isProfane('BadWord')).toBe(true);
        expect(filter.sanitize('BADWORD nasty', '*')).toBe('******* *****');
    });

    test('does not flag partial words in non-wordBoundaries mode', () => {
        filter = new Filter({ wordBoundaries: false });
        filter['words'].insert('bad');
        expect(filter.isProfane('badly')).toBe(true); // partial match allowed
        expect(filter.isProfane('bad')).toBe(true);
    });

    test('sanitize replaces multiple profane words consecutively', () => {
        filter = new Filter({ wordBoundaries: false, replaceWith: '#' });
        filter['words'].insert('badword');
        filter['words'].insert('nasty');
        const result = filter.sanitize('badword nasty');
        expect(result).toBe('####### #####'); // length of badword + nasty
    });

});
