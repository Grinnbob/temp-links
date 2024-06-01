import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { uuid } from 'uuidv4';

const BE_URL = 'http://localhost:3042/links/';
type LinkObj = {
  isActive: boolean;
  value: string;
};

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async get(key: string): Promise<string> {
    if (typeof key !== 'string')
      throw new HttpException(
        `Typeof param must be string, not ${typeof key}`,
        HttpStatus.BAD_REQUEST,
      );

    const value = await this.cacheManager.get<string>(key);

    if (!value)
      throw new HttpException(`value not found`, HttpStatus.NOT_FOUND);
    const linkObj: LinkObj = JSON.parse(value);
    if (!linkObj)
      throw new HttpException(`linkObj not found`, HttpStatus.NOT_FOUND);

    if (linkObj.isActive === false)
      throw new HttpException(
        `Link has been already used`,
        HttpStatus.FORBIDDEN,
      );

    linkObj.isActive = false;
    await this.cacheManager.set(key, JSON.stringify(linkObj));
    return linkObj.value;
  }

  public async create(value: string): Promise<string> {
    if (typeof value !== 'string')
      throw new HttpException(
        `Typeof param must be string, not ${typeof value}`,
        HttpStatus.BAD_REQUEST,
      );
    const key = uuid();
    const linkObj: LinkObj = {
      isActive: true,
      value,
    };
    await this.cacheManager.set(key, JSON.stringify(linkObj));
    return BE_URL + '?key=' + key;
  }
}
