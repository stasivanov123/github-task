//https://docs.nestjs.com/exception-filters
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';

@Catch(AxiosError)
export class AxiosErrorFilter implements ExceptionFilter {
  catch(exception: AxiosError<any>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.response.status;

    response.status(status).json({
      statusCode: status,
      message: exception?.response?.data?.message || exception.message,
    });
  }
}
