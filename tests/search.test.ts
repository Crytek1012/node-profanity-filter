import { Filter } from '../src';

describe('Filter search behavior', () => {
    it('finds matches for exact and repeated words', () => {
        const f = new Filter({ words: ['bad'] });
        expect(f.search('bad')).toHaveLength(1);
        expect(f.search('bad bad bad')).toHaveLength(3);
    });

    it('finds multiple distinct matches', () => {
        const f = new Filter({ words: ['bad', 'evil'] });
        expect(f.search('bad and evil')).toHaveLength(2);
    });

    it('returns no results when nothing matches', () => {
        const f = new Filter({ words: ['bad'] });
        expect(f.search('good')).toHaveLength(0);
    });

    it('is case insensitive and normalizes input words', () => {
        const f1 = new Filter({ words: ['bad'] });
        const f2 = new Filter({ words: ['BaD'] });

        expect(f1.search('BaD')).toHaveLength(1);
        expect(f2.search('bad')).toHaveLength(1);
    });

    it('applies default normalization including leetspeak mapping', () => {
        const f = new Filter({ words: ['bad', 'password'] });
        expect(f.search('b@d')).toHaveLength(1);
        expect(f.search('p@ssw0rd')).toHaveLength(1);
    });

    it('respects normalization toggles', () => {
        const f = new Filter({ words: ['bad'], normalize: false });
        expect(f.search('b@d')).toHaveLength(0);
        expect(f.search('b@d', { normalize: false })).toHaveLength(0);
    });

    it('handles strict mode input sanitization', () => {
        const f = new Filter({ words: ['as', 'bad'], strict: true });
        expect(f.search('a s')).toHaveLength(1);
        expect(f.search('b@d!!!')).toHaveLength(1);
    });

    it('respects strict mode overrides per call', () => {
        const f = new Filter({ words: ['as'], strict: true });
        expect(f.search('a s', { strict: false })).toHaveLength(0);
    });

    it('enforces word boundary rules when enabled', () => {
        const f = new Filter({ words: ['bad'], wordBoundaries: true });
        expect(f.search('badly')).toHaveLength(0);
        expect(f.search('bad word')).toHaveLength(1);
        expect(f.search('bad bad')).toHaveLength(2);
    });

    it('handles edge cases like empty inputs and numeric noise', () => {
        const f = new Filter({ words: ['bad'] });

        expect(f.search('')).toHaveLength(0);
        expect(f.search('bad')).toHaveLength(1);
        expect(f.search('b4d')).toHaveLength(0);
        expect(f.search('b@d123')).toHaveLength(1);
    });
});