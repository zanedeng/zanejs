module zanejs {

    const enum ByteArraySize {
        SIZE_OF_BOOLEAN = 1,
        SIZE_OF_INT8    = 1,
        SIZE_OF_INT16   = 2,
        SIZE_OF_INT32   = 4,
        SIZE_OF_UINT8   = 1,
        SIZE_OF_UINT16  = 2,
        SIZE_OF_UINT32  = 4,
        SIZE_OF_FLOAT32 = 4,
        SIZE_OF_FLOAT64 = 8
    }

    /**
     * ByteArray 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
     * 注意：ByteArray 类适用于需要在字节层访问数据的高级 开发人员。
     */
    export class ByteArray {

        public endian: string;

        protected _bufferExtSize = 0;
        protected _data: DataView;
        protected _bytes: Uint8Array;
        protected _position: number;
        protected _writePosition: number;

        private EOFByte: number = -1;
        private EOFCodePoint: number = -1;

        constructor(buffer?: ArrayBuffer | Uint8Array, bufferExtSize: number = 0) {
            if (bufferExtSize < 0) {
                bufferExtSize = 0;
            }
            this._bufferExtSize = bufferExtSize;
            let bytes: Uint8Array, wpos = 0;
            if (buffer) {
                let uint8: Uint8Array;
                if (buffer instanceof Uint8Array) {
                    uint8 = buffer;
                    wpos = buffer.length;
                } else {
                    wpos = buffer.byteLength;
                    uint8 = new Uint8Array(buffer);
                }
                if (bufferExtSize === 0) {
                    bytes = new Uint8Array(wpos);
                } else {
                    let multi = (wpos / bufferExtSize | 0) + 1;
                    bytes = new Uint8Array(multi * bufferExtSize);
                }
                bytes.set(uint8);
            } else {
                bytes = new Uint8Array(bufferExtSize);
            }
            this._writePosition = wpos;
            this._position = 0;
            this._bytes = bytes;
            this._data = new DataView(bytes.buffer);
            this.endian = Endian.BIG_ENDIAN;
        }

        /**
         * 可读的剩余字节数
         */
        public get readAvailable() {
            return this._writePosition - this._position;
        }

        /**
         * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
         * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
         */
        public get bytesAvailable(): number {
            return this._data.byteLength - this._position;
        }

        public get bytes(): Uint8Array {
            return this._bytes;
        }

        public get dataView(): DataView {
            return this._data;
        }

        public set dataView(value: DataView) {
            this.buffer = value.buffer;
        }

        public get rawBuffer(): ArrayBuffer {
            return this._data.buffer;
        }

        public get buffer(): ArrayBuffer {
            return this._data.buffer.slice(0, this._writePosition);
        }

        public set buffer(value: ArrayBuffer) {
            let wpos = value.byteLength;
            let uint8 = new Uint8Array(value);
            let bufferExtSize = this._bufferExtSize;
            let bytes: Uint8Array;
            if (bufferExtSize === 0) {
                bytes = new Uint8Array(wpos);
            } else {
                let multi = (wpos / bufferExtSize | 0) + 1;
                bytes = new Uint8Array(multi * bufferExtSize);
            }
            bytes.set(uint8);
            this._writePosition = wpos;
            this._bytes = bytes;
            this._data = new DataView(bytes.buffer);
        }

        public get bufferOffset(): number {
            return this._data.byteOffset;
        }

        public get position(): number {
            return this._position;
        }

        public set position(value: number) {
            this._position = value;
            if (value > this._writePosition) {
                this._writePosition = value;
            }
        }

        public get length(): number {
            return this._writePosition;
        }

        public set length(value: number) {
            this._writePosition = value;
            if (this._data.byteLength > value) {
                this._position = value;
            }
            this._validateBuffer(value);
        }

        /**
         * 从字节流中读取布尔值。读取单个字节，如果字节非零，则返回 true，否则返回 false。
         * @return 如果字节不为零，则返回 true，否则返回 false
         */
        public readBoolean(): boolean {
            if (this.validate(ByteArraySize.SIZE_OF_BOOLEAN)) {
                return !!this._bytes[this.position++];
            }
        }

        /**
         * 从字节流中读取带符号的字节。返回值的范围是从 -128 到 127。
         * @return 介于 -128 和 127 之间的整数。
         */
        public readByte(): number {
            if (this.validate(ByteArraySize.SIZE_OF_INT8)) {
                return this._data.getInt8(this.position++);
            }
        }

        /**
         * 从字节流中读取 length 参数指定的数据字节数。
         * 从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中。
         * @param bytes 要将数据读入的 ByteArray 对象。
         * @param offset bytes 中的偏移（位置），应从该位置写入读取的数据。
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据。
         */
        public readBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
            if (!bytes) {
                return;
            }
            let pos = this._position;
            let available = this._writePosition - pos;
            if (available < 0) {
                throw new Error('遇到文件尾');
                return;
            }
            if (length === 0) {
                length = available;
            } else if (length > available) {
                throw new Error('遇到文件尾');
                return;
            }
            const position = bytes._position;
            bytes._position = 0;
            bytes._validateBuffer(offset + length);
            bytes._position = position;
            bytes._bytes.set(this._bytes.subarray(pos, pos + length), offset);
            this.position += length;
        }

        /**
         * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数。
         * @return 双精度（64 位）浮点数。
         */
        public readDouble(): number {
            if (this.validate(ByteArraySize.SIZE_OF_FLOAT64)) {
                let value = this._data.getFloat64(this._position, this.endian === Endian.LITTLE_ENDIAN);
                this.position += ByteArraySize.SIZE_OF_FLOAT64;
                return value;
            }
        }

        /**
         * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数。
         * @return 单精度（32 位）浮点数。
         */
        public readFloat(): number {
            if (this.validate(ByteArraySize.SIZE_OF_FLOAT32)) {
                let value = this._data.getFloat32(this._position, this.endian === Endian.LITTLE_ENDIAN);
                this.position += ByteArraySize.SIZE_OF_FLOAT32;
                return value;
            }
        }

        /**
         * 从字节流中读取一个带符号的 32 位整数。
         * 返回值的范围是从 -2147483648 到 2147483647。
         * @return 介于 -2147483648 和 2147483647 之间的 32 位带符号整数。
         */
        public readInt(): number {
            if (this.validate(ByteArraySize.SIZE_OF_INT32)) {
                let value = this._data.getInt32(this._position, this.endian === Endian.LITTLE_ENDIAN);
                this.position += ByteArraySize.SIZE_OF_INT32;
                return value;
            }
        }

        /**
         * 从字节流中读取一个带符号的 16 位整数。
         * 返回值的范围是从 -32768 到 32767。
         * @return 介于 -32768 和 32767 之间的 16 位带符号整数。
         */
        public readShort(): number {
            if (this.validate(ByteArraySize.SIZE_OF_INT16)) {
                let value = this._data.getInt16(this._position, this.endian === Endian.LITTLE_ENDIAN);
                this.position += ByteArraySize.SIZE_OF_INT16;
                return value;
            }
        }

        /**
         * 从字节流中读取无符号的字节。
         * 返回值的范围是从 0 到 255。
         * @return 介于 0 和 255 之间的 32 位无符号整数。
         */
        public readUnsignedByte(): number {
            if (this.validate(ByteArraySize.SIZE_OF_UINT8)) {
                return this._bytes[this.position++];
            }
        }

        /**
         * 从字节流中读取一个无符号的 32 位整数。
         * 返回值的范围是从 0 到 4294967295。
         * @return 介于 0 和 4294967295 之间的 32 位无符号整数。
         */
        public readUnsignedInt(): number {
            if (this.validate(ByteArraySize.SIZE_OF_UINT32)) {
                let value = this._data.getUint32(this._position, this.endian === Endian.LITTLE_ENDIAN);
                this.position += ByteArraySize.SIZE_OF_UINT32;
                return value;
            }
        }

        /**
         * 从字节流中读取一个无符号的 16 位整数。
         * 返回值的范围是从 0 到 65535。
         * @return 介于 0 和 65535 之间的 16 位无符号整数。
         */
        public readUnsignedShort(): number {
            if (this.validate(ByteArraySize.SIZE_OF_UINT16)) {
                let value = this._data.getUint16(this._position, this.endian === Endian.LITTLE_ENDIAN);
                this.position += ByteArraySize.SIZE_OF_UINT16;
                return value;
            }
        }

        /**
         * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是无符号的短整型（以字节表示长度）。
         * @return UTF-8 编码的字符串。
         */
        public readUTF(): string {
            let length = this.readUnsignedShort();
            if (length > 0) {
                return this.readUTFBytes(length);
            } else {
                return '';
            }
        }

        /**
         * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串。
         * @param length 指明 UTF-8 字节长度的无符号短整型数。
         * @return 由指定长度的 UTF-8 字节组成的字符串。
         */
        public readUTFBytes(length: number): string {
            if (!this.validate(length)) {
                return;
            }
            let data = this._data;
            let bytes = new Uint8Array(data.buffer, data.byteOffset + this._position, length);
            this.position += length;
            return this._decodeUTF8(bytes);
        }

        /**
         * 写入布尔值。根据 value 参数写入单个字节。如果为 true，则写入 1，如果为 false，则写入 0。
         * @param value  确定写入哪个字节的布尔值。如果该参数为 true，则该方法写入 1；如果该参数为 false，则该方法写入 0。
         */
        public writeBoolean(value: boolean): void {
            this._validateBuffer(ByteArraySize.SIZE_OF_BOOLEAN);
            this._bytes[this.position++] = +value;
        }

        /**
         * 在字节流中写入一个字节。
         * 使用参数的低 8 位。忽略高 24 位。
         * @param value — 一个 32 位整数。低 8 位将被写入字节流。
         */
        public writeByte(value: number): void {
            this._validateBuffer(ByteArraySize.SIZE_OF_INT8);
            this._bytes[this.position++] = value & 0xff;
        }

        /**
         * 将指定字节数组 bytes（起始偏移量为 offset，从零开始的索引）中包含 length 个字节的字节序列写入字节流。
         * 如果省略 length 参数，则使用默认长度 0；该方法将从 offset 开始写入整个缓冲区。如果还省略了 offset 参数，则写入整个缓冲区。
         * 如果 offset 或 length 超出范围，它们将被锁定到 bytes 数组的开头和结尾。
         * @param bytes — ByteArray 对象。
         * @param offset — 从 0 开始的索引，表示在数组中开始写入的位置
         * @param length — 一个无符号整数，表示在缓冲区中的写入范围。
         */
        public writeBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
            let writeLength: number;
            if (offset < 0) {
                return;
            }
            if (length < 0) {
                return;
            } else if (length === 0) {
                writeLength = bytes.length - offset;
            } else {
                writeLength = Math.min(bytes.length - offset, length);
            }
            if (writeLength > 0) {
                this._validateBuffer(writeLength);
                this._bytes.set(bytes._bytes.subarray(offset, offset + writeLength), this._position);
                this.position = this._position + writeLength;
            }
        }

        /**
         * 在字节流中写入一个 IEEE 754 双精度（64 位）浮点数。
         * @param value — 双精度（64 位）浮点数。
         */
        public writeDouble(value: number): void {
            this._validateBuffer(ByteArraySize.SIZE_OF_FLOAT64);
            this._data.setFloat64(this._position, value, this.endian === Endian.LITTLE_ENDIAN);
            this.position += ByteArraySize.SIZE_OF_FLOAT64;
        }

        /**
         * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数。
         * @param value — 单精度（32 位）浮点数
         */
        public writeFloat(value: number): void {
            this._validateBuffer(ByteArraySize.SIZE_OF_FLOAT32);
            this._data.setFloat32(this._position, value, this.endian === Endian.LITTLE_ENDIAN);
            this.position += ByteArraySize.SIZE_OF_FLOAT32;
        }

        /**
         * 在字节流中写入一个带符号的 32 位整数
         * @param value — 要写入字节流的整数。
         */
        public writeInt(value: number): void {
            this._validateBuffer(ByteArraySize.SIZE_OF_INT32);
            this._data.setInt32(this._position, value, this.endian === Endian.LITTLE_ENDIAN);
            this.position += ByteArraySize.SIZE_OF_INT32;
        }

        /**
         * 在字节流中写入一个 16 位整数。使用参数的低 16 位。忽略高 16 位。
         * @param value — 32 位整数，该整数的低 16 位将被写入字节流。
         */
        public writeShort(value: number): void {
            this._validateBuffer(ByteArraySize.SIZE_OF_INT16);
            this._data.setInt16(this._position, value, this.endian === Endian.LITTLE_ENDIAN);
            this.position += ByteArraySize.SIZE_OF_INT16;
        }

        /**
         * 在字节流中写入一个无符号的 32 位整数。
         * @param value — 要写入字节流的无符号整数。
         */
        public writeUnsignedInt(value: number): void {
            this._validateBuffer(ByteArraySize.SIZE_OF_UINT32);
            this._data.setUint32(this._position, value, this.endian === Endian.LITTLE_ENDIAN);
            this.position += ByteArraySize.SIZE_OF_UINT32;
        }

        /**
         * 在字节流中写入一个无符号的 16 位整数
         * @param value — 要写入字节流的无符号整数。
         */
        public writeUnsignedShort(value: number): void {
            this._validateBuffer(ByteArraySize.SIZE_OF_UINT16);
            this._data.setUint16(this._position, value, this.endian === Endian.LITTLE_ENDIAN);
            this.position += ByteArraySize.SIZE_OF_UINT16;
        }

        /**
         * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节。
         * @param value — 要写入的字符串值。
         */
        public writeUTF(value: string): void {
            let utf8bytes: ArrayLike<number> = this._encodeUTF8(value);
            let length: number = utf8bytes.length;
            this._validateBuffer(ByteArraySize.SIZE_OF_UINT16 + length);
            this._data.setUint16(this._position, length, this.endian === Endian.LITTLE_ENDIAN);
            this.position += ByteArraySize.SIZE_OF_UINT16;
            this.writeUint8Array(utf8bytes, false);
        }

        /**
         * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的词为字符串添加前缀。
         * @param value — 要写入的字符串值。
         */
        public writeUTFBytes(value: string): void {
            this.writeUint8Array(this._encodeUTF8(value));
        }

        /**
         *
         * @param bytes
         * @param validateBuffer
         */
        public writeUint8Array(bytes: Uint8Array | ArrayLike<number>, validateBuffer: boolean = true): void {
            let pos = this._position;
            let npos = pos + bytes.length;
            if (validateBuffer) {
                this._validateBuffer(npos);
            }
            this.bytes.set(bytes, pos);
            this.position = npos;
        }

        /**
         *
         * @param len
         */
        public validate(len: number): boolean {
            let bl = this._bytes.length;
            if (bl > 0 && this._position + len <= bl) {
                return true;
            } else {
                throw new Error('遇到文件尾');
            }
        }

        /**
         * 清除字节数组的内容，并将 length 和 position 属性重置为 0。
         * 明确调用此方法将释放 ByteArray 实例占用的内存。
         */
        public clear(): void {
            let buffer = new ArrayBuffer(this._bufferExtSize);
            this._data = new DataView(buffer);
            this._bytes = new Uint8Array(buffer);
            this._position = 0;
            this._writePosition = 0;
        }

        protected _validateBuffer(value: number) {
            if (this._data.byteLength < value) {
                let be = this._bufferExtSize;
                let tmp: Uint8Array;
                if (be === 0) {
                    tmp = new Uint8Array(value);
                } else {
                    let nLen = ((value / be >> 0) + 1) * be;
                    tmp = new Uint8Array(nLen);
                }
                tmp.set(this._bytes);
                this._bytes = tmp;
                this._data = new DataView(tmp.buffer);
            }
        }

        private _encodeUTF8(str: string): Uint8Array {
            let pos: number = 0;
            let codePoints = this._stringToCodePoints(str);
            let outputBytes = [];

            while (codePoints.length > pos) {
                let codePoint: number = codePoints[pos++];

                if (inRange(codePoint, 0xD800, 0xDFFF)) {
                    this._encoderError(codePoint);
                } else if (inRange(codePoint, 0x0000, 0x007f)) {
                    outputBytes.push(codePoint);
                } else {
                    let count, offset;
                    if (inRange(codePoint, 0x0080, 0x07FF)) {
                        count = 1;
                        offset = 0xC0;
                    } else if (inRange(codePoint, 0x0800, 0xFFFF)) {
                        count = 2;
                        offset = 0xE0;
                    } else if (inRange(codePoint, 0x10000, 0x10FFFF)) {
                        count = 3;
                        offset = 0xF0;
                    }

                    outputBytes.push(Math.floor(codePoint / Math.pow(64, count)) + offset);

                    while (count > 0) {
                        let temp = Math.floor(codePoint / Math.pow(64, count - 1));
                        outputBytes.push(0x80 + (temp % 64));
                        count -= 1;
                    }
                }
            }
            return new Uint8Array(outputBytes);
        }

        private _decodeUTF8(data: Uint8Array): string {
            let fatal: boolean = false;
            let pos: number = 0;
            let result: string = '';
            let codePoint: number;
            let utf8CodePoint = 0;
            let utf8BytesNeeded = 0;
            let utf8BytesSeen = 0;
            let utf8LowerBoundary = 0;

            while (data.length > pos) {

                let _byte = data[pos++];

                if (_byte === this.EOFByte) {
                    if (utf8BytesNeeded !== 0) {
                        codePoint = this._decoderError(fatal);
                    } else {
                        codePoint = this.EOFCodePoint;
                    }
                } else {

                    if (utf8BytesNeeded === 0) {
                        if (inRange(_byte, 0x00, 0x7F)) {
                            codePoint = _byte;
                        } else {
                            if (inRange(_byte, 0xC2, 0xDF)) {
                                utf8BytesNeeded = 1;
                                utf8LowerBoundary = 0x80;
                                utf8CodePoint = _byte - 0xC0;
                            } else if (inRange(_byte, 0xE0, 0xEF)) {
                                utf8BytesNeeded = 2;
                                utf8LowerBoundary = 0x800;
                                utf8CodePoint = _byte - 0xE0;
                            } else if (inRange(_byte, 0xF0, 0xF4)) {
                                utf8BytesNeeded = 3;
                                utf8LowerBoundary = 0x10000;
                                utf8CodePoint = _byte - 0xF0;
                            } else {
                                this._decoderError(fatal);
                            }
                            utf8CodePoint = utf8CodePoint * Math.pow(64, utf8BytesNeeded);
                            codePoint = null;
                        }
                    } else if (!inRange(_byte, 0x80, 0xBF)) {
                        utf8CodePoint = 0;
                        utf8BytesNeeded = 0;
                        utf8BytesSeen = 0;
                        utf8LowerBoundary = 0;
                        pos--;
                        codePoint = this._decoderError(fatal, _byte);
                    } else {

                        utf8BytesSeen += 1;
                        utf8CodePoint = utf8CodePoint +
                            (_byte - 0x80) * Math.pow(64, utf8BytesNeeded - utf8BytesSeen);

                        if (utf8BytesSeen !== utf8BytesNeeded) {
                            codePoint = null;
                        } else {

                            let cp = utf8CodePoint;
                            let lowerBoundary = utf8LowerBoundary;
                            utf8CodePoint = 0;
                            utf8BytesNeeded = 0;
                            utf8BytesSeen = 0;
                            utf8LowerBoundary = 0;
                            if (inRange(cp, lowerBoundary, 0x10FFFF) && !inRange(cp, 0xD800, 0xDFFF)) {
                                codePoint = cp;
                            } else {
                                codePoint = this._decoderError(fatal, _byte);
                            }
                        }

                    }
                }
                // Decode string
                if (codePoint !== null && codePoint !== this.EOFCodePoint) {
                    if (codePoint <= 0xFFFF) {
                        if (codePoint > 0) result += String.fromCharCode(codePoint);
                    } else {
                        codePoint -= 0x10000;
                        result += String.fromCharCode(0xD800 + ((codePoint >> 10) & 0x3ff));
                        result += String.fromCharCode(0xDC00 + (codePoint & 0x3ff));
                    }
                }
            }
            return result;
        }

        /**
         *
         * @param codePoint
         * @private
         */
        private _encoderError(codePoint: number) {
            throw new Error('EncodingError! The code point ' + codePoint + ' could not be encoded.');
        }

        /**
         *
         * @param fatal
         * @param optCodePoint
         * @private
         */
        private _decoderError(fatal: boolean, optCodePoint?: number): number {
            if (fatal) {
                throw new Error('DecodingError!');
            }
            return optCodePoint || 0xFFFD;
        }

        /**
         *
         * @param str
         * @private
         */
        private _stringToCodePoints(str: string) {
            /** @type {Array.<number>} */
            let cps = [];
            // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
            let i = 0, n = str.length;
            while (i < str.length) {
                let c = str.charCodeAt(i);
                if (!inRange(c, 0xD800, 0xDFFF)) {
                    cps.push(c);
                } else if (inRange(c, 0xDC00, 0xDFFF)) {
                    cps.push(0xFFFD);
                } else { // (inRange(c, 0xD800, 0xDBFF))
                    if (i === n - 1) {
                        cps.push(0xFFFD);
                    } else {
                        let d = str.charCodeAt(i + 1);
                        if (inRange(d, 0xDC00, 0xDFFF)) {
                            let a = c & 0x3FF;
                            let b = d & 0x3FF;
                            i += 1;
                            cps.push(0x10000 + (a << 10) + b);
                        } else {
                            cps.push(0xFFFD);
                        }
                    }
                }
                i += 1;
            }
            return cps;
        }
    }
}
