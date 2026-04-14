import { Filter } from '../src';

describe('Filter strict mode behavior', () => {
    it('normalizes separators into continuous text', () => {
        const f = new Filter({ words: ['as', 'test', 'abc'], strict: true });

        expect(f.search('a s')).toHaveLength(1);
        expect(f.search('t.e.s.t')).toHaveLength(1);
        expect(f.search('t e-s_t')).toHaveLength(1);
        expect(f.search('t....e....s....t')).toHaveLength(1);
        expect(f.search('a!b-c#')).toHaveLength(1);
    });

    it('keeps alphanumeric content intact', () => {
        const f = new Filter({ words: ['test'], strict: true });
        expect(f.search('test123')).toHaveLength(1);
    });

    it('still applies leetspeak normalization in strict mode', () => {
        const f = new Filter({ words: ['password'], strict: true });
        expect(f.search('p@ss w0rd')).toHaveLength(1);
    });

    it('does not produce false positives from only noise', () => {
        const f = new Filter({ words: ['a'], strict: true });
        expect(f.search('!!!')).toHaveLength(0);
    });

    it('respects per-call strict override', () => {
        const f = new Filter({ words: ['as'], strict: true });
        expect(f.search('a s', { strict: false })).toHaveLength(0);
    });

    it('preserves word boundary rules when enabled', () => {
        const f = new Filter({ words: ['bad'], strict: true, wordBoundaries: true });
        expect(f.search('bad!')).toHaveLength(1);
    });
});