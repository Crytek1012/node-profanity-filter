class ACNode {
    children: Record<string, ACNode> = {};
    fail: ACNode = null!;
    output: string[] = [];

    constructor() {
        this.fail = this;
    }
}

type StringOrArray = string | string[];
export type Match = { word: string; start: number; end: number };

export class AhoCorasick {
    private root = new ACNode();

    constructor(words: StringOrArray = []) {
        this.add(words);
        this.build();
    }

    add(input: StringOrArray) {
        const words = Array.isArray(input) ? input : [input];

        for (const word of words) {
            let node = this.root;

            for (const ch of word) {
                node = node.children[ch] ??= new ACNode();
            }

            node.output.push(word);
        }
    }

    private build() {
        const queue: ACNode[] = [];

        for (const child of Object.values(this.root.children)) {
            child.fail = this.root;
            queue.push(child);
        }

        let qh = 0;

        while (qh < queue.length) {
            const current = queue[qh++]!;

            for (const [ch, child] of Object.entries(current.children)) {
                let fail = current.fail;

                while (fail !== this.root && !fail.children[ch]) {
                    fail = fail.fail;
                }

                child.fail = fail.children[ch] ?? this.root;

                child.output.push(...child.fail.output);

                queue.push(child);
            }
        }
    }

    search(text: string): Match[] {
        let node = this.root;
        const matches: Match[] = [];

        for (let i = 0; i < text.length; i++) {
            const ch = text[i]!;

            while (node !== this.root && !node.children[ch]) {
                node = node.fail;
            }

            node = node.children[ch] ?? this.root;

            if (node.output.length) {
                for (const w of node.output) {
                    matches.push({
                        word: w,
                        start: i - w.length + 1,
                        end: i
                    });
                }
            }
        }

        return matches;
    }
}