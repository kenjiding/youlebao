import ffi from 'ffi';
import path from 'path';
import ref from 'ref';
import RefArray from 'ref-array';

const byteArray = new RefArray(ref.types.byte, 16);

export default () => ffi.Library(path.join(__static, 'dll', 'basic', 'Device'), {
  card_GetCardIDAndType: ['int', [ref.refType(byteArray)]],
  card_GetEmpCardID: ['int', [ref.refType(byteArray)]],
  card_ReadBlock: ['int', ['int', ref.refType(byteArray)]],
  card_Alive: ['int', []],
  card_Beep: ['int', ['int']],
});
