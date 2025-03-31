import { Type } from 'class-transformer';
import { IsInt, IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class GetCourseListDto {
  @IsNotEmpty({ message: 'Page size không được thiếu' })
  @IsInt()
  @Type(() => Number)
  pageSize?: number;
  // @IsNotEmpty()

  @IsNotEmpty({ message: 'Page number không được thiếu' })
  @IsInt()
  @Type(() => Number)
  pageNumber?: number;

  @IsNotEmpty({ message: 'Sort by không được thiếu' })
  @IsString()
  sortBy?: string;

  @IsNotEmpty({ message: 'Sort order không được thiếu' })
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
