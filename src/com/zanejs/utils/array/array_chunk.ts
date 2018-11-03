module zanejs {

    /**
     * 将一个数组分割成多个数组，其中每个数组的单元数目由 size 决定。最后一个数组的单元数目可能会少于 size 个。
     *
     * example 1: array_chunk(['Kevin', 'van', 'Zonneveld'], 2)
     * returns 1: [['Kevin', 'van'], ['Zonneveld']]
     *
     * example 2: array_chunk(['Kevin', 'van', 'Zonneveld'], 2, true)
     * returns 2: [{0:'Kevin', 1:'van'}, {2: 'Zonneveld'}]
     *
     * example 3: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2)
     * returns 3: [['Kevin', 'van'], ['Zonneveld']]
     *
     * example 4: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2, true)
     * returns 4: [{1: 'Kevin', 2: 'van'}, {3: 'Zonneveld'}]
     * @param input
     * @param size
     * @param preserveKeys
     * @returns {*}
     */
    export function array_chunk(input: any, size: number, preserveKeys: boolean = false): any[] {
        let x;
        let p = '';
        let i = 0;
        let c = -1;
        let l = input.length || 0;
        let n = [];

        if (size < 1) {
            return null;
        }

        if (Object.prototype.toString.call(input) === '[object Array]') {
            if (preserveKeys) {
                while (i < l) {
                    (x = i % size)
                        ? n[c][i] = input[i]
                        : n[++c] = {};
                    n[c][i] = input[i];
                    i++;
                }
            } else {
                while (i < l) {
                    (x = i % size)
                        ? n[c][x] = input[i]
                        : n[++c] = [input[i]];
                    i++;
                }
            }
        } else {
            if (preserveKeys) {
                for (p in input) {
                    if (input.hasOwnProperty(p)) {
                        (x = i % size)
                            ? n[c][p] = input[p]
                            : n[++c] = {};
                        n[c][p] = input[p];
                        i++;
                    }
                }
            } else {
                for (p in input) {
                    if (input.hasOwnProperty(p)) {
                        (x = i % size)
                            ? n[c][x] = input[p]
                            : n[++c] = [input[p]];
                        i++;
                    }
                }
            }
        }

        return n;
    }
}
