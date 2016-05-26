var buffy = require('buffy')
import stream = require('stream');

const HEADER_SIZE = 68

//Ported from https://github.com/bkw/node-dronestream/blob/master/lib/PaVEParser.js
//Strips custom data produced by drone in video stream
export class PaVEParser extends stream.Stream {
  private writable = true;
  private readable = true;

  private _parser = buffy.createReader();
  private _state  = 'header';
  private _toRead = undefined;
  // TODO: search forward in buffer to last I-Frame
  private _frame_type = undefined;

  private _frame: any;

  static HEADER_SIZE_SHORT = 64;
  static HEADER_SIZE_LONG = 68;

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
          if (parser.bytesAhead() < PaVEParser.HEADER_SIZE_LONG) {
            return;
          }

          this._frame = {
            signature               : parser.ascii(4),
            version                 : parser.uint8(),
            video_codec             : parser.uint8(),
            header_size             : parser.uint16LE(),
            payload_size            : parser.uint32LE(),
            encoded_stream_width    : parser.uint16LE(),
            encoded_stream_height   : parser.uint16LE(),
            display_width           : parser.uint16LE(),
            display_height          : parser.uint16LE(),
            frame_number            : parser.uint32LE(),
            timestamp               : parser.uint32LE(),
            total_chunks            : parser.uint8(),
            chunk_index             : parser.uint8(),
            frame_type              : parser.uint8(),
            control                 : parser.uint8(),
            stream_byte_position_lw : parser.uint32LE(),
            stream_byte_position_uw : parser.uint32LE(),
            stream_id               : parser.uint16LE(),
            total_slices            : parser.uint8(),
            slice_index             : parser.uint8(),
            header1_size            : parser.uint8(),
            header2_size            : parser.uint8(),
            reserved2               : parser.buffer(2),
            advertised_size         : parser.uint32LE(),
            reserved3               : parser.buffer(12),
            payload                 : null,
          };

          if (this._frame.signature !== 'PaVE') {
            this.emit('error', new Error('Invalid signature: ' + JSON.stringify(this._frame.signature)));
            // TODO: skip forward until next frame
            return;
          }

          // stupid kludge for https://projects.ardrone.org/issues/show/159
          parser.buffer(this._frame.header_size - PaVEParser.HEADER_SIZE_SHORT);

          this._state = 'payload';
          break;
        case 'payload':
          if (parser.bytesAhead() < this._frame.payload_size) {
            return;
          }

          this._frame.payload = parser.buffer(this._frame.payload_size);

          this.emit('data', this._frame);
          if (cb) {
            cb(this._frame.payload);
          }
          this._frame = undefined;
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
