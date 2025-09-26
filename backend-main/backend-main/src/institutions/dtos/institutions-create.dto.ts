import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InstitutionsCreateDto {
    @ApiProperty({ example: 'Acme Inc.' })
    @IsNotEmpty({ message: 'The commercial name is required.' })
    @IsString({ message: 'The commercial name must be a string.' })
    comercialName: string;

    @ApiProperty({ example: '123456789' })
    @IsNotEmpty({ message: 'The phone number is required.' })
    @IsString({ message: 'The phone number must be a string.' })
    phone: string;

    @ApiProperty({ example: 'info@acme.com' })
    @IsNotEmpty({ message: 'The commercial email is required.' })
    @IsString({ message: 'The commercial email must be a string.' })
    comercialemail: string;

    @ApiProperty({ example: '123 Main St' })
    @IsNotEmpty({ message: 'The commercial address is required.' })
    @IsString({ message: 'The commercial address must be a string.' })
    comercialAddress: string;

    @ApiProperty({ example: 'Metropolis' })
    @IsNotEmpty({ message: 'The city is required.' })
    @IsString({ message: 'The city must be a string.' })
    city: string;

    @ApiProperty({ example: 'Wonderland' })
    @IsNotEmpty({ message: 'The country is required.' })
    @IsString({ message: 'The country must be a string.' })
    country: string;

    @ApiProperty({ example: '12345' })
    @IsNotEmpty({ message: 'The postal code is required.' })
    @IsString({ message: 'The postal code must be a string.' })
    @Length(5, 5, { message: 'The postal code must be 5 characters long.' })
    postalCode: string;

    @ApiProperty({ example: 'https://www.example.com' })
    @IsNotEmpty({ message: 'The website URL is required.' })
    @IsUrl({}, { message: 'The website URL is not valid.' })
    websiteUrl: string;

    // Fiscal data
    @ApiProperty({ example: 'Acme Inc. Fiscal' })
    @IsNotEmpty({ message: 'The fiscal name is required.' })
    @IsString({ message: 'The fiscal name must be a string.' })
    fiscalName: string;

    @ApiProperty({ example: '123 Fiscal St' })
    @IsNotEmpty({ message: 'The fiscal address is required.' })
    @IsString({ message: 'The fiscal address must be a string.' })
    fiscalAddress: string;

    @ApiProperty({ example: '123456789' })
    @IsNotEmpty({ message: 'The fiscal VAT is required.' })
    @IsString({ message: 'The fiscal VAT must be a string.' })
    fiscalVAT: string;

    // Bank details
    @ApiProperty({ example: 'ES9121000418450200051332', required: false })
    @IsOptional()
    @IsString({ message: 'The IBAN must be a string.' })
    iban: string;

    @ApiProperty({ example: 'ABCDDEFFXXX', required: false })
    @IsOptional()
    @IsString({ message: 'The SWIFT/BIC must be a string.' })
    swiftBic: string;

    @ApiProperty({ example: '123456789012345678', required: false })
    @IsOptional()
    @IsString({ message: 'The bank account number must be a string.' })
    bankAccountNumber: string;

    @ApiProperty({ example: '111000025', required: false })
    @IsOptional()
    @IsString({ message: 'The ABA must be a string.' })
    aba: string;

    @ApiProperty({ example: 'Other bank details here', required: false })
    @IsOptional()
    @IsString({ message: 'The other bank detail must be a string.' })
    otherBankDetail: string;
}