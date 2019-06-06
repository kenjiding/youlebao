import ffi from 'ffi';
import path from 'path';

export default () => ffi.Library(path.join(__static, 'dll', 'basic', 'termb'), {
  CVR_InitComm: ['int', ['int']],
  // CVR_Ant: ['int', ['int']],
  CVR_Authenticate: ['int', []],
  CVR_Read_Content: ['int', ['int']],
  CVR_CloseComm: ['int', []],
});
