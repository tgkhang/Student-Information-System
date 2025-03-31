import { IsOptional, IsInt, IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class GetTeacherListDto {
    @IsNotEmpty({ message: 'Page size không được thiếu' })
    @IsInt()
    pageSize?: number;
    @IsNotEmpty()

    @IsNotEmpty({ message: 'Page number không được thiếu' })
    @IsInt()
    pageNumber?: number;

    @IsNotEmpty({ message: 'Sort by không được thiếu' })
    @IsString()
    sortBy?: string;

    @IsNotEmpty({ message: 'Sort order không được thiếu' })
    @IsEnum(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';
    }
