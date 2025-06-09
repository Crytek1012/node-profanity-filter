export class TrieNode {
    children: Record<string, TrieNode> = {};
    isWord = false;
}

export class Trie {
    root = new TrieNode();

    constructor(words: string[] = []) {
        words.forEach(w => this.insert(w));
    }

    /**
     * Insert a new word
     * @param word 
     */
    insert(word: string) {
        let node = this.root;
        for (const char of word) {
            node = node.children[char] ||= new TrieNode();
        }
        node.isWord = true;
    }

    /**
     * Whether the exact word is matched
     * @param word 
     * @returns 
     */
    contains(word: string): boolean {
        let node = this.root;
        for (const char of word) {
            node = node.children[char];
            if (!node) return false;
        }
        return node.isWord;
    }

    /**
     * Whether the text includes any matches
     * @param text 
     * @returns 
     */
    containsIn(text: string): boolean {
        for (let i = 0; i < text.length; i++) {
            let node = this.root;
            for (let j = i; j < text.length; j++) {
                const char = text[j];
                node = node.children[char];
                if (!node) break;
                if (node.isWord) return true;
            }
        }
        return false;
    }

    /**
     * Match the length
     * @param text 
     * @param start 
     * @returns 
     */
    matchLengthAt(text: string, start: number): number {
        let node = this.root;
        let maxLen = 0;

        for (let i = start; i < text.length; i++) {
            const char = text[i];
            node = node.children[char];
            if (!node) break;
            if (node.isWord) maxLen = i - start + 1;
        }

        return maxLen;
    }

}
