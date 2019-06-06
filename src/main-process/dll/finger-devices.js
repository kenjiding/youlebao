
import ffi from 'ffi';
import path from 'path';
import ref from 'ref';
import RefArray from 'ref-array';

const byteArray = new RefArray(ref.types.byte, 16);

export const fingerVeinApi = () => ffi.Library(path.join(__static, 'dll', 'basic', 'WedoneDll'), {
  FVAPI_GetSerialNumber: [ref.types.uint32, [ref.refType(byteArray), ref.types.byte]],
  FVAPI_FingerDetect: [ref.types.uint32, [ref.types.byte]],
  FVAPI_FetchVeinTemplate: [ref.types.uint32, [ref.refType(byteArray), ref.types.uint32]],
  FVAPI_SameFingerCheck: [
    ref.types.uint32,
    [ref.refType(byteArray), ref.refType(byteArray), ref.types.byte],
  ],
});

export const fingerWNApi = () => ffi.Library(path.join(__static, 'dll', 'basic', 'WMRAPI'), {
  WM_Init: ['int', []],
  WM_Free: ['int', []],
  WM_GetDeviceCount: ['int', []],
  WM_OpenDevice: ['int', ['int', ref.refType(ref.types.int)]],
  WM_GetImageInfo: ['int', [ref.refType('int'), ref.refType('int')]],
  WM_GetImage: ['int', ['int', 'int', ref.refType(byteArray), ref.refType('int')]],
  WM_Extract: ['int', [ref.refType(byteArray), 'int', 'int', ref.refType(byteArray), ref.refType('int')]],
  WM_GenTemplate: ['int', [ref.refType(byteArray), ref.refType(byteArray), ref.refType(byteArray), ref.refType(byteArray), ref.refType('int')]],
  WM_CloseDevice: ['int', ['int']],
});

export const fingerWN06Api = () => ffi.Library(path.join(__static, 'dll', 'basic', 'WMRAPI06'), {
  WM_Init: ['int', []],
  WM_Free: ['int', []],
  WM_GetDeviceCount: ['int', []],
  WM_OpenDevice: ['int', ['int', ref.refType(ref.types.int)]],
  WM_GetImageInfo: ['int', [ref.refType('int'), ref.refType('int')]],
  WM_GetImage: ['int', ['int', 'int', ref.refType(byteArray), ref.refType('int')]],
  WM_Extract: ['int', [ref.refType(byteArray), 'int', 'int', ref.refType(byteArray), ref.refType('int')]],
  WM_GenTemplate: ['int', [ref.refType(byteArray), ref.refType(byteArray), ref.refType(byteArray), ref.refType(byteArray), ref.refType('int')]],
  WM_CloseDevice: ['int', ['int']],
});

export const fingerZAApi = () => ffi.Library(path.join(__static, 'dll', 'basic', 'ZAZAPIt'), {
  ZAZOpenDeviceEx: ['int', [ref.refType(byteArray), 'int', 'int', 'int', 'int', 'int']],
  ZAZCloseDeviceEx: ['int', ['int']],
  ZAZGetImage: ['int', ['int', ref.types.uint32]],
  ZAZErr2Str: [ref.types.void, ['int', 'string']],
  ZAZGenChar: ['int', ['int', ref.types.uint32, 'int']],
  ZAZRegModule: ['int', ['int', ref.types.uint32]],
  ZAZUpChar: ['int', ['int', ref.types.uint32, 'int', ref.refType(ref.types.byte), ref.refType('int')]],
});
