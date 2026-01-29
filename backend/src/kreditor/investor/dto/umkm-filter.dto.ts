import { IsOptional, IsArray, IsNumber, IsString, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UmkmFilterDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sector?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  province?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minScore?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  maxScore?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recommendation?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(['score', 'newest', 'views'])
  sortBy?: 'score' | 'newest' | 'views' = 'score';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
