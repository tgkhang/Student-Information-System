import { IsNotEmpty, IsString, IsEnum, IsInt } from 'class-validator';

export class GetListStudentDto {
  @IsNotEmpty()
  @IsInt()
  pageSize: number;

  @IsNotEmpty()
  @IsInt()
  pageNumber: number;

  @IsNotEmpty()
  @IsString()
  sortBy: string;

  @IsNotEmpty()
  @IsEnum(['asc', 'desc'])
  sortOrder: 'asc' | 'desc';
}
