var buffy = require('buffy')

const HEADER_SIZE = 68

//Ported from https://github.com/bkw/node-dronestream/blob/master/lib/PaVEParser.js
export class PaVEParser {
  private writable = true;
  private readable = true;

  private _parser = buffy.createReader();
  private _state  = 'header';
  private _toRead = undefined;
    // TODO: search forward in buffer to last I-Frame
  private _frame_type = undefined;

  write(buffer, cb) {
    var parser = this._parser
      , signature
      , header_size
      , readable
      ;

    parser.write(buffer);

    while (true) {
        switch (this._state) {
        case 'header':
            if (parser.bytesAhead() < HEADER_SIZE) {
                return true;
            }
            signature = parser.ascii(4);

            if (signature !== 'PaVE') {
                // TODO: wait/look for next PaVE frame
                console.log('Invalid signature: ' + JSON.stringify(signature))
                return;
            }

            parser.skip(2);
            header_size = parser.uint16LE();
            // payload_size
            this._toRead = parser.uint32LE();
            // skip 18 bytes::
            // encoded_stream_width 2
            // encoded_stream_height 2
            // display_width 2
            // display_height 2
            // frame_number 4
            // timestamp 4
            // total_chunks 1
            // chunk_index 1
            parser.skip(18);
            this._frame_type = parser.uint8();

            // bytes consumed so far: 4 + 2 + 2 + 4 + 18 + 1 = 31. Skip ahead.
            parser.skip(header_size - 31);

            this._state = 'payload';
            break;

        case 'payload':
            readable = parser.bytesAhead();
            if (readable < this._toRead) {
                return true;
            }

            // also skip first NAL-Unit boundary: (4)
            parser.skip(4);
            this._toRead -= 4;
            this.sendData(parser.buffer(this._toRead), this._frame_type, cb);
            this._toRead = undefined;
            this._state = 'header';
            break;
        }
    }
  }

  private sendData(data, frametype, cb) {
    var lastBegin = 0, i, l;
    if (frametype === 1) {
        // I-Frame, split more
        // Todo: optimize.
        for (i = 0, l = data.length - 4; i < l; i++) {
            if (
                data[i] === 0 &&
                data[i + 1] === 0 &&
                data[i + 2] === 0 &&
                data[i + 3] === 1
            ) {
                if (lastBegin < i) {
                    cb(data.slice(lastBegin, i));
                    lastBegin = i + 4;
                    i += 4;
                }
            }
        }
        cb(data.slice(lastBegin));
    } else {
        cb(data);
    }
  }
}
