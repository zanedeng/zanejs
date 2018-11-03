module zanejs {

    /**
     *
     * @param input
     */
    export function is_array(input: any) {
        return typeof (input) === 'object' && (input instanceof Array);
    }
}
