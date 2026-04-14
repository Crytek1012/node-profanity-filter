import { Filter } from '../src';

describe('Filter string normalization', () => {
    it('converts input to lowercase', () => {
        const f = new Filter();
        expect(f.sanitize('BaD')).toBe('bad');
    });

    it('applies leetspeak substitutions', () => {
        const f = new Filter();
        expect(f.sanitize('@$1030')).toBe('asioeo');
    });

    it('keeps non-mapped characters intact', () => {
        const f = new Filter();
        expect(f.sanitize('hello-world')).toBe('hello-world');
    });

    it('returns empty string unchanged', () => {
        const f = new Filter();
        expect(f.sanitize('')).toBe('');
    });

    it('removes spacing and punctuation in strict mode', () => {
        const f = new Filter({ strict: true });
        expect(f.sanitize('t.e!s t')).toBe('test');
    });

    it('keeps alphanumeric content in strict mode', () => {
        const f = new Filter({ strict: true, normalize: false });
        expect(f.sanitize('abc123')).toBe('abc123');
    });

    it('combines strict mode with leetspeak normalization', () => {
        const f = new Filter({ strict: true });
        expect(f.sanitize('p@ss w0rd')).toBe('password');
    });
});