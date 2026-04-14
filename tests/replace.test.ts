import { Filter } from '../src';

describe('Filter replacement behavior', () => {
    it('replaces matched words', () => {
        const f = new Filter({ words: ['bad'], replaceWith: '*' });
        expect(f.replace('bad')).toBe('*');
        expect(f.replace('bad word')).toBe('* word');
        expect(f.replace('bad bad bad')).toBe('* * *');
    });

    it('supports multiple target words', () => {
        const f = new Filter({ words: ['bad', 'evil'], replaceWith: '*' });
        expect(f.replace('bad and evil')).toBe('* and *');
    });

    it('applies normalization during replacement', () => {
        const f = new Filter({ words: ['bad'], replaceWith: '*' });
        expect(f.replace('b@d')).toBe('*');
    });

    it('does not replace when normalization is disabled', () => {
        const f = new Filter({ words: ['bad'], normalize: false, replaceWith: '*' });
        expect(f.replace('b@d')).toBe('b@d');
    });

    it('allows per-call replacement override', () => {
        const f = new Filter({ words: ['bad'], replaceWith: '*' });
        expect(f.replace('bad', { replaceWith: '###' })).toBe('###');
    });

    it('respects word boundaries when enabled', () => {
        const f = new Filter({ words: ['bad'], wordBoundaries: true, replaceWith: '*' });
        expect(f.replace('badly bad')).toBe('badly *');
    });

    it('handles overlapping patterns by prioritizing longest match', () => {
        const f = new Filter({ words: ['bad', 'badbad'], replaceWith: '*' });
        expect(f.replace('badbad')).toBe('*');
    });

    it('preserves surrounding punctuation', () => {
        const f = new Filter({ words: ['bad'], replaceWith: '*' });
        expect(f.replace('bad!!!')).toBe('*!!!');
    });

    it('processes consecutive matches cleanly', () => {
        const f = new Filter({ words: ['bad'], replaceWith: '*' });
        expect(f.replace('bad bad')).toBe('* *');
    });

    it('works with strict mode inputs', () => {
        const f = new Filter({ words: ['test'], strict: true, replaceWith: '*' });
        expect(f.replace('t.e s t!!!')).toBe('*!!!');
    });

    it('handles empty input and empty rule set', () => {
        expect(new Filter({ words: ['bad'], replaceWith: '*' }).replace('')).toBe('');
        expect(new Filter({ words: [], replaceWith: '*' }).replace('bad')).toBe('bad');
    });
});