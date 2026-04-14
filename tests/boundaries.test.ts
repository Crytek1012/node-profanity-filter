import { Filter } from '../src';

describe('Filter word boundaries', () => {
    it('does not match substrings inside other words', () => {
        const f = new Filter({ words: ['bad'], wordBoundaries: true });
        expect(f.search('badly')).toHaveLength(0);
        expect(f.search('attest')).toHaveLength(0);
        expect(f.search('testing')).toHaveLength(0);
    });

    it('matches isolated words only', () => {
        const f = new Filter({ words: ['bad'], wordBoundaries: true });
        expect(f.search('bad')).toHaveLength(1);
        expect(f.search('bad bad')).toHaveLength(2);
    });

    it('respects punctuation as valid boundaries', () => {
        const f = new Filter({ words: ['bad'], wordBoundaries: true });
        expect(f.search('!bad!')).toHaveLength(1);
    });

    it('does not match when adjacent to digits', () => {
        const f = new Filter({ words: ['bad'], wordBoundaries: true });
        expect(f.search('bad1')).toHaveLength(0);
        expect(f.search('1bad')).toHaveLength(0);
    });

    it('supports multiple target words in a single input', () => {
        const f = new Filter({ words: ['bad', 'evil'], wordBoundaries: true });
        expect(f.search('bad evil good')).toHaveLength(2);
    });

    it('still matches normalized variants', () => {
        const f = new Filter({ words: ['bad'], wordBoundaries: true });
        expect(f.search('b@d')).toHaveLength(1);
    });
});