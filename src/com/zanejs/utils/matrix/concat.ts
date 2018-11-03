module zanejs {

    export function concat(m1: PIXI.Matrix, m2: PIXI.Matrix): PIXI.Matrix {
        let a  = m1.a * m2.a;
        let b  = 0.0;
        let c  = 0.0;
        let d  = m1.d * m2.d;
        let tx = m1.tx * m2.a + m2.tx;
        let ty = m1.ty * m2.d + m2.ty;

        if (m1.b !== 0.0 || m1.c !== 0.0 || m2.b !== 0.0 || m2.c !== 0.0) {
            a  += m1.b  * m2.c;
            d  += m1.c  * m2.b;
            b  += m1.a  * m2.b  + m1.b * m2.d;
            c  += m1.c  * m2.a  + m1.d * m2.c;
            tx += m1.ty * m2.c;
            ty += m1.tx * m2.b;
        }

        m1.a  = a;
        m1.b  = b;
        m1.c  = c;
        m1.d  = d;
        m1.tx = tx;
        m1.ty = ty;

        return m1;
    }
}
