import request from './request';

export class FileService {
  static listCollections(params): Promise<any> {
    return request({
      method: 'GET',
      url: '/api/collection',
    });
  }
  static createACollection(params): Promise<any> {
    return request({
      method: 'POST',
      url: '/api/createfile',
      data: params,
    });
  }

  static deleteFileService(params): Promise<any> {
    return request({
      method: 'POST',
      url: `/api/deleteFileService`,
      data: params,
    });
  }

  static getcollectiontree(params):Promise<any>{
    return request({
      method: 'POST',
      url: `/api/getcollectiontree`,
      data: params,
    });
  }
}
