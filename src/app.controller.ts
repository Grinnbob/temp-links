import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Query,
  Scope,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('links')
@Injectable({ scope: Scope.REQUEST })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  get(@Query() query: { key: string }): Promise<string> {
    return this.appService.get(query.key);
  }

  @Post()
  create(@Body() body: { value: string }): Promise<string> {
    return this.appService.create(body.value);
  }
}
