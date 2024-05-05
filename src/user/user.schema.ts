import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
	@Prop({ required: true })
	email: string;

	@Prop({ default: () => "User" + Date.now() })
	name: string;

	@Prop({ default: "http://www.gravatar.com/avatar/?d=identicon" })
	avatar: string;

	@Prop()
	passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
