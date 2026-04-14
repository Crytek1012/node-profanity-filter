import { Filter } from '../src';

describe('Filter replacement behavior', () => {
    it('replaces matched words', () => {
        const f = new Filter({ words: ['bad'], replaceWith: '*' });
        expect(f.replace('bad').text).toBe('*');
        expect(f.replace('bad word').text).toBe('* word');
        expect(f.replace('bad bad bad').text).toBe('* * *');
    });

    it('supports multiple target words', () => {
        const f = new Filter({ words: ['bad', 'evil'], replaceWith: '*' });
        expect(f.replace('bad and evil').text).toBe('* and *');
    });

    it('applies normalization during replacement', () => {
        const f = new Filter({ words: ['bad'], replaceWith: '*' });
        expect(f.replace('b@d').text).toBe('*');
    });

    it('does not replace when normalization is disabled', () => {
        const f = new Filter({ words: ['bad'], normalize: false, replaceWith: '*' });
        expect(f.replace('b@d').text).toBe('b@d');
    });

    it('allows per-call replacement override', () => {
        const f = new Filter({ words: ['bad'], replaceWith: '*' });
        expect(f.replace('bad', { replaceWith: '###' }).text).toBe('###');
    });

    it('respects word boundaries when enabled', () => {
        const f = new Filter({ words: ['bad'], wordBoundaries: true, replaceWith: '*' });
        expect(f.replace('badly bad').text).toBe('badly *');
    });

    it('handles overlapping patterns by prioritizing longest match', () => {
        const f = new Filter({ words: ['bad', 'badbad'], replaceWith: '*' });
        expect(f.replace('badbad').text).toBe('*');
    });

    it('preserves surrounding punctuation', () => {
        const f = new Filter({ words: ['bad'], replaceWith: '*' });
        expect(f.replace('bad!!!').text).toBe('*!!!');
    });

    it('processes consecutive matches cleanly', () => {
        const f = new Filter({ words: ['bad'], replaceWith: '*' });
        expect(f.replace('bad bad').text).toBe('* *');
    });

    it('works with strict mode inputs', () => {
        const f = new Filter({ words: ['test'], strict: true, replaceWith: '*' });
        expect(f.replace('t.e s t!!!').text).toBe('*!!!');
    });

    it('handles empty input and empty rule set', () => {
        expect(new Filter({ words: ['bad'], replaceWith: '*' }).replace('').text).toBe('');
        expect(new Filter({ words: [], replaceWith: '*' }).replace('bad').text).toBe('bad');
    });
});