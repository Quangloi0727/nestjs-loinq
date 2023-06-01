import { IsString } from "class-validator"
export class CreateTenantDto {
    @IsString()
    applicationName: string

    @IsString()
    applicationId: string

    @IsString()
    accessToken: string
}