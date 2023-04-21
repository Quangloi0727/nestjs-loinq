import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

export type TenantDocument = Tenant & Document

@Schema({ collection: 'tenant' })
export class Tenant {
    @Prop()
    _id: string

    @Prop({ type: Object })
    configs: Object

    @Prop()
    applicationIds: []
}

export const TenantSchema = SchemaFactory.createForClass(Tenant)
